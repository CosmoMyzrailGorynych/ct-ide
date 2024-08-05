const DEBUG = true; // Print incoming event messages to the console

import convertPngToIco from './lib/png2icons';
import fetchJson from './lib/fetchJson';
import fetchText from './lib/fetchText';
import serve, {stopServer} from './lib/serve';
import zip from './lib/zip';
import unzip from './lib/unzip';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functionMap: Record<string, (payload: any) => Promise<any>> = {
    convertPngToIco,
    fetchJson,
    fetchText,
    serve,
    stopServer,
    zip,
    unzip
};
type stdinRequest = {
    id: string,
    command: string,
    payload: Record<string, never>
};
const eventHandler = async (json: stdinRequest) => {
    try {
        const payload = await functionMap[json.command](json.payload);
        // eslint-disable-next-line no-console
        console.log(JSON.stringify({
            id: json.id,
            payload
        }));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log({
            id: json.id,
            error: (error as Error).message,
            stack: (error as Error).stack
        });
    }
};


// eslint-disable-next-line no-console
console.log('🥟 Bun Extension started');

for await (const line of console) {
    if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`🥟 [Received] ${line}`);
    }
    let json: stdinRequest | null = null;
    try {
        json = JSON.parse(line);
    } catch (error) {
        console.error(`Invalid input: ${line}`);
        continue;
    }
    if (json && json.id && json.command && json.payload) {
        eventHandler(json);
    } else {
        console.error(`Invalid request: ${line}`);
    }
}

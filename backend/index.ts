/* eslint-disable id-blacklist */
/* eslint-disable no-process-exit */
import WebSocket from 'ws';

const DEBUG = true; // Print incoming event messages to the console

// Available commands:
import convertPngToIco from './lib/png2icons';
import fetchJson from './lib/fetchJson';
import fetchText from './lib/fetchText';
import serve, {stopServer} from './lib/serve';
import zip from './lib/zip';
import unzip from './lib/unzip';
import packForDesktop from './lib/packForDesktop';
import ttf2woff from './lib/ttf2woff';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functionMap: Record<string, (payload: any) => Promise<any>> = {
    convertPngToIco,
    fetchJson,
    fetchText,
    serve,
    stopServer,
    zip,
    unzip,
    packForDesktop,
    ttf2woff
};

// eslint-disable-next-line no-console
console.log('🥟 Bun Extension started 🥟');

let nlToken, nlConnectToken, nlExtensionId, nlPort, urlSocket;
if (Bun.argv.length > 2) {
    [, nlPort] = Bun.argv[2].split('=');
    [, nlToken] = Bun.argv[3].split('=');
    nlConnectToken = '';
    [, nlExtensionId] = Bun.argv[4].split('=');
    urlSocket = `ws://127.0.0.1:${nlPort}?extensionId=${nlExtensionId}`;
} else {
    const conf = await Bun.stdin.json();
    ({nlToken, nlConnectToken, nlExtensionId, nlPort} = conf);
    urlSocket = `ws://127.0.0.1:${nlPort}?extensionId=${nlExtensionId}&connectToken=${nlConnectToken}`;
}
const ws = new WebSocket(urlSocket);

export const sendEvent = (name: string, payload?: unknown) => {
    ws.send(JSON.stringify({
        method: 'app.broadcast',
        accessToken: nlToken,
        data: {
            event: name,
            data: payload
        }
    }));
};

const eventHandler = async (json: {
    id: string,
    command: string,
    payload: unknown
}) => {
    try {
        const payload = await functionMap[json.command](json.payload);
        ws.send(JSON.stringify({
            id: json.id,
            method: 'app.broadcast',
            accessToken: nlToken,
            data: {
                event: 'bunchat',
                data: {
                    id: json.id,
                    payload
                }
            }
        }));
    } catch (error) {
        ws.send(JSON.stringify({
            id: json.id,
            method: 'app.broadcast',
            accessToken: nlToken,
            data: {
                event: 'bunchat',
                data: {
                    id: json.id,
                    error: (error as Error).message,
                    stack: (error as Error).stack
                }
            }
        }));
        console.error(error, (error as Error).stack);
    }
};


ws.on('open', () => {
    // eslint-disable-next-line no-console
    console.log(`🥟 WebSocket connection opened on port ${nlPort} 🥟`);
});
ws.on('message', (message: Buffer) => {
    let json;
    try {
        json = JSON.parse(message.toString('utf8'));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Invalid message: ${message.toString('utf8')}`);
        return;
    }
    if (json.event === 'appClose') {
        process.exit(0);
    }
    if (DEBUG && json.method !== 'app.broadcast') {
        // eslint-disable-next-line no-console
        console.log('🥟 Received', json);
    }

    if (json.event === 'bunchat') {
        eventHandler(json.data);
    }
});

await new Promise((resolve, reject) => {
    void resolve;
    void reject;
});

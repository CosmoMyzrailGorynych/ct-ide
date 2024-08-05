import {isDev} from '../platformUtils';
const {os, events} = Neutralino;

let bunServer: Neutralino.os.SpawnedProcess | null = null;
const bunAwait = os.spawnProcess(
    isDev() ? 'bun run --inspect index.ts' : 'server.exe',
    isDev() ? `${NL_PATH}/backend` : `${NL_PATH}/bun`
).then(proc => {
    // eslint-disable-next-line no-console
    console.debug(`🥟 Bun server started with ID: ${proc.id}, PID: ${proc.pid}`);
    bunServer = proc;
});


const getUid = () => Date.now().toString(36) + Math.random().toString(36);

export const bun = async <T>(command: string, payload?: any): Promise<T> => {
    const id = getUid();
    let resolve: (payload: T) => void;
    let reject: (error: Error) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    const listener = (e: CustomEvent) => {
        // eslint-disable-next-line id-blacklist
        const {data, id: processId} = e.detail;
        if (bunServer && processId !== bunServer.id) {
            return;
        }
        // eslint-disable-next-line id-blacklist
        if (data[0] !== '{') {
            return;
        }
        let response: {
            id: string,
            payload: T,
            error?: string,
            stack?: string
        } | null = null;
        try {
            response = JSON.parse(data);
        } catch (err) {
            void err;
        }
        if (!response) {
            return;
        }
        if (response.id === id) {
            events.off('spawnedProcess', listener);
            if ('error' in response) {
                const err = new Error(response.error);
                err.stack = response.stack;
                reject(err);
            } else {
                resolve(response.payload);
            }
        }
    };
    events.on('spawnedProcess', listener);
    if (!bunServer) {
        await bunAwait;
    }
    await os.updateSpawnedProcess(bunServer!.id, 'stdIn', JSON.stringify({
        id,
        command,
        payload
    }) + '\n');
    return promise;
};

export const kill = async () => {
    await os.updateSpawnedProcess(bunServer!.id, 'exit');
};

if (isDev()) {
    events.on('spawnedProcess', e => {
        // eslint-disable-next-line id-blacklist
        const {data, id} = e.detail;
        if (bunServer && id !== bunServer.id) {
            return;
        }
        // eslint-disable-next-line no-console, id-blacklist
        console.debug(`🥟 [Response] ${data}`);
    });
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchJson = (url: string): Promise<any> => bun('fetchJson', url);
export const fetchText = (url: string): Promise<string> => bun('fetchText', url);
export const serve = (dir: string, port?: number): Promise<{ url: string, port: number }> => bun('serve', {
    dir,
    port
});
export const stopServer = (port?: number): Promise<void> => bun('stopServer', port);
export const convertPngToIco = (pngPath: string, icoPath: string, pixelart: boolean) => bun('convertPngToIco', {
    pngPath,
    icoPath,
    pixelart
});
export const zip = (payload: {
    files?: string[],
    dir?: string,
    out?: string
}): Promise<string> => bun('zip', payload);
export const unzip = (inPath: string, outPath: string): Promise<string> => bun('unzip', {
    inPath,
    outPath
});

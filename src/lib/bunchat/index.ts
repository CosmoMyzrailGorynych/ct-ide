import {isDev} from '../platformUtils';
const {events, app, extensions} = Neutralino;
const {dispatch} = extensions;

const getUid = () => Date.now().toString(36) + Math.random().toString(36);

export const bun = async <T>(command: string, payload?: unknown): Promise<T> => {
    const id = getUid();
    let resolve: (payload: T) => void;
    let reject: (error: Error) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    const listener = (e: CustomEvent) => {
        const response: {
            id: string,
            payload: T,
            error?: string,
            stack?: string
        } | null = e.detail;
        if (!response) {
            return;
        }
        if (response.id === id) {
            events.off('bunchat', listener);
            if ('error' in response) {
                const err = new Error(response.error);
                err.stack = response.stack;
                reject(err);
            } else {
                resolve(response.payload);
            }
        }
    };
    events.on('bunchat', listener);
    await dispatch('extBun', 'bunchat', {
        id,
        command,
        payload
    });
    return promise;
};
export const kill = async () => {
    await dispatch('extBun', 'appClose', '');
    await app.exit();
};
if (NL_MODE !== 'window') {
    window.addEventListener('beforeunload', e => {
        e.preventDefault();
        kill();
        return '';
    });
}

if (isDev()) {
    events.on('bunchat', e => {
        console.debug('🥟 [Response]', e.detail);
    });
    (window as any).bun = bun;
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

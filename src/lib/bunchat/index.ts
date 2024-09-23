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
            stack?: string,
            cause?: string
        } | null = e.detail;
        if (!response) {
            return;
        }
        if (response.id === id) {
            events.off('bunchat', listener);
            if ('error' in response) {
                const err = new Error(response.error);
                console.error(response.error, response.cause, response.stack);
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
        // eslint-disable-next-line no-console
        console.debug('🥟 [Response]', e.detail);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).bun = bun;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchJson = (url: string): Promise<any> => bun('fetchJson', url);
export const fetchText = (url: string): Promise<string> => bun('fetchText', url);

import {serveOptions, serveResponse} from '../../../bgServices/lib/serve/messagingContract';
export const serve = (dir: string, port?: number): Promise<serveResponse> => bun('serve', {
    dir,
    port
} as serveOptions);
export const stopServer = (port?: number): Promise<void> => bun('stopServer', port);

import {png2IconsOptions} from '../../../bgServices/lib/png2icons/messagingContract';
export const convertPngToIco = (pngPath: string, icoPath: string, pixelart: boolean) => bun('convertPngToIco', {
    pngPath,
    icoPath,
    pixelart
} as png2IconsOptions);

export const zip = (payload: {
    files?: string[],
    dir?: string,
    out?: string
}): Promise<string> => bun('zip', payload);
export const unzip = (inPath: string, outPath: string): Promise<string> => bun('unzip', {
    inPath,
    outPath
});

import {packForDesktopOptions, packForDesktopResponse} from '../../../bgServices/lib/packForDesktop/messagingContract';
export const packForDesktop = (payload: packForDesktopOptions): Promise<packForDesktopResponse> => bun('packForDesktop', payload);

import {ttf2WoffOptions} from '../../../bgServices/lib/ttf2woff/messagingContract';
export const ttf2Woff = async (inPath: string, outPath: string): Promise<string> => {
    await bun('ttf2woff', {
        in: inPath,
        out: outPath
    } as ttf2WoffOptions);
    return outPath;
};

import {getNetInterfacesResponse} from '../../../bgServices/lib/getNetInterfaces/messagingContract';
export const getNetInterfaces = (): Promise<getNetInterfacesResponse> => bun('getNetInterfaces', {});

export const minifyCss = (input: string): Promise<string> => bun('minifyCss', input);
export const minifyHtml = (input: string): Promise<string> => bun('minifyHtml', input);

export const shutdown = (): Promise<never> => bun('shutdown', {});

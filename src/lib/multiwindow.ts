/* eslint-disable id-blacklist */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anywindow = window as any;

type knownConnection = {
    port: number;
    connectionToken: string;
    accessToken: string;
    ws: WebSocket;
    ready: Promise<void>;
    close: Promise<void>;
    closed: boolean;
}
export const knownConnections = new Map<string, knownConnection>();
let myName: string = 'unnamed';

type promiseHandler = (value: void | PromiseLike<void>) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type promiseRejectHandler = (reason?: any) => void;
const asyncs = new Map<string, [promiseHandler, promiseRejectHandler]>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const boringId = (): string => '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
    // eslint-disable-next-line no-bitwise, no-mixed-operators
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

const addConnection = (name: string, port: number, accessToken: string) => {
    if (knownConnections.has(name)) {
        return;
    }
    const [, connectionToken] = accessToken.split('.');
    const ws = new WebSocket(`ws://${window.location.hostname}:${port}?connectToken=${connectionToken}`);
    const ready = new Promise<void>((resolve) => {
        ws.addEventListener('open', () => {
            resolve();
        });
    });
    const close = new Promise<void>((resolve) => {
        ws.addEventListener('close', () => {
            resolve();
            // Update in case someone holds a reference to the object
            knownConnections.get(name)!.closed = true;
            knownConnections.delete(name);
        });
    });
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.id && asyncs.has(message.id)) {
            const [resolve, reject] = asyncs.get(message.id)!;
            // Native call response
            if (message.data?.error) {
                reject(message.data.error);
            } else if (message.data?.success) {
                resolve(('returnValue' in message.data) ?
                    message.data.returnValue :
                    message.data);
            }
            asyncs.delete(message.id);
        }
    });
    knownConnections.set(name, {
        port,
        accessToken,
        connectionToken,
        ws,
        ready,
        close,
        closed: false
    });
};

export const sendMessage = async (connection: string, method: string, data?: unknown):
Promise<unknown> => {
    if (!knownConnections.has(connection)) {
        throw new Error(`No connection named ${connection} found.`);
    }
    const {ws, ready, closed, accessToken} = knownConnections.get(connection)!;
    if (closed) {
        throw new Error(`Connection named ${connection} is closed.`);
    }
    await ready;
    const id = boringId();
    ws.send(JSON.stringify({
        id,
        accessToken,
        method,
        data
    }));
    let resolve: promiseHandler,
        reject: promiseRejectHandler;
    const promise = new Promise<void>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    asyncs.set(id, [resolve!, reject!]);
    return promise;
};

/**
 * Returns a promise that resolves when a connection to the named window becomes ready.
 * After this promise resolves, you will be able to send commands and other messages to the window.
 */
export const awaitConnection = async (name: string): Promise<void> => {
    const wait = () => new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, 50);
    });
    while (!knownConnections.has(name)) {
        // eslint-disable-next-line no-await-in-loop
        await wait();
    }
    return knownConnections.get(name)!.ready;
};
/**
 * Returns whether a window with the given name is closed.
 * If there is no connection with the given name, always returns `true`.
 */
export const isClosed = (name: string): boolean => knownConnections.get(name)?.closed ?? true;

type transferredConnections = {
    /** Connection data */
    c: {
        /** The name of the connection */
        n: string;
        /** Websocke port number */
        p: number;
        /** Full access token, NL_TOKEN */
        t: string;
    }[];
    o?: Record<string, unknown>;
};


export const getUrlWithConnections = (
    url: string,
    c?: transferredConnections['c'] | null | undefined,
    additionalOptions?: Record<string, unknown>
): string => {
    const connections: transferredConnections = {
        c: c ?? [{
            n: myName,
            p: Number(window.location.port),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t: anywindow.NL_TOKEN || sessionStorage.getItem('NL_TOKEN')
        }]
    };
    if (additionalOptions) {
        connections.o = additionalOptions;
    }
    return `${url}#multiwindow${encodeURIComponent(JSON.stringify(connections))}`;
};
export const createWindow = async (
    name: string,
    url: string,
    options?: Parameters<typeof Neutralino.window.create>[1],
    additionalOptions?: Record<string, unknown>
): Promise<void> => {
    Neutralino.window.create(getUrlWithConnections(url, null, additionalOptions), options);
    await awaitConnection(name);
};

export const broadcastTo = (to: string, event: string, data?: unknown) => {
    sendMessage(to, 'events.broadcast', {
        event,
        data
    });
};

export const announceSelf = (to: string, customPort?: number) => {
    broadcastTo(to, 'multiwindow.announce', {
        name: myName,
        port: customPort || anywindow.NL_PORT,
        token: anywindow.NL_TOKEN || sessionStorage.getItem('NL_TOKEN')
    });
};
export const shareConnections = (to: string, names: string[]) => {
    for (const name of names) {
        const {port, accessToken} = knownConnections.get(name)!;
        broadcastTo(to, 'multiwindow.announce', {
            name,
            port,
            token: accessToken
        });
    }
};

/**
 * An utility function mainly used to send file data to another connection.
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(buffer);
    const regularArray = Array.from(uint8Array);
    return btoa(regularArray.join(''));
};

Neutralino.events.on('multiwindow.announce', e => {
    const {detail} = e;
    addConnection(detail.name, detail.port, detail.token);
});

export const getOptions = (hash = location.hash): Record<string, unknown> => {
    if (hash.includes('multiwindow')) {
        const connectionData = JSON.parse(decodeURIComponent(hash.split('multiwindow')[1])) as transferredConnections;
        if (connectionData.o) {
            return connectionData.o;
        }
    }
    return {};
};

export const getConnectionsFromHash = (hash: string) => {
    if (hash.includes('multiwindow')) {
        const connectionData = JSON.parse(decodeURIComponent(hash.split('multiwindow')[1])) as transferredConnections;
        return connectionData;
    }
    return false;
};

export const init = (name: string) => {
    myName = name;
    const connections = getConnectionsFromHash(location.hash);
    if (connections) {
        for (const {n, p, t} of connections.c) {
            addConnection(n, p, t);
        }
    }
    location.hash = '';
    for (const [name] of knownConnections) {
        announceSelf(name);
    }
};

export const show = (name: string) => sendMessage(name, 'window.show');
export const hide = (name: string) => sendMessage(name, 'window.hide');
export const exit = (name: string) => sendMessage(name, 'app.exit');
export const getPosition = (name: string) => sendMessage(name, 'window.getPosition') as Promise<Neutralino.window.WindowPosOptions>;
export const getSize = (name: string) => sendMessage(name, 'window.getSize') as Promise<Neutralino.window.WindowSizeOptions>;
export const setAlwaysOnTop = (name: string, onTop: boolean) => sendMessage(name, 'window.setAlwaysOnTop', {
    onTop
});
export const setSize = async (name: string, options: Neutralino.window.WindowOptions) => {
    const sizeOptions = await getSize(name);
    options = {
        ...sizeOptions,
        ...options // merge prioritizing options arg
    };
    sendMessage(name, 'window.setSize', options);
};
export const move = (name: string, x: number, y: number) => sendMessage(name, 'window.move', {
    x,
    y
});
export const setPosition = move;
export const center = (name: string) => sendMessage(name, 'window.center');
export const focus = (name: string) => sendMessage(name, 'window.focus');
export const getTitle = (name: string) => sendMessage(name, 'window.getTitle') as Promise<string>;
export const setTitle = (name: string, title: string) => sendMessage(name, 'window.setTitle', {
    title
});

if (anywindow.Neutralino) {
    anywindow.Neutralino.multiwindow = {
        init,
        getOptions,
        broadcastTo,
        sendMessage,
        getUrlWithConnections,
        getConnectionsFromHash,
        createWindow,
        announceSelf,
        addConnection,
        shareConnections,
        awaitConnection,
        knownConnections,
        isClosed,

        arrayBufferToBase64,

        show,
        hide,
        exit,
        getPosition,
        getSize,
        setAlwaysOnTop,
        setSize,
        move,
        setPosition,
        center,
        focus,
        getTitle,
        setTitle
    };
}

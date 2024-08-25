import type {serveOptions, serveResponse} from './messagingContract';

import type {Server} from 'bun';

const servers = new Map<number, Server>();

const serveStatic = (dir: string) => (request: Request): Response => {
    // As seen in https://github.com/jadujoel/bun-serve/blob/main/index.ts
    let fp = dir + new URL(request.url).pathname;
    if (fp.endsWith('/')) {
        fp += 'index.html';
    }
    return new Response(Bun.file(fp));
};

export default (payload: serveOptions): Promise<serveResponse> => {
    if (servers.has(payload.port ?? 0)) {
        const server = servers.get(payload.port ?? 0)!;
        return Promise.resolve({
            url: `http://localhost:${server.port}`,
            port: server.port
        });
    }
    let server;
    try {
        server = Bun.serve({
            fetch: serveStatic(payload.dir),
            port: payload.port ?? 0,
            error() {
                return new Response(null, {
                    status: 404
                });
            }
        });
    } catch (err) {
        // Retry with a random port
        server = Bun.serve({
            fetch: serveStatic(payload.dir),
            port: 0,
            error() {
                return new Response(null, {
                    status: 404
                });
            }
        });
    }
    servers.set(server.port, server);
    return Promise.resolve({
        url: `http://localhost:${server.port}`,
        port: server.port
    });
};
export const stopServer = (port: number = 0): Promise<void> => {
    if (servers.has(port)) {
        servers.get(port)!.stop(true);
        servers.delete(port);
    }
    return Promise.resolve();
};

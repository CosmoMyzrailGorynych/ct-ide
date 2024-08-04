import serveStatic from 'serve-static-bun';
import type {Server} from 'bun';

const servers = new Map<number, Server>();

export default (payload: {
    dir: string,
    port?: number
}): Promise<{
    url: string,
    port: number
}> => {
    if (servers.has(payload.port ?? 0)) {
        const server = servers.get(payload.port ?? 0)!;
        return Promise.resolve({
            url: `http://localhost:${server.port}`,
            port: server.port
        });
    }
    const server = Bun.serve({
        fetch: serveStatic(payload.dir),
        port: payload.port ?? 0
    });
    servers.set(server.port, server);
    return Promise.resolve({
        url: `http://localhost:${server.port}`,
        port: server.port
    });
};
export const stopServer = (port: number = 0): Promise<void> => {
    if (servers.has(port)) {
        servers.get(port)!.stop(true);
    }
    return Promise.resolve();
};

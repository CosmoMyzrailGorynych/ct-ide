import {getConnectionsFromHash, getUrlWithConnections, getOptions} from './lib/multiwindow';

const connections = getConnectionsFromHash(location.hash);
const options = getOptions(location.hash) as {
    url: string;
};
if (connections) {
    const url = getUrlWithConnections(options.url, connections.c, {
        p: NL_PORT,
        t: NL_TOKEN || sessionStorage.getItem('NL_TOKEN')
    });
    window.location.href = url;
}

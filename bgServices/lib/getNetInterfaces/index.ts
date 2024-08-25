import type {getNetInterfacesResponse} from './messagingContract';
import {networkInterfaces} from 'os';

export default (): Promise<getNetInterfacesResponse> => {
    const interfaces = networkInterfaces();
    const connections: getNetInterfacesResponse = [];
    Object.keys(interfaces).forEach(ifname => {
        var alias = 0;
        interfaces[ifname]!.forEach(iface => {
            // skip over internal (i.e. 127.0.0.1) addresses
            if (iface.internal) {
                return;
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                connections.push({
                    name: `${ifname} (${alias})`,
                    address: `http://${iface.address}`
                });
            } else {
                // this interface has only one ipv4 adress
                connections.push({
                    name: ifname,
                    address: `http://${iface.address}`
                });
            }
            ++alias;
        });
    });
    return Promise.resolve(connections);
};

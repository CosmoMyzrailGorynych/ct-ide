debugger-modal.aView
    .center.aQRList
        .aQR(each="{interface in interfaces}")
            .center(if="{qrCodes.has(interface)}")
                img(src="{qrCodes.get(interface)}")
            b {interface.name}
            br
            code.selectable {interface.address}
    script.
        let port = 0;
        if (!this.opts.params) {
            const passedParams = new URLSearchParams(window.location.search);
            if (passedParams.has('link')) {
                const link = passedParams.get('link');
                const url = new URL(link);
                ({port} = url);
            }
        } else {
            const url = new URL(this.opts.params.link);
            ({port} = url);
        }
        this.interfaces = [];
        // TODO: populate with data from Bun

        const {getSVG} = require('qreator/lib/svg');
        this.qrCodes = new WeakMap();
        // https://stackoverflow.com/a/8440736
        Object.keys(interfaces).forEach(ifname => {
            var alias = 0;
            interfaces[ifname].forEach(iface => {
                if (iface.family !== 'IPv4' || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    this.interfaces.push({
                        name: `${ifname} (${alias})`,
                        address: `http://${iface.address}:${port}/`
                    });
                } else {
                    // this interface has only one ipv4 adress
                    this.interfaces.push({
                        name: ifname,
                        address: `http://${iface.address}:${port}/`
                    });
                }
                ++alias;
            });
        });
        for (const interface of this.interfaces) {
            getSVG(interface.address, {
                color: '#000000',
                bgColor: '#ffffff',
                margin: 1
            }).then(contents => {
                const blob = new Blob([contents], {
                    type: 'image/svg+xml'
                });
                const url = URL.createObjectURL(blob);
                this.qrCodes.set(interface, url);
                this.update();
            });
        }
        this.on('unmount', () => {
            for (const interface of this.interfaces) {
                URL.revokeObjectURL(this.qrCodes.get(interface));
                this.qrCodes.delete(interface);
            }
        });

debugger-modal.aView
    .center.aQRList
        .aQR(each="{interfaces}")
            div.center(ref="qr" data-address="{address}")
            b {name}
            br
            code.selectable {address}
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
        var os = require('os');
        var interfaces = os.networkInterfaces();

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

        const palette = {
            Day: ['#446adb', '#ffffff'],
            Night: ['#121822', '#44dbb5'],
            Horizon: ['#1C1E26', '#E95378']
        };
        this.on('mount', () => {
            setTimeout(() => {
                for (const div of (Array.isArray(this.refs.qr) ? this.refs.qr : [this.refs.qr])) {
                    const themedColors = palette[localStorage.UItheme];
                    // eslint-disable-next-line no-new
                    new QRCode(div, {
                        text: div.getAttribute('data-address'),
                        width: 256,
                        height: 256,
                        colorDark: themedColors ? themedColors[0] : palette.Day[0],
                        colorLight: themedColors ? themedColors[1] : palette.Day[1],
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            }, 0);
        });

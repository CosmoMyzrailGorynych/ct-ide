debugger-modal.modal
    .toright
        span(onclick="{closeModal}")
            svg.feather(title="{vocGlob.close}")
                use(xlink:href="data/icons.svg#x")
    .center.aQRList
        .aQR(each="{interfaces}")
            div.center(ref="qr" data-address="{address}")
            b {name}
            br
            code {address}
    script.
        this.closeModal = e => {
            this.parent.bShowModal = false;
            this.parent.update();
        };
        this.interfaces = [];
        var game = document.getElementById('thePreview');
        var os = require('os');
        var interfaces = os.networkInterfaces();

        var getPort = href => href.split(':').pop().split('/')[0];

        // https://stackoverflow.com/a/8440736
        Object.keys(interfaces).forEach(ifname => {
            var alias = 0;
            interfaces[ifname].forEach(iface => {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    this.interfaces.push({
                        name: `${ifname} (${alias})`,
                        address: `http://${iface.address}:${getPort(game.src)}/`
                    });
                } else {
                    // this interface has only one ipv4 adress
                    this.interfaces.push({
                        name: ifname,
                        address: `http://${iface.address}:${getPort(game.src)}/`
                    });
                }
                ++alias;
            });
        });

        this.on('mount', () => {
            setTimeout(() => {
                for (div of this.refs.qr) {
                    console.log(div);
                    var qrcode = new QRCode(div, {
                        text: div.getAttribute('data-address'),
                        width: 256,
                        height: 256,
                        colorDark : localStorage.UItheme === 'Day'? '#446adb' : '#121822',
                        colorLight : localStorage.UItheme === 'Day'? '#ffffff' : '#44dbb5',
                        correctLevel : QRCode.CorrectLevel.H
                    });
                }
            }, 0);
        });
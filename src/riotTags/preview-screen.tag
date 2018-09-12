preview-bottom-panel.flexrow
    button(onclick="{reloadGame}")
        span {voc.reload}
    button(onclick="{reloadRoom}")
        span {voc.roomRestart}
    button.nogrow(onclick="{showModal}" title="{voc.getQR}")
        i.icon-smartphone
    button.nogrow(onclick="{openExternal}" title="{voc.openExternal}")
        i.icon-external-link
    preview-modal(if="{bShowModal}")
    script.
        this.namespace = 'preview';
        this.mixin(window.riotVoc);
        this.bShowModal = false;
        this.reloadGame = e => {
            var game = document.getElementById('thePreview');
            game.reload();
            game.focus();
        };
        this.reloadRoom = e => {
            var game = document.getElementById('thePreview');
            game.executeScript({
                code: 'ct.rooms.switch(ct.room.name);',
                mainWorld: true
            });
            game.focus();
        };
        this.openExternal = e => {
            var game = document.getElementById('thePreview');
            nw.Shell.openExternal(game.src);
        };
        this.showModal = e => {
            this.bShowModal = !this.bShowModal;
        };

preview-modal.modal
    .toright
        span(onclick="{closeModal}")
            i.icon-x(title="{vocGlob.close}")
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
                        colorDark : localStorage.UItheme === 'Day'? '#446adb' : '#44dbb5',
                        colorLight : localStorage.UItheme === 'Day'? '#ffffff' : '#000000',
                        correctLevel : QRCode.CorrectLevel.H
                    });
                }
            }, 0);
        });
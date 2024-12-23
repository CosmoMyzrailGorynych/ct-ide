game-tools-qrs.aView.flexfix.tall
    .flexfix-header.flexrow
        .game-tools-qrs-aDragger#theDragger
            svg.feather
                use(xlink:href="#dragger-horizontal")
        button.nogrow.inline.square(title="{voc.close}" onclick="{exit}")
            svg.feather
                use(xlink:href="#x")
    .flexfix-body
        .center.rotate(if="{!ready}")
            svg.feather
                use(xlink:href="#loader")
        .center.aQRList(if="{ready}")
            .aQR(each="{interface in interfaces}")
                .center(if="{qrCodes.has(interface)}")
                    img(src="{qrCodes.get(interface)}")
                b {interface.name}
                br
                code.selectable {interface.address}
    script.
        const {run} = require('buntralino-client');

        this.namespace = 'common';
        this.mixin(require('src/lib/riotMixins/voc').default);

        this.ready = false;

        run('getNetInterfaces').then(interfaces => {
            const port = Number(window.NL_ARGS
                .find(arg => arg.includes('--gameport='))
                .split('=')[1]);

            this.interfaces = interfaces.filter(i => {
                // Remove obviously unusable for external devices interfaces
                if (i.name.toLowerCase().includes('vethernet')) {
                    return false;
                }
                if (i.name.toLowerCase().includes('vmware')) {
                    return false;
                }
                if (i.name.toLowerCase().includes('virtualbox')) {
                    return false;
                }
                return true;
            });
            this.interfaces.forEach(i => i.address = `${i.address}:${port}/`);
            const {getSVG} = require('qreator/lib/svg');
            this.qrCodes = new WeakMap();
            return Promise.all(this.interfaces.map(i =>
                getSVG(i.address, {
                    color: '#000000',
                    bgColor: '#ffffff',
                    margin: 1
                }).then(contents => {
                    const blob = new Blob([contents], {
                        type: 'image/svg+xml'
                    });
                    const url = URL.createObjectURL(blob);
                    this.qrCodes.set(i, url);
                })
            ));
        }).then(() => {
            this.ready = true;
            this.update();
        });

        this.on('unmount', () => {
            for (const i of this.interfaces) {
                URL.revokeObjectURL(this.qrCodes.get(i));
                this.qrCodes.delete(i);
            }
        });

        this.on('mount', () => {
            setTimeout(() => {
                Neutralino.window.setDraggableRegion('theDragger', {
                    alwaysCapture: true
                });
            }, 0);
        });

        this.exit = () => {
            run('debugToggleQrs');
        };

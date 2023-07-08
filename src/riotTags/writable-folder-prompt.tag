writable-folder-prompt
    .aDimmer
        .aPanel(ref="widget")
            h1 {voc.headerSelectFolderForData}
            .flexrow
                .sixty.npt.npl
                    p {voc.paragraphCouldNotPickDirectory}
                    p {voc.paragraphDirectoryDirections}
                    button(onclick="{openDirectoryPicker}")
                        svg.feather
                            use(xlink:href="#search")
                        span {voc.selectFolder}
                .fourty.npt.npr
                    svg.anIllustration.wide.tall
                        use(xlink:href="data/img/weirdFoldersIllustration.svg#illustration")
    script.
        this.namespace = 'writableFolderPrompt';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.openDirectoryPicker = async () => {
            const {requestWritableDir} = require('./data/node_requires/platformUtils');
            if (await requestWritableDir()) {
                if (this.opts.onsuccess) {
                    this.opts.onsuccess();
                }
            }
        };

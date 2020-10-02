writable-folder-prompt
    .dimmer
        .panel(ref="widget")
            h1 {voc.headerSelectFolderForData}
            .flexrow
                .sixty.npt.npl
                    p {voc.paragraphCouldNotPickDirectory}
                    p {voc.paragraphDirectoryDirections}
                    button(onclick="{openDirectoryPicker}")
                        svg.feather
                            use(xlink:href="data/icons.svg#search")
                        span {voc.selectFolder}
                .fourty.npt.npr
                    svg.anIllustration.wide.tall
                        use(xlink:href="data/img/weirdFoldersIllustration.svg#illustration")
    script.
        this.namespace = 'writableFolderPrompt';
        this.mixin(window.riotVoc);

        this.openDirectoryPicker = async () => {
            require('./data/node_requires/platformUtils').requestWritableDir();
        };
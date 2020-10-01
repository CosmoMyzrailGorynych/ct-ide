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
            const folder = await window.showOpenDialog({
                openDirectory: true,
                title: this.voc.headerSelectFolderForData
            });
            const fs = require('fs-extra');
            try {
                const lstat = await fs.lstat(folder);
                if (!lstat.isDirectory()) {
                    window.alertify.error(this.voc.notADirectory);
                    return;
                }
                try {
                    await fs.access(folder, fs.constants.W_OK);
                    localStorage.customWritableDir = folder;
                    window.alertify.success(this.voc.complete);
                    if (this.opts.onsuccess) {
                        this.opts.onsuccess();
                    }
                } catch (e) {
                    window.alertify.error(this.voc.folderNotWritable);
                }
            } catch (e) {
                window.alertify.error(this.voc.folderDoesNotExist);
            }
        };
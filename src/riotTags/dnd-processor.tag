dnd-processor
    .aDropzone(if="{dropping}" ondrop="{dndImport}")
        .middleinner
            svg.feather
                use(xlink:href="#download")
            h2 {vocGlob.dropToImport}
    script.
        this.mixin(require('src/lib/riotMixins/voc').default);
        this.dndImport = async e => {
            e.preventDefault();
            if (!e.dataTransfer.items && !e.dataTransfer.files) {
                return;
            }
            let files;
            if (e.dataTransfer.items) {
                files = [...e.dataTransfer.items]
                    .filter(i => i.kind === 'file')
                    .map(i => i.getAsFile());
            } else {
                files = [...e.dataTransfer.files];
            }
            this.dropping = false;
            this.update();

            const {createAsset} = require('src/lib/resources');
            await Promise.all(files.map(async file => {
                if (/\.(jpg|gif|png|jpeg)$/gi.test(file.name)) {
                    createAsset('texture', this.opts.currentfolder, {
                        src: await file.arrayBuffer(),
                        name: file.name.split('.')[0]
                    });
                } else if (/\.ttf$/gi.test(file.name)) {
                    createAsset('typeface', this.opts.currentfolder, {
                        src: await file.arrayBuffer(),
                        name: file.name.split('.')[0]
                    });
                } else {
                    alertify.log(`Skipped ${file.name} as it is not supported by drag-and-drop importer.`);
                }
            }));
        };

        /*
         * drag-n-drop handling
         */
        let dragTimer;
        this.onDragOver = e => {
            var dt = e.dataTransfer;
            if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') !== -1 : dt.types.contains('Files'))) {
                this.dropping = true;
                this.update();
                window.clearTimeout(dragTimer);
            }
            e.preventDefault();
            e.stopPropagation();
        };
        this.onDrop = e => {
            this.dropping = false;
            this.update();
            e.stopPropagation();
        };
        this.onDragLeave = e => {
            dragTimer = window.setTimeout(() => {
                this.dropping = false;
                this.update();
            }, 25);
            e.preventDefault();
            e.stopPropagation();
        };
        this.on('mount', () => {
            document.addEventListener('dragover', this.onDragOver);
            document.addEventListener('dragleave', this.onDragLeave);
            document.addEventListener('drop', this.onDrop);
        });
        this.on('unmount', () => {
            document.removeEventListener('dragover', this.onDragOver);
            document.removeEventListener('dragleave', this.onDragLeave);
            document.removeEventListener('drop', this.onDrop);
        });

dnd-processor
    .aDropzone(if="{dropping}")
        .middleinner
            svg.feather
                use(xlink:href="#download")
            h2 {vocGlob.dropToImport}
            input(
                type="file" multiple
                accept=".png,.jpg,.jpeg,.bmp,.gif,.json,.ttf"
                onchange="{dndImport}"
            )
    script.
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.dndImport = e => {
            const {createAsset} = require('./data/node_requires/resources');
            const files = [...e.target.files].map(file => file.path);
            for (let i = 0; i < files.length; i++) {
                if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
                    createAsset('texture', this.opts.currentfolder, {
                        src: files[i]
                    });
                } else if (/_ske\.json/i.test(files[i])) {
                    createAsset('skeleton', this.opts.currentfolder, {
                        src: files[i]
                    });
                } else if (/\.ttf/gi.test(files[i])) {
                    createAsset('font', this.opts.currentfolder, {
                        src: files[i]
                    });
                } else {
                    alertify.log(`Skipped ${files[i]} as it is not supported by drag-and-drop importer.`);
                }
            }
            e.srcElement.value = '';
            this.dropping = false;
            e.preventDefault();
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

dnd-processor
    .aDropzone(if="{dropping}")
        .middleinner
            svg.feather
                use(xlink:href="data/icons.svg#download")
            h2 {languageJSON.common.fastimport}
            input(
                type="file" multiple
                accept=".png,.jpg,.jpeg,.bmp,.gif,.json,.ttf"
                onchange="{dndImport}"
            )
    script.
        this.dndImport = e => {
            const files = [...e.target.files].map(file => file.path);
            for (let i = 0; i < files.length; i++) {
                if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
                    const {importImageToTexture} = require('./data/node_requires/resources/textures');
                    importImageToTexture(files[i]);
                } else if (/_ske\.json/i.test(files[i])) {
                    const {importSkeleton} = require('./data/node_requires/resources/skeletons');
                    importSkeleton(files[i]);
                } else if (/\.ttf/gi.test(files[i])) {
                    const {importTtfToFont} = require('./data/node_requires/resources/fonts');
                    importTtfToFont(files[i]);
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
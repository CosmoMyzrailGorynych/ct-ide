particle-importer.panel.view
    .flexfix.tall
        .flexfix-body
            ul.cards
                li(
                    each="{texture in textures}"
                    onclick="{onselected(texture)}"
                    no-reorder
                )
                    span {texture.name}
                    img(src="{texture.path}")
        .flexfix-footer(if="{oncancelled}")
            button(onclick="{oncancelled}") {voc.cancel}
    script.
        this.onselected = this.opts.onselected;
        this.oncancelled = this.opts.oncancelled;
        this.namespace = 'common';
        this.mixin(window.riotVoc);

        this.updateList = () => {
            this.textures = [];
            const fs = require('fs-extra');
            const path = require('path');
            fs.readdir('data/particles')
            .then(files => {
                for (const file of files) {
                    this.textures.push({
                        name: path.basename(file, path.extname(file)),
                        path: path.join('data/particles', file)
                    });
                }
                this.update();
            });
        };
        this.updateList();

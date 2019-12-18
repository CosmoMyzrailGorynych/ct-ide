fonts-panel.flexfix.tall.fifty
    div.flexfix-header
        h1 {voc.fonts}
    .toleft
        label.file.flexfix-header
            input(type="file" multiple
                accept=".ttf"
                onchange="{fontImport}")
            .button
                svg.feather
                    use(xlink:href="data/icons.svg#download")
                span {voc.import}
    .clear
    ul.cards.flexfix-body
        li(each="{font in (searchResults? searchResults : fonts)}"
        onclick="{openFont(font)}"
        oncontextmenu="{onFontContextMenu(font)}"
        onlong-press="{onFontContextMenu(font)}")
            span {font.typefaceName} {font.weight} {font.italic? voc.italic : ''}
            img(src="file://{window.sessionStorage.projdir + '/fonts/' + font.origname}_prev.png?{font.lastmod}")
    .aDropzone(if="{dropping}")
        .middleinner
            svg.feather
                use(xlink:href="data/icons.svg#download")
            h2 {languageJSON.common.fastimport}
            input(type="file" multiple
                accept=".ttf"
                onchange="{fontImport}")
    context-menu(menu="{fontMenu}" ref="fontMenu")
    font-editor(if="{editingFont}" fontobj="{editedFont}")
    script.
        this.editingFont = false;
        window.currentProject.fonts = window.currentProject.fonts || [];
        this.fonts = window.currentProject.fonts;
        this.namespace = 'fonts';
        this.mixin(window.riotVoc);
        const fs = require('fs-extra'),
              path = require('path');

        this.setUpPanel = e => {
            window.currentProject.fonts = window.currentProject.fonts || [];
            this.fonts = window.currentProject.fonts;
            this.editingFont = false;
            this.editedFont = null;
            this.update();
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
        });

        this.openFont = font => e => {
            this.editingFont = true;
            this.editedFont = font;
        };

        // Context menu for manipulating fonts with RMB
        this.fontMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: e => {
                    this.editingFont = true;
                    this.update();
                }
            }, {
                label: languageJSON.common.copyName,
                click: e => {
                    const {clipboard} = require('electron');
                    clipboard.writeText(this.editedFont.name);
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    alertify
                    .defaultValue(this.editedFont.name)
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            this.editedFont.name = e.inputValue;
                            this.update();
                        }
                    });
                }
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.delete,
                click: () => {
                    alertify
                    .okBtn(window.languageJSON.common.delete)
                    .cancelBtn(window.languageJSON.common.cancel)
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', `${this.editedFont.typefaceName} ${this.editedFont.weight} ${this.editedFont.italic? voc.italic : ''}`))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            const ind = window.currentProject.fonts.indexOf(this.editedFont);
                            window.currentProject.fonts.splice(ind, 1);
                            this.update();
                            alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };
        this.onFontContextMenu = font => e => {
            this.editedFont = e.item.font;
            this.refs.fontMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

        /**
         * The event of importing a font through a file manager
         */
        this.fontImport = e => { // e.target:input[type="file"]
            const generateGUID = require('./data/node_requires/generateGUID');
            const files = [...e.target.files].map(file => file.path);
            e.target.value = '';
            for (let i = 0; i < files.length; i++) {
                if (/\.ttf/gi.test(files[i])) {
                    let id = generateGUID();
                    this.loadFont(
                        id,
                        files[i],
                        path.join(sessionStorage.projdir, '/fonts/f' + id + '.ttf'),
                        true
                    );
                } else {
                    // ¯\_(ツ)_/¯
                }
            }
            this.dropping = false;
            e.srcElement.value = ""; // clear input value that prevent to upload the same filename again
            e.preventDefault();
        };
        this.loadFont = (uid, filename, dest, imprt) => {
            fs.copy(filename, dest, e => {
                if (e) throw e;
                var obj = {
                    typefaceName: path.basename(filename).replace('.ttf', ''),
                    weight: 400,
                    italic: false,
                    uid: uid,
                    origname: path.basename(dest),
                    lastmod: +(new Date())
                };
                window.currentProject.fonts.push(obj);
                setTimeout(() => {
                    this.fontGenPreview(dest, dest + '_prev.png', 64, obj)
                    .then(dataUrl => {
                        this.update();
                    });
                }, 250)
            });
        };
        this.fontGenPreview = (source, destFile, size, obj) => new Promise ((resolve, reject) => {
            var template = {
                weight: obj.weight,
                style: obj.italic? 'italic' : 'normal'
            };
            // we clean the source url from the possible space and the \ to / (windows specific)
            var cleanedSource = source.replace(/ /g, '%20').replace(/\\/g, '/');
            var face = new FontFace('CTPROJFONT' + obj.typefaceName, `url(file://${cleanedSource})`, template);
            var elt = document.createElement('span');
            elt.innerHTML = 'testString';
            elt.style.fontFamily = obj.typefaceName;
            document.body.appendChild(elt);
            face.load()
            .then(loaded => {
                loaded.external = true;
                loaded.ctId = face.ctId = obj.uid;
                document.fonts.add(loaded);
                var c = document.createElement('canvas'),
                    w, h;
                c.x = c.getContext('2d');
                c.width = c.height = size;
                c.x.clearRect(0, 0, size, size);
                c.x.font = `${obj.italic? 'italic ' : ''}${obj.weight} ${Math.floor(size * 0.75)}px "${loaded.family}"`;
                c.x.fillStyle = '#000';
                c.x.fillText('Aa', size * 0.05, size * 0.75);
                // strip off the data:image url prefix to get just the base64-encoded bytes
                var dataURL = c.toDataURL();
                var data = dataURL.replace(/^data:image\/\w+;base64,/, '');
                var buf = new Buffer(data, 'base64');
                var stream = fs.createWriteStream(destFile);
                stream.on('finish', () => {
                    setTimeout(() => { // WHY THE HECK I EVER NEED THIS?!
                        resolve(destFile);
                    }, 100);
                });
                stream.on('error', err => {
                    reject(err);
                });
                stream.end(buf);
            })
            .catch(reject);
        });
        /*
         * Additions for drag-n-drop
         */
        var dragTimer;
        this.onDragOver = e => {
            var dt = e.dataTransfer;
            if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
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
                this.update()
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

        this.loadFonts = () => {
            var fonts = window.currentProject.fonts;
            for (const font of document.fonts) {
                if (font.external) {
                    document.fonts.delete(font);
                }
            }
            for (const font of fonts) {
                var template = {
                        weight: font.weight,
                        style: font.italic? 'italic' : 'normal'
                    },
                    source = `${sessionStorage.projdir}/fonts/${font.origname}`;
                    var cleanedSource = source.replace(/ /g, '%20').replace(/\\/g, '/');
                var face = new FontFace('CTPROJFONT' + font.typefaceName, `url(file://${cleanedSource})`, template);
                face.load()
                .then(loaded => {
                    loaded.external = true;
                    loaded.ctId = face.ctId = font.uid;
                    document.fonts.add(loaded);
                });
            }
        };
        this.loadFonts();
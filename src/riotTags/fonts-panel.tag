fonts-panel.flexfix.tall.fifty
    div.flexfix-header
        h1 {voc.fonts}
    .toleft
        label.file.flexfix-header
            input(type="file" multiple 
                accept=".ttf" 
                onchange="{fontImport}")
            .button
                i.icon.icon-import
                span {voc.import}
    .clear
    ul.cards.flexfix-body
        li(each="{font in (searchResults? searchResults : fonts)}" 
        onclick="{openFont(font)}" 
        oncontextmenu="{onFontContextMenu(font)}")
            span {font.typefaceName} {font.weight} {font.italic? voc.italic : ''}
            img(src="file://{window.sessionStorage.projdir + '/fonts/' + font.origname}_prev.png?{font.lastmod}")
    .aDropzone(if="{dropping}")
        .middleinner
            i.icon-import
            h2 {languageJSON.common.fastimport}
            input(type="file" multiple 
                accept=".ttf" 
                onchange="{fontImport}")
    font-editor(if="{editingFont}" fontobj="{editedFont}")
    script.
        this.editingFont = false;
        window.currentProject.fonts = window.currentProject.fonts || [];
        this.fonts = window.currentProject.fonts;
        this.namespace = 'fonts';
        this.mixin(window.riotVoc);
        const fs = require('fs-extra'),
              path = require('path'),
              gui = require('nw.gui');

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
        var fontMenu = new gui.Menu();
        this.onFontContextMenu = font => e => {
            this.editedFont = e.item.font;
            fontMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        fontMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            click: e => {
                this.editingFont = true;
                this.update();
            }
        }));
        fontMenu.append(new gui.MenuItem({
            label: languageJSON.common.copyName,
            click: e => {
                var clipboard = nw.Clipboard.get();
                clipboard.set(this.editedFont.name, 'text');
            }
        }));
        fontMenu.append(new gui.MenuItem({
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
        }));
        fontMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        fontMenu.append(new gui.MenuItem({
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
                        this.updateList();
                        this.update();
                        alertify
                        .okBtn(window.languageJSON.common.ok)
                        .cancelBtn(window.languageJSON.common.cancel);
                    }
                });
            }
        }));

        /**
         * The event of importing a font through a file manager
         */
        this.fontImport = e => { // e.target:input[type="file"]
            var i;
            files = e.target.value.split(';');
            for (i = 0; i < files.length; i++) {
                if (/\.ttf/gi.test(files[i])) {
                    let id = window.generateGUID();
                    this.loadFont(
                        id,
                        files[i],
                        sessionStorage.projdir + '/fonts/f' + id + '.ttf',
                        true
                    );
                } else {
                    
                }
            }
            this.dropping = false;
            e.preventDefault();
        };
        this.loadFont = (uid, filename, dest, imprt) => {
            window.megacopy(filename, dest, e => {
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
            var face = new FontFace('CTPROJFONT' + obj.typefaceName, `url(file://${source})`, template);
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
                var face = new FontFace('CTPROJFONT' + font.typefaceName, `url(file://${source})`, template);
                face.load()
                .then(loaded => {
                    loaded.external = true;
                    loaded.ctId = face.ctId = font.uid;
                    document.fonts.add(loaded);
                });
            }
        };
        this.loadFonts();
//
    @method openAsset
fonts-panel.flexfix.tall.fifty
    asset-viewer(
        collection="{global.currentProject.fonts}"
        contextmenu="{onFontContextMenu}"
        namespace="fonts"
        assettype="fonts"
        click="{openFont}"
        thumbnails="{thumbnails}"
        names="{names}"
        ref="fonts"
        class="tall"
    )
        h1 {parent.voc.fonts}
        .toleft
            label.file.flexfix-header
                input(type="file" multiple
                    accept=".ttf"
                    onchange="{parent.fontImport}")
                .button
                    svg.feather
                        use(xlink:href="#download")
                    span {parent.voc.import}
    context-menu(menu="{fontMenu}" ref="fontMenu")
    font-editor(if="{editingFont}" fontobj="{editedFont}")
    script.
        this.editingFont = false;
        global.currentProject.fonts = global.currentProject.fonts || [];
        this.fonts = global.currentProject.fonts;
        this.namespace = 'fonts';
        this.mixin(window.riotVoc);

        this.thumbnails = require('./data/node_requires/resources/fonts').getFontPreview;
        this.names = font => `${font.typefaceName} ${font.weight} ${font.italic ? this.voc.italic : ''}`;

        this.setUpPanel = () => {
            global.currentProject.fonts = global.currentProject.fonts || [];
            this.fonts = global.currentProject.fonts;
            this.editingFont = false;
            this.editedFont = null;
            this.refs.fonts.updateList();
            this.update();
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
        });

        this.openFont = font => () => {
            this.editingFont = true;
            this.editedFont = font;
            this.update();
        };
        this.openAsset = (assetType, uid) => {
            const {getById} = require('./data/node_requires/resources/fonts');
            this.openFont(getById(uid))();
        };

        // Context menu for manipulating fonts with RMB
        this.fontMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: () => {
                    this.editingFont = true;
                    this.update();
                }
            }, {
                label: window.languageJSON.common.copyName,
                click: () => {
                    nw.Clipboard.get().set(this.editedFont.name, 'text');
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    alertify
                    .defaultValue(this.editedFont.typefaceName)
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            this.editedFont.typefaceName = e.inputValue;
                            this.refs.fonts.updateList();
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
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', `${this.editedFont.typefaceName} ${this.editedFont.weight} ${this.editedFont.italic ? this.voc.italic : ''}`))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            const ind = global.currentProject.fonts.indexOf(this.editedFont);
                            global.currentProject.fonts.splice(ind, 1);
                            this.refs.fonts.updateList();
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
            this.editedFont = font;
            this.refs.fontMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

        /**
         * The event of importing a font through a file manager
         */
        this.fontImport = e => { // e.target:input[type="file"]
            const files = [...e.target.files].map(file => file.path);
            e.target.value = '';
            const {importTtfToFont} = require('./data/node_requires/resources/fonts');
            for (let i = 0; i < files.length; i++) {
                if (/\.ttf/gi.test(files[i])) {
                    importTtfToFont(files[i], this.refs.fonts.currentGroup.uid)
                    .then(() => {
                        this.refs.fonts.updateList();
                        this.update();
                    });
                } else {
                    alertify.log(`Skipped ${files[i]} as it is not a .ttf file.`);
                }
            }
            e.srcElement.value = ''; // clear input value that prevent to upload the same filename again
            e.preventDefault();
        };

        const updatePanels = () => {
            this.refs.fonts.updateList();
            this.update();
        };
        window.signals.on('fontCreated', updatePanels);
        this.on('unmount', () => {
            window.signals.off('fontCreated', updatePanels);
        });

        this.loadFonts = () => {
            const {fonts} = global.currentProject;
            for (const font of document.fonts) {
                if (font.external) {
                    document.fonts.delete(font);
                }
            }
            for (const font of fonts) {
                const template = {
                    weight: font.weight,
                    style: font.italic ? 'italic' : 'normal'
                };
                const source = `${global.projdir}/fonts/${font.origname}`,
                      cleanedSource = source.replace(/ /g, '%20').replace(/\\/g, '/');
                const face = new FontFace('CTPROJFONT' + font.typefaceName, `url(file://${cleanedSource})`, template);
                face.load()
                .then(loaded => {
                    loaded.external = true;
                    loaded.ctId = face.ctId = font.uid;
                    document.fonts.add(loaded);
                });
            }
        };
        this.loadFonts();

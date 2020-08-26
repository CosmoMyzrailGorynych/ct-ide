textures-panel.panel.view
    .flexfix.tall
        div
            asset-viewer(
                collection="{global.currentProject.textures}"
                contextmenu="{showTexturePopup}"
                vocspace="texture"
                namespace="textures"
                click="{openTexture}"
                thumbnails="{textureThumbnails}"
                ref="textures"
            )
                label.file.inlineblock
                    input(type="file" multiple
                        accept=".png,.jpg,.jpeg,.bmp,.gif,.json"
                        onchange="{parent.textureImport}")
                    .button
                        svg.feather
                            use(xlink:href="data/icons.svg#download")
                        span {voc.import}
                button(
                    onclick="{parent.pasteTexture}"
                    title="{voc.importFromClipboard}"
                    data-hotkey="Control+v"
                    data-hotkey-require-scope="texture"
                )
                    svg.feather
                        use(xlink:href="data/icons.svg#clipboard")
                button(
                    onclick="{parent.openGenerator}"
                    title="{voc.generatePlaceholder}"
                )
                    svg.feather
                        use(xlink:href="data/icons.svg#loader")
            asset-viewer(
                collection="{global.currentProject.skeletons}"
                contextmenu="{showSkeletonPopup}"
                vocspace="texture"
                namespace="skeletons"
                thumbnails="{skelThumbnails}"
                ref="skeletons"
            )
                h2
                    span {voc.skeletons}
                    docs-shortcut(path="/skeletal-animation.html")
                label.file.flexfix-header
                    input(type="file" multiple
                        accept=".json"
                        onchange="{parent.textureImport}")
                    .button
                        svg.feather
                            use(xlink:href="data/icons.svg#download")
                        span {voc.import}
    texture-editor(if="{editing}" texture="{currentTexture}")
    texture-generator(if="{generating}" onclose="{closeGenerator}")
    context-menu(menu="{textureMenu}" ref="textureMenu")
    script.
        const glob = require('./data/node_requires/glob');
        this.namespace = 'texture';
        this.mixin(window.riotVoc);
        this.editing = false;
        this.dropping = false;

        this.textureThumbnails = require('./data/node_requires/resources/textures').getTexturePreview;
        this.skelThumbnails = require('./data/node_requires/resources/skeletons').getSkeletonPreview;

        this.fillTextureMap = () => {
            glob.texturemap = {};
            global.currentProject.textures.forEach(texture => {
                var img = document.createElement('img');
                glob.texturemap[texture.uid] = img;
                img.g = texture;
                img.src = 'file://' + global.projdir + '/img/' + texture.origname + '?' + texture.lastmod;
            });
            var img = document.createElement('img');
            glob.texturemap[-1] = img;
            img.g = {
                width: 32,
                height: 32,
                offx: 0,
                offy: 0,
                grid: [1, 1],
                axis: [16, 16],
                marginx: 0,
                marginy: 0,
                imgWidth: 32,
                imgHeight: 32,
                closedStrip: true
            };
            img.src = 'data/img/unknown.png';
        };

        this.setUpPanel = () => {
            this.fillTextureMap();
            this.refs.textures.updateList();
            this.refs.skeletons.updateList();
            this.searchResults = null;
            this.editing = false;
            this.dropping = false;
            this.currentTexture = null;
            this.update();
        };
        this.updateTextureData = () => {
            this.refs.textures.updateList();
            this.refs.skeletons.updateList();
            this.update();
            this.fillTextureMap();
        };

        window.signals.on('projectLoaded', this.setUpPanel);
        window.signals.on('textureImported', this.updateTextureData);
        window.signals.on('skeletonImported', this.updateTextureData);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
            window.signals.off('textureImported', this.updateTextureData);
            window.signals.off('skeletonImported', this.updateTextureData);
        });

        /**
         * An event fired when user attempts to add files from a file manager
         * (by clicking an "Import" button)
         */
        this.textureImport = e => { // input[type="file"]
            const {importImageToTexture} = require('./data/node_requires/resources/textures');
            const files = [...e.target.files].map(file => file.path);
            for (let i = 0; i < files.length; i++) {
                if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
                    importImageToTexture(files[i]);
                } else if (/_ske\.json/i.test(files[i])) {
                    const {importSkeleton} = require('./data/node_requires/resources/skeletons');
                    importSkeleton(files[i]);
                }
            }
            e.srcElement.value = '';
            e.preventDefault();
        };

        this.pasteTexture = () => {
            const png = nw.Clipboard.get().get('png');
            if (!png) {
                alertify.error(this.vocGlob.couldNotLoadFromClipboard);
                return;
            }
            const imageBase64 = png.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = new Buffer(imageBase64, 'base64');
            const {importImageToTexture} = require('./data/node_requires/resources/textures');
            importImageToTexture(imageBuffer);
            alertify.success(this.vocGlob.pastedFromClipboard);
        };

        this.openGenerator = () => {
            this.generating = true;
        };
        this.closeGenerator = () => {
            this.generating = false;
            this.update();
        };

        const deleteCurrentTexture = () => {
            for (const type of global.currentProject.types) {
                if (type.texture === this.currentTexture.uid) {
                    type.texture = -1;
                }
            }
            for (const room of global.currentProject.rooms) {
                if ('tiles' in room) {
                    for (const layer of room.tiles) {
                        layer.tiles = layer.tiles.filter(tile => tile.texture !== this.currentTexture.uid);
                    }
                }
                if ('backgrounds' in room) {
                    let i = 0;
                    while (i < room.backgrounds.length) {
                        if (room.backgrounds[i].texture === this.currentTexture.uid) {
                            room.backgrounds.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                }
            }
            for (const tandem of global.currentProject.emitterTandems) {
                for (const emitter of tandem.emitters) {
                    if (emitter.texture === this.currentTexture.uid) {
                        emitter.texture = -1;
                    }
                }
            }
            if (global.currentProject.settings.icon === this.currentTexture.uid) {
                delete global.currentProject.settings.icon;
            }
            global.currentProject.textures.splice(this.currentTextureId, 1);
        };

        // Creates a context menu that will appear on RMB click on texture cards
        this.textureMenu = {
            opened: false,
            items: [{
                icon: 'loader',
                label: this.voc.createType,
                click: () => {
                    const typesAPI = require('./data/node_requires/resources/types/');
                    const type = typesAPI.createNewType(this.currentTexture.name);
                    type.texture = this.currentTexture.uid;
                    // eslint-disable-next-line no-underscore-dangle
                    const mainMenu = document.getElementsByTagName('main-menu')[0]._tag;
                    mainMenu.changeTab('types')();
                    mainMenu.update();
                    // eslint-disable-next-line no-underscore-dangle
                    const typesPanel = document.getElementsByTagName('types-panel')[0]._tag;
                    typesPanel.refs.types.updateList();
                    typesPanel.openType(type)();
                    typesPanel.update();
                }
            }, {
                label: window.languageJSON.common.open,
                click: () => {
                    if (this.currentTextureType !== 'skeleton') {
                        this.openTexture(this.currentTexture)();
                    }
                    this.update();
                }
            }, {
                label: window.languageJSON.common.copyName,
                click: () => {
                    nw.Clipboard.get().set(this.currentTexture.name, 'text');
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    alertify
                    .defaultValue(this.currentTexture.name)
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue && e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            this.currentTexture.name = e.inputValue;
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
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentTexture.name))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            if (this.currentTextureType === 'skeleton') {
                                global.currentProject.skeletons.splice(this.currentTextureId, 1);
                            } else {
                                deleteCurrentTexture();
                            }
                            this.refs.textures.updateList();
                            this.refs.skeletons.updateList();
                            this.update();
                            alertify
                                .okBtn(window.languageJSON.common.ok)
                                .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };
        /**
         * Shows the context menu created above
         */
        this.showTexturePopup = (texture, isSkeleton) => e => {
            this.currentTextureType = isSkeleton ? 'skeleton' : 'texture';
            if (isSkeleton) {
                this.currentTextureId = global.currentProject.skeletons.indexOf(texture);
            } else {
                this.currentTextureId = global.currentProject.textures.indexOf(texture);
            }
            this.currentTexture = texture;
            this.refs.textureMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        this.showSkeletonPopup = skel => e => {
            this.showTexturePopup(skel, true)(e);
        };

        /**
         * Opens an editor for the given texture
         */
        this.openTexture = texture => () => {
            this.currentTexture = texture;
            this.currentTextureId = global.currentProject.textures.indexOf(texture);
            this.editing = true;
        };

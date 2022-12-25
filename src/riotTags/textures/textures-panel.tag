//
    @method openAsset
textures-panel.aPanel.aView
    .flexfix.tall
        div
            asset-viewer(
                collection="{global.currentProject.textures}"
                contextmenu="{showTexturePopup}"
                assettype="textures"
                namespace="textures"
                click="{openTexture}"
                thumbnails="{textureThumbnails}"
                icons="{textureIcons}"
                ref="textures"
            )
                h1.inlineblock
                    span {parent.voc.textures}
                .aSpacer.inlineblock
                .aButtonGroup
                    button(onclick="{parent.openFileSelector}")
                        svg.feather
                            use(xlink:href="#download")
                        span {parent.voc.import}
                    button(
                        onclick="{parent.pasteTexture}"
                        title="{parent.voc.importFromClipboard}"
                        data-hotkey="Control+v"
                        data-hotkey-require-scope="texture"
                        ref="clipboardPaste"
                    ).square
                        svg.feather
                            use(xlink:href="#clipboard")
                .aButtonGroup.nml
                    button(onclick="{parent.openGallery}" ref="galleryButton")
                        svg.feather
                            use(xlink:href="#folder")
                        span {parent.vocGlob.openAssetGallery}
                    button(
                        onclick="{parent.openGenerator}"
                        title="{parent.voc.generatePlaceholder}"
                        ref="placeholderGenButton"
                    ).square
                        svg.feather
                            use(xlink:href="#loader")
            asset-viewer(
                collection="{global.currentProject.skeletons}"
                contextmenu="{showSkeletonPopup}"
                assettype="skeletons"
                namespace="skeletons"
                thumbnails="{skelThumbnails}"
                ref="skeletons"
            )
                h1.inlineblock
                    span {parent.voc.skeletons}
                .aSpacer.inlineblock
                label.file.inlineblock
                    input(type="file" multiple
                        accept=".json"
                        onchange="{parent.textureImport}")
                    .button
                        svg.feather
                            use(xlink:href="#download")
                        span {parent.voc.import}
                docs-shortcut(hidelabel="yes" path="/skeletal-animation.html" button="yes" title="{vocGlob.docsShort}")
    input(
        style="display: none;"
        type="file" multiple accept=".webp,.png,.jpg,.jpeg,.bmp,.gif,.json"
        ref="inputFile" onchange="{textureImport}"
    )
    texture-editor(if="{editing}" texture="{currentTexture}" onclose="{closeTexture}")
    texture-generator(if="{generating}" onclose="{closeGenerator}")
    context-menu(menu="{textureMenu}" ref="textureMenu")
    builtin-asset-gallery(if="{showingGallery}" type="textures" onclose="{closeGallery}")
    script.
        const glob = require('./data/node_requires/glob');
        this.namespace = 'texture';
        this.mixin(window.riotVoc);
        this.editing = false;
        this.dropping = false;

        this.textureThumbnails = require('./data/node_requires/resources/textures').getTexturePreview;
        const iconMap = {
            rect: 'square',
            circle: 'circle',
            strip: 'polyline'
        };
        this.textureIcons = texture => [iconMap[texture.shape]];
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

        this.openAsset = (assetType, uid) => {
            if (this.editing) {
                // Reset texture editor
                this.editing = this.currentTexture = this.currentTextureId = false;
                this.update();
            }
            if (assetType !== 'textures') {
                return; // cannot open skeletons
            }
            this.editing = true;
            this.currentTexture = window.currentProject.textures.find(t => t.uid === uid);
            this.currentTextureId = uid;
            this.update();
        };

        this.openFileSelector = () => {
            this.refs.inputFile.click();
        };
        /**
         * An event fired when user attempts to add files from a file manager
         * (by clicking an "Import" button)
         */
        this.textureImport = e => { // input[type="file"]
            const {importImageToTexture} = require('./data/node_requires/resources/textures');
            const files = [...e.target.files].map(file => file.path);
            for (let i = 0; i < files.length; i++) {
                if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
                    importImageToTexture(files[i], void 0, this.refs.textures.currentGroup.uid);
                } else if (/_ske\.json/i.test(files[i])) {
                    const {importSkeleton} = require('./data/node_requires/resources/skeletons');
                    importSkeleton(files[i], this.refs.skeletons.currentGroup.uid);
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
            importImageToTexture(imageBuffer, void 0, this.refs.textures.currentGroup.uid);
            alertify.success(this.vocGlob.pastedFromClipboard);
        };

        /**
         * Opens an editor for the given texture
         */
        this.openTexture = texture => () => {
            this.currentTexture = texture;
            this.currentTextureId = global.currentProject.textures.indexOf(texture);
            this.editing = true;
        };
        this.closeTexture = () => {
            this.editing = false;
            this.update();
        };

        this.openGenerator = () => {
            this.generating = true;
        };
        this.closeGenerator = () => {
            this.generating = false;
            this.update();
        };

        const deleteCurrentTexture = () => {
            for (const template of global.currentProject.templates) {
                if (template.texture === this.currentTexture.uid) {
                    template.texture = -1;
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
            if (global.currentProject.settings.branding.icon === this.currentTexture.uid) {
                delete global.currentProject.settings.branding.icon;
            }
            global.currentProject.textures.splice(this.currentTextureId, 1);
        };

        // Creates a context menu that will appear on RMB click on texture cards
        this.textureMenu = {
            opened: false,
            items: [{
                icon: 'loader',
                label: this.voc.createTemplate,
                click: () => {
                    const templatesAPI = require('./data/node_requires/resources/templates/');
                    const template = templatesAPI.createNewTemplate(this.currentTexture.name);
                    if (this.currentTextureType === 'skeleton') {
                        template.oncreate = '// You can set a regular texture to make a collision mask;\n' +
                            '// ct.js doesn\'t support collisions and in-editor display of skeletal animations yet!\n' +
                            `this.skel = ct.res.makeSkeleton('${this.currentTexture.name}');\n` +
                            'this.skel.animation.play(\'DefaultAnimation\');\n' +
                            'this.addChild(this.skel);\n' +
                            'this.tex = -1; // This will hide the copy\'s own sprite';
                    } else {
                        template.texture = this.currentTexture.uid;
                    }
                    window.orders.trigger('openAsset', `templates/${template.uid}`);
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
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue && e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            this.currentTexture.name = e.inputValue;
                            this.update();
                            const {updatePixiTexture} = require('./data/node_requires/resources/textures');
                            updatePixiTexture(this.currentTexture);
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

        this.openGallery = () => {
            this.showingGallery = true;
        };
        this.closeGallery = () => {
            this.showingGallery = false;
            this.update();
        };

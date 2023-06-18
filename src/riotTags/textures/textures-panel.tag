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
                click="{openSkeleton}"
                contextmenu="{showSkeletonPopup}"
                assettype="skeletons"
                namespace="skeletons"
                thumbnails="{skelThumbnails}"
                icons="{textureIcons}"
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
    texture-editor(if="{editing && currentTexture}" texture="{currentTexture}" onclose="{closeTexture}")
    texture-editor(if="{editing && currentSkeleton}" skeletonmode="yep" skeleton="{currentSkeleton}" onclose="{closeSkeleton}")
    texture-generator(if="{generating}" onclose="{closeGenerator}")
    context-menu(menu="{textureMenu}" ref="textureMenu")
    builtin-asset-gallery(if="{showingGallery}" type="textures" onclose="{closeGallery}")
    script.
        const glob = require('./data/node_requires/glob');

        const {getTextureOrig, getTextureFromId, getTexturePreview} = require('./data/node_requires/resources/textures');
        const {getSkeletonFromId, getSkeletonThumbnail} = require('./data/node_requires/resources/skeletons');
        this.textureThumbnails = getTexturePreview;
        this.skelThumbnails = getSkeletonThumbnail;

        this.namespace = 'texture';
        this.mixin(window.riotVoc);
        this.editing = false;
        this.dropping = false;

        const iconMap = {
            rect: 'square',
            circle: 'circle',
            strip: 'polyline'
        };
        this.textureIcons = texture => [iconMap[texture.shape]];

        this.setUpPanel = () => {
            this.refs.textures.updateList();
            // this.refs.skeletons.updateList();
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
                this.editing = this.currentTexture = this.currentTexturePos =
                    this.currentSkeleton = this.currentSkeletonPos = false;
                this.update();
            }
            this.editing = true;
            if (assetType === 'textures') {
                this.currentTexture = getTextureFromId(uid);
                this.currentTexturePos = uid;
            } else {
                this.currentSkeleton = getSkeletonFromId(uid);
                this.currentSkeletonPos = uid;
            }
            this.update();
        };

        this.openFileSelector = () => {
            this.refs.inputFile.click();
        };
        /**
         * An event fired when user attempts to add files from a file manager
         * (by clicking an "Import" button)
         */
        this.textureImport = e => { // target is input[type="file"]
            const {importImageToTexture} = require('./data/node_requires/resources/textures');
            const files = [...e.target.files].map(file => file.path);
            for (let i = 0; i < files.length; i++) {
                if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
                    importImageToTexture(files[i], void 0, this.refs.textures.currentGroup.uid);
                } else if (/\.json/i.test(files[i])) {
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
            this.currentTexturePos = global.currentProject.textures.indexOf(texture);
            this.editing = true;
        };
        this.closeTexture = () => {
            this.editing = false;
            this.currentTexture = void 0;
            this.currentTexturePos = null;
            this.update();
        };
        this.openSkeleton = skeleton => () => {
            this.currentSkeleton = skeleton;
            this.currentSkeletonPos = global.currentProject.skeletons.indexOf(skeleton);
            this.editing = true;
        };
        this.closeSkeleton = () => {
            this.editing = false;
            this.currentSkeleton = void 0;
            this.currentSkeletonPos = null;
            this.update();
        };
        this.openGenerator = () => {
            this.generating = true;
        };
        this.closeGenerator = () => {
            this.generating = false;
            this.update();
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
                    if (this.currentAssetType === 'skeleton') {
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
                    if (this.currentAssetType !== 'skeleton') {
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
                            if (this.currentAssetType !== 'skeleton') {
                                const {updatePixiTexture} = require('./data/node_requires/resources/textures');
                                updatePixiTexture(this.currentTexture);
                            }
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
                            if (this.currentAssetType === 'skeleton') {
                                global.currentProject.skeletons.splice(this.currentSkeletonPos, 1);
                            } else {
                                require('./data/node_requires/resources/textures').removeTexture(this.currentTexture);
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
            this.currentAssetType = isSkeleton ? 'skeleton' : 'texture';
            if (isSkeleton) {
                this.currentTexturePos = global.currentProject.skeletons.indexOf(texture);
            } else {
                this.currentTexturePos = global.currentProject.textures.indexOf(texture);
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

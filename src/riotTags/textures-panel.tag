textures-panel.panel.view
    .flexfix.tall
        div
            asset-viewer(
                collection="{global.currentProject.textures}"
                contextmenu="{showTexturePopup}"
                vocspace="texture"
                namespace="textures"
                click="{openTexture}"
                thumbnails="{thumbnails}"
                ref="textures"
            )
                label.file.flexfix-header
                    input(type="file" multiple
                        accept=".png,.jpg,.jpeg,.bmp,.gif,.json"
                        onchange="{parent.textureImport}")
                    .button
                        svg.feather
                            use(xlink:href="data/icons.svg#download")
                        span {voc.import}
            asset-viewer(
                collection="{global.currentProject.skeletons}"
                contextmenu="{showSkeletonPopup}"
                vocspace="texture"
                namespace="skeletons"
                thumbnails="{thumbnails}"
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

    .aDropzone(if="{dropping}")
        .middleinner
            svg.feather
                use(xlink:href="data/icons.svg#download")
            h2 {languageJSON.common.fastimport}
            input(type="file" multiple
                accept=".png,.jpg,.jpeg,.bmp,.gif,.json"
                onchange="{textureImport}")

    texture-editor(if="{editing}" texture="{currentTexture}")
    context-menu(menu="{textureMenu}" ref="textureMenu")
    script.
        const fs = require('fs-extra'),
              path = require('path');
        const glob = require('./data/node_requires/glob');
        const generateGUID = require('./data/node_requires/generateGUID');
        this.namespace = 'texture';
        this.mixin(window.riotVoc);
        this.editing = false;
        this.dropping = false;

        const {getTexturePreview} = require('./data/node_requires/resources/textures');
        // this.thumbnails = texture => `file://${global.projdir}/img/${texture.origname}_prev.png?cache=${texture.lastmod}`;
        this.thumbnails = getTexturePreview;

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
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
            window.signals.off('textureImported', this.updateTextureData);
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
                    const id = generateGUID();
                    this.loadSkeleton(
                        id,
                        files[i],
                        global.projdir + '/img/skdb' + id + '_ske.json'
                    );
                }
            }
            e.srcElement.value = '';
            this.dropping = false;
            e.preventDefault();
        };

        this.loadSkeleton = (uid, filename, dest) => {
            fs.copy(filename, dest)
            .then(() => fs.copy(filename.replace('_ske.json', '_tex.json'), dest.replace('_ske.json', '_tex.json')))
            .then(() => fs.copy(filename.replace('_ske.json', '_tex.png'), dest.replace('_ske.json', '_tex.png')))
            .then(() => {
                global.currentProject.skeletons.push({
                    name: path.basename(filename).replace('_ske.json', ''),
                    origname: path.basename(dest),
                    from: 'dragonbones',
                    uid
                });
                this.skelGenPreview(dest, dest + '_prev.png', [64, 128])
                .then(() => {
                    this.refs.skeletons.updateList();
                    this.update();
                });
            });
        };

        /**
         *  Generates a square preview for a given skeleton
         * @param {String} source Path to the source _ske.json file
         * @param {String} destFile Path to the destinating image
         * @param {Array<Number>} sizes Size of the square thumbnail, in pixels
         * @returns {Promise} Resolves after creating a thumbnail. On success,
         * passes data-url of the created thumbnail.
         */
        this.skelGenPreview = (source, destFile, sizes) => {
            // TODO: Actually generate previews of different sizes
            const loader = new PIXI.loaders.Loader(),
                  dbf = dragonBones.PixiFactory.factory;
            const slice = 'file://' + source.replace('_ske.json', '');
            return new Promise((resolve, reject) => {
                loader.add(`${slice}_ske.json`, `${slice}_ske.json`)
                    .add(`${slice}_tex.json`, `${slice}_tex.json`)
                    .add(`${slice}_tex.png`, `${slice}_tex.png`);
                loader.load(() => {
                    dbf.parseDragonBonesData(loader.resources[`${slice}_ske.json`].data);
                    dbf.parseTextureAtlasData(loader.resources[`${slice}_tex.json`].data, loader.resources[`${slice}_tex.png`].texture);
                    const skel = dbf.buildArmatureDisplay('Armature', loader.resources[`${slice}_ske.json`].data.name);
                    const promises = sizes.map(() => new Promise((resolve, reject) => {
                        const app = new PIXI.Application();
                        const rawSkelBase64 = app.renderer.plugins.extract.base64(skel);
                        const skelBase64 = rawSkelBase64.replace(/^data:image\/\w+;base64,/, '');
                        const buf = new Buffer(skelBase64, 'base64');
                        const stream = fs.createWriteStream(destFile);
                        stream.on('finish', () => {
                            setTimeout(() => { // WHY THE HECK I EVER NEED THIS?!
                                resolve(destFile);
                            }, 100);
                        });
                        stream.on('error', err => {
                            reject(err);
                        });
                        stream.end(buf);
                    }));
                    Promise.all(promises)
                    .then(() => {
                        // eslint-disable-next-line no-underscore-dangle
                        delete dbf._dragonBonesDataMap[loader.resources[`${slice}_ske.json`].data.name];
                        // eslint-disable-next-line no-underscore-dangle
                        delete dbf._textureAtlasDataMap[loader.resources[`${slice}_ske.json`].data.name];
                    })
                    .then(resolve)
                    .catch(reject);
                });
            });
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

        /*
         * drag-n-drop handling
         */
        var dragTimer;
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
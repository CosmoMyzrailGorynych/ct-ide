//-
    @attribute [inline] (atomic)
        Applies the `inline` className to the button.
    @attribute [square] (atomic)
        Applies the `square` className to the button.
    @attribute [folder] (IAssetFolder)
        The default folder for created assets.

    @attribute [onimported]
        Called when a new asset is created by this component.
        The created asset is passed to the callback as its only argument.

    @attribute [class]
create-asset-menu.relative.inlineblock(class="{opts.class}")
    button.success(onclick="{showMenu}" class="{inline: opts.inline, square: opts.square}")
        svg.feather
            use(xlink:href="#plus")
        span {voc.newAsset}
    context-menu(menu="{menu}" ref="menu")
    .aDimmer.pad.fadein(if="{tool === 'textureGenerator'}")
        button.aDimmer-aCloseButton.forcebackground(title="{vocGlob.close}" onclick="{closeTools}")
            svg.feather
                use(xlink:href="#x")
        .aModal.pad.cursordefault.appear
            texture-generator(onclose="{closeTools}" folder="{opts.folder}")
    .aDimmer.pad.fadein(if="{tool === 'assetGallery'}")
        button.aDimmer-aCloseButton.forcebackground(title="{vocGlob.close}" onclick="{closeTools}")
            svg.feather
                use(xlink:href="#x")
        .aModal.pad.cursordefault.appear
            builtin-asset-gallery(type="textures" folder="{opts.folder}")
    script.
        this.namespace = 'createAsset';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        const priorityTypes = ['texture', 'template', 'room'];
        const customizedTypes = ['tandem', 'behavior'];

        const {assetTypes, resourceToIconMap, createAsset} = require('src/node_requires/resources');

        this.showMenu = e => {
            this.refs.menu.popup(e.clientX, e.clientY);
        };
        this.tool = false;
        this.closeTools = () => {
            this.tool = false;
            this.update();
        };

        const genericCreate = (assetType, payload) => async () => {
            try {
                const asset = await createAsset(assetType, this.opts.folder || null, payload);
                if (asset === null) {
                    return; // Cancelled by a user
                }
                if (this.opts.onimported) {
                    this.opts.onimported(asset);
                }
            } catch (e) {
                alertify.error(e);
                throw e;
            }
        };

        const menuItems = [];
        const assetTypeIterator = assetType => {
            const [i18nName] = this.vocGlob.assetTypes[assetType];
            menuItems.push({
                label: i18nName[0].toUpperCase() + i18nName.slice(1),
                icon: resourceToIconMap[assetType],
                click: genericCreate(assetType)
            });
        };
        priorityTypes.forEach(assetTypeIterator);
        menuItems.push({
            type: 'separator'
        });
        assetTypes
            .filter(assetType => !priorityTypes.includes(assetType) &&
                !customizedTypes.includes(assetType))
            .forEach(assetTypeIterator);

        // Tandems can be imported
        const tandemVoc = this.vocGlob.assetTypes.tandem;
        menuItems.push({
            label: this.capitalize(tandemVoc[0]),
            icon: 'sparkles',
            click: genericCreate('tandem'),
            submenu: {
                items: [{
                    label: this.vocGlob.create,
                    icon: 'plus',
                    click: genericCreate('tandem')
                }, {
                    label: this.voc.importFromFile,
                    icon: 'download',
                    click: async () => {
                        const src = await window.showOpenDialog({
                            filter: '.ctTandem'
                        });
                        if (!src) {
                            return;
                        }
                        const asset = await createAsset('tandem', this.opts.folder || null, {
                            src
                        });
                        if (this.opts.onimported) {
                            this.opts.onimported(asset);
                        }
                    }
                }]
            }
        });

        // Behaviors need a subtype preset and can be imported
        const bhVoc = this.vocGlob.assetTypes.behavior;
        menuItems.push({
            label: this.capitalize(bhVoc[0]),
            icon: 'behavior',
            submenu: {
                items: [{
                    label: this.voc.behaviorTemplate,
                    icon: 'template',
                    click: genericCreate('behavior', {
                        behaviorType: 'template'
                    })
                }, {
                    label: this.voc.behaviorRoom,
                    icon: 'room',
                    click: genericCreate('behavior', {
                        behaviorType: 'room'
                    })
                }, {
                    label: this.voc.importFromFile,
                    icon: 'download',
                    click: async () => {
                        const src = await window.showOpenDialog({
                            filter: '.ctBehavior'
                        });
                        if (!src) {
                            return;
                        }
                        const asset = await createAsset('behavior', this.opts.folder || null, {
                            src
                        });
                        if (this.opts.onimported) {
                            this.opts.onimported(asset);
                        }
                    }
                }]
            }
        });
        menuItems.push({
            type: 'separator'
        });
        menuItems.push({
            label: this.voc.placeholderTexture,
            icon: 'texture',
            click: () => {
                this.tool = 'textureGenerator';
                this.update();
            }
        }, {
            label: this.voc.assetGallery,
            icon: 'texture',
            click: () => {
                this.tool = 'assetGallery';
                this.update();
            }
        });

        this.menu = {
            opened: false,
            items: menuItems
        };

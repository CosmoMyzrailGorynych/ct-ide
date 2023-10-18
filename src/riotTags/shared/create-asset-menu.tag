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
create-asset-menu.relative.inlineblock
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
    script.
        this.namespace = 'createAsset';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        const priorityTypes = ['texture', 'template', 'room'];

        const {assetTypes, resourceToIconMap, createAsset} = require('./data/node_requires/resources');

        this.showMenu = e => {
            this.refs.menu.popup(e.clientX, e.clientY);
        };
        this.tool = false;
        this.closeTools = () => {
            this.tool = false;
            this.update();
        };

        const menuItems = [];
        const assetTypeIterator = assetType => {
            const i18nName = this.vocGlob.assetTypes[assetType][0];
            menuItems.push({
                label: i18nName[0].toUpperCase() + i18nName.slice(1),
                icon: resourceToIconMap[assetType],
                click: async () => {
                    try {
                        const asset = await createAsset(
                            assetType,
                            this.opts.folder || null
                        );
                        if (this.opts.onimported) {
                            this.opts.onimported(asset);
                        }
                    } catch (e) {
                        alertify.error(e);
                        throw e;
                    }
                }
            });
        };
        priorityTypes.forEach(assetTypeIterator);
        menuItems.push({
            type: 'separator'
        });
        assetTypes.filter(assetType => !priorityTypes.includes(assetType)).forEach(assetTypeIterator);
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
        })
        this.menu = {
            opened: false,
            items: menuItems
        };

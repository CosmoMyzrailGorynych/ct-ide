//
    A button that opens an asset selector for the specified type of resources.

    @attribute assettype (string)
        The asset type to be pickable. Should match the name of a folder inside
        ./data/node_requires/resources
        Not all the asset types are supported (e.g. projects are not).
    @attribute allowclear (atomic)
        Whether the tag should also show a button to clear input's value.
    @attribute disallowjump (atomic)
        If set, hides a button to jump to the selected asset.
    @attribute assetid (string)
        The asset id of the currently picked asset. It is used to get asset's
        thumbnail, as well as to prefill the current input's value.
        Use -1 for an empty value.

    @attribute large (atomic)
        Shows a larger asset selector instead of a button stack.
    @attribute compact (atomic)
        Makes buttons slimmer. Incompatible with the `large` attribute.
    @attribute selectorheader (string)
        The header shown inside the asset selector.
    @attribute selecttext (string)
        The prompt text inside the button or large selector when no asset was picked.
        Defaults to "Select" in current locale.

    @attribute onchanged (riot function)
        This method is called when the value changes, either when a user clicks
        the "clear" button or picks a new asset from the selector.
        The value passed in the function is the uid of the selected asset.
        It is also called with -1 when the asset input cannot find the current asset
        in the project.
asset-input
    .aButtonGroup.nml(if="{!opts.large}")
        button(onclick="{openSelector}" title="{voc.changeAsset}" class="{inline: opts.compact}")
            img(if="{['textures', 'templates', 'rooms'].includes(opts.assettype)}" src="{thumbnails(currentAsset || -1, false, false)}")
            svg.feather(if="{['sounds', 'tandems'].includes(opts.assettype)}")
                use(xlink:href="#{(opts.assetid == -1 || opts.assetid === void 0) ? 'help-circle' : thumbnails(currentAsset)}")
            span(if="{opts.assetid == -1 || opts.assetid === void 0}") {vocGlob.select}
            span(if="{opts.assetid != -1 && opts.assetid !== void 0}") {names(currentAsset)}
        button.square(if="{opts.assetid != -1 && opts.assetid !== void 0 && !opts.disallowjump}" title="{voc.jumpToAsset}" onclick="{openAsset}" class="{inline: opts.compact}")
            svg.feather
                use(xlink:href="#external-link")
        button.square(if="{(opts.assetid != -1 && opts.assetid !== void 0) && opts.allowclear}" title="{vocGlob.clear}" onclick="{clearAsset}" class="{inline: opts.compact}")
            svg.feather
                use(xlink:href="#x")
    .asset-input-aBigInput(if="{opts.large}" onclick="{openSelector}" title="{voc.changeAsset}")
        .asset-input-TinyTools
            button.tiny(if="{opts.assetid != -1 && opts.assetid !== void 0}" title="{voc.jumpToAsset}" onclick="{openAsset}")
                svg.feather
                    use(xlink:href="#external-link")
            button.tiny(if="{(opts.assetid != -1 && opts.assetid !== void 0) && opts.allowclear}" title="{vocGlob.clear}" onclick="{clearAsset}")
                svg.feather
                    use(xlink:href="#x")
        img(if="{['textures', 'templates', 'rooms'].includes(opts.assettype)}" src="{thumbnails(currentAsset || -1, true, false)}")
        svg.feather(if="{['sounds', 'tandems'].includes(opts.assettype)}")
            use(xlink:href="#{currentAsset == -1 ? 'help-circle' : thumbnails(currentAsset)}")
        .aNotice(if="{opts.assetid == -1 || opts.assetid === void 0}") {vocGlob.select}
        .dim(if="{opts.assetid != -1 && opts.assetid !== void 0}") {names(currentAsset)}
    asset-selector(
        if="{showingSelector}"
        assettype="{opts.assettype === 'tandems' ? 'emitterTandems' : opts.assettype}"
        selectorheader="{opts.selectorheader}"
        allownone="{opts.allowclear}"
        onselected="{onAssetPicked}"
        oncancelled="{closeSelector}"
    )
    script.
        this.namespace = 'assetInput';
        this.mixin(window.riotVoc);

        const updateResourceAPIs = () => {
            this.currentAssetType = this.opts.assettype;
            if (this.currentAssetType === 'tandems') {
                this.resourceAPI = require('./data/node_requires/resources/emitterTandems');
            } else {
                this.resourceAPI = require(`./data/node_requires/resources/${this.currentAssetType}`);
            }
            this.names = asset => (this.resourceAPI.getName ? this.resourceAPI.getName(asset) : asset.name);
            this.thumbnails = (asset, x2, fs) => {
                if (this.currentAssetType === 'sounds') {
                    return asset.isMusic ? 'music' : 'volume-2';
                }
                if (this.currentAssetType === 'tandems') {
                    return 'sparkles';
                }
                return this.resourceAPI.getThumbnail(asset, x2, fs);
            };
        };
        updateResourceAPIs();
        // eslint-disable-next-line eqeqeq
        if (this.opts.assetid && this.opts.assetid != -1) {
            this.currentAsset = this.resourceAPI.getById(this.opts.assetid);
        }

        this.openAsset = e => {
            window.orders.trigger('openAsset', `${this.opts.assettype}/${this.currentAsset.uid}`);
            e.stopPropagation();
        };
        this.openSelector = e => {
            this.showingSelector = true;
            e.stopPropagation();
        };
        this.closeSelector = () => {
            this.showingSelector = false;
            this.update();
        };
        this.clearAsset = e => {
            e.stopPropagation();
            if (this.opts.onchanged) {
                this.opts.onchanged(-1);
            }
            this.currentAsset = void 0;
        };
        this.onAssetPicked = assetId => {
            if (assetId === -1) {
                this.currentAsset = void 0;
            } else {
                this.currentAsset = this.resourceAPI.getById(assetId);
            }
            if (this.opts.onchanged) {
                this.opts.onchanged(assetId);
            }
            this.showingSelector = false;
            this.update();
        };
        this.on('update', () => {
            if (this.opts.assettype !== this.currentAssetType) {
                updateResourceAPIs();
            }
            setTimeout(() => {
                // eslint-disable-next-line eqeqeq
                if (this.opts.assetid == -1 || this.opts.assetid === void 0) {
                    if (this.currentAsset) {
                        this.currentAsset = void 0;
                        this.update();
                    }
                } else if (!this.currentAsset || this.currentAsset.uid !== this.opts.assetid) {
                    this.currentAsset = this.resourceAPI.getById(this.opts.assetid);
                    this.update();
                }
            }, 0);
        });

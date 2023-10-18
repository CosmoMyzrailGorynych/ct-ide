//
    A button that opens an asset selector for the specified type of resources.

    @attribute assettypes (string)
        Comma-separated asset types that will be allowed to be picked, e.g. "type,texture,room".
        You can set to "all" to allow all asset types.
        Note: unlike in asset-browser, this attribute is mandatory and will throw an error if empty.
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
            img(if="{opts.assetid != -1 && opts.assetid}" src="{this.getThumbnail(currentAsset, false, false)}")
            img(if="{opts.assetid == -1 || !opts.assetid}" src="data/img/notexture.png")
            span(if="{opts.assetid != -1 && opts.assetid !== void 0}") {getName(currentAsset)}
            span(if="{opts.assetid == -1 || opts.assetid === void 0}") {vocGlob.selectDialogue}
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
        img(if="{opts.assetid != -1 && opts.assetid}" src="{getThumbnail(currentAsset, true, false)}")
        img(if="{opts.assetid == -1 || !opts.assetid}" src="data/img/notexture.png")
        .dim(if="{opts.assetid != -1 && opts.assetid !== void 0}") {getName(currentAsset)}
        .aNotice(if="{opts.assetid == -1 || opts.assetid === void 0}") {vocGlob.selectDialogue}
    asset-selector(
        if="{showingSelector}"
        assettypes="{opts.assettypes}"
        selectorheader="{opts.selectorheader}"
        allownone="{opts.allowclear}"
        onselected="{onAssetPicked}"
        oncancelled="{closeSelector}"
    )
    script.
        if (!this.opts.assettypes) {
            throw new Error('[asset-input] The assettypes attribute is mandatory and was not set.');
        }
        this.namespace = 'assetInput';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.resourceAPIs = require('./data/node_requires/resources');
        this.getThumbnail = this.resourceAPIs.getThumbnail;
        this.getName = this.resourceAPIs.getName;

        // eslint-disable-next-line eqeqeq
        if (this.opts.assetid && this.opts.assetid != -1) {
            this.currentAsset = this.resourceAPIs.getById(null, this.opts.assetid);
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
                this.currentAsset = this.resourceAPIs.getById(null, assetId);
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
                    this.currentAsset = this.resourceAPIs.getById(null, this.opts.assetid);
                    this.update();
                }
            }, 0);
        });

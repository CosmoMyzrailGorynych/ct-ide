//
    An asset selector shown in a modal that allows selecting a single asset.
    Technically it is a pre-filled wrapper of the asset-browser.

    @attribute assettypes (string)
        Comma-separated asset types that will be allowed to be picked, e.g. "template,texture,room".
        You can set to "all" to allow all asset types.
        Note: unlike in asset-browser, this attribute is mandatory and will throw an error if empty.
    @attribute selectorheader (string)
        The header shown inside the asset selector.
    @attribute allownone (atomic)
        If set to some value, shows the "None" option that returns -1 in opts.onselected
        when chosen.

    @attribute onselected (riot function)
        This method is called when an asset is selected.
        The value passed in the function is the uid of the selected asset.
        It is also called with -1 when the asset input cannot find the current asset
        in the project.
    @attribute oncancelled (riot function)
        This method is called when the value changes, either when a user clicks
        the "clear" button or picks a new asset from the selector.
        The value passed in the function is the uid of the selected asset.
        It is also called with -1 when the asset input cannot find the current asset
        in the project.
asset-selector.aDimmer.pointer.pad.fadein(onclick="{closeOnDimmer}" ref="dimmer")

    button.aDimmer-aCloseButton.forcebackground(if="{opts.oncancelled}" title="{vocGlob.close}" onclick="{opts.oncancelled}")
        svg.feather
            use(xlink:href="#x")

    .aModal.pad.cursordefault.appear
        asset-browser(
            assettypes="{opts.assettypes}"
            shownone="{opts.allownone}"
            click="{onAssetPicked}"
        )
            h2 {parent.opts.selectorheader || parent.voc.selectAssetHeader}
    script.
        if (!this.opts.assettypes) {
            throw new Error('[asset-input] The assettypes attribute is mandatory and was not set.');
        }

        this.namespace = 'assetInput';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.closeOnDimmer = e => {
            if (e.target === this.root) {
                if (this.opts.oncancelled) {
                    this.opts.oncancelled();
                }
            }
            e.stopPropagation();
        };
        this.onAssetPicked = asset => e => {
            if (this.opts.onselected) {
                if (asset === -1) {
                    this.opts.onselected(-1);
                } else {
                    this.opts.onselected(asset.uid);
                }
            }
            e.stopPropagation();
        };

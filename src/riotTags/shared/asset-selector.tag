//
    An asset selector shown in a modal that allows selecting a single asset.
    Technically it is a pre-filled wrapper of the asset-viewer.

    @attribute assettype (string)
        The asset type to be pickable. Should match the name of a folder inside
        ./data/node_requires/resources
        Not all the asset types are supported (e.g. projects are not).
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
        asset-viewer(
            assettype="{opts.assettype}"
            collection="{currentProject[opts.assettype]}"
            names="{names}"
            thumbnails="{thumbnails}"
            useicons="{['sounds', 'emitterTandems'].includes(opts.assettype)}"
            shownone="{opts.allownone}"
            click="{onAssetPicked}"
        )
            h2 {parent.opts.selectorheader || parent.voc.selectAssetHeader}
    script.
        this.namespace = 'assetInput';
        this.mixin(window.riotVoc);

        const updateResourceAPIs = () => {
            this.currentAssetType = this.opts.assettype;
            this.resourceAPI = require(`./data/node_requires/resources/${this.currentAssetType}`);
            this.names = asset => (this.resourceAPI.getName ? this.resourceAPI.getName(asset) : asset.name);
            this.thumbnails = (asset, x2, fs) => this.resourceAPI.getThumbnail(asset, x2, fs);
        };
        updateResourceAPIs();

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

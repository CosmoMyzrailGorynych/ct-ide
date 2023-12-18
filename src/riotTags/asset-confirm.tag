//
    Shows an asset save/discard/cancel confirmation dialog.

    @attribute asset (IAsset)
    @attribute discard (riot function)
    @attribute cancel (riot function)
    @attribute apply (riot function)
asset-confirm.aDimmer.pad.fadein(ref="dimmer")
    .aModal.pad.appear.npb
        h2.nmt {voc.confirmHeading}
        p {voc.confirmParagraph.replace('$1', getName(opts.asset))}
        .flexrow.inset
            button.nogrow.error(onclick="{opts.discard}")
                svg.feather
                    use(xlink:href="#x")
                span  {vocGlob.discard}
            .filler
            button.nogrow(onclick="{opts.cancel}")
                span  {vocGlob.cancel}
            .filler
            button.nogrow.success(onclick="{opts.apply}")
                svg.feather
                    use(xlink:href="#check")
                span  {vocGlob.apply}
    script.
        this.namespace = 'assetConfirm';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.getName = require('./data/node_requires/resources').getName;

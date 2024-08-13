//-
    @attribute asset {IAsset}

thumbnail-loader
    await(
        promise="{promise}"
        asset="{opts.asset}"
        key="{asset.uid}"
    )
        yield(to="resolved")
            img(
                src="{value}"
                class="{soundthumbnail: opts.asset.type === 'sound' && opts.asset.variants.length}"
            )
        yield(to="pending")
            svg.feather.group-icon.rotate
                use(xlink:href="#preloader")
        yield(to="error")
            svg.feather.group-icon.red
                use(xlink:href="#x")
    script.
        const {getThumbnail} = require('src/lib/resources');
        this.promise = getThumbnail(this.opts.asset);
        this.cachedUid = this.opts.asset.uid;

        this.on('update', () => {
            if (this.opts.asset.uid !== this.cachedUid) {
                this.promise = getThumbnail(this.opts.asset);
                this.cachedUid = this.opts.asset.uid;
            }
        });

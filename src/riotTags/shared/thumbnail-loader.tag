//-
    @attribute asset (assetRef)

    @attribute long (atomic)
        Use for sound thumbnails to retrieve the long waveform image.

    @attribute variant (string)
        Use for sound thumbnails to retrieve a thumbnail for a specific sound variant.
        The value must be the UID of the sound variant.

thumbnail-loader
    await(
        if="{opts.asset !== -1}"
        promise="{promise}"
        asset="{opts.asset}"
    )
        yield(to="resolved")
            img(
                src="{value}"
                class="{soundthumbnail: opts.asset.type === 'sound' && opts.asset.variants.length}"
            )
        yield(to="pending")
            svg.feather.group-icon.rotate
                use(xlink:href="#loader")
        yield(to="error")
            svg.feather.group-icon.red
                use(xlink:href="#x")
    img(src="/data/img/unknown.png" if="{opts.asset === -1}")
    script.
        const {getThumbnail, getById} = require('src/lib/resources');
        const getSoundThumbnail = require('src/lib/resources/preview/sound').SoundPreviewer.get;

        const updatePromise = () => {
            let {asset} = this.opts;
            if (typeof asset === 'string') {
                asset = getById(null, asset);
            }
            if (!asset || asset === -1) {
                this.promise = Promise.reject();
                return;
            }
            if (this.opts.variant || this.opts.long) {
                this.promise = getSoundThumbnail(asset, this.opts.variant, Boolean(this.opts.long));
            } else {
                this.promise = getThumbnail(asset);
            }
            this.cachedUid = asset.uid;
        };
        updatePromise();

        this.on('update', () => {
            if (this.opts.asset === -1 || this.opts.asset.uid !== this.cachedUid) {
                updatePromise();
            }
        });

//-
    @attribute asset (IAsset)

    @attribute long (atomic)
        Use for sound thumbnails to retrieve the long waveform image.

    @attribute variant (string)
        Use for sound thumbnails to retrieve a thumbnail for a specific sound variant.
        The value must be the UID of the sound variant.

thumbnail-loader
    await(
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
                use(xlink:href="#preloader")
        yield(to="error")
            svg.feather.group-icon.red
                use(xlink:href="#x")
    script.
        const {getThumbnail} = require('src/lib/resources');
        const getSoundThumbnail = require('src/lib/resources/preview/sound').SoundPreviewer.get;

        const updatePromise = () => {
            if (!this.opts.asset) {
                this.promise = Promise.reject();
                return;
            }
            if (this.opts.variant || this.opts.long) {
                this.promise = getSoundThumbnail(this.opts.asset, this.opts.variant, Boolean(this.opts.long));
            } else {
                this.promise = getThumbnail(this.opts.asset);
            }
            this.cachedUid = this.opts.asset.uid;
        };
        updatePromise();

        this.on('update', () => {
            if (this.opts.asset.uid !== this.cachedUid) {
                updatePromise();
            }
        });

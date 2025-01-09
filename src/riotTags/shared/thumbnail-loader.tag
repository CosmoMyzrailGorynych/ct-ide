//-
    @attribute asset (assetRef)

    @attribute long (atomic)
        Use for sound thumbnails to retrieve the long waveform image.

    @attribute variant (string)
        Use for sound thumbnails to retrieve a thumbnail for a specific sound variant.
        The value must be the UID of the sound variant.

thumbnail-loader
    img(
        if="{opts.asset !== -1}"
        src="{value}"
        class="{soundthumbnail: opts.asset.type === 'sound' && opts.asset.variants.length}"
    )
    img(src="/data/img/unknown.png" if="{opts.asset === -1}")
    script.
        const {getThumbnail, getById} = require('src/lib/resources');
        const getSoundThumbnail = require('src/lib/resources/preview/sound').SoundPreviewer.get;

        const updateThumbnail = () => {
            let {asset} = this.opts;
            if (typeof asset === 'string') {
                asset = getById(null, asset);
            }
            if (this.opts.variant || this.opts.long) {
                this.value = getSoundThumbnail(asset, this.opts.variant, Boolean(this.opts.long));
            } else {
                this.value = getThumbnail(asset);
            }
            this.cachedUid = asset.uid;
        };
        updateThumbnail();

        this.on('update', () => {
            if (this.opts.asset === -1 || this.opts.asset.uid !== this.cachedUid) {
                updateThumbnail();
            }
        });

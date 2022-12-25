//
    @method openAsset
ui-panel.aPanel.aView
    styles-panel(ref="{styles}")
    fonts-panel(ref="{fonts}")
    .clear
    script.
        this.openAsset = (assetType, uid) => {
            if (assetType === 'styles') {
                this.refs.styles.openAsset(assetType, uid);
            } else if (assetType === 'fonts') {
                this.refs.fonts.openAsset(assetType, uid);
            }
        };

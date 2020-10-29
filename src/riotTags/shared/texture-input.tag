//
    A button that allows to pick a texture, showing current selection's miniature.

    @attribute showempty (any string or empty)
        If set, allows to pick an empty texture.
    @attribute val (texture's uid or -1)
        Current input's value
    @attribute header (string)
        Passed to the texture selector, showing a header in the top-left corner.
    @attribute large (atomic)
        Shows a larger texture selector with additional buttons
    @attribute onselected (riot function)
        A callback that is called when a texture is selected.
        Passes the texture object and its ID as two arguments.
texture-input(class="{large: opts.large} {opts.class}")
    .aButtonGroup.nml(if="{!opts.large}")
        button(onclick="{openSelector}" title="{voc.changeTexture}")
            img(src="{getTexturePreview(val || -1)}")
            br(if="{opts.large}")
            span(if="{val === -1}") {vocGlob.select}
            span(if="{val !== -1}") {getTextureFromId(val).name}
        button.square(if="{val !== -1}" title="{voc.jumpToTexture}" onclick="{openTexture}")
            svg.feather
                use(xlink:href="data/icons.svg#external-link")
    .texture-input-aBigInput(if="{opts.large}" onclick="{openSelector}" title="{voc.changeTexture}")
        img(src="{getTexturePreview(val || -1, true)}")
        div(if="{val === -1}") {vocGlob.select}
        div(if="{val !== -1}") {getTextureFromId(val).name}
    button.tiny(if="{val !== -1 && opts.large}" title="{voc.jumpToTexture}" onclick="{openTexture}")
        svg.feather
            use(xlink:href="data/icons.svg#external-link")
    texture-selector(
        if="{selectingTexture}"
        showempty="{opts.showempty}"
        onselected="{onSelected}"
        oncancelled="{onCancelled}"
        header="{opts.header}"
    )
    script.
        this.namespace = 'textureInput';
        this.mixin(window.riotVoc);

        const {getTexturePreview, getTextureFromId} = require('./data/node_requires/resources/textures');
        this.getTexturePreview = getTexturePreview;
        this.getTextureFromId = getTextureFromId;

        this.val = this.opts.val || -1;
        this.openSelector = () => {
            this.selectingTexture = true;
        };
        this.onSelected = texture => () => {
            if (this.opts.onselected) {
                this.opts.onselected(texture, texture.uid);
            }
            this.val = texture.uid;
            this.selectingTexture = false;
            this.update();
        };
        this.onCancelled = () => {
            this.selectingTexture = false;
            this.update();
        };
        this.openTexture = () => {
            window.orders.trigger('openAsset', `textures/${this.val}`);
        };

        this.on('update', () => {
            if (this.val !== this.opts.val) {
                this.val = this.opts.val;
            }
        });
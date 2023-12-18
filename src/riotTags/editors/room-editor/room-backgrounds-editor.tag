//
    @attribute backgrounds (Background[])
    @attribute addbackground (riot function)
    @attribute room (IRoom)
    @attribute history (History)

room-backgrounds-editor
    collapsible-section(
        each="{background, ind in opts.backgrounds}"
        icon="settings"
    ).aPanel
        yield(to="header")
            asset-input(
                assettypes="texture"
                assetid="{background.bgTexture}"
                compact="true"
                onchanged="{parent.changeBgTexture(background)}"
                ref="assetInput"
            )
            error-notice(
                if="{background.bgTexture && background.bgTexture !== -1 && !parent.getTextureFromId(background.bgTexture).tiled && !parent.getTextureFromId(background.bgTexture).ignoreTiledUse}"
                target="{refs.assetInput}"
            )
                | {parent.parent.voc.notBackgroundTextureWarning}
                |
                span.a(onclick="{parent.parent.fixTexture}") {parent.parent.voc.fixBackground}
                |
                |
                span.a(onclick="{parent.parent.dismissWarning}") {parent.parent.voc.dismissWarning}
        fieldset
            label
                b {parent.voc.depth}
                input.wide(
                    type="number" step="1"
                    onfocus="{parent.rememberValue}"
                    value="{background.zIndex}"
                    oninput="{parent.tweak(background, 'zIndex')}"
                    onchange="{parent.recordChange(background, 'zIndex')}"
                )
        fieldset
            b {parent.voc.shift}
            .aPoint2DInput.compact.wide
                label.flexrow
                    span.nogrow X:
                    input.nmr(
                        type="number" step="8" placeholder="0"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background, 'shiftX')}"
                        onchange="{parent.recordChange(background, 'shiftX')}"
                        value="{background.shiftX}"
                    )
                .aSpacer.noshrink.nogrow
                label.flexrow
                    span.nogrow Y:
                    input.nmr(
                        type="number" step="8" placeholder="0"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background, 'shiftY')}"
                        onchange="{parent.recordChange(background, 'shiftY')}"
                        value="{background.shiftY}"
                    )
            b {parent.voc.scale}
            .aPoint2DInput.compact.wide
                label.flexrow
                    span.nogrow X:
                    input.nmr(
                        type="number" step="0.1" placeholder="1"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background.tileScale, 'x')}"
                        onchange="{parent.recordChange(background.tileScale, 'x')}"
                        value="{background.tileScale.x}"
                    )
                .aSpacer.noshrink.nogrow
                label.flexrow
                    span.nogrow Y:
                    input.nmr(
                        type="number" step="0.1" placeholder="1"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background.tileScale, 'y')}"
                        onchange="{parent.recordChange(background.tileScale, 'y')}"
                        value="{background.tileScale.y}"
                    )
        fieldset
            b {parent.voc.movement}
            .aPoint2DInput.compact.wide
                label.flexrow
                    span.nogrow X:
                    input.nmr(
                        type="number" step="1" placeholder="0"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background, 'movementX')}"
                        onchange="{parent.recordChange(background, 'movementX')}"
                        value="{background.movementX}"
                    )
                .aSpacer.noshrink.nogrow
                label.flexrow
                    span.nogrow Y:
                    input.nmr(
                        type="number" step="1" placeholder="0"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background, 'movementY')}"
                        onchange="{parent.recordChange(background, 'movementY')}"
                        value="{background.movementY}"
                    )
            b {parent.voc.parallax}
            .aPoint2DInput.compact.wide
                label.flexrow
                    span.nogrow X:
                    input.nmr(
                        type="number" step="0.1" placeholder="1"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background, 'parallaxX')}"
                        onchange="{parent.recordChange(background, 'parallaxX')}"
                        value="{background.parallaxX}"
                    )
                .aSpacer.noshrink.nogrow
                label.flexrow
                    span.nogrow Y:
                    input.nmr(
                        type="number" step="0.1" placeholder="1"
                        onfocus="{parent.rememberValue}"
                        oninput="{parent.tweak(background, 'parallaxY')}"
                        onchange="{parent.recordChange(background, 'parallaxY')}"
                        value="{background.parallaxY}"
                    )
        fieldset
            b {parent.voc.repeat}
            |
            select(
                onfocus="{parent.rememberValue}"
                onchange="{parent.recordAndTweak(background, 'repeat')}"
            )
                option(value="repeat" selected="{background.repeat === 'repeat'}") repeat
                option(value="repeat-x" selected="{background.repeat === 'repeat-x'}") repeat-x
                option(value="repeat-y" selected="{background.repeat === 'repeat-y'}") repeat-y
                option(value="no-repeat" selected="{background.repeat === 'no-repeat'}") no-repeat
        .aSpacer
        button.wide(onclick="{parent.removeBg}")
            svg.feather
                use(xlink:href="#trash")
            span {parent.vocGlob.delete}
    .aSpacer(if="{opts.backgrounds.length}")
    button.inline.wide(onclick="{addBg}")
        svg.feather
            use(xlink:href="#plus")
        span {voc.add}
    // Used for selecting a texture for newly created backgrounds
    asset-selector(
        ref="texturePicker"
        if="{newBg}"
        assettypes="texture"
        oncancelled="{onTextureCancel}"
        onselected="{onTextureSelected}"
    )
    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;

        const {getTextureFromId, getTexturePreview} = require('./data/node_requires/resources/textures');
        this.getTextureFromId = getTextureFromId;
        this.getTexturePreview = getTexturePreview;

        this.pickingBackground = false;
        this.namespace = 'roomBackgrounds';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.tweak = (obj, field) => e => {
            const input = e.target;
            if (input.type === 'radio' || input.type === 'checkbox') {
                obj[field] = input.checked;
            } else if (input.type === 'number') {
                obj[field] = Number(input.value);
            } else {
                obj[field] = input.value;
            }
        };

        // These two are only for newly created backgrounds, for which an asset selection modal
        // is automatically created
        this.onTextureSelected = textureId => {
            this.newBg.changeTexture(textureId);
            this.opts.history.pushChange({
                type: 'backgroundCreation',
                created: this.newBg
            });
            this.newBg = void 0;
            this.update();
        };
        this.onTextureCancel = () => {
            this.pickingBackground = false;
            if (this.newBg) {
                this.newBg.destroy();
            }
            this.newBg = false;
            this.update();
        };

        this.addBg = () => {
            const bgTemplate = {
                depth: 0,
                texture: -1,
                parallaxX: 1,
                parallaxY: 1,
                shiftX: 0,
                shiftY: 0,
                scaleX: 1,
                scaleY: 1,
                movementX: 0,
                movementY: 0,
                repeat: 'repeat'
            };
            const bg = this.opts.addbackground(bgTemplate);
            this.newBg = bg;
            this.pickingBackground = true;
        };

        this.changeBgTexture = background => textureId => {
            const prevId = background.bgTexture;
            background.changeTexture(textureId);
            this.opts.history.pushChange({
                type: 'propChange',
                key: 'bgTexture',
                target: background,
                before: prevId,
                after: textureId
            });
            this.update();
        };

        this.removeBg = e => {
            const {background} = e.item;
            background.detach();
            this.opts.history.pushChange({
                type: 'backgroundDeletion',
                deleted: background
            });
        };

        this.fixTexture = e => {
            const {background} = e.item;
            const tex = getTextureFromId(background.bgTexture);
            tex.tiled = true;
            e.stopPropagation();
            this.update();
        };
        this.dismissWarning = e => {
            const {background} = e.item;
            const tex = getTextureFromId(background.bgTexture);
            tex.ignoreTiledUse = true;
            e.stopPropagation();
            this.update();
        };

        var prevValue;
        this.rememberValue = e => {
            if (e.target.type === 'number') {
                prevValue = Number(e.target.value);
            } else {
                prevValue = e.target.value;
            }
        };
        this.recordChange = (entity, key) => e => {
            if (!this.opts.history) {
                return;
            }
            let {value} = e.target;
            if (e.target.type === 'number') {
                value = Number(value);
            }
            this.opts.history.pushChange({
                type: 'propChange',
                key,
                target: entity,
                before: prevValue,
                after: value
            });
        };
        this.recordAndTweak = (entity, key) => e => {
            this.tweak(entity, key)(e);
            this.recordChange(entity, key)(e);
        };

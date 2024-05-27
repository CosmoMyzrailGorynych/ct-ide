mixin notSupportedThingy
    .dim
        svg.feather
            use(xlink:href="#alert-triangle")
        |
        span {voc.notSupportedForBitmap}
mixin rangeNumberInput(wirePath, min = 0, max = 64, step = 1)
    .flexrow
        input(
            type="range" value=`{${wirePath}}` min=min max=max step=step
            data-wired-force-minmax="yes"
            onchange=`{wire('${wirePath}')}`
            oninput=`{wire('${wirePath}')}`
        )
        .aSpacer.nogrow
        input.short.nogrow(
            type="number" value=`{${wirePath}}` min=min
            onchange=`{wire('${wirePath}')}`
            oninput=`{wire('${wirePath}')}`
        )

style-editor.aPanel.aView(class="{opts.class}")
    .style-editor-Properties.tall.flexfix
        .tabwrap.flexfix-body
            ul.aNav.tabs.nogrow.noshrink
                li(onclick="{changeTab('stylefont')}" class="{active: tab === 'stylefont'}") {voc.font}
                li(onclick="{changeTab('stylefill')}" class="{active: tab === 'stylefill'}") {voc.fill}
                li(onclick="{changeTab('stylestroke')}" class="{active: tab === 'stylestroke'}") {voc.stroke}
                li(onclick="{changeTab('styleshadow')}" class="{active: tab === 'styleshadow'}") {voc.shadow}
            #stylefont.tabbed(show="{tab === 'stylefont'}")
                #stylefontinner
                    fieldset
                        label
                            b {capitalize(vocGlob.assetTypes.typeface[0])}:
                        asset-input.wide(
                            assettypes="typeface"
                            allowclear="true"
                            assetid="{asset.typeface}"
                            onchanged="{applyTypeface}"
                        )
                        br
                        label
                            b {voc.fallbackFontFamily}
                            input#fontfamily.wide(type="text" value="{asset.font.family || 'sans-serif'}" onchange="{wire('asset.font.family')}")
                    fieldset
                        .flexrow
                            label
                                b {voc.fontSize}
                                br
                                input.wide(type="number" value="{asset.font.size || '12'}" onchange="{wireFontSize}" oninput="{wireFontSize}" step="1")
                            .aSpacer.nogrow.noshrink
                            label
                                b {voc.lineHeight}
                                br
                                input.wide(type="number" step="1" min="0" value="{asset.font.lineHeight || 0}" oninput="{wire('asset.font.lineHeight')}")
                    fieldset
                        .flexrow
                            label
                                b {voc.fontWeight}
                                br
                                select.wide(value="{asset.font.weight}" onchange="{wire('asset.font.weight')}")
                                    each val in [100, 200, 300, 400, 500, 600, 700, 800, 900]
                                        option(value=val disabled=`{!checkWeightAvailable('${val}')}`)= val
                            .aSpacer.nogrow.noshrink
                            div
                                br
                                label.checkbox
                                    input(type="checkbox" checked="{asset.font.italic}" onchange="{wire('asset.font.italic')}")
                                    b {voc.italic}
                    fieldset
                        b {voc.alignment}
                        .align.buttonselect
                            button#middleleft.inline.nml(onclick="{styleSetAlign('left')}" class="{active: this.asset.font.halign === 'left'}")
                                svg.feather
                                    use(xlink:href="#align-left")
                            button#middlecenter.inline(onclick="{styleSetAlign('center')}" class="{active: this.asset.font.halign === 'center'}")
                                svg.feather
                                    use(xlink:href="#align-center")
                            button#middleright.inline(onclick="{styleSetAlign('right')}" class="{active: this.asset.font.halign === 'right'}")
                                svg.feather
                                    use(xlink:href="#align-right")
                    fieldset
                        label.checkbox
                            input(type="checkbox" checked="{asset.font.wrap}" onchange="{wire('asset.font.wrap')}")
                            b {voc.textWrap}
                        label(if="{asset.font.wrap}").block.nmt
                            b {voc.textWrapWidth}
                            input.wide(type="number" step="8" min="1" value="{asset.font.wrapPosition || 100}" oninput="{wire('asset.font.wrapPosition')}")

            #stylefill.tabbed(show="{tab === 'stylefill'}")
                label.checkbox
                    input#iftochangefill(type="checkbox" checked="{'fill' in asset}" onchange="{styleToggleFill}")
                    span {voc.active}
                #stylefillinner(if="{asset.fill}")
                    fieldset
                        b {voc.fillType}
                        label.checkbox
                            input(type="radio" value="0" name="filltype" checked="{asset.fill.type == 0}" onchange="{wire('asset.fill.type')}")
                            span {voc.fillSolid}
                        label.checkbox
                            input(type="radio" value="1" name="filltype" checked="{asset.fill.type == 1}" onchange="{wire('asset.fill.type')}")
                            span {voc.fillGrad}
                    fieldset
                        .solidfill(if="{asset.fill.type == 0}")
                            b {voc.fillColor}
                            br
                            color-input(onchange="{wire('asset.fill.color', true)}" color="{asset.fill.color}")
                        .gradientfill(if="{asset.fill.type == 1}")
                            +notSupportedThingy
                            .fifty.npl.npt
                                b {voc.fillColor1}
                                color-input(onchange="{wire('asset.fill.color1', true)}" color="{asset.fill.color1}")
                            .fifty.npr.npt
                                b {voc.fillColor2}
                                color-input(onchange="{wire('asset.fill.color2', true)}" color="{asset.fill.color2}")
                            .clear
                            b {voc.fillGradType}
                            label.checkbox
                                input(type="radio" value="2" name="fillgradtype" onchange="{wire('asset.fill.gradtype')}")
                                span {voc.fillHorizontal}
                            label.checkbox
                                input(type="radio" value="1" name="fillgradtype" onchange="{wire('asset.fill.gradtype')}")
                                span {voc.fillVertical}
            #stylestroke.tabbed(show="{tab === 'stylestroke'}")
                label.checkbox
                    input#iftochangestroke(type="checkbox" checked="{'stroke' in asset}" onchange="{styleToggleStroke}")
                    span {voc.active}
                #stylestrokeinner(if="{asset.stroke}")
                    fieldset
                        b {voc.strokeColor}
                        color-input(onchange="{wire('asset.stroke.color', true)}" color="{asset.stroke.color}")
                    fieldset
                        b {voc.strokeWeight}
                        br
                        +rangeNumberInput('asset.stroke.weight')
                .aSpacer
                +notSupportedThingy
            #styleshadow.tabbed(show="{tab === 'styleshadow'}")
                label.checkbox
                    input#iftochangeshadow(type="checkbox" checked="{'shadow' in asset}" onchange="{styleToggleShadow}")
                    span {voc.active}
                #styleshadowinner(if="{asset.shadow}")
                    fieldset
                        b {voc.shadowColor}
                        color-input(onchange="{wire('asset.shadow.color', true)}" color="{asset.shadow.color}")
                    fieldset
                        b {voc.shadowShift}
                        br
                        input#shadowx.short(type="number" value="{asset.shadow.x}" onchange="{wire('asset.shadow.x')}" oninput="{wire('asset.shadow.x')}")
                        | ×
                        input#shadowy.short(type="number" value="{asset.shadow.y}" onchange="{wire('asset.shadow.y')}" oninput="{wire('asset.shadow.y')}")
                    fieldset
                        b {voc.shadowBlur}
                        br
                        +rangeNumberInput('asset.shadow.blur')
                .aSpacer
                +notSupportedThingy
        .flexfix-footer
            button.wide.nogrow.noshrink(onclick="{styleSave}" title="Shift+Control+S" data-hotkey="Control+S")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}
    .style-editor-aPreview.tall(ref="canvasSlot" style="background-color: {previewColor};")
        button.inline.forcebackground.style-editor-aChangeBgButton(onclick="{changePreviewBg}")
            svg.feather
                use(xlink:href="#droplet")
            span {vocFull.textureView.bgColor}
    asset-selector(
        if="{selectingFont}"
        assettypes="font"
        onselected="{applyFont}"
        oncancelled="{cancelCustomFontSelector}"
    )
    color-picker(
        ref="previewBackgroundColor" if="{changingPreviewBg}"
        hidealpha="true"
        color="{previewColor}" onapply="{updatePreviewColor}" onchanged="{updatePreviewColor}" oncancel="{cancelPreviewColor}"
    )
    script.
        this.namespace = 'styleView';
        this.mixin(require('src/node_requires/riotMixins/voc').default);
        this.mixin(require('src/node_requires/riotMixins/wire').default);
        this.mixin(require('src/node_requires/riotMixins/discardio').default);

        const PIXI = require('pixi.js');

        const {getById} = require('src/node_requires/resources');
        // Cache the linked typeface so we can easily fetch valid weights later
        if (this.asset.typeface !== -1) {
            this.linkedTypeface = getById('typeface', this.asset.typeface);
        }

        this.tab = 'stylefont';
        this.changeTab = tab => () => {
            this.tab = tab;
        };
        this.on('mount', () => {
            // Create a pixi.js preview
            // Fit the canvas into the preview window
            const bounds = this.refs.canvasSlot.getBoundingClientRect();
            const width = Math.floor(bounds.width);
            const height = Math.floor(bounds.height);
            this.pixiApp = new PIXI.Application({
                width,
                height,
                backgroundAlpha: 0,
                resolution: window.devicePixelRatio
            });
            this.refs.canvasSlot.appendChild(this.pixiApp.view);

            // Create some text labels for the preview
            const labelShort = this.vocFull.styleView.testText,
                  labelMultiline = this.vocFull.styleView.testText.repeat(2) + '\n' + this.vocFull.styleView.testText.repeat(3) + '\n' + this.vocFull.styleView.testText,
                  labelLong = 'A quick blue cat jumps over the lazy frog. 0123456789 '.repeat(3),
                  labelThumbnail = 'Aa';
            this.pixiStyle = new PIXI.TextStyle();
            this.labelShort = new PIXI.Text(labelShort, this.pixiStyle);
            this.labelMultiline = new PIXI.Text(labelMultiline, this.pixiStyle);
            this.labelLong = new PIXI.Text(labelLong, this.pixiStyle);
            this.labelThumbnail = new PIXI.Text(labelThumbnail, this.pixiStyle);
            this.labels = [this.labelShort, this.labelLong, this.labelMultiline];
            for (const label of this.labels) {
                label.resolution = window.devicePixelRatio;
                label.anchor.x = 0.5;
                label.anchor.y = 0.5;
                this.pixiApp.stage.addChild(label);
                label.x = width / 2;
            }
            this.labelShort.y = 60;
            this.labelMultiline.y = 60 * 3;
            this.labelLong.y = 60 * 6;
            this.updateStylePreview();
        });
        this.on('unmount', () => {
            this.pixiApp.destroy(false, {
                children: true
            });
        });
        this.on('updated', () => {
            this.updateStylePreview();
        });
        const resizeCanvas = () => {
            const bounds = this.refs.canvasSlot.getBoundingClientRect();
            this.pixiApp.renderer.resize(Math.floor(bounds.width), Math.floor(bounds.height));
            for (const label of this.labels) {
                label.x = bounds.width / 2;
            }
        };
        window.addEventListener('resize', resizeCanvas);
        this.on('unmount', () => {
            window.removeEventListener('resize', resizeCanvas);
        });

        this.selectingTexture = false;

        this.openCustomFontSelector = () => {
            this.selectingFont = true;
        };
        this.cancelCustomFontSelector = () => {
            this.selectingFont = false;
            this.update();
        };

        this.applyTypeface = typefaceUid => {
            this.asset.typeface = typefaceUid;
            // Cache the linked typeface so we can easily fetch valid weights later
            if (this.asset.typeface !== -1) {
                this.linkedTypeface = getById('typeface', this.asset.typeface);
                // Check if the selected weight and italic settings are still valid;
                // reset to the first font / default settings otherwise
                if (!this.linkedTypeface.fonts.some(f =>
                    f.weight === this.asset.font.weight &&
                    f.italic === this.asset.font.italic)
                ) {
                    if (this.linkedTypeface.fonts.length) {
                        this.asset.font.weight = this.linkedTypeface.fonts[0].weight;
                        this.asset.font.italic = this.linkedTypeface.fonts[0].italic;
                    } else {
                        this.asset.font.weight = 400;
                        this.asset.font.italic = false;
                    }
                }
            } else {
                this.linkedTypeface = false;
            }
            this.update();
        };

        this.checkWeightAvailable = weight => !this.linkedTypeface ||
            this.linkedTypeface.fonts.some(f => f.weight === weight);

        this.wireFontSize = e => {
            const oldSize = this.asset.font.size,
                  oldLineHeight = this.asset.font.lineHeight;
            this.wire('asset.font.size')(e);
            const k = this.asset.font.size / oldSize;
            this.asset.font.lineHeight = Math.round(oldLineHeight * k * 100) / 100;
        };

        this.styleSetAlign = align => () => {
            this.asset.font.halign = align;
        };
        this.styleToggleFill = () => {
            if (this.asset.fill) {
                delete this.asset.fill;
            } else {
                this.asset.fill = {};
            }
        };
        this.styleToggleStroke = function styleToggleStroke() {
            if (this.asset.stroke) {
                delete this.asset.stroke;
            } else {
                this.asset.stroke = {
                    color: '#000000',
                    weight: 1
                };
            }
        };
        this.styleToggleShadow = function styleToggleShadow() {
            if (this.asset.shadow) {
                delete this.asset.shadow;
            } else {
                this.asset.shadow = {
                    color: '#000000',
                    x: 0,
                    y: 0,
                    blur: 0
                };
            }
        };
        // Render a preview image in the editor
        const {extend} = require('src/node_requires/objectUtils');
        const {styleToTextStyle} = require('src/node_requires/styleUtils');
        this.updateStylePreview = () => {
            this.pixiStyle.reset();
            extend(this.pixiStyle, styleToTextStyle(this.asset, true));
            for (const label of this.labels) {
                // this forces to redraw the pixi label
                // eslint-disable-next-line no-self-assign
                label.text = label.text;
            }
            this.pixiApp.render();
        };
        this.saveAsset = async () => {
            const {StylePreviewer} = require('src/node_requires/resources/preview/style');
            await StylePreviewer.save(this.asset);
            this.writeChanges();
            return true;
        };
        this.styleSave = async () => {
            await this.saveAsset();
            this.opts.ondone(this.asset);
        };

        // Get the color for thhe preview window and let a user change it
        const {getSwatch} = require('src/node_requires/themes');
        this.previewColor = getSwatch('backgroundDeeper');
        this.changePreviewBg = () => {
            this.changingPreviewBg = !this.changingPreviewBg;
            if (this.changingPreviewBg) {
                this.oldPreviewColor = this.previewColor;
            }
        };
        this.updatePreviewColor = (color, evtype) => {
            this.previewColor = color;
            if (evtype === 'onapply') {
                this.changingPreviewBg = false;
            }
            this.update();
        };
        this.cancelPreviewColor = () => {
            this.changingPreviewBg = false;
            this.previewColor = this.oldPreviewColor;
            this.update();
        };

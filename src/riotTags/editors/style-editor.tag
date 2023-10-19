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
                            b {voc.fontFamily}
                            input#fontfamily.wide(type="text" value="{asset.font.family || 'sans-serif'}" onchange="{wire('asset.font.family')}")
                        button(onclick="{openCustomFontSelector}")
                            svg.feather
                                use(xlink:href="#font")
                            span {voc.useCustomFont}
                        .clear
                        label.fifty.npl.nmt
                            b {voc.fontSize}
                            br
                            input#fontsize.wide(type="number" value="{asset.font.size || '12'}" onchange="{wire('asset.font.size')}" oninput="{wire('asset.font.size')}" step="1")
                        label.fifty.npr.nmt
                            b {voc.fontWeight}
                            br
                            select.wide(value="{asset.font.weight}" onchange="{wire('asset.font.weight')}")
                                each val in [100, 200, 300, 400, 500, 600, 700, 800, 900]
                                    option(value=val)= val
                        .clear
                        label.checkbox
                            input(type="checkbox" checked="{asset.font.italic}" onchange="{wire('asset.font.italic')}")
                            span {voc.italic}
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
                        label
                            b {voc.lineHeight}
                            br
                            input(type="number" step="1" min="0" value="{asset.font.lineHeight || 0}" oninput="{wire('asset.font.lineHeight')}")
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
                        input#strokeweight(type="number" value="{asset.stroke.weight}" onchange="{wire('asset.stroke.weight')}" oninput="{wire('asset.stroke.weight')}")
                    #strokeweightslider
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
                        input#shadowblur(type="number" value="{asset.shadow.blur}" min="0" onchange="{wire('asset.shadow.blur')}" oninput="{wire('asset.shadow.blur')}")
        .flexfix-footer
            .aPanel.pad
                .flexrow
                    h3 {voc.code}
                    .aSpacer
                    button.inline.nogrow(onclick="{copyCode}")
                        svg.feather
                            use(xlink:href="#copy")
                        span {voc.copyCode}
                textarea.wide(disabled="true" ref="codeField")
                    | this.textLabel = new PIXI.Text('Your text here', ct.styles.get('{asset.name}'));
                    | {'\n'}this.addChild(this.textLabel);

            button.wide.nogrow.noshrink(onclick="{styleSave}" title="Shift+Control+S" data-hotkey="Control+S")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}
    .style-editor-aPreview.tall(ref="canvasSlot")
    asset-selector(
        if="{selectingFont}"
        assettype="fonts"
        onselected="{applyFont}"
        oncancelled="{cancelCustomFontSelector}"
    )
    script.
        this.namespace = 'styleView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        const PIXI = require('pixi.js');

        this.changingAnyColor = false;
        this.tab = 'stylefont';
        this.changeTab = tab => () => {
            this.tab = tab;
        };
        this.on('mount', () => {
            const width = 800;
            const height = 500;
            this.pixiApp = new PIXI.Application({
                width,
                height,
                transparent: true
            });
            this.refs.canvasSlot.appendChild(this.pixiApp.view);

            var labelShort = this.vocFull.styleView.testText,
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
                label.anchor.x = 0.5;
                label.anchor.y = 0.5;
                this.pixiApp.stage.addChild(label);
                label.x = width / 2;
            }
            this.labelShort.y = 60;
            this.labelMultiline.y = 60 * 3;
            this.labelLong.y = 60 * 6;
            this.refreshStyleTexture();
        });
        this.on('updated', () => {
            this.refreshStyleTexture();
        });

        this.selectingTexture = false;

        this.openCustomFontSelector = () => {
            this.selectingFont = true;
        };
        this.cancelCustomFontSelector = () => {
            this.selectingFont = false;
            this.update();
        };
        const {getById} = require('./data/node_requires/resources');
        this.applyFont = fontId => {
            this.selectingFont = false;
            const font = getById('font', fontId);
            this.asset.font.family = `"CTPROJFONT${font.typefaceName}", "${font.typefaceName}", sans-serif`;
            this.asset.font.weight = font.weight;
            this.asset.font.italic = font.italic;
            this.update();
        };

        this.copyCode = () => {
            nw.Clipboard.get().set(this.refs.codeField.value);
            alertify.success(this.vocGlob.done);
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
        const {extend} = require('./data/node_requires/objectUtils');
        const {styleToTextStyle} = require('./data/node_requires/styleUtils');
        this.refreshStyleTexture = () => {
            this.pixiStyle.reset();
            extend(this.pixiStyle, styleToTextStyle(this.asset));
            for (const label of this.labels) {
                // this forces to redraw the pixi label
                // eslint-disable-next-line no-self-assign
                label.text = label.text;
            }
            this.pixiApp.render();
        };
        this.saveAsset = async () => {
            this.writeChanges();
            const {StylePreviewer} = require('./data/node_requires/resources/preview/style');
            await StylePreviewer.save(this.asset);
            return true;
        };
        this.styleSave = async () => {
            await this.saveAsset();
            this.opts.ondone(this.asset);
        };

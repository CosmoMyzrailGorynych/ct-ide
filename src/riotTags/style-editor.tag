style-editor.panel.view
    #styleleft.tall.flexfix
        .flexfix-header
            .panel.pad
                b {vocGlob.name}
                br
                input.wide(type="text" value="{styleobj.name}" onchange="{wire('this.styleobj.name')}")
                .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nametaken}
        .tabwrap.flexfix-body
            ul.nav.tabs.nogrow.noshrink
                li(onclick="{changeTab('stylefont')}" class="{active: tab === 'stylefont'}") {voc.font}
                li(onclick="{changeTab('stylefill')}" class="{active: tab === 'stylefill'}") {voc.fill}
                li(onclick="{changeTab('stylestroke')}" class="{active: tab === 'stylestroke'}") {voc.stroke}
                li(onclick="{changeTab('styleshadow')}" class="{active: tab === 'styleshadow'}") {voc.shadow}
            #stylefont.tabbed(show="{tab === 'stylefont'}")
                #stylefontinner
                    fieldset
                        label
                            b {voc.fontfamily}
                            input#fontfamily.wide(type="text" value="{styleobj.font.family || 'sans-serif'}" onchange="{wire('this.styleobj.font.family')}")
                        button(onclick="{openCustomFontSelector}")
                            svg.feather
                                use(xlink:href="data/icons.svg#font")
                            span {voc.useCustomFont}
                        .clear
                        label.fifty.npl.nmt
                            b {voc.fontsize}
                            br
                            input#fontsize.wide(type="number" value="{styleobj.font.size || '12'}" onchange="{wire('this.styleobj.font.size')}" oninput="{wire('this.styleobj.font.size')}" step="1")
                        label.fifty.npr.nmt
                            b {voc.fontweight}
                            br
                            select.wide(value="{styleobj.font.weight}" onchange="{wire('this.styleobj.font.weight')}")
                                each val in [100, 200, 300, 400, 500, 600, 700, 800, 900]
                                    option(value=val)= val
                        .clear
                        label.checkbox
                            input(type="checkbox" checked="{styleobj.font.italic}" onchange="{wire('this.styleobj.font.italic')}")
                            span {voc.italic}
                    fieldset
                        b {voc.alignment}
                        .align.buttonselect
                            button#middleleft.inline.nml(onclick="{styleSetAlign('left')}" class="{active: this.styleobj.font.halign === 'left'}")
                                svg.feather
                                    use(xlink:href="data/icons.svg#align-left")
                            button#middlecenter.inline(onclick="{styleSetAlign('center')}" class="{active: this.styleobj.font.halign === 'center'}")
                                svg.feather
                                    use(xlink:href="data/icons.svg#align-center")
                            button#middleright.inline(onclick="{styleSetAlign('right')}" class="{active: this.styleobj.font.halign === 'right'}")
                                svg.feather
                                    use(xlink:href="data/icons.svg#align-right")
                        label
                            b {voc.lineHeight}
                            br
                            input(type="number" step="1" min="0" value="{styleobj.font.lineHeight || 0}" oninput="{wire('this.styleobj.font.lineHeight')}")
                    fieldset
                        label.checkbox
                            input(type="checkbox" checked="{styleobj.font.wrap}" onchange="{wire('this.styleobj.font.wrap')}")
                            b {voc.textWrap}
                        label(if="{styleobj.font.wrap}").block.nmt
                            b {voc.textWrapWidth}
                            input.wide(type="number" step="8" min="1" value="{styleobj.font.wrapPosition || 100}" oninput="{wire('this.styleobj.font.wrapPosition')}")

            #stylefill.tabbed(show="{tab === 'stylefill'}")
                label.checkbox
                    input#iftochangefill(type="checkbox" checked="{'fill' in styleobj}" onchange="{styleToggleFill}")
                    span {voc.active}
                #stylefillinner(if="{styleobj.fill}")
                    fieldset
                        b {voc.filltype}
                        label.checkbox
                            input(type="radio" value="0" name="filltype" checked="{styleobj.fill.type == 0}" onchange="{wire('this.styleobj.fill.type')}")
                            span {voc.fillsolid}
                        label.checkbox
                            input(type="radio" value="1" name="filltype" checked="{styleobj.fill.type == 1}" onchange="{wire('this.styleobj.fill.type')}")
                            span {voc.fillgrad}
                    fieldset
                        .solidfill(if="{styleobj.fill.type == 0}")
                            b {voc.fillcolor}
                            br
                            color-input(onchange="{wire('this.styleobj.fill.color', true)}" color="{styleobj.fill.color}")
                        .gradientfill(if="{styleobj.fill.type == 1}")
                            .fifty.npl.npt
                                b {voc.fillcolor1}
                                color-input(onchange="{wire('this.styleobj.fill.color1', true)}" color="{styleobj.fill.color1}")
                            .fifty.npr.npt
                                b {voc.fillcolor2}
                                color-input(onchange="{wire('this.styleobj.fill.color2', true)}" color="{styleobj.fill.color2}")
                            .clear
                            b {voc.fillgradtype}
                            label.checkbox
                                input(type="radio" value="2" name="fillgradtype" onchange="{wire('this.styleobj.fill.gradtype')}")
                                span {voc.fillhorisontal}
                            label.checkbox
                                input(type="radio" value="1" name="fillgradtype" onchange="{wire('this.styleobj.fill.gradtype')}")
                                span {voc.fillvertical}
            #stylestroke.tabbed(show="{tab === 'stylestroke'}")
                label.checkbox
                    input#iftochangestroke(type="checkbox" checked="{'stroke' in styleobj}" onchange="{styleToggleStroke}")
                    span {voc.active}
                #stylestrokeinner(if="{styleobj.stroke}")
                    fieldset
                        b {voc.strokecolor}
                        color-input(onchange="{wire('this.styleobj.stroke.color', true)}" color="{styleobj.stroke.color}")
                    fieldset
                        b {voc.strokeweight}
                        br
                        input#strokeweight(type="number" value="{styleobj.stroke.weight}" onchange="{wire('this.styleobj.stroke.weight')}" oninput="{wire('this.styleobj.stroke.weight')}")
                    #strokeweightslider
            #styleshadow.tabbed(show="{tab === 'styleshadow'}")
                label.checkbox
                    input#iftochangeshadow(type="checkbox" checked="{'shadow' in styleobj}" onchange="{styleToggleShadow}")
                    span {voc.active}
                #styleshadowinner(if="{styleobj.shadow}")
                    fieldset
                        b {voc.shadowcolor}
                        color-input(onchange="{wire('this.styleobj.shadow.color', true)}" color="{styleobj.shadow.color}")
                    fieldset
                        b {voc.shadowshift}
                        br
                        input#shadowx.short(type="number" value="{styleobj.shadow.x}" onchange="{wire('this.styleobj.shadow.x')}" oninput="{wire('this.styleobj.shadow.x')}")
                        | ×
                        input#shadowy.short(type="number" value="{styleobj.shadow.y}" onchange="{wire('this.styleobj.shadow.y')}" oninput="{wire('this.styleobj.shadow.y')}")
                    fieldset
                        b {voc.shadowblur}
                        br
                        input#shadowblur(type="number" value="{styleobj.shadow.blur}" min="0" onchange="{wire('this.styleobj.shadow.blur')}" oninput="{wire('this.styleobj.shadow.blur')}")
        .flexfix-footer
            button.wide.nogrow.noshrink(onclick="{styleSave}" title="Shift+Control+S" data-hotkey="Control+S")
                svg.feather
                    use(xlink:href="data/icons.svg#check")
                span {voc.apply}
    #stylepreview.tall(ref="canvasSlot")
    font-selector(if="{selectingFont}" onselected="{applyFont}" oncancelled="{cancelCustomFontSelector}")
    script.
        const fs = require('fs-extra');

        this.namespace = 'styleview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.styleobj = this.opts.styleobj;
        this.styleobj.font = this.styleobj.font || {
            family: 'sans-serif',
            size: 12,
            weight: 400,
            italic: false
        };

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

            var labelShort = window.languageJSON.styleview.testtext,
                labelMultiline = window.languageJSON.styleview.testtext.repeat(2) + '\n' + window.languageJSON.styleview.testtext.repeat(3) + '\n' + window.languageJSON.styleview.testtext,
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
        this.on('update', () => {
            const {styles} = global.currentProject;
            if (styles.find(style => this.styleobj.name === style.name && this.styleobj !== style)) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
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
        this.applyFont = font => () => {
            this.selectingFont = false;
            this.styleobj.font.family = `"CTPROJFONT${font.typefaceName}", "${font.typefaceName}", sans-serif`;
            this.styleobj.font.weight = font.weight;
            this.styleobj.font.italic = font.italic;
            this.update();
        };

        this.styleSetAlign = align => () => {
            this.styleobj.font.halign = align;
        };
        this.styleToggleFill = () => {
            if (this.styleobj.fill) {
                delete this.styleobj.fill;
            } else {
                this.styleobj.fill = {};
            }
        };
        this.styleToggleStroke = function styleToggleStroke() {
            if (this.styleobj.stroke) {
                delete this.styleobj.stroke;
            } else {
                this.styleobj.stroke = {
                    color: '#000000',
                    weight: 1
                };
            }
        };
        this.styleToggleShadow = function styleToggleShadow() {
            if (this.styleobj.shadow) {
                delete this.styleobj.shadow;
            } else {
                this.styleobj.shadow = {
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
            extend(this.pixiStyle, styleToTextStyle(this.styleobj));
            for (const label of this.labels) {
                // this forces to redraw the pixi label
                // eslint-disable-next-line no-self-assign
                label.text = label.text;
            }
            this.pixiApp.render();
        };
        this.styleSave = function styleSave() {
            if (this.nameTaken) {
                // animate the error notice
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                soundbox.play('Failure');
                return false;
            }
            this.styleobj.lastmod = Number(new Date());
            this.styleGenPreview(global.projdir + '/img/' + this.styleobj.origname + '_prev@2.png', 128);
            this.styleGenPreview(global.projdir + '/img/' + this.styleobj.origname + '_prev.png', 64).then(() => {
                this.parent.editingStyle = false;
                this.parent.update();
            });
            return true;
        };

        /**
         * Generates a thumbnail for the current style
         * @returns {Promise}
         */
        this.styleGenPreview = function styleGenPreview(destination) {
            return new Promise((accept, decline) => {
                var img = this.pixiApp.renderer.plugins.extract.base64(this.labelThumbnail);

                var thumbnailBase64 = img.replace(/^data:image\/\w+;base64,/, '');
                var buf = Buffer.from(thumbnailBase64, 'base64');
                fs.writeFile(destination, buf, err => {
                    if (err) {
                        console.error(err);
                        decline(err);
                    } else {
                        accept(destination);
                    }
                });
            });
        };

style-editor.panel.view
    #styleleft.tall.flexfix
        .flexfix-header
            .panel.pad
                b {vocGlob.name}
                br
                input.wide(type="text" value="{styleobj.name}" onchange="{wire('this.styleobj.name')}")
                .anErrorNotice(if="{nameTaken}") {vocGlob.nametaken}
        .tabwrap.flexfix-body
            ul.nav.tabs.nogrow.noshrink
                li(onclick="{changeTab('stylefont')}" class="{active: tab === 'stylefont'}") {voc.font}
                li(onclick="{changeTab('stylefill')}" class="{active: tab === 'stylefill'}") {voc.fill}
                li(onclick="{changeTab('stylestroke')}" class="{active: tab === 'stylestroke'}") {voc.stroke}
                li(onclick="{changeTab('styleshadow')}" class="{active: tab === 'styleshadow'}") {voc.shadow}
            #stylefont.tabbed(show="{tab === 'stylefont'}")
                #stylefontinner
                    .fifty.npl.npt.npr
                        b {voc.fontfamily}
                        input#fontfamily.wide(type="text" value="{styleobj.font.family || 'sans-serif'}" onchange="{wire('this.styleobj.font.family')}")
                        br
                    .fifty.npr.npt
                        b {voc.fontsize}
                        br
                        input#fontsize.wide(type="number" value="{styleobj.font.size || '12'}" onchange="{wire('this.styleobj.font.size')}" oninput="{wire('this.styleobj.font.size')}" step="1")
                    .clear
                    .fifty.npl.npt
                        label
                            b {voc.fontweight}
                            br
                            select(value="{styleobj.font.weight}" onchange="{wire('this.styleobj.font.weight')}")
                                each val in [100, 200, 300, 400, 500, 600, 700, 800, 900]
                                    option(value=val)= val
                    .fifty.npr
                        label
                            input(type="checkbox" checked="{styleobj.font.italic}" onchange="{wire('this.styleobj.font.italic')}")
                            span   {voc.italic}
                    .clear
                    b {voc.alignment}
                    .align.buttonselect
                        button#middleleft.inline(onclick="{styleSetAlign('left')}" class="{active: this.styleobj.font.halign === 'left'}")
                            i.icon.icon-align-left
                        button#middlecenter.inline(onclick="{styleSetAlign('center')}" class="{active: this.styleobj.font.halign === 'center'}")
                            i.icon.icon-align-center
                        button#middleright.inline(onclick="{styleSetAlign('right')}" class="{active: this.styleobj.font.halign === 'right'}")
                            i.icon.icon-align-right
                    br
                    label
                        b {voc.lineHeight}
                        br
                        input(type="number" step="1" min="0" value="{styleobj.font.lineHeight || 0}" oninput="{wire('this.styleobj.font.lineHeight')}")
                    br
                    br
                    label
                        input(type="checkbox" checked="{styleobj.font.wrap}" onchange="{wire('this.styleobj.font.wrap')}")
                        b   {voc.textWrap}
                    label(if="{styleobj.font.wrap}")
                        br
                        span {voc.textWrapWidth}
                        br
                        input(type="number" step="8" min="1" value="{styleobj.font.wrapPosition || 100}" oninput="{wire('this.styleobj.font.wrapPosition')}")

            #stylefill.tabbed(show="{tab === 'stylefill'}")
                label
                    input#iftochangefill(type="checkbox" checked="{'fill' in styleobj}" onchange="{styleToggleFill}")
                    span {voc.active}
                #stylefillinner(if="{styleobj.fill}")
                    b {voc.filltype}
                    br
                    label
                        input(type="radio" value="0" name="filltype" checked="{styleobj.fill.type == 0}" onchange="{wire('this.styleobj.fill.type')}")
                        span {voc.fillsolid}
                    br
                    label
                        input(type="radio" value="1" name="filltype" checked="{styleobj.fill.type == 1}" onchange="{wire('this.styleobj.fill.type')}")
                        span {voc.fillgrad}
                    br
                    .solidfill(if="{styleobj.fill.type == 0}")
                        b {voc.fillcolor}
                        br
                        color-input(onchange="{wire('this.styleobj.fill.color', true)}" color="{styleobj.fill.color}")
                    .gradientfill(if="{styleobj.fill.type == 1}")
                        .fifty.npl
                            b {voc.fillcolor1}
                            color-input(onchange="{wire('this.styleobj.fill.color1', true)}" color="{styleobj.fill.color1}")
                        .fifty.npr
                            b {voc.fillcolor2}
                            color-input(onchange="{wire('this.styleobj.fill.color2', true)}" color="{styleobj.fill.color2}")
                        br
                        b {voc.fillgradtype}
                        br
                        label
                            input(type="radio" value="2" name="fillgradtype" onchange="{wire('this.styleobj.fill.gradtype')}")
                            span {voc.fillhorisontal}
                        br
                        label
                            input(type="radio" value="1" name="fillgradtype" onchange="{wire('this.styleobj.fill.gradtype')}")
                            span {voc.fillvertical}
            #stylestroke.tabbed(show="{tab === 'stylestroke'}")
                label
                    input#iftochangestroke(type="checkbox" checked="{'stroke' in styleobj}" onchange="{styleToggleStroke}")
                    span {voc.active}
                #stylestrokeinner(if="{styleobj.stroke}")
                    b {voc.strokecolor}
                    color-input(onchange="{wire('this.styleobj.stroke.color', true)}" color="{styleobj.stroke.color}")
                    b {voc.strokeweight}
                    br
                    input#strokeweight(type="number" value="{styleobj.stroke.weight}" onchange="{wire('this.styleobj.stroke.weight')}" oninput="{wire('this.styleobj.stroke.weight')}")
                    #strokeweightslider
            #styleshadow.tabbed(show="{tab === 'styleshadow'}")
                label
                    input#iftochangeshadow(type="checkbox" checked="{'shadow' in styleobj}" onchange="{styleToggleShadow}")
                    span {voc.active}
                #styleshadowinner(if="{styleobj.shadow}")
                    b {voc.shadowcolor}
                    color-input(onchange="{wire('this.styleobj.shadow.color', true)}" color="{styleobj.shadow.color}")
                    br
                    b {voc.shadowshift}
                    br
                    input#shadowx.short(type="number" value="{styleobj.shadow.x}" onchange="{wire('this.styleobj.shadow.x')}" oninput="{wire('this.styleobj.shadow.x')}")
                    | ×
                    input#shadowy.short(type="number" value="{styleobj.shadow.y}" onchange="{wire('this.styleobj.shadow.y')}" oninput="{wire('this.styleobj.shadow.y')}")
                    br
                    br
                    b {voc.shadowblur}
                    br
                    input#shadowblur(type="number" value="{styleobj.shadow.blur}" min="0" onchange="{wire('this.styleobj.shadow.blur')}" oninput="{wire('this.styleobj.shadow.blur')}")
                    #shadowblurslider
        .flexfix-footer
            button.wide.nogrow.noshrink(onclick="{styleSave}")
                i.icon.icon-confirm
                span {voc.apply}
    #stylepreview.tall
        canvas(width="550" height="400" ref="canvas")
    texture-selector(if="{selectingTexture}" onselected="{applyTexture}" ref="textureselector")
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
        this.changeTab = tab => e => {
            this.tab = tab;
        };
        this.on('mount', e => {
            this.pixiApp = new PIXI.Application(640, 480, {
                view: this.refs.canvas,
                transparent: true
            });
            var labelShort = languageJSON.styleview.testtext,
                labelMultiline = languageJSON.styleview.testtext.repeat(2) + '\n' + languageJSON.styleview.testtext.repeat(3) + '\n' + languageJSON.styleview.testtext,
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
                label.x = 320;
            }
            this.labelShort.y = 60;
            this.labelMultiline.y = 60 * 3;
            this.labelLong.y = 60 * 6;
            this.refreshStyleTexture();
        });
        this.on('update', () => {
            if (window.currentProject.styles.find(style => 
                this.styleobj.name === style.name && this.styleobj !== style
            )) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
        });
        this.on('updated', e => {
            this.refreshStyleTexture();
        });
        
        this.selectingTexture = false;
        
        this.styleSetAlign = align => e => {
            this.styleobj.font.halign = align;
        };
        this.styleToggleFill = () => {
            if (this.styleobj.fill) {
                delete this.styleobj.fill;
            } else {
                this.styleobj.fill = {
                    
                };
            }
        };
        this.styleToggleStroke = function() {
            if (this.styleobj.stroke) {
                delete this.styleobj.stroke;
            } else {
                this.styleobj.stroke = {
                    color: '#000000',
                    weight: 1
                };
            }
        };
        this.styleToggleShadow = function() {
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
        // Рендер превью в редакторе
        this.refreshStyleTexture = e => {
            this.pixiStyle.reset();
            window.___extend(this.pixiStyle, window.styleToTextStyle(this.styleobj));
            for (const label of this.labels) {
                label.text = label.text;
            }
            this.pixiApp.render();
        };
        this.styleSave = function() {
            this.styleobj.lastmod = +(new Date());
            this.styleGenPreview(sessionStorage.projdir + '/img/' + this.styleobj.origname + '_prev@2.png', 128);
            this.styleGenPreview(sessionStorage.projdir + '/img/' + this.styleobj.origname + '_prev.png', 64).then(() => {
                this.parent.editingStyle = false;
                this.parent.update();
            });
        };
        
        /**
         * Generates a thumbnail for the current style
         * @returns {Promise}
         */
        this.styleGenPreview = function(destination, size) {
            return new Promise((accept, decline) => {
                var img = this.pixiApp.renderer.plugins.extract. base64(this.labelThumbnail);
                var data = img.replace(/^data:image\/\w+;base64,/, '');
                var buf = new Buffer(data, 'base64');
                fs.writeFile(destination, buf, function(err) {
                    if (err) {
                        console.log(err);
                        decline(err);
                    } else {
                        accept(destination);
                    }
                });
            });
        };

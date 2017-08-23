style-editor.panel.view
    #styleleft.tall
        .tabwrap.tall
            ul.nav.tabs.nogrow.noshrink
                li(onclick="changeTab('stylefont')" class="{active: tab === 'stylefont'}") {voc.font}
                li(onclick="changeTab('stylefill')" class="{active: tab === 'stylefill'}") {voc.fill}
                li(onclick="changeTab('stylestroke')" class="{active: tab === 'stylestroke'}") {voc.stroke}
                li(onclick="changeTab('styleshadow')" class="{active: tab === 'styleshadow'}") {voc.shadow}
            div(style="overflow: auto;")
                #stylefont.tabbed
                    label
                        input#iftochangefont(type="checkbox" onchange="{styleToggleFont}")
                        span {voc.active}
                    #stylefontinner(disabled="{!styleobj.font}")
                        b {voc.fontfamily}
                        input#fontfamily.wide(type="text" value="{styleobj.font.family || 'sans-serif'}" onchange="{wire('this.styleobj.font.family')}")
                        br
                        b {voc.fontsize}
                        br
                        input#fontsize.short(type="number" value="{styleobj.font.size || '12'}" onchange="{wire('this.styleobj.font.size')}" step="1")
                        #fontsizeslider
                        br
                        b {voc.alignment}
                        .align.buttonselect
                            button#topleft.inline(onclick="{styleSetAlign('top left')}" class="{active: styleobj.font.align === 'top left'}")
                                i.icon.icon-menu
                            button#topcenter.inline(onclick="{styleSetAlign('top center')}" class="{active: styleobj.font.align === 'top center'}")
                                i.icon.icon-text-center
                            button#topright.inline(onclick="{styleSetAlign('top right')}" class="{active: styleobj.font.align === 'top right'}")
                                i.icon.icon-menu-right
                        .align.buttonselect
                            button#middleleft.inline(onclick="{styleSetAlign('middle left')}" class="{active: styleobj.font.align === 'middle left'}")
                                i.icon.icon-menu
                            button#middlecenter.inline(onclick="{styleSetAlign('middle center')}" class="{active: styleobj.font.align === 'middle center'}")
                                i.icon.icon-text-center
                            button#middleright.inline(onclick="{styleSetAlign('middle right')}" class="{active: styleobj.font.align === 'middle right'}")
                                i.icon.icon-menu-right
                        .align.buttonselect
                            button#bottomleft.inline(onclick="{styleSetAlign('bottom left')}" class="{active: styleobj.font.align === 'bottom left'}")
                                i.icon.icon-menu
                            button#bottomcenter.inline(onclick="{styleSetAlign('bottom center')}" class="{active: styleobj.font.align === 'bottom center'}")
                                i.icon.icon-text-center
                            button#bottomright.inline(onclick="{styleSetAlign('bottom right')}" class="{active: styleobj.font.align === 'bottom right'}")
                                i.icon.icon-menu-right
                #stylefill.tabbed
                    label
                        input#iftochangefill(type="checkbox" checked="{styleobj.fill}" onchange="{styleToggleFill}")
                        span {voc.active}
                    #stylefillinner(disabled="{!styleobj.fill}")
                        b {voc.filltype}
                        br
                        label
                            input(type="radio" value="0" name="filltype" onchange="{wire('this.styleobj.fill.type')}")
                            span {voc.fillsolid}
                        br
                        label
                            input(type="radio" value="1" name="filltype" onchange="{wire('this.styleobj.fill.type')}")
                            span {voc.fillgrad}
                        br
                        label
                            input(type="radio" value="2" name="filltype" onchange="{wire('this.styleobj.fill.type')}")
                            span {voc.fillpattern}
                        br
                        br
                        .solidfill(if="{styleobj.fill.type == 0}")
                            b {voc.fillcolor}
                            br
                            input#fillcolor.color(type="text" onchange="{wire('this.styleobj.fill.color')}")
                        .gradientfill(if="{styleobj.fill.type == 1}")
                            b {voc.fillcolor1}
                            br
                            input#fillcolor1.color(type="text" onchange="{wire('this.styleobj.fill.color1')}")
                            br
                            br
                            b {voc.fillcolor2}
                            br
                            input#fillcolor2.color(type="text" onchange="{wire('this.styleobj.fill.color2')}")
                            br
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
                            br
                            label
                                input(type="radio" value="0" name="fillgradtype" onchange="{wire('this.styleobj.fill.gradtype')}")
                                span {voc.fillradial}
                            br
                            br
                            b {voc.fillgradsize}
                            br
                            input#fillgradsize(type="number" name="fillgradsize" value="{styleobj.fill.gradsize}" onchange="{wire('this.styleobj.fill.gradsize')}")
                            #gradsizeslider
                        .pattern(if="{styleobj.fill.type == 2}")
                            b {voc.fillpatname}
                            br
                            input#fillpatname(type="text" name="fillpatname" value="{styleobj.fill.patname}" onchange="{wire('this.styleobj.fill.patname')}")
                            button.inline(data-event="styleFindPattern")
                                i.icon.icon-search
                                span {voc.findpat}
                #stylestroke.tabbed
                    label
                        input#iftochangestroke(type="checkbox" checked="{styleobj.stroke}" onchange="{styleToggleStroke}")
                        span {voc.active}
                    #stylestrokeinner(disabled="{!styleobj.stroke}")
                        b {voc.strokecolor}
                        br
                        input#strokecolor.color(type="text" value="{styleobj.stroke.color}" onchange="{wire('this.styleobj.stroke.color')}")
                        br
                        br
                        b {voc.strokeweight}
                        br
                        input#strokeweight(type="number" value="{styleobj.stroke.weight}" onchange="{wire('this.styleobj.stroke.weight')}")
                        #strokeweightslider
                #styleshadow.tabbed
                    label
                        input#iftochangeshadow(type="checkbox" onchange="{styleToggleShadow}")
                        span {voc.active}
                    #styleshadowinner
                        b {voc.shadowcolor}
                        br
                        input#shadowcolor.color(type="text" value="{styleobj.shadow.color}" onchange="{wire('this.styleobj.shadow.color')}")
                        br
                        br
                        b {voc.shadowshift}
                        br
                        input#shadowx.short(type="number" value="{styleobj.shadow.x}" onchange="{wire('this.styleobj.shadow.x')}")
                        | ×
                        input#shadowy.short(type="number" value="{styleobj.shadow.y}" onchange="{wire('this.styleobj.shadow.y')}")
                        br
                        br
                        b {voc.shadowblur}
                        br
                        input#shadowblur(type="number" value="{styleobj.shadow.blur}" onchange="{wire('this.styleobj.shadow.blur')}")
                        #shadowblurslider
            button.wide.nogrow.noshrink(onclick="{styleSave}")
                i.icon.icon-confirm
                span {voc.apply}
    #stylepreview.tall
        canvas(width="550" height="400" ref="canvas")
    graphic-selector(if="{selectingGraphic}" ref="graphicselector")
    script.
        this.mixin(window.riotWired);
        this.voc = window.languageJSON.styleview;
        
        this.tab = 'stylefont';
        this.changeTab = tab => e => {
            this.tab = tab;
        };
        this.on('mount', e => {
            this.refs.canvas.x = this.refs.canvas.getContext('2d');
        });
        this.on('updated', e => {
            this.refreshStyleGraphic();
        });
        
        this.selectingGraphic = false;
        
        this.styleToggleFont = e => {
            if (!this.styleobj.font) {
                this.styleobj.font = {
                    family: 'sans-serif',
                    size: 12
                };
            } else {
                this.styleobj.font = false;
            }
        };
        this.styleSetAlign = align => e => {
            var arr = align.split(' ');
            this.style.font.valign = arr[0];
            this.style.font.halign = arr[1];
        };
        this.styleToggleFill = () => {
            if (this.styleobj.fill) {
                this.styleobj.fill = false;
            } else {
                this.styleobj.fill = {
                    
                };
            }
        };
        this.styleToggleStroke = function() {
            if (this.styleobj.stroke) {
                this.styleobj.stroke = false;
            } else {
                this.styleobj.stroke = {
                    color: '#000000',
                    weight: 1
                };
            }
        };
        this.styleToggleShadow = function() {
            if (this.styleobj.shadow) {
                this.styleobj.shadow = false;
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
        this.refreshStyleGraphic = e => {
            var canv = this.refs.canvas;
            canv.x.strokeStyle = '#000000'; // обводка
            canv.x.globalAlpha = 1; // непрозрачность
            canv.x.font = '12px sans-serif'; // шрифт
            canv.x.fillStyle = '#000000'; // заливка
            canv.x.shadowBlur = 0; // размытие тени
            canv.x.shadowColor = 'none'; // цвет тени
            canv.x.shadowOffsetX = 0; // смещение тени по горизонтали
            canv.x.shadowOffsetY = 0; // смещение тени по вертикали
            canv.x.lineWidth = 0; // толщина линий для обводки
            canv.x.textBaseline = 'alphabet'; // способ выравнивания текста по вертикали
            canv.x.textAlign = 'left';
        
            canv.x.clearRect(0, 0, canv.width, canv.height);
            this.styleSet(canv.x);
        
            canv.x.save();
            canv.x.translate(100,100);
            canv.x.beginPath();
            canv.x.rect(0, 0, 100, 100);
            canv.x.fill();
            if (this.styleobj.stroke) {
                canv.x.stroke();
            }
            canv.x.restore();
        
            canv.x.save();
            canv.x.translate(300,100);
            canv.x.beginPath();
            canv.x.arc(50, 50, 50, 0, 2 * Math.PI);
            canv.x.closePath();
            canv.x.fill();
            if (this.styleobj.stroke) {
                canv.x.stroke();
            }
            canv.x.restore();
        
        
            canv.x.save();
            canv.x.translate(canv.width / 2, 300);
            canv.x.fillText(languageJSON.styleview.testtext, 0, 0);
            if (this.styleobj.stroke) {
                canv.x.strokeText(languageJSON.styleview.testtext, 0, 0);
            }
            canv.x.restore();
        };
        this.styleSet = function (cx) {
            if (this.styleobj.font) {
                cx.font = this.styleobj.font.size + 'px ' + this.styleobj.font.family;
                cx.textBaseline = this.styleobj.font.valign;
                cx.textAlign = this.styleobj.font.halign;
            }
            if (this.styleobj.fill) {
                if (this.styleobj.fill.type == 0) {
                    cx.fillStyle = this.styleobj.fill.color;
                } else if (this.styleobj.fill.type == 1) {
                    var grad;
                    if (!this.styleobj.fill.gradsize) {
                        this.styleobj.fill.gradsize = 50;
                        this.styleobj.fill.color1 = '#fff';
                        this.styleobj.fill.color2 = '#000';
                    }
                    if (this.styleobj.fill.gradtype == 0) {
                        grad = canv.x.createRadialGradient(
                            this.styleobj.fill.gradsize,
                            this.styleobj.fill.gradsize,
                            0,
                            this.styleobj.fill.gradsize,
                            this.styleobj.fill.gradsize,
                            this.styleobj.fill.gradsize);
                    } else if (this.styleobj.fill.gradtype == 1) {
                        grad = canv.x.createLinearGradient(0, 0, 0, this.styleobj.fill.gradsize);
                    } else {
                        grad = cx.createLinearGradient(0, 0, this.styleobj.fill.gradsize, 0);
                    }
                    grad.addColorStop(0, this.styleobj.fill.color1);
                    grad.addColorStop(1, this.styleobj.fill.color2);
                    cx.fillStyle = grad;
                } else if (this.styleobj.fill.type == 2) {
                    if (this.styleobj.fill.patname != '') {
                        var imga = document.createElement('img');
                        imga.onload = function () {
                            this.styleRedrawPreview();
                        }
                        for (var i = 0; i < currentProject.graphs.length; i++) {
                            if (currentProject.graphs[i].name == this.styleobj.fill.patname) {
                                cx.img = imga;
                                imga.src = sessionStorage.projdir + '/img/' + currentProject.graphs[i].origname;
                                break;
                            }
                        }
                    }
                    cx.fillStyle = '#fff';
                }
            }
            if (this.styleobj.stroke) {
                cx.strokeStyle = this.styleobj.stroke.color;
                cx.lineWidth = this.styleobj.stroke.weight;
            }
            if (this.styleobj.shadow) {
                cx.shadowColor = this.styleobj.shadow.color;
                cx.shadowBlur = this.styleobj.shadow.blur;
                cx.shadowOffsetX = this.styleobj.shadow.x;
                cx.shadowOffsetY = this.styleobj.shadow.y;
            }
        };
        // генерация превьюхи стиля
        this.styleRedrawPreview = () => {
            var canv = this.refs.canvas;
            canv.x.fillStyle = canv.x.createPattern(canv.x.img, 'repeat');
            canv.x.clearRect(0, 0, canv.width, canv.height);
            canv.x.beginPath();
            canv.x.rect(100, 100, 100, 100);
            canv.x.fill();
            if (this.style.stroke) {
                canv.x.stroke();
            }
            canv.x.beginPath();
            canv.x.arc(350, 150, 50, 0, 2 * Math.PI);
            canv.x.closePath();
            canv.x.fill();
            if (this.style.stroke) {
                canv.x.stroke();
            }
            canv.x.fillText(window.languageJSON.styleview.testtext, canv.width / 2, 300);
            if (this.style.stroke) {
                canv.x.strokeText(window.languageJSON.styleview.testtext, canv.width / 2, 300);
            }
        };
        this.styleSave = function() {
            this.styleGenPreview();
            this.fillStyles();
        };
        this.styleFindPattern = e => {
            this.selectingGraphic = true;
            this.update();
            this.refs.graphicselector.onselect = graph => {
                this.style.fill.patname = graph.name;
                this.selectingGraphic = false;
                this.update();
            };
        };

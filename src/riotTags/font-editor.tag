font-editor.panel.view
    .panel.pad.left.tall.flexfix
        .flexfix-body
            fieldset
                label.block
                    b {voc.typefacename}
                    br
                    input.wide(type="text" onchange="{wire('this.fontobj.typefaceName')}" value="{fontobj.typefaceName}")
                label.block
                    b {voc.fontweight}
                    br
                    select(value="{fontobj.weight}" onchange="{wire('this.fontobj.weight')}")
                        each val in [100, 200, 300, 400, 500, 600, 700, 800, 900]
                            option(value=val)= val
                label.checkbox
                    input(type="checkbox" checked="{fontobj.italic}" onchange="{wire('this.fontobj.italic')}")
                    b {voc.italic}
            fieldset
                label.checkbox
                    input(type="checkbox" checked="{fontobj.bitmapFont}" onchange="{wire('this.fontobj.bitmapFont')}")
                    b {voc.generateBitmapFont}
                h3(if="{fontobj.bitmapFont}") {voc.bitmapFont}
                fieldset(if="{fontobj.bitmapFont}")
                    label.block
                        b {voc.bitmapFontSize}
                        br
                        input.wide(value="{fontobj.bitmapFontSize || 16}" onchange="{wire('this.fontobj.bitmapFontSize')}" type="number" min="1" max="144")
                    label.block
                        b {voc.bitmapFontLineHeight}
                        br
                        input.wide(value="{fontobj.bitmapFontLineHeight || 18}" onchange="{wire('this.fontobj.bitmapFontLineHeight')}" type="number" min="1" max="300")
                    .block
                        b {voc.charset}
                        label.checkbox(each="{val in charsetOptions}")
                            input(
                                type="checkbox" value="{val}"
                                checked="{fontobj.charsets.indexOf(val) !== -1}"
                                onchange="{toggleCharset}"
                            )
                            |
                            | {voc.charsets[val]}
                    label.block(if="{fontobj.charsets.indexOf('custom') !== -1}")
                        textarea.wide(
                            value="{fontobj.customCharset}"
                            onchange="{wire('this.fontobj.customCharset')}"
                        )
                    h3 {voc.resultingBitmapFontName}
                    copy-icon.toright(text="{fontobj.typefaceName}_{fontobj.weight}{fontobj.italic? '_Italic' : ''}")
                    code {fontobj.typefaceName}_{fontobj.weight}{fontobj.italic? '_Italic' : ''}
                    .clear
        .flexfix-footer
            button.wide(onclick="{fontSave}")
                svg.feather
                    use(xlink:href="data/icons.svg#check")
                span {vocGlob.apply}
    .right.tall(style="font-weight: {fontobj.weight}; font-style: {fontobj.italic? 'italic' : 'normal'}")
        each val in [8, 9, 10, 11, 12, 14, 16, 21, 24, 32, 48, 60, 72]
            p(style=`font-size: ${val}px; line-height: ${val}px; font-family: 'CTPROJFONT{fontobj.typefaceName}';` data-size=val) A quick blue cat jumps over the lazy frog. 0123456789
    script.
        this.namespace = 'fontview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.fontobj = this.opts.fontobj;

        this.charsetOptions = ['punctuation', 'basicLatin', 'latinExtended', 'cyrillic', 'greekCoptic', 'custom', 'allInFont'];

        this.toggleCharset = e => {
            const {charsets} = this.fontobj;
            const ind = charsets.indexOf(e.item.val);
            if (ind === -1) {
                if (e.item.val === 'allInFont' ||
                    charsets.indexOf('allInFont') !== -1) {
                    charsets.length = 0;
                }
                charsets.push(e.item.val);
            } else {
                charsets.splice(ind, 1);
            }
        };

        this.oldTypefaceName = this.fontobj.typefaceName;
        this.fontSave = () => {
            this.parent.editingFont = false;
            this.parent.update();
            this.parent.loadFonts();
        };
        this.on('update', () => {
            for (const font of document.fonts) {
                if (font.family === 'CTPROJFONT' + this.oldTypefaceName) {
                    this.oldTypefaceName = this.fontobj.typefaceName;
                    font.family = this.fontobj.typefaceName;
                    font.style = this.fontobj.italic ? 'italic' : 'normal';
                    font.weight = this.fontobj.weight;
                    this.parent.loadFonts();
                    break;
                }
            }
        });

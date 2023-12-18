font-editor.aPanel.aView(class="{opts.class}")
    .aPanel.pad.left.tall.flexfix
        .flexfix-body
            fieldset
                label.block
                    b {voc.typefaceName}
                    br
                    input.wide(type="text" onchange="{wire('asset.typefaceName')}" value="{asset.typefaceName}")
                label.block
                    b {voc.fontWeight}
                    br
                    select(value="{asset.weight}" onchange="{wire('asset.weight')}")
                        each val in [100, 200, 300, 400, 500, 600, 700, 800, 900]
                            option(value=val)= val
                label.checkbox
                    input(type="checkbox" checked="{asset.italic}" onchange="{wire('asset.italic')}")
                    b {voc.italic}
            fieldset
                label.checkbox
                    input(type="checkbox" checked="{asset.bitmapFont}" onchange="{wire('asset.bitmapFont')}")
                    b {voc.generateBitmapFont}
                h3(if="{asset.bitmapFont}") {voc.bitmapFont}
                fieldset(if="{asset.bitmapFont}")
                    label.block
                        b {voc.bitmapFontSize}
                        br
                        input.wide(value="{asset.bitmapFontSize || 16}" onchange="{wire('asset.bitmapFontSize')}" type="number" min="1" max="144")
                    label.block
                        b {voc.bitmapFontLineHeight}
                        br
                        input.wide(value="{asset.bitmapFontLineHeight || 18}" onchange="{wire('asset.bitmapFontLineHeight')}" type="number" min="1" max="300")
                    .block
                        b {voc.charset}
                        label.checkbox(each="{val in charsetOptions}")
                            input(
                                type="checkbox" value="{val}"
                                checked="{asset.charsets.indexOf(val) !== -1}"
                                onchange="{toggleCharset}"
                            )
                            |
                            | {voc.charsets[val]}
                    label.block(if="{asset.charsets.indexOf('custom') !== -1}")
                        textarea.wide(
                            value="{asset.customCharset}"
                            onchange="{wire('asset.customCharset')}"
                        )
                    h3 {voc.resultingBitmapFontName}
                    copy-icon.toright(text="{asset.typefaceName}_{asset.weight}{asset.italic? '_Italic' : ''}")
                    code {asset.typefaceName}_{asset.weight}{asset.italic? '_Italic' : ''}
                    .clear
        .flexfix-footer
            button.wide(onclick="{fontSave}")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}
    .right.tall(style="font-weight: {asset.weight}; font-style: {asset.italic? 'italic' : 'normal'}")
        each val in [8, 9, 10, 11, 12, 14, 16, 21, 24, 32, 48, 60, 72]
            p(style=`font-size: ${val}px; line-height: ${val}px; font-family: 'CTPROJFONT{asset.typefaceName}';` data-size=val) A quick blue cat jumps over the lazy frog. 0123456789
    script.
        this.namespace = 'fontView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        this.charsetOptions = ['punctuation', 'basicLatin', 'latinExtended', 'cyrillic', 'greekCoptic', 'custom', 'allInFont'];

        this.toggleCharset = e => {
            const {charsets} = this.asset;
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

        this.refreshFonts = require('./data/node_requires/resources/fonts').refreshFonts;

        this.oldTypefaceName = this.asset.typefaceName;
        this.saveAsset = () => {
            this.writeChanges();
            this.refreshFonts();
        };
        this.fontSave = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };
        this.on('update', () => {
            for (const font of document.fonts) {
                if (font.family === 'CTPROJFONT' + this.oldTypefaceName) {
                    this.oldTypefaceName = this.asset.typefaceName;
                    font.family = this.asset.typefaceName;
                    font.style = this.asset.italic ? 'italic' : 'normal';
                    font.weight = this.asset.weight;
                    this.refreshFonts();
                    break;
                }
            }
        });

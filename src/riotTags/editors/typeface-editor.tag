typeface-editor.aPanel.aView(class="{opts.class}")
    .aPanel.pad.left.tall.flexfix
        .flexfix-body
            fieldset
                label.block
                    b {voc.typefaceName}
                    br
                    input.wide(type="text" onchange="{wire('asset.name')}" value="{asset.name}")
            fieldset
                label.checkbox
                    input(type="checkbox" checked="{asset.bitmapFont}" onchange="{wire('asset.bitmapFont')}")
                    b {voc.generateBitmapFont}
                label.checkbox(if="{asset.bitmapFont}")
                    input(type="checkbox" checked="{asset.bitmapPrecision}" onchange="{wire('asset.bitmapPrecision')}")
                    b {voc.pixelPerfect}
                    hover-hint(text="{voc.pixelPerfectTooltip}")
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
                    .clear
        .flexfix-footer
            button.wide(onclick="{applyChanges}")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}
    .right.tall
        .aFont(each="{font, ind in asset.fonts}")
            .aFont-Settings
                label.block
                    b {voc.fontWeight}
                    select(value="{font.weight}" onchange="{wire('asset.fonts.'+ind+'.weight')}")
                        each val in [100, 200, 300, 400, 500, 600, 700, 800, 900]
                            option(value=val)= val
                label.checkbox
                    input(type="checkbox" checked="{font.italic}" onchange="{wire('asset.fonts.'+ind+'.italic')}")
                    b {voc.italic}
                .dim.small {font.origname}
                .aSpacer
                button.inline.small(onclick="{deleteFont}")
                    svg.feather
                        use(xlink:href="#trash")
                    span {vocGlob.delete}
            p.aFontSample(style="font-family: '{getFontDomName(font)}';")
                | A quick blue cat jumps over the lazy frog. 0123456789!?
        button.success(onclick="{importFont}")
            svg.feather
                use(xlink:href="#plus")
            span {voc.addFont}
    script.
        const {os} = Neutralino;

        this.namespace = 'fontView';
        this.mixin(require('src/lib/riotMixins/voc').default);
        this.mixin(require('src/lib/riotMixins/wire').default);
        this.mixin(require('src/lib/riotMixins/discardio').default);

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

        const typefacesAPI = require('src/lib/resources/typefaces');
        const previews = require('src/lib/resources/preview/typeface').TypefacePreviewer;
        this.getFontDomName = typefacesAPI.getFontDomName;

        this.oldTypefaceName = this.asset.name;
        this.saveAsset = async () => {
            this.writeChanges();
            typefacesAPI.refreshFonts();
            await previews.save(this.asset);
        };
        this.applyChanges = async () => {
            await this.saveAsset();
            this.opts.ondone(this.asset);
        };
        typefacesAPI.refreshFonts().then(() => {
            this.update();
        });

        this.deleteFont = e => {
            const {font} = e.item;
            this.asset.fonts.splice(this.asset.fonts.indexOf(font));
        };
        this.importFont = async e => {
            e.preventUpdate = true;
            const reply = await os.showOpenDialog(this.voc.addFont, {
                multiSelections: true,
                filters: [{
                    name: 'TrueType fonts',
                    extensions: ['ttf']
                }]
            });
            if (!reply || !reply.length) {
                return;
            }
            await Promise.all(reply.map(filepath => typefacesAPI.addFont(this.asset, filepath)));
            await typefacesAPI.refreshFonts();
            this.update();
        };

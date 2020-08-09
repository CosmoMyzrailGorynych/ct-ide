//
    A modal window that allows to pick an arbitrary color, or pick them
    from user-created swatches.

    @attribute onchanged (riot function)
        Called when a color has changed by a user, but not yet applied.
        Passes a HEX/RGBA color as a first argument and 'onchanged' as a second one.
    @attribute onapply (riot function)
        Called when a user presses the "Apply" button.
        Passes a HEX/RGBA color as a first argument and 'onapply' as a second one.
    @attribute oncancel (riot function)
        Called when a user presses the "Cancel" button.
        Passes a HEX/RGBA color as a first argument and 'oncancel' as a second one.

    @attribute hidealpha (atomic)
        Disables alpha input.

color-picker
    .panel(ref="widget")
        .color-picker-aBackgroundToggler
        .color-picker-aBackgoundWell.flexrow
            .c6.swatch(style="background-color: {oldColor.toString()};")
                span(style="color: {oldColor.getLuminance() < 0.5? 'white' : 'black'};") {voc.old}
            span &nbsp;
            .c6.swatch(style="background-color: {color.toString()};")
                span(style="color: {color.getLuminance() < 0.5? 'white' : 'black'};") {voc.current}
        .c6.npt.npl.npb
            h4.nmt {voc.globalPalette}
            .Swatches(ref="globalSwatches")
                .aSwatch(each="{colr in globalPalette}" style="background-color: {colr};" onclick="{onSwatchClick}")
                button.anAddSwatchButton(onclick="{addAsGlobal}")
                    | +
            h4 {voc.projectPalette}
            .Swatches(ref="localSwatches")
                .aSwatch(each="{colr in global.currentProject.palette}" style="background-color: {colr};" onclick="{onSwatchClick}")
                button.anAddSwatchButton(onclick="{addAsLocal}")
                    | +
        .c6.npt.npr.npb
            .flexrow
                .aRangePipeStack
                    .pipe.huebar
                    .pipe(style="background-color: rgba(255, 255, 255, {1 - color.getSaturation()});")
                    .pipe(style="background-color: rgba(0, 0, 0, {1 - color.getValue()});")
                    input.transparent(type="range" value="{color.getHue()}" min="0" max="359" onchange="{updateHue}" oninput="{updateHue}")
                input.short(type="number" min="0" max="359" value="{color.getHue()}" onchange="{updateHue}")
            .flexrow
                .aRangePipeStack
                    .pipe(style="background: linear-gradient(to right, {color.setAlpha(1).desaturateByRatio(1).toCSS()} 0%, {color.setAlpha(1).saturateByAmount(1).toCSS()} 100%)")
                    input.transparent(type="range" value="{~~(color.getSaturation() * 100)}" min="0" max="100" onchange="{updateSaturation}" oninput="{updateSaturation}")
                input.short(type="number" min="0" max="100" value="{~~(color.getSaturation() * 100)}" onchange="{updateSaturation}")
            .flexrow
                .aRangePipeStack
                    .pipe(style="background: linear-gradient(to right, {color.setAlpha(1).devalueByRatio(1).toCSS()} 0%, {color.setAlpha(1).valueByAmount(1).toCSS()} 100%)")
                    input.transparent(type="range" value="{~~(color.getValue() * 100)}" min="0" max="100" onchange="{updateValue}" oninput="{updateValue}")
                input.short(type="number" min="0" max="100" value="{~~(color.getValue() * 100)}" onchange="{updateValue}")
            .flexrow(hide="{opts.hidealpha}")
                .aRangePipeStack
                    .pipe.alphabar
                    .pipe(style="background: linear-gradient(to right, transparent 0%, {color.setAlpha(1).toCSS()} 100%)")
                    input.transparent(type="range" value="{~~(color.getAlpha() * 100)}" min="0" max="100" onchange="{updateAlpha}" oninput="{updateAlpha}")
                input.short(type="number" min="0" max="100" value="{~~(color.getAlpha() * 100)}" onchange="{updateAlpha}")

            input.wide(type="text" ref="colorValue" value="{color.toString()}" onchange="{tryInputColor}")
        .clear
        .flexrow.color-picker-Buttons
            button.nml(onclick="{cancelColor}")
                svg.feather
                    use(xlink:href="data/icons.svg#x")
                span  {vocGlob.cancel}
            button.nmr(onclick="{applyColor}")
                svg.feather
                    use(xlink:href="data/icons.svg#apply")
                span  {vocGlob.apply}
    script.
        /* global net */
        const brehautColor = net.brehaut.Color;
        this.namespace = 'colorPicker';
        this.mixin(window.riotVoc);

        this.loadColor = color => {
            this.color = brehautColor(color);
            this.color = this.color.setValue(this.color.getValue());
            this.oldColor = brehautColor(color);
        };
        this.loadColor(this.opts.color || '#ffffff');

        if (!('palette' in global.currentProject)) {
            global.currentProject.palette = [];
        }
        if ('globalPalette' in window.localStorage) {
            this.globalPalette = JSON.parse(localStorage.globalPalette);
        } else {
            this.globalPalette = [];
            localStorage.globalPalette = JSON.stringify(this.globalPalette);
        }

        this.getColor = () => this.color.toString();

        this.updateHue = e => {
            this.color = this.color.setHue(e.target.value);
            this.notifyUpdates();
            e.stopPropagation();
        };
        this.updateSaturation = e => {
            this.color = this.color.setSaturation(e.target.value / 100);
            this.notifyUpdates();
            e.stopPropagation();
        };
        this.updateValue = e => {
            this.color = this.color.setValue(e.target.value / 100);
            this.notifyUpdates();
            e.stopPropagation();
        };
        this.updateAlpha = e => {
            this.color = this.color.setAlpha(e.target.value / 100);
            this.notifyUpdates();
            e.stopPropagation();
        };
        this.tryInputColor = e => {
            this.color = brehautColor(e.target.value);
            this.notifyUpdates();
            e.stopPropagation();
        };

        this.onSwatchClick = e => {
            if (e.ctrlKey) { // deletes a swatch
                if (e.target.parentNode === this.refs.localSwatches) {
                    const ind = global.currentProject.palette.indexOf(e.item.colr);
                    global.currentProject.palette.splice(ind, 1);
                } else {
                    this.globalPalette.splice(this.globalPalette.indexOf(e.item.colr), 1);
                    localStorage.globalPalette = JSON.stringify(this.globalPalette);
                }
            } else {
                this.color = brehautColor(e.item.colr);
                this.notifyUpdates();
            }
        };
        this.addAsGlobal = () => {
            this.globalPalette.push(this.color.toString());
            localStorage.globalPalette = JSON.stringify(this.globalPalette);
        };
        this.addAsLocal = () => {
            global.currentProject.palette.push(this.color.toString());
        };

        this.notifyUpdates = () => {
            this.dark = this.color.getLuminance() < 0.5;
            if (this.opts.onchanged) {
                this.opts.onchanged(this.color.toString(), 'onchanged');
            }
        };
        this.applyColor = () => {
            this.dark = this.color.getLuminance() < 0.5;
            if (this.opts.onapply) {
                this.opts.onapply(this.color.toString(), 'onapply');
            }
        };
        this.cancelColor = () => {
            if (this.opts.oncancel) {
                this.opts.oncancel(this.color.toString(), 'oncancel');
            }
        };
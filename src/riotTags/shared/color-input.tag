//
    An input block that allows to pick an arbitrary color with a color picker

    @attribute onapply (riot function)
        Calls the funtion when a user applies the selected color and closes the color picker.
        Passes an object `{target: RiotTag}` as one argument and a value (an rgba/HEX string).
    @attribute onchange (riot function)
        Calls the funtion when a user changes the color while working with the color picker.
        Passes an object `{target: RiotTag}` as one argument and a value (an rgba/HEX string).

    @attribute hidealpha (atomic)
        Passed as is to color-picker. Disables alpha input.

color-input
    .color-input-aPicker(style="background-color: {value};" onclick="{openPicker}")
        span(style="color: {dark? '#fff' : '#000'};") {value}
    color-picker(
        ref="colorPicker" if="{opened}"
        color="{value}" hidealpha="{opts.hidealpha}"
        onapply="{applyColor}" onchanged="{changeColor}" oncancel="{cancelColor}"
    )
    script.
        /* global net */
        const brehautColor = net.brehaut.Color;
        this.opened = false;
        this.value = this.lastValue = this.opts.color || '#FFFFFF';
        this.dark = brehautColor(this.value).getLuminance() < 0.5;
        this.openPicker = () => {
            this.opened = !this.opened;
        };
        this.changeColor = color => {
            this.value = color;
            this.dark = this.refs.colorPicker.dark;
            if (this.opts.onchange) {
                this.opts.onchange({
                    target: this
                }, this.value);
            }
            this.update();
        };
        this.applyColor = color => {
            this.value = color;
            this.dark = this.refs.colorPicker.dark;
            if (this.opts.onapply) {
                this.opts.onapply({
                    target: this
                }, this.value);
            }
            if (this.opts.onchange) {
                this.opts.onchange({
                    target: this
                }, this.value);
            }
            this.opened = false;
            this.update();
        };
        this.cancelColor = () => {
            this.opened = false;
            this.update();
        };
        this.on('update', () => {
            if (this.lastValue !== this.opts.color) {
                this.value = this.lastValue = this.opts.color || '#FFFFFF';
            }
        });
color-input
    .color-input-aPicker(style="background-color: {value};" onclick="{openPicker}")
        span(style="color: {dark? '#fff' : '#000'};") {value}
    color-picker(
        ref="colorPicker" if="{opened}"
        color="{value}" onapply="{applyColor}" onchanged="{changeColor}" oncancel="{cancelColor}"
    )
    script.
        this.opened = false;
        this.value = this.lastValue = this.opts.color || '#FFFFFF'; 
        this.openPicker = e => {
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
            if (this.lastValue != this.opts.color) {
                this.value = this.lastValue = this.opts.color || '#FFFFFF';
            }
        });
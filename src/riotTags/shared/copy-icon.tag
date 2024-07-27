//
    Displays a little inline icon that copies a defined string on click. That's it.

    @attribute text (string)
        The text to copy

copy-icon(onclick="{copy}")
    svg.feather.a(class="{success: copied}")
        use(xlink:href="#{copied ? 'check' : 'copy'}")
    script.
        const defaultText = 'There should have been some useful text, but something wrong happened. Please report about it.';
        this.copy = () => {
            const {clipboard} = require('@neutralinojs/lib');
            clipboard.writeText(this.opts.text || defaultText);
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
                this.update();
            }, 1000);
        };

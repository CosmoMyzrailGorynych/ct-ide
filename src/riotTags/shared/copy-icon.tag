//
    Displays a little inline icon that copies a defined string on click. That's it.

    @attribute text (string)
        The text to copy

copy-icon(onclick="{copy}")
    svg.feather.a(class="{success: copied}")
        use(xlink:href="data/icons.svg#{copied ? 'check' : 'copy'}")
    script.
        const defaultText = 'There should have been some useful text, but something wrong happened. Please report about it.';
        this.copy = () => {
            nw.Clipboard.get().set(this.opts.text || defaultText, 'text');
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
                this.update();
            }, 1000);
        };
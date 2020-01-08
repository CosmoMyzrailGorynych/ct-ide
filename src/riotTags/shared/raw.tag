//
    An utility tag mostly used for displaying postprocessed stuff like rendered markdown.
    Yields a passed static/templated html as is.

    @attribute content (string)
        The HTML to display.

raw
    span
    script.
        this.root.innerHTML = this.oldContent = this.opts.content;
        this.on('update', () => {
            if (this.oldContent !== this.opts.content) {
                this.root.innerHTML = this.oldContent = this.opts.content;
            }
        });

raw
    span
    script.
        this.root.innerHTML = this.oldContent = this.opts.content;
        this.on('update', () => {
            if (this.oldContent !== this.opts.content) {
                this.root.innerHTML = this.oldContent = this.opts.content;
            }
        });

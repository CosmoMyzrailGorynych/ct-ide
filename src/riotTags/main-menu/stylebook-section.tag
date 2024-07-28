stylebook-section
    h2 {opts.heading}
    yield(from="description")
    .flexrow
        .fifty.npl
            .aPanel.pad(ref="example" class="{stripedbg: opts.stripedbg}")
                yield(from="example")
        pre.fifty
            code.language-pug(ref="codeblock")
                | {pugified}
        .aSpacer
        copy-icon.nogrow(text="{pugified}")
    script.
        const hljs = require('highlight.js');
        require('src/node_requires/highlightjs-pug')(hljs);
        const pugifyOptions = {
            fragment: true,
            commas: false,
            doubleQuotes: true,
            preserveLineBreaks: false
        };
        this.on('mount', () => {
            setTimeout(() => {
                this.update();
            }, 0);
        });
        this.on('update', () => {
            // TODO:
            this.refs.codeblock.innerHTML = 'NOT AVAILABLE FOR NOW';
        });

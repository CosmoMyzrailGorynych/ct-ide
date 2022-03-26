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
        const html2pug = require('html2pug');
        const hljs = require('highlight.js');
        require('./data/node_requires/highlightjs-pug')(hljs);
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
            this.pugified = html2pug(this.refs.example.innerHTML, pugifyOptions);
            this.pugified = this.pugified.replace(/^(( {2})+)/gm, '$1$1');
            this.refs.codeblock.innerHTML = hljs.highlight('pug', this.pugified).value;
        });

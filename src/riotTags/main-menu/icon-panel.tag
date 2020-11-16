icon-panel.view.pad
    .toright
        button(onclick="{opts.onclose}") {vocGlob.close}
    .clear
    ul.cards
        li(
            each="{icon in iconList}"
            onclick="{copy(icon)}"
            no-reorder
        )
            span {icon}
            svg.feather
                use(xlink:href="data/icons.svg#{icon}")
    script.
        this.namespace = 'common';
        this.mixin(window.riotVoc);

        const fs = require('fs-extra');
        fs.readJSON('./data/icons.json')
        .then(json => {
            this.iconList = json;
            this.update();
        });

        this.copy = string => () => {
            nw.Clipboard.get().set(string);
            alertify.success('Copied!');
        };
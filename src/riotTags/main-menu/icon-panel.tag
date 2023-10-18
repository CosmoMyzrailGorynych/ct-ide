icon-panel.aView.pad
    .toright
        button(onclick="{opts.onclose}") {vocGlob.close}
    .clear
    ul.Cards
        li.aCard(
            each="{icon in iconList}"
            onclick="{copy(icon)}"
            no-reorder
        )
            .aCard-aThumbnail
                svg.feather
                    use(xlink:href="#{icon}")
            .aCard-Properties
                span {icon}
    script.
        this.namespace = 'common';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

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

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
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        const fs = require('src/node_requires/neutralino-fs-extra');
        fs.readJSON('./data/icons.json')
        .then(json => {
            this.iconList = json;
            this.update();
        });

        this.copy = string => async () => {
            const {clipboard} = require('@neutralinojs/lib');
            await clipboard.writeText(string);
            alertify.success('Copied!');
        };

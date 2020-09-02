icon-panel.view.pad
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
        const fs = require('fs-extra');
        fs.readJSON('./data/icons.json')
        .then(json => {
            this.iconList = json;
            this.update();
        });

        this.copy = string => () => {
            nw.Clipboard.get().set(string);
        };
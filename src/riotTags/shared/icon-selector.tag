//
    Allows users to pick a texture object. May return `-1` as an empty texture,
    if an attribute `showempty` is set.

    @attribute header (any string or empty)
        An optional header shown in the top-left corner
    @attribute onselected (riot function)
        A two-fold function (texture => e => {…}).
        Calls the funtion with the selected icon as its argument (a string).
    @attribute oncancelled (riot function)
        Calls the funtion when a user presses the "Cancel" button. Passes no arguments.

icon-selector.aView.pad
    .toright
        button(onclick="{opts.oncancelled}") {vocGlob.cancel}
    h1(if="{opts.header}") {opts.header}
    .clear
    ul.Cards
        li.aCard(
            each="{icon in iconList}"
            onclick="{parent.opts.onselected(icon)}"
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

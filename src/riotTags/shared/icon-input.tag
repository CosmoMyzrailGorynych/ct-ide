//
    A button that allows to pick an svg icon from the set that is used in ct.IDE.

    @attribute val (icon's name)
        Current input's value
    @attribute header (string)
        Passed to the template selector, showing a header in the top-left corner.
    @attribute onselected (riot function)
        A callback that is called when an icon is selected.
        Passes the icon's name (a string).
icon-input
    button(onclick="{openSelector}" title="{voc.changeTexture}")
        svg.feather
            use(xlink:href="#{val}")
        span {vocGlob.select}
    icon-selector(
        if="{selectingIcon}"
        onselected="{onSelected}"
        oncancelled="{onCancelled}"
        header="{opts.header}"
    )
    script.
        this.namespace = 'common';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.val = this.opts.val || 'x';
        this.openSelector = () => {
            this.selectingIcon = true;
        };
        this.onSelected = icon => () => {
            if (this.opts.onselected) {
                this.opts.onselected(icon);
            }
            this.val = icon;
            this.selectingIcon = false;
            this.update();
        };
        this.onCancelled = () => {
            this.selectingIcon = false;
            this.update();
        };

        this.on('update', () => {
            if (this.val !== this.opts.val) {
                this.val = this.opts.val;
            }
        });

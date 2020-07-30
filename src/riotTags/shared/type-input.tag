//
    A button that allows to pick a ct.js type, showing current selection's miniature.

    @attribute showempty (any string or empty)
        If set, allows to pick no type.
    @attribute val (type's uid or -1)
        Current input's value
    @attribute header (string)
        Passed to the type selector, showing a header in the top-left corner.
    @attribute onselected (riot function)
        A callback that is called when a type is selected, or when no type was selected.
        Passes the type's object and its ID as two arguments.
type-input
    .flexrow
        img(src="{getTypePreview(val || -1)}" onclick="{openSelector}")
        input.wide(
            type="text" readonly
            value="{val && val !== -1 ? getTypeFromId(val).name : voc.select}"
            onclick="{openSelector}"
        )
        .spacer(if="{val && val !== -1}")
        button.nmr.square.inline(if="{val && val !== -1}" title="{voc.clear}" onclick="{clearInput}")
            svg.feather
                use(xlink:href="data/icons.svg#x")
    type-selector(
        if="{selectingType}"
        onselected="{onSelected}"
        oncancelled="{onCancelled}"
        header="{opts.header}"
    )
    script.
        this.namespace = 'common';
        this.mixin(window.riotVoc);

        const {getTypePreview, getTypeFromId} = require('./data/node_requires/resources/types');
        this.getTypePreview = getTypePreview;
        this.getTypeFromId = getTypeFromId;

        this.val = this.opts.val || -1;
        this.openSelector = () => {
            this.selectingType = true;
        };
        this.onSelected = type => () => {
            if (this.opts.onselected) {
                this.opts.onselected(type, type.uid);
            }
            this.val = type.uid;
            this.selectingType = false;
            this.update();
        };
        this.clearInput = () => {
            if (this.opts.onselected) {
                this.opts.onselected(null, -1);
            }
            this.val = -1;
        };
        this.onCancelled = () => {
            this.selectingType = false;
            this.update();
        };

        this.on('update', () => {
            if (this.val !== this.opts.val) {
                this.val = this.opts.val;
            }
        });
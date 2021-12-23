//
    A button that allows to pick a ct.js template, showing current selection's miniature.

    @attribute showempty (any string or empty)
        If set, allows to pick no template.
    @attribute val (template's uid or -1)
        Current input's value
    @attribute header (string)
        Passed to the template selector, showing a header in the top-left corner.
    @attribute onselected (riot function)
        A callback that is called when a template is selected, or when no template was selected.
        Passes the template's object and its ID as two arguments.
template-input
    .flexrow
        img(src="{getTemplatePreview(val || -1)}" onclick="{openSelector}")
        input.wide(
            type="text" readonly
            value="{val && val !== -1 ? getTemplateFromId(val).name : voc.select}"
            onclick="{openSelector}"
        )
        .aSpacer(if="{val && val !== -1}")
        button.nmr.square.inline(if="{val && val !== -1}" title="{voc.clear}" onclick="{clearInput}")
            svg.feather
                use(xlink:href="#x")
    template-selector(
        if="{selectingTemplate}"
        onselected="{onSelected}"
        oncancelled="{onCancelled}"
        header="{opts.header}"
    )
    script.
        this.namespace = 'common';
        this.mixin(window.riotVoc);

        const {getTemplatePreview, getTemplateFromId} = require('./data/node_requires/resources/templates');
        this.getTemplatePreview = getTemplatePreview;
        this.getTemplateFromId = getTemplateFromId;

        this.val = this.opts.val || -1;
        this.openSelector = () => {
            this.selectingTemplate = true;
        };
        this.onSelected = template => () => {
            if (this.opts.onselected) {
                this.opts.onselected(template, template.uid);
            }
            this.val = template.uid;
            this.selectingTemplate = false;
            this.update();
        };
        this.clearInput = () => {
            if (this.opts.onselected) {
                this.opts.onselected(null, -1);
            }
            this.val = -1;
        };
        this.onCancelled = () => {
            this.selectingTemplate = false;
            this.update();
        };

        this.on('update', () => {
            if (this.val !== this.opts.val) {
                this.val = this.opts.val;
            }
        });

//
    Allows users to pick a template object.

    @attribute header (any string or empty)
        An optional header shown in the top-left corner
    @attribute onselected (riot function)
        A two-fold function (template => e => {…}). Calls the funtion with the selected
        ct template as the only argument in the first function, and MouseEvent in the second.
    @attribute oncancelled (riot function)
        Calls the funtion when a user presses the "Cancel" button. Passes no arguments.

template-selector.aPanel.aView.flexfix
    .flexfix-body
        asset-viewer(
            collection="{global.currentProject.templates}"
            namespace="templates"
            click="{opts.onselected}"
            thumbnails="{thumbnails}"
            ref="templates"
            class="tall"
        )
            h1(if="{opts.header}") {opts.header}
    .flexfix-footer(if="{opts.oncancelled}")
        button(onclick="{opts.oncancelled}") {window.languageJSON.common.cancel}
    script.
        this.thumbnails = require('./data/node_requires/resources/templates').getTemplatePreview;

//
    Allows users to pick a type object.

    @attribute header (any string or empty)
        An optional header shown in the top-left corner
    @attribute onselected (riot function)
        A two-fold function (type => e => {…}). Calls the funtion with the selected
        ct type as the only argument in the first function, and MouseEvent in the second.
    @attribute oncancelled (riot function)
        Calls the funtion when a user presses the "Cancel" button. Passes no arguments.

type-selector.panel.view.flexfix
    .flexfix-body
        asset-viewer(
            collection="{global.currentProject.types}"
            namespace="types"
            click="{opts.onselected}"
            thumbnails="{thumbnails}"
            ref="types"
            class="tall"
        )
            h1(if="{opts.header}") {opts.header}
    .flexfix-footer(if="{opts.oncancelled}")
        button(onclick="{opts.oncancelled}") {window.languageJSON.common.cancel}
    script.
        this.thumbnails = require('./data/node_requires/resources/types').getTypePreview;

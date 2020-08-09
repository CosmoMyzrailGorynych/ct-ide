//
    Allows users to pick a custom font.

    @attribute header (any string or empty)
        An optional header shown in the top-left corner
    @attribute onselected (riot function)
        A two-fold function (font => e => {…}). Calls the funtion with the selected
        font as the only argument in the first function, and MouseEvent in the second.
    @attribute oncancelled (riot function)
        Calls the funtion when a user presses the "Cancel" button. Passes no arguments.

font-selector.panel.view.flexfix
    .flexfix-body
        asset-viewer(
            collection="{global.currentProject.fonts}"
            namespace="fonts"
            click="{opts.onselected}"
            thumbnails="{thumbnails}"
            names="{names}"
            ref="fonts"
            class="tall"
        )
            h1(if="{opts.header}") {opts.header}
    .flexfix-footer(if="{opts.oncancelled}")
        button(onclick="{opts.oncancelled}") {window.languageJSON.common.cancel}
    script.
        this.thumbnails = font => `file://${window.global.projdir}/fonts/${font.origname}_prev.png?cache=${font.lastmod}`;
        this.names = font => `${font.typefaceName} ${font.weight} ${font.italic ? this.voc.italic : ''}`;

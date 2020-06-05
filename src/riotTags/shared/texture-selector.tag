//
    Allows users to pick a texture object. May return `-1` as an empty texture,
    if an attribute `showempty` is set.

    @attribute showempty (any string or empty)
        If set, allows users to pick an empty texture (to reset texture).
    @attribute header (any string or empty)
        An optional header shown in the top-left corner
    @attribute onselected (riot function)
        A two-fold function (texture => e => {…}). Calls the funtion with the selected
        ct texture as the only argument in the first function, and MouseEvent in the second.
    @attribute oncancelled (riot function)
        Calls the funtion when a user presses the "Cancel" button. Passes no arguments.

texture-selector.panel.view
    .flexfix.tall
        .flexfix-header
            .toleft
                h1(if="{opts.header}") {opts.header}
            .toright
                b {vocGlob.sort}
                button.inline.square(onclick="{switchSort('date')}" class="{selected: sort === 'date' && !searchResults}")
                    svg.feather
                        use(xlink:href="data/icons.svg#clock")
                button.inline.square(onclick="{switchSort('name')}" class="{selected: sort === 'name' && !searchResults}")
                    svg.feather
                        use(xlink:href="data/icons.svg#sort-alphabetically")
                .aSearchWrap
                    input.inline(type="text" onkeyup="{fuseSearch}")
            .clear
        .flexfix-body
            ul.cards
                li(if="{opts.showempty}" onclick="{onselected(-1)}")
                    span {window.languageJSON.common.none}
                    img(src="data/img/notexture.png")
                li(
                    each="{texture in (searchResults? searchResults : textures)}"
                    onclick="{onselected(texture)}"
                    no-reorder
                )
                    span {texture.name}
                    img(src="file://{global.projdir + '/img/' + texture.origname + '_prev.png'}")
        .flexfix-footer(if="{oncancelled}")
            button(onclick="{oncancelled}") {window.languageJSON.common.cancel}
    script.
        this.onselected = this.opts.onselected;
        this.oncancelled = this.opts.oncancelled;
        this.namespace = 'common';
        this.mixin(window.riotVoc);
        this.sort = 'name';
        this.sortReverse = false;
        this.searchResults = false;

        this.updateList = () => {
            this.textures = [...global.currentProject.textures];
            if (this.sort === 'name') {
                this.textures.sort((a, b) => a.name.localeCompare(b.name));
            } else {
                this.textures.sort((a, b) => b.lastmod - a.lastmod);
            }
            if (this.sortReverse) {
                this.textures.reverse();
            }
        };
        this.switchSort = sort => () => {
            if (this.sort === sort) {
                this.sortReverse = !this.sortReverse;
            } else {
                this.sort = sort;
                this.sortReverse = false;
            }
            this.updateList();
        };
        const fuseOptions = {
            shouldSort: true,
            tokenize: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['name']
        };
        const Fuse = require('fuse.js');
        this.fuseSearch = e => {
            if (e.target.value.trim()) {
                var fuse = new Fuse(this.textures, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        this.updateList();

//
    A generic asset viewer with a search form, sorting and switchable layout

    @slot
        Can use nested tags. Yields the passed markup as a header of an asset viewer.

    @attribute class (string)
        This tag has its own CSS classes, but allows arbitrary ones added as an attribute.

    @attribute namespace (string)
        A unique namespace used to store settings. Fallbacks to 'default'.
    @attribute vocspace (string)
        A namespace in the current language file to use for translated tags in a passed slot.
        Not needed if no nested markup was passed to the tag.
        Fallbacks to `namespace` attribute.

    @attribute collection (riot function)
        A collection of items to iterate over while generating markup, sorting and firing events.
    @attribute names (riot function)
        A mapping funtion that takes a collection object and returns its human-readable name.
        Fallbacks to `item.name` if not defined.
    @attribute thumbnails (riot function)
        A mapping funtion that takes a collection object and returns a url for its thumbnail.
    @attribute click (riot function)
        A two-fold callback (item => e => {…}) fired when a user clicks on an item,
        passing the associated collection object as its only argument in the first function,
        and a MouseEvent in a second function
    @attribute contextmenu (riot function)
        A two-fold callback (item => e => {…}) that is given a collection object
        as its only argument in the first function, and a MouseEvent in a second function,
        when a user tries to call a context menu on an item.

    @method updateList()
        Update the asset viewer, needed e.g. when new items were added.

asset-viewer.flexfix(class="{opts.namespace} {opts.class}")
    .flexfix-header
        .toright
            b {vocGlob.sort}
            button.inline.square(
                onclick="{switchSort('date')}"
                class="{selected: sort === 'date' && !searchResults}"
            )
                svg.feather
                    use(xlink:href="data/icons.svg#clock")
            button.inline.square(
                onclick="{switchSort('name')}"
                class="{selected: sort === 'name' && !searchResults}"
            )
                svg.feather
                    use(xlink:href="data/icons.svg#sort-alphabetically")
            .aSearchWrap
                input.inline(type="text" onkeyup="{fuseSearch}")
                svg.feather
                    use(xlink:href="data/icons.svg#search")
            button.inline.square(onclick="{switchLayout}")
                svg.feather
                    use(xlink:href="data/icons.svg#{localStorage[opts.namespace? (opts.namespace+'Layout') : 'defaultAssetLayout'] === 'list'? 'grid' : 'list'}")
        .toleft
            <yield/>
        .clear
    .flexfix-body
        ul.cards(class="{list: localStorage[opts.namespace? (opts.namespace+'Layout') : 'defaultAssetLayout'] === 'list'}")
            li(
                each="{asset in (searchResults? searchResults : collection)}"
                oncontextmenu="{parent.opts.contextmenu && parent.opts.contextmenu(asset)}"
                onlong-press="{parent.opts.contextmenu && parent.opts.contextmenu(asset)}"
                onclick="{parent.opts.click && parent.opts.click(asset)}"
                no-reorder
            )
                span {parent.opts.names? parent.opts.names(asset) : asset.name}
                span.date(if="{asset.lastmod}") {niceTime(asset.lastmod)}
                img(if="{parent.opts.thumbnails}" src="{parent.opts.thumbnails(asset)}")
    script.
        this.namespace = this.opts.vocspace || this.opts.namespace;
        this.mixin(window.riotVoc);
        this.mixin(window.riotNiceTime);
        this.sort = 'name';
        this.sortReverse = false;

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

        this.updateList = () => {
            this.collection = [...(this.opts.collection || [])];
            if (this.sort === 'name') {
                if (this.opts.names) {
                    const accessor = this.opts.names;
                    this.collection.sort((a, b) => accessor(a).localeCompare(accessor(b)));
                } else {
                    this.collection.sort((a, b) => a.name.localeCompare(b.name));
                }
            } else {
                this.collection.sort((a, b) => b.lastmod - a.lastmod);
            }
            if (this.sortReverse) {
                this.collection.reverse();
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
        this.fuseSearch = e => {
            if (e.target.value.trim()) {
                const Fuse = require('fuse.js');
                var fuse = new Fuse(this.collection, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        this.switchLayout = () => {
            const key = this.opts.namespace ? (this.opts.namespace + 'Layout') : 'defaultAssetLayout';
            localStorage[key] = localStorage[key] === 'list' ? 'grid' : 'list';
        };

        this.updateList();

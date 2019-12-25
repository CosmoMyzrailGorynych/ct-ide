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
                this.collection.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            } else {
                this.collection.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
            }
            if (this.sortReverse) {
                this.collection.reverse();
            }
        };
        this.switchSort = sort => e => {
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
        this.switchLayout = e => {
            const key = this.opts.namespace? (this.opts.namespace+'Layout') : 'defaultAssetLayout';
            localStorage[key] = localStorage[key] === 'list'? 'grid' : 'list';
        };
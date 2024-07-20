search-and-recents.aNav(class="{opts.class}")
    li(onclick="{toggleMenu}" data-hotkey="Control+p" role="button" title="{voc.buttonTitle} Ctrl+P")
        svg.feather
            use(href="#search")
    .aDimmer(if="{opened}" onclick="{closeOnOutsideClick}" ref="dimmer")
        .aSearchWrap
            input.wide(
                ref="search"
                type="text" value="{searchVal}"
                oninput="{search}"
                onkeydown="{tryHotkeys}"
                placeholder="{voc.searchHint}"
            )
            svg.feather
                use(href="#search")
        ul.aMenu.aPanel(role="menu" if="{opened}" ref="menu")
            // Search items
            li( role="menuitem" tabindex="0" ref="searchItems"
                if="{searchVal.trim() && searchResults.length}" each="{asset in searchResults}"
                onpointerdown="{openAsset}" onkeydown="{menuKeyDown}"
            )
                svg.feather
                    use(href="#{iconMap[asset.type]}")
                span {asset.name}
                |
                |
                span.small.dim {vocGlob.assetTypes[asset.type][0]}
            li(disabled="disabled" if="{searchVal.trim() && !searchResults.length}").dim {voc.nothingFound}

            // Recent items
            li( role="menuitem" tabindex="0" ref="lastItems"
                onpointerdown="{openAssetById}" onkeydown="{menuKeyDown}"
                if="{!searchVal.trim()}}" each="{uid in recentAssets}"
            )
                svg.feather
                    use(href="#{iconMap[getById(uid).type]}")
                span {getById(uid).name}
                |
                |
                span.small.dim {vocGlob.assetTypes[getById(uid).type][0]}
                .toright.small.dim {voc.recent}
    script.
        const {searchAssets, resourceToIconMap, getById} = require('src/node_requires/resources');
        const {getProjectCodename} = require('src/node_requires/resources/projects');

        this.namespace = 'globalSearch';
        this.mixin(require('src/node_requires/riotMixins/voc').default);
        this.getById = id => getById(null, id);

        this.opened = false;
        this.iconMap = resourceToIconMap;

        this.toggleMenu = e => {
            e.preventDefault();
            this.opened = !this.opened;
            this.searchVal = '';
            if (this.opened) {
                setTimeout(() => {
                    this.refs.search.focus();
                }, 0);
                this.recentAssets = localStorage[`lastOpened_${getProjectCodename()}`] ?
                    JSON.parse(localStorage[`lastOpened_${getProjectCodename()}`]) :
                    [];
            }
        };

        this.search = e => {
            this.searchVal = e.target.value;
            if (this.searchVal.trim()) {
                this.searchResults = searchAssets(this.searchVal.trim());
            }
        };

        this.closeOnOutsideClick = e => {
            if (e.target === this.refs.dimmer) {
                this.opened = false;
            }
        };

        this.tryHotkeys = e => {
            if (e.key === 'Escape') {
                this.opened = false;
            } else if (e.key === 'Enter') {
                if (this.searchVal.trim() && this.searchResults.length) {
                    this.opened = false;
                    window.orders.trigger('openAsset', this.searchResults[0].uid);
                } else if (this.recentAssets.length) {
                    this.opened = false;
                    window.orders.trigger('openAsset', this.recentAssets[0].uid);
                }
            } else if (e.key === 'ArrowDown') {
                const refs = this.refs.searchItems ?? this.refs.lastItems;
                const items = Array.isArray(refs) ? refs : [refs];
                if (items.length) {
                    items[0].focus();
                }
            }
        };
        this.openAsset = e => {
            const {asset, uid} = e.item;
            this.opened = false;
            window.orders.trigger('openAsset', asset?.uid ?? uid);
        };

        // Events happening while navigating the menu items with keyboard
        this.menuKeyDown = e => {
            if (e.code === 'Enter' || e.code === 'Space') {
                const {asset, uid} = e.item;
                this.opened = false;
                window.orders.trigger('openAsset', asset?.uid ?? uid);
            } else if (e.code === 'ArrowRight') {
                const {asset, uid} = e.item;
                window.orders.trigger('openAsset', asset?.uid ?? uid);
            } else if (e.code === 'ArrowUp') {
                const current = this.root.querySelector(':focus');
                if (current.previousElementSibling) {
                    current.previousElementSibling.focus();
                } else {
                    this.refs.search.select();
                }
                e.preventDefault();
            } else if (e.code === 'ArrowDown') {
                const current = this.root.querySelector(':focus');
                if (current.nextElementSibling) {
                    current.nextElementSibling.focus();
                }
                e.preventDefault();
            } else if (e.code !== 'Tab' && e.code !== 'ShiftLeft' && e.code !== 'ShiftRight') {
                // Shift & Tab are used to navigate the keyboard focus
                this.opened = false;
                this.parent.update();
            }
        };

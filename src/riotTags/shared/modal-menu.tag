//
    A cousin of the context-menu tag that supports the same menu structure
    but is intended for two-level menus only, providing a more usable and visual layout.

    It doesn't support checkbox entries or clicking on top-level entries.

    @attribute [title] (string)
        An optional title that is shown above all the submenus.
    @attribute [enablesearch] (atomic)
        If set, shows a searchbar under the title that filters out second-level items
        based on their titles.

    @attribute menu (riot object)
        Expects a following structure (IMenu):
        {
            opened: boolean, // mutable by a context-menu instance
            items: Array<IMenuItem>,
            columns: number
        }
        IMenuItem is https://github.com/ct-js/ct-js/blob/develop/src/node_requires/IMenuItem.d.ts

    @method toggle
    @method open
    @method close

modal-menu
    .aDimmer.pad.fadein(if="{opts.menu.opened}")
        button.aDimmer-aCloseButton.forcebackground(title="{vocGlob.close}" onclick="{close}")
            svg.feather
                use(xlink:href="#x")
        .aModal.pad.npb.cursordefault.appear.flexfix
            .flexfix-header
                h1(if="{opts.title}") {opts.title}
                .aSearchWrap.wide(if="{opts.enablesearch}")
                    input.wide(type="text" oninput="{filterEntries}" value="{filterText}" ref="search")
                    svg.feather
                        use(href="#search")
                .aSpacer(if="{opts.enablesearch}")
            .flexfix-body
                virtual(
                    each="{item in opts.menu.items}"
                )
                    h2
                        svg.alignmiddle(if="{item.icon && item.type !== 'separator'}" class="{item.iconClass || 'feather'}")
                            use(xlink:href="#{item.icon instanceof Function? item.icon() : item.icon}")
                        span.ctext.alignmiddle  {item.label}
                    span(if="{item.hint}")
                    .modal-menu-aGrid(if="{!item.submenu.items || !item.submenu.items.length}")
                        | {vocGlob.nothingToShowFiller}
                    .modal-menu-aGrid(if="{item.submenu.items && item.submenu.items.length}")
                        .modal-menu-aGridItem(
                            each="{subitem in item.submenu.items}"
                            if="{!getIsFilteredOut(subitem)}"
                            onclick="{onItemClick}"
                        )
                            h3
                                svg.alignmiddle(if="{subitem.icon && subitem.type !== 'separator'}" class="{subitem.iconClass || 'feather'}")
                                    use(xlink:href="#{subitem.icon instanceof Function? subitem.icon() : subitem.icon}")
                                span.act.alignmiddle  {subitem.label}
                            div(if="{subitem.hint}") {subitem.hint}
            .flexfix-footer.inset
                button(onclick="{close}") {vocGlob.close}
    script.
        this.namespace = 'common';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.onItemClick = e => {
            const item = e.item.subitem;
            if (item.click) {
                item.click(item.affixedData);
            }
            this.opts.menu.opened = false;
        };

        this.filterEntries = e => {
            this.filterText = e.target.value.trim().toLowerCase();
        };
        this.getIsFilteredOut = entry => {
            if (!this.filterText) {
                return false;
            }
            return entry.label.toLowerCase().indexOf(this.filterText) === -1;
        };

        this.close = () => {
            this.opts.menu.opened = false;
            this.update();
        };
        this.open = () => {
            this.opts.menu.opened = true;
            this.update();
            setTimeout(() => {
                if (this.opts.enablesearch) {
                    this.refs.search.focus();
                }
            }, 0);
        };
        this.toggle = () => {
            this.opts.menu.opened = !this.opts.menu.opened;
            this.update();
            if (this.opts.opts.menu.opened) {
                setTimeout(() => {
                    if (this.opts.enablesearch) {
                        this.refs.search.focus();
                    }
                }, 0);
            }
        };

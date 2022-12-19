//
    Shows a generic context menu.

    @attribute menu (riot object)
        Expects a following structure (IMenu):
        {
            opened: boolean, // mutable by a context-menu instance
            items: Array<IMenuItem>,
            columns: number
        }
        IMenuItem is https://github.com/ct-js/ct-js/blob/develop/src/node_requires/IMenuItem.d.ts

    @method popup(x, y)
        Works with absolute coordinates (in CSS terms)
    @method toggle
    @method open
    @method close

context-menu(class="{opened: opts.menu.opened}" ref="root" style="{opts.menu.columns? 'columns: '+opts.menu.columns+';' : ''}")
    a(
        each="{item in opts.menu.items}"
        if="{!item.if || item.if()}"
        href="javascript: void 0;"
        class="{item.type || 'item'} {checkbox: item.type === 'checkbox'} {submenu: item.submenu}"
        disabled="{item.disabled}"
        onclick="{onItemClick}"
        tabindex="{'-1': item.type === 'separator'}"
        data-hotkey="{item.hotkey}"
        title="{item.hint}"
    )
        svg.context-menu-anIcon(if="{item.icon && item.type !== 'separator' && item.type !== 'checkbox'}" class="{item.iconClass || 'feather'}")
            use(xlink:href="#{item.icon instanceof Function? item.icon() : item.icon}")
        .context-menu-Swatches(if="{item.swatches?.length}")
            .context-menu-aSwatch(each="{swatch in item.swatches}" style="background-color: {swatch};")
        input(type="checkbox" checked="{item.checked instanceof Function? item.checked() : item.checked}" if="{item.type === 'checkbox'}")
        span(if="{!item.type !== 'separator'}") {item.label}
        span.hotkey(if="{!item.type !== 'separator' && (item.hotkey || item.hotkeyLabel)}") ({item.hotkeyLabel || item.hotkey})
        svg.feather.context-menu-aChevron(if="{item.submenu && item.type !== 'separator'}")
            use(xlink:href="#chevron-right")
        context-menu(if="{item.submenu && item.type !== 'separator'}" menu="{item.submenu}")
    script.
        var noFakeClicks;
        this.onItemClick = e => {
            e.preventDefault();
            if (e.item.item.submenu && e.target.closest('context-menu') === this.root) { // prevent closing if a label with a submenu was clicked *directly*
                e.stopPropagation();
            }
            // first `item` is a riot's reference to all looped vars,
            // second is var's name in markup
            if (e.item.item.click) {
                e.item.item.click(e.item.item.affixedData);
                e.stopPropagation();
            }
            if (!e.item.item.submenu) { // autoclose on regular items
                this.opts.menu.opened = false;
            }
        };

        this.popup = (x, y) => {
            noFakeClicks = true;
            setTimeout(() => {
                noFakeClicks = false;
            }, 100);
            this.root.style.left = this.root.style.top = this.root.style.right = this.root.style.bottom = 'unset';
            this.root.style.position = 'fixed';
            if (x !== void 0 && y !== void 0) {
                if (x < window.innerWidth / 2) {
                    this.root.style.left = x + 'px';
                } else {
                    this.root.style.right = (window.innerWidth - x) + 'px';
                }
                if (y < window.innerHeight / 2) {
                    this.root.style.top = y + 'px';
                } else {
                    this.root.style.bottom = (window.innerHeight - y) + 'px';
                }
            }
            this.opts.menu.opened = true;
            this.update();
            const firstA = this.root.querySelector('a');
            if (firstA) {
                firstA.focus();
            }
        };

        this.toggle = () => {
            this.opts.menu.opened = !this.opts.menu.opened;
            if (this.opts.menu.opened) {
                noFakeClicks = true;
                setTimeout(() => {
                    noFakeClicks = false;
                }, 100);
            }
            this.update();
        };
        this.open = () => {
            noFakeClicks = true;
            setTimeout(() => {
                noFakeClicks = false;
            }, 100);
            this.opts.menu.opened = true;
            this.update();
        };
        this.close = () => {
            this.opts.menu.opened = false;
            this.update();
        };
        const clickListener = e => {
            if (!this.opts.menu.opened || noFakeClicks) {
                return;
            }
            if (e.target.closest('context-menu') !== this.root) {
                this.opts.menu.opened = false;
                this.update();
            } else {
                e.stopPropagation();
            }
        };

        this.on('mount', () => {
            document.addEventListener('click', clickListener);
        });
        this.on('unmount', () => {
            document.removeEventListener('click', clickListener);
        });

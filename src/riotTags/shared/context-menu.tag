//
    Shows a generic context menu.

    @attribute menu (riot object)
        Expects a following structure:
        {
            opened: boolean, // mutable by a context-menu instance
            items: Array<IMenuItem>,
            columns: number
        }
        IMenuItem is:
        {
            label: string,
            icon?: string, // a name of an svg icon, e.g. 'check'

            type?: 'checkbox'|'separator'|any,
            click?: function,
            checked?: boolean|Function<boolean>, // valid for 'checkbox' type
            submenu?: Array<IMenuItem>,

            hotkey?: string, // E.g. 'Control+c'
            hotkeyLabel?: string // A human-readable variant, e.g. 'Ctrl+C'. Fallbacks to `hotkey`.
        }

    @method popup(x, y)
        Works with absolute coordinates (in CSS terms)
    @method toggle
    @method open
    @method close

context-menu(class="{opened: opts.menu.opened}" ref="root" style="{opts.menu.columns? 'columns: '+opts.menu.columns+';' : ''}")
    a(
        each="{item in opts.menu.items}"
        href="javascript: void 0;"
        class="{item.type || 'item'} {checkbox: item.type === 'checkbox'} {submenu: item.submenu}"
        disabled="{item.disabled}"
        onclick="{onItemClick}"
        tabindex="{'-1': item.type === 'separator'}"
        data-hotkey="{item.hotkey}"
    )
        svg.context-menu-anIcon(if="{item.icon && item.type !== 'separator' && item.type !== 'checkbox'}" class="{item.iconClass || 'feather'}")
            use(xlink:href="data/icons.svg#{item.icon instanceof Function? item.icon() : item.icon}")
        input(type="checkbox" checked="{item.checked instanceof Function? item.checked() : item.checked}" if="{item.type === 'checkbox'}")
        span(if="{!item.type !== 'separator'}") {item.label}
        span.hotkey(if="{!item.type !== 'separator' && item.hotkey}") ({item.hotkeyLabel || item.hotkey})
        svg.feather.context-menu-aChevron(if="{item.submenu && item.type !== 'separator'}")
            use(xlink:href="data/icons.svg#chevron-right")
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
                e.item.item.click();
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
            y -= this.root.parentNode.getBoundingClientRect().y;
            if (x !== void 0 && y !== void 0) {
                this.root.style.left = x + 'px';
                this.root.style.top = y + 'px';
            }
            this.opts.menu.opened = true;
            this.update();
            this.root.querySelector('a').focus();
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

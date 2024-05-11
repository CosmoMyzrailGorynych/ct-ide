//
    Shows a generic context menu.

    @attribute menu (riot object)
        Expects a following structure (IMenu):
        {
            opened: boolean, // mutable by a context-menu instance
            items: Array<IMenuItem>,
            columns: number
        }
        IMenuItem is https://github.com/ct-js/ct-js/blob/developsrc/node_requires/IMenuItem.d.ts

    @method popup(x, y)
        Works with absolute coordinates (in CSS terms)
    @method toggle
    @method open
    @method close

context-menu(class="{opened: opts.menu.opened}" style="\
    columns: {opts.menu.columns || 1};\
    left: {left}; top: {top}; right: {right}; bottom: {bottom}; position: {position};\
")
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
    ).relative
        svg.context-menu-anIcon(if="{item.icon && item.type !== 'separator' && item.type !== 'checkbox'}" class="{item.iconClass || 'feather'}")
            use(xlink:href="#{item.icon instanceof Function? item.icon() : item.icon}")
        .context-menu-Swatches(if="{item.swatches?.length}")
            .context-menu-aSwatch(each="{swatch in item.swatches}" style="background-color: {swatch};")
        input(type="checkbox" checked="{item.checked instanceof Function? item.checked() : item.checked}" if="{item.type === 'checkbox'}")
        span(if="{!item.type !== 'separator'}") {item.label}
        span.hotkey(if="{!item.type !== 'separator' && (item.hotkey || item.hotkeyLabel)}") ({item.hotkeyLabel || item.hotkey})
        svg.feather.context-menu-aChevron(if="{item.submenu && item.type !== 'separator'}")
            use(xlink:href="#chevron-right")
        context-menu(if="{item.submenu && item.type !== 'separator'}" ref="submenu" menu="{item.submenu}")
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

        this.containPosition = () => {
            const bounds = this.root.getBoundingClientRect();
            if (bounds.bottom > window.innerHeight) {
                this.root.style.bottom = 0;
                // this.root.style.top = 'unset';
            } else if (bounds.top < 0) {
                this.root.style.top = 0;
                // this.root.style.bottom = 'unset';
            }
            if (bounds.right > window.innerWidth) {
                this.root.style.right = 0;
                // this.root.style.left = 'unset';
            } else if (bounds.left < 0) {
                this.root.style.left = 0;
                // this.root.style.right = 'unset';
            }
            this.containSubmenus();
        };
        this.containSubmenus = () => {
            if (!this.refs.submenu) {
                return;
            }
            const menus = Array.isArray(this.refs.submenu) ?
                this.refs.submenu :
                [this.refs.submenu];
            menus.forEach(menu => menu.containPosition());
        };

        this.popup = (x, y) => {
            noFakeClicks = true;
            setTimeout(() => {
                noFakeClicks = false;
            }, 250);
            this.opts.menu.opened = true;
            this.left = this.top = this.right = this.bottom = 'unset';
            this.position = 'fixed';
            if (x !== void 0 && y !== void 0) {
                if (x < window.innerWidth / 2) {
                    this.left = x + 'px';
                } else {
                    this.right = (window.innerWidth - x) + 'px';
                }
                if (y < window.innerHeight / 2) {
                    this.top = y + 'px';
                } else {
                    this.bottom = (window.innerHeight - y) + 'px';
                }
            }
            this.update();
            this.containPosition();
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
            this.containPosition();
        };
        this.open = () => {
            noFakeClicks = true;
            setTimeout(() => {
                noFakeClicks = false;
            }, 100);
            this.opts.menu.opened = true;
            this.update();
            this.containPosition();
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
            }
        };

        this.on('mount', () => {
            document.body.addEventListener('click', clickListener, {
                capture: true,
                passive: true
            });
            document.body.addEventListener('contextmenu', clickListener, {
                capture: true,
                passive: true
            });
        });
        this.on('unmount', () => {
            document.body.removeEventListener('click', clickListener);
            document.body.removeEventListener('contextmenu', clickListener);
        });

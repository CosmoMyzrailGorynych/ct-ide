//
    A small block that displays a section with an h3 header that can be collapsed.

    @attribute heading (string)
        The heading to display
    @attribute defaultstate ("opened"|"closed")
        Sets the default state of the section. If it is not set, the section will appear closed.

    @attribute ontoggle (riot function)
        A callback that triggers when a user folds/unfolds the section. Passes the new state
        and this tag as two arguments.

collapsible-section
    .flexrow(onclick="{toggle}")
        h3 {opts.heading}
        svg.feather.a(class="{rotated: this.opened}")
            use(xlink:href="data/icons.svg#chevron-up")
    .collapsible-section-aWrapper(if="{opened}")
        <yield/>
    script.
        this.opened = this.opts.defaultstate === 'opened';
        this.toggle = () => {
            this.opened = !this.opened;
            if (this.opts.ontoggle) {
                this.opts.ontoggle(this.opened, this);
            }
        };
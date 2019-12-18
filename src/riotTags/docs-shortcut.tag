docs-shortcut
    span(title="{opts.title || voc.openDocs}" onclick="{navigateToDocs}" if="{!opts.button}")
        svg.feather.a
            use(xlink:href="data/icons.svg#book-open")
    button(onclick="{navigateToDocs}" if="{opts.button}" class="{wide: opts.wide}")
        svg.feather
            use(xlink:href="data/icons.svg#book-open")
        span  {opts.title || voc.openDocs}
    script.
        this.namespace = 'docsShortcut';
        this.mixin(window.riotVoc);
        this.navigateToDocs = e => {
            window.signals.trigger('openDocs', {
                path: this.opts.path || '/'
            });
        };
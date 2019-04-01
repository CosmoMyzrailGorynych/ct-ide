docs-shortcut
    span(title="{opts.title || voc.openDocs}" onclick="{navigateToDocs}" if="{!opts.button}")
        i.icon-book-open.a
    button(onclick="{navigateToDocs}" if="{opts.button}" class="{wide: opts.wide}")
        i.icon-book-open
        span  {opts.title || voc.openDocs}
    script.
        this.namespace = 'docsShortcut';
        this.mixin(window.riotVoc);
        this.navigateToDocs = e => {
            window.signals.trigger('openDocs', {
                path: this.opts.path || '/'
            });
        };
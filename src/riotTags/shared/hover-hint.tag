//
    Displays a little inline icon that shows specified stuff on hover. That's it.

    @attribute text (string)
        The text to show in the title
    @attribute icon (string)
        The icon to use. Defaults to "info"

hover-hint(title="{opts.text || 'There should have been some useful text, but something wrong happened. Please report about it.'}")
    svg.feather
        use(xlink:href="data/icons.svg#{opts.icon ? opts.icon : 'info'}")

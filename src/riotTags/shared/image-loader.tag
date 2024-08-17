//-
    A simple wrapper around the await tag to display an image received from a promise.

    @attribute promise (Promise<string>)
    @attribute imageclass (string)
        An optional class to add to the image.

image-loader
    await(
        if="{opts.promise}"
        promise="{opts.promise}"
        imageclass="{opts.imageclass}"
    )
        yield(to="resolved")
            img(src="{value}" class="{opts.imageclass}")
        yield(to="pending")
            svg.feather.group-icon.rotate
                use(xlink:href="#loader")
        yield(to="error")
            svg.feather.group-icon.red
                use(xlink:href="#x")
    img(src="/data/img/unknown.png" if="{!opts.promise}")

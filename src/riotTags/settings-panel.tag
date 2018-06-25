settings-panel.panel.view
    .tall
        h1 {voc.settings}
        h2 {voc.authoring}
        b {voc.title}
        br
        input#gametitle(type="text" value="{currentProject.settings.title}" onchange="{wire('this.currentProject.settings.title')}")
        br
        b {voc.author}
        br
        input#gameauthor(type="text" value="{currentProject.settings.author}" onchange="{wire('this.currentProject.settings.author')}")
        br
        b {voc.site}
        br
        input#gamesite(type="text" value="{currentProject.settings.site}" onchange="{wire('this.currentProject.settings.site')}")

        h2 {voc.renderoptions}
        label.block
            span {voc.framerate}
            br
            input(type="number" min="1" max="180" value="{currentProject.settings.fps}" onchange="{wire('this.currentProject.settings.fps')}")
            br
        label.block
            input(type="checkbox" value="{currentProject.settings.pixelatedrender}" onchange="{wire('this.currentProject.settings.pixelatedrender')}")
            span {voc.pixelatedrender}

        h2 {voc.exportparams}
        label.blocky(style="margin-right: 2.5rem;")
            input(type="checkbox" value="{currentProject.settings.minifyhtmlcss}" onchange="{wire('this.currentProject.settings.minifyhtmlcss')}")
            span {voc.minifyhtmlcss}
        label.blocky
            input(type="checkbox" value="{currentProject.settings.minifyjs}" onchange="{wire('this.currentProject.settings.minifyjs')}")
            span {voc.minifyjs}

        //span
            h2 {voc.preloader}
            select#gamepreloader.select(value="{currentProject.preloader}" onchange="{wire('this.currentProject.preloader')}")
                option(value="0") {voc.preloaders.circular}
                option(value="1") {voc.preloaders.bar}
                option(value="-1") {voc.preloaders.no}
            br
            br
            b {voc.cover}
            label.file
                button.inline
                    i.icon.icon-folder
                    span {voc.getfile}
                input#gamepreloaderfile(type="file" accept=".png, .jpg, .gif")
            #preloaderpreview.pt40.tall
    script.
        this.namespace = 'settings';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = window.currentProject;
        this.currentProject.settings.fps = this.currentProject.settings.fps || 30;

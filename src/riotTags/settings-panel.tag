settings-panel.panel.view
    .tall.fifty.npl.npt.npb
        h1 {voc.settings}
        h2 {voc.authoring}
        b {voc.title}
        br
        input#gametitle(type="text" value="{currentProject.settings.title}" onchange="{changeTitle}")
        br
        b {voc.author}
        br
        input#gameauthor(type="text" value="{currentProject.settings.author}" onchange="{wire('this.currentProject.settings.author')}")
        br
        b {voc.site}
        br
        input#gamesite(type="text" value="{currentProject.settings.site}" onchange="{wire('this.currentProject.settings.site')}")
        br
        b {voc.version}
        br
        input(type="number" style="width: 1.5rem;" value="{currentProject.settings.version[0]}" length="3" min="0" onchange="{wire('this.currentProject.settings.version.0')}")
        |  .
        input(type="number" style="width: 1.5rem;" value="{currentProject.settings.version[1]}" length="3" min="0" onchange="{wire('this.currentProject.settings.version.1')}")
        |  .
        input(type="number" style="width: 1.5rem;" value="{currentProject.settings.version[2]}" length="3" min="0" onchange="{wire('this.currentProject.settings.version.2')}")
        |   {voc.versionpostfix}  
        input(type="text" style="width: 3rem;" value="{currentProject.settings.versionPostfix}" length="5" onchange="{wire('this.currentProject.settings.versionPostfix')}")
        
        h2 {voc.actions}
        p
            button.nml(onclick="{openActionsEditor}")
                i.icon-airplay
                span   {voc.editActions}
        actions-editor(if="{editingActions}")

        h2 {voc.renderoptions}
        label.block
            input(type="checkbox" value="{currentProject.settings.pixelatedrender}" checked="{currentProject.settings.pixelatedrender}" onchange="{wire('this.currentProject.settings.pixelatedrender')}")
            span {voc.pixelatedrender}

        h2 {voc.exportparams}
        label.block(style="margin-right: 2.5rem;")
            input(type="checkbox" value="{currentProject.settings.minifyhtmlcss}" checked="{currentProject.settings.minifyhtmlcss}" onchange="{wire('this.currentProject.settings.minifyhtmlcss')}")
            span {voc.minifyhtmlcss}
        label.block
            input(type="checkbox" value="{currentProject.settings.minifyjs}" checked="{currentProject.settings.minifyjs}" onchange="{wire('this.currentProject.settings.minifyjs')}")
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
    .tall.fifty.flexfix.npr.npt.npb
        h1.flexfix-header {voc.scripts.header}
        ul.menu.flexfix-body
            li(each="{script in currentProject.scripts}" onclick="{selectScript}")
                code {script.name}
                div.toright(onclick="{deleteScript}" title="{voc.scripts.deleteScript}")
                    i.icon-delete
        button.flexfix-footer(onclick="{addNewScript}")
            i.icon-add
            span {voc.scripts.addNew}
    script-editor(if="{currentScript}" script="{currentScript}")
    script.
        this.namespace = 'settings';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = window.currentProject;
        this.currentProject.scripts = this.currentProject.scripts || [];
        this.currentProject.settings.fps = this.currentProject.settings.fps || 30;

        this.addNewScript = e => {
            var script = {
                name: 'New Script',
                code: `/* ${this.voc.scripts.newScriptComment} */`
            };
            this.currentProject.scripts.push(script);
            this.currentScript = script;
        };
        this.selectScript = e => {
            this.currentScript = e.item.script;
        };
        this.deleteScript = e => {
            var script = e.item.script,
                ind = this.currentProject.scripts.indexOf(script);
            this.currentProject.scripts.splice(ind, 1);
            e.stopPropagation();
        };
        this.changeTitle = e => {
            currentProject.settings.title = e.target.value.trim();
            if (currentProject.settings.title) {
                document.title = currentProject.settings.title + ' — ct.js';
            }
        };
        this.openActionsEditor = e => {
            this.editingActions = true;
        };

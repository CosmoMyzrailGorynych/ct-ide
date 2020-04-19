settings-panel.panel.view
    .tall.fifty.npl.npt.npb
        h1 {voc.settings}
        fieldset
            h2 {voc.authoring}
            b {voc.title}
            br
            input#gametitle(type="text" value="{global.currentProject.settings.title}" onchange="{changeTitle}")
            br
            b {voc.author}
            br
            input#gameauthor(type="text" value="{global.currentProject.settings.author}" onchange="{wire('this.currentProject.settings.author')}")
            br
            b {voc.site}
            br
            input#gamesite(type="text" value="{global.currentProject.settings.site}" onchange="{wire('this.currentProject.settings.site')}")
            br
            b {voc.version}
            br
            input(type="number" style="width: 1.5rem;" value="{global.currentProject.settings.version[0]}" length="3" min="0" onchange="{wire('this.currentProject.settings.version.0')}")
            |  .
            input(type="number" style="width: 1.5rem;" value="{global.currentProject.settings.version[1]}" length="3" min="0" onchange="{wire('this.currentProject.settings.version.1')}")
            |  .
            input(type="number" style="width: 1.5rem;" value="{global.currentProject.settings.version[2]}" length="3" min="0" onchange="{wire('this.currentProject.settings.version.2')}")
            |   {voc.versionpostfix}
            input(type="text" style="width: 3rem;" value="{global.currentProject.settings.versionPostfix}" length="5" onchange="{wire('this.currentProject.settings.versionPostfix')}")
        fieldset
            h2 {voc.actions}
            button.nml(onclick="{openActionsEditor}")
                svg.feather
                    use(xlink:href="data/icons.svg#airplay")
                span   {voc.editActions}
        fieldset
            h2 {voc.branding.heading}
            .block
                b
                    span {voc.branding.icon}
                    hover-hint(text="{voc.branding.iconNotice}")
                br
                texture-input(val="{global.currentProject.settings.branding.icon || -1}" showempty="yep" onselected="{updateGameIcon}")
            .spacer
            .block
                b
                    span {voc.branding.accent}
                    hover-hint(text="{voc.branding.accentNotice}")
                color-input(onchange="{wire('global.currentProject.settings.branding.accent', true)}" color="{global.currentProject.settings.branding.accent}")
            .spacer
            .block.checkbox
                input(type="checkbox" value="{global.currentProject.settings.branding.invertPreloaderScheme}" checked="{global.currentProject.settings.branding.invertPreloaderScheme}" onchange="{wire('this.currentProject.settings.branding.invertPreloaderScheme')}")
                span {voc.branding.invertPreloaderScheme}
        fieldset
            h2 {voc.renderoptions}
            label.block.checkbox
                input(type="checkbox" value="{global.currentProject.settings.pixelatedrender}" checked="{global.currentProject.settings.pixelatedrender}" onchange="{wire('this.currentProject.settings.pixelatedrender')}")
                span {voc.pixelatedrender}
            label.block.checkbox
                input(type="checkbox" value="{global.currentProject.settings.highDensity}" checked="{global.currentProject.settings.highDensity}" onchange="{wire('this.currentProject.settings.highDensity')}")
                span {voc.highDensity}
            label.block.checkbox
                input(type="checkbox" value="{global.currentProject.settings.usePixiLegacy}" checked="{global.currentProject.settings.usePixiLegacy}" onchange="{wire('this.currentProject.settings.usePixiLegacy')}")
                span {voc.usePixiLegacy}
            label.block
                span {voc.maxFPS}
                |
                input.short(type="number" min="1" value="{global.currentProject.settings.maxFPS || 60}" onchange="{wire('this.currentProject.settings.maxFPS')}")
        fieldset
            h2 {voc.exportparams}
            label.block.checkbox(style="margin-right: 2.5rem;")
                input(type="checkbox" value="{global.currentProject.settings.minifyhtmlcss}" checked="{global.currentProject.settings.minifyhtmlcss}" onchange="{wire('this.currentProject.settings.minifyhtmlcss')}")
                span {voc.minifyhtmlcss}
            label.block.checkbox
                input(type="checkbox" value="{global.currentProject.settings.minifyjs}" checked="{global.currentProject.settings.minifyjs}" onchange="{wire('this.currentProject.settings.minifyjs')}")
                span {voc.minifyjs}

    scripts-panel.tall.fifty.flexfix.npr.npt.npb
    actions-editor(if="{editingActions}")
    script.
        this.namespace = 'settings';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = global.currentProject;
        this.currentProject.settings.fps = this.currentProject.settings.fps || 30;

        this.changeTitle = e => {
            global.currentProject.settings.title = e.target.value.trim();
            if (global.currentProject.settings.title) {
                document.title = global.currentProject.settings.title + ' — ct.js';
            }
        };
        this.updateGameIcon = tex => {
            global.currentProject.settings.branding.icon = tex.uid;
        };
        this.openActionsEditor = e => {
            this.editingActions = true;
        };

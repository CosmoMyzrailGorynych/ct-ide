branding-settings
    h1 {voc.heading}
    .block
        b
            span {voc.icon}
            hover-hint(text="{voc.iconNotice}")
        br
        texture-input(
            val="{global.currentProject.settings.branding.icon || -1}"
            showempty="yep"
            onselected="{updateGameIcon}"
            header="{voc.icon}"
        )
    .spacer
    .block
        b
            span {voc.accent}
            hover-hint(text="{voc.accentNotice}")
        color-input(onchange="{wire('global.currentProject.settings.branding.accent', true)}" color="{global.currentProject.settings.branding.accent}")
    .spacer
    .block.checkbox
        input(type="checkbox" value="{global.currentProject.settings.branding.invertPreloaderScheme}" checked="{global.currentProject.settings.branding.invertPreloaderScheme}" onchange="{wire('this.currentProject.settings.branding.invertPreloaderScheme')}")
        span {voc.invertPreloaderScheme}
    script.
        this.namespace = 'settings.branding';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = global.currentProject;

        this.updateGameIcon = tex => {
            global.currentProject.settings.branding.icon = tex.uid;
        };
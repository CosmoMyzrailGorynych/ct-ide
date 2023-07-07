branding-settings
    h1 {voc.heading}
    b
        span {voc.icon}
        hover-hint(text="{voc.iconNotice}")
    br
    asset-input(
        assettypes="texture"
        assetid="{global.currentProject.settings.branding.icon || -1}"
        allowclear="yep"
        onchanged="{updateGameIcon}"
        header="{voc.icon}"
    )
    .aSpacer
    b
        span {voc.splashScreen}
        hover-hint(text="{voc.splashScreenNotice}")
    br
    asset-input(
        assettypes="texture"
        assetid="{global.currentProject.settings.branding.splashScreen || -1}"
        allowclear="yep"
        onchanged="{updateGameSplashScreen}"
        header="{voc.splashScreen}"
    )
    .aSpacer
    label.block.checkbox
        input(
            type="checkbox"
            value="{global.currentProject.settings.branding.forceSmoothIcons}"
            checked="{global.currentProject.settings.branding.forceSmoothIcons}"
            onchange="{wire('currentProject.settings.branding.forceSmoothIcons')}"
        )
        span {voc.forceSmoothIcons}
    label.block.checkbox
        input(
            type="checkbox"
            value="{global.currentProject.settings.branding.forceSmoothSplashScreen}"
            checked="{global.currentProject.settings.branding.forceSmoothSplashScreen}"
            onchange="{wire('currentProject.settings.branding.forceSmoothSplashScreen')}"
        )
        span {voc.forceSmoothSplashScreen}
    .aSpacer
    b
        span {voc.accent}
        hover-hint(text="{voc.accentNotice}")
    color-input(onchange="{wire('currentProject.settings.branding.accent', true)}" color="{global.currentProject.settings.branding.accent}")
    .aSpacer
    label.block.checkbox
        input(
            type="checkbox"
            value="{global.currentProject.settings.branding.invertPreloaderScheme}"
            checked="{global.currentProject.settings.branding.invertPreloaderScheme}"
            onchange="{wire('currentProject.settings.branding.invertPreloaderScheme')}"
        )
        span {voc.invertPreloaderScheme}
    label.block.checkbox
        input(
            type="checkbox"
            value="{global.currentProject.settings.branding.hideLoadingLogo}"
            checked="{global.currentProject.settings.branding.hideLoadingLogo}"
            onchange="{wire('currentProject.settings.branding.hideLoadingLogo')}"
        )
        span {voc.hideLoadingLogo}
    script.
        this.namespace = 'settings.branding';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = global.currentProject;

        this.updateGameIcon = id => {
            global.currentProject.settings.branding.icon = id;
        };
        this.updateGameSplashScreen = id => {
            global.currentProject.settings.branding.splashScreen = id;
        };

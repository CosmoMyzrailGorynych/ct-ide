rendering-settings
    h1 {voc.heading}
    fieldset
        label.block
            b {voc.maxFPS}
            br
            input.short(type="number" min="1" value="{renderSettings.maxFPS || 60}" onchange="{wire('this.renderSettings.maxFPS')}")
    fieldset
        label.block.checkbox
            input(type="checkbox" value="{renderSettings.pixelatedrender}" checked="{renderSettings.pixelatedrender}" onchange="{wire('this.renderSettings.pixelatedrender')}")
            span {voc.pixelatedrender}
        label.block.checkbox
            input(type="checkbox" value="{renderSettings.highDensity}" checked="{renderSettings.highDensity}" onchange="{wire('this.renderSettings.highDensity')}")
            span {voc.highDensity}
        label.block.checkbox
            input(type="checkbox" value="{renderSettings.usePixiLegacy}" checked="{renderSettings.usePixiLegacy}" onchange="{wire('this.renderSettings.usePixiLegacy')}")
            span {voc.usePixiLegacy}
    fieldset
        label.block.checkbox
            input(type="checkbox" checked="{renderSettings.hideCursor}" onchange="{wire('this.renderSettings.hideCursor')}")
            span {voc.hideCursor}
    h2 {voc.desktopBuilds}
    fieldset
        b {voc.launchMode}
        each key in ['maximized', 'fullscreen', 'windowed']
            label.checkbox
                input(type="radio" value=key checked=`{renderSettings.desktopMode === '${key}'}` onchange="{wire('this.renderSettings.desktopMode')}")
                span=`{voc.launchModes.${key}}`

    script.
        this.namespace = 'settings.rendering';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = global.currentProject;
        this.renderSettings = this.currentProject.settings.rendering;
export-settings
    h1 {voc.heading}

    h2 {vocFull.settings.rendering.desktopBuilds}
    fieldset
        label.block.checkbox
            input(type="checkbox" value="{exportSettings.autocloseDesktop}" checked="{exportSettings.autocloseDesktop}" onchange="{wire('exportSettings.autocloseDesktop')}")
            span {voc.autocloseDesktop}
    h2 {voc.codeModifier}
    fieldset
        each key in ['none', 'minify', 'obfuscate']
            label.checkbox
                input(type="radio" value=key checked=`{exportSettings.codeModifier === '${key}'}` onchange="{wire('exportSettings.codeModifier')}")
                span=`{voc.codeModifiers.${key}}`
                - if (key === 'obfuscate')
                    hover-hint(text="{voc.obfuscateWarning}" icon="alert-triangle")
    //-
        fieldset
            label.block.checkbox
                input(type="checkbox" value="{exportSettings.functionWrap}" checked="{exportSettings.functionWrap}" onchange="{wire('exportSettings.functionWrap')}")
                span {voc.functionWrap}
    p {voc.codeModifierAndWrapNote}

    h2 {voc.assetTree}
    p.nmt {voc.assetTreeNote}
    label.block.checkbox
        input(type="checkbox" value="{exportSettings.bundleAssetTree}" checked="{exportSettings.bundleAssetTree}" onchange="{wire('exportSettings.bundleAssetTree')}")
        span {voc.exportAssetTree}
    div(if="{exportSettings.bundleAssetTree}")
        span {voc.exportAssetTypes}
        each key in ['texture', 'template', 'room', 'behavior', 'script', 'font', 'sound', 'style', 'tandem']
            label.checkbox
                input(type="checkbox" checked=`{exportSettings.bundleAssetTypes.${key}}` onchange=`{wire('exportSettings.bundleAssetTypes.${key}')}`)
                span=`{vocGlob.assetTypes.${key}[2]}`

    script.
        this.namespace = 'settings.export';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.currentProject = global.currentProject;
        this.exportSettings = this.currentProject.settings.export;

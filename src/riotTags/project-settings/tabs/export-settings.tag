export-settings
    h1 {voc.heading}
    fieldset
        label.block.checkbox
            input(type="checkbox" value="{exportSettings.functionWrap}" checked="{exportSettings.functionWrap}" onchange="{wire('exportSettings.functionWrap')}")
            span {voc.functionWrap}
    h2 {voc.codeModifier}
    fieldset
        each key in ['none', 'minify', 'obfuscate']
            label.checkbox
                input(type="radio" value=key checked=`{exportSettings.codeModifier === '${key}'}` onchange="{wire('exportSettings.codeModifier')}")
                span=`{voc.codeModifiers.${key}}`
                - if (key === 'obfuscate')
                    hover-hint(text="{voc.obfuscateWarning}" icon="alert-triangle")
    p {voc.codeModifierAndWrapNote}

    script.
        this.namespace = 'settings.export';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.currentProject = global.currentProject;
        this.exportSettings = this.currentProject.settings.export;

rendering-settings
    h1 {voc.heading}
    fieldset
        label.block
            b {voc.maxFPS}
            br
            input.short(type="number" min="1" value="{renderSettings.maxFPS || 60}" onchange="{wire('renderSettings.maxFPS')}")
    fieldset
        label.block.checkbox
            input(type="checkbox" value="{renderSettings.pixelatedrender}" checked="{renderSettings.pixelatedrender}" onchange="{wireAndUpdatePixelated('this.renderSettings.pixelatedrender')}")
            span {voc.pixelatedRender}
        label.block.checkbox
            input(type="checkbox" value="{renderSettings.highDensity}" checked="{renderSettings.highDensity}" onchange="{wire('renderSettings.highDensity')}")
            span {voc.highDensity}
        label.block.checkbox
            input(type="checkbox" value="{renderSettings.usePixiLegacy}" checked="{renderSettings.usePixiLegacy}" onchange="{wire('renderSettings.usePixiLegacy')}")
            span {voc.usePixiLegacy}
        label.block.checkbox
            input(type="checkbox" value="{renderSettings.transparent}" checked="{renderSettings.transparent}" onchange="{wire('renderSettings.transparent')}")
            span {voc.useTransparent}
    fieldset
        label.block.checkbox
            input(type="checkbox" checked="{renderSettings.hideCursor}" onchange="{wire('renderSettings.hideCursor')}")
            span {voc.hideCursor}
    h2 {voc.viewportMode}
    fieldset
        label.block.checkbox(each="{val in ['asIs', 'fastScale', 'fastScaleInteger', 'expand', 'expandViewport', 'scaleFit', 'scaleFill']}")
            input(type="radio" value="{val}" checked="{renderSettings.viewMode === val}" onchange="{wire('this.renderSettings.viewMode')}")
            span
                b {voc.viewportModes[val]}
                span  — {voc.viewportModesDescriptions[val]}
    h2 {voc.desktopBuilds}
    fieldset
        b {voc.launchMode}
        each key in ['maximized', 'fullscreen', 'windowed']
            label.checkbox
                input(type="radio" value=key checked=`{renderSettings.desktopMode === '${key}'}` onchange="{wire('renderSettings.desktopMode')}")
                span=`{voc.launchModes.${key}}`
    h2 {voc.mobileBuilds}
    fieldset
        b {voc.screenOrientation}
        each key in ['unspecified', 'landscape', 'portrait']
            label.checkbox
                input(type="radio" value=key checked=`{renderSettings.mobileScreenOrientation === '${key}'}` onchange="{wire('renderSettings.mobileScreenOrientation')}")
                span=`{voc.screenOrientations.${key}}`

    script.
        this.namespace = 'settings.rendering';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.currentProject = global.currentProject;
        this.renderSettings = this.currentProject.settings.rendering;

        this.wireAndUpdatePixelated = path => e => {
            this.wire(path)(e);
            const {setPixelart} = require('./data/node_requires/resources/textures');
            setPixelart(window.currentProject.settings.rendering.pixelatedrender);
        };

emitter-editor.panel.pad
    .emitter-editor-aHeader
        img.emitter-editor-aTexture(src="{getPreview()}")
        h3 {voc.emitterHeading} {opts.emitter.uid.split('-').pop()}
        svg.feather.act(title="{vocGlob.delete}" onclick="{deleteEmitter}")
            use(xlink:href="data/icons.svg#trash")

    collapsible-section(
        heading="{voc.textureHeading}"
        ontoggle="{saveSectionState}"
        key="texture"
        defaultstate="{opts.emitter.openedTabs.includes('texture')? 'opened' : 'closed'}"
    )
        button.wide(onclick="{parent.showTexturesSelector}")
            svg.feather
                use(xlink:href="data/icons.svg#coin")
            span {parent.voc.selectTexture}
        button.wide(onclick="{parent.showTextureImport}")
            svg.feather
                use(xlink:href="data/icons.svg#download")
            span {parent.voc.importBuiltin}

    collapsible-section(
        heading="{voc.colorAndOpacityHeading}"
        ontoggle="{saveSectionState}"
        key="colors"
        defaultstate="{opts.emitter.openedTabs.includes('colors')? 'opened' : 'closed'}"
    )
        fieldset
            label
                b {parent.voc.colorAndOpacity}
                curve-editor(
                    easing="{parent.opts.emitter.settings.alpha.isStepped? 'none' : 'linear'}"
                    coloreasing="{parent.opts.emitter.settings.color.isStepped? 'none' : 'linear'}"
                    curve="{parent.opts.emitter.settings.alpha.list}"
                    colorcurve="{parent.opts.emitter.settings.color.list}"
                    lockstarttime="true" lockendtime="true"
                    onchange="{parent.updateColorCurve}"
                    type="color"
                ).safecolors
        fieldset
            label.checkbox
                input(
                    type="checkbox" checked="{parent.opts.emitter.settings.color.isStepped}"
                    onchange="{parent.wireAndReset('this.opts.emitter.settings.color.isStepped')}"
                )
                b {parent.voc.steppedColor}
            label.checkbox
                input(
                    type="checkbox" checked="{parent.opts.emitter.settings.alpha.isStepped}"
                    onchange="{parent.wireAndReset('this.opts.emitter.settings.alpha.isStepped')}"
                )
                b {parent.voc.steppedAlpha}
        fieldset
            label
                b {parent.voc.blendMode}
                select.wide(onchange="{parent.wireAndReset('this.opts.emitter.settings.blendMode')}")
                    option(value="normal" selected="{parent.opts.emitter.settings.blendMode === 'normal'}") {parent.voc.regular}
                    option(value="multiply" selected="{parent.opts.emitter.settings.blendMode === 'multiply'}") {parent.voc.darken}
                    option(value="screen" selected="{parent.opts.emitter.settings.blendMode === 'screen'}") {parent.voc.lighten}
                    option(value="add" selected="{parent.opts.emitter.settings.blendMode === 'add'}") {parent.voc.burn}

    collapsible-section(
        heading="{voc.scalingHeading}"
        ontoggle="{saveSectionState}"
        key="scaling"
        defaultstate="{opts.emitter.openedTabs.includes('scaling')? 'opened' : 'closed'}"
    )
        fieldset
            label
                b {parent.voc.scale}
                curve-editor(
                    min="0" max="2"
                    valuestep="0.1"
                    easing="{parent.opts.emitter.settings.scale.isStepped? 'none' : 'linear'}"
                    curve="{parent.opts.emitter.settings.scale.list}"
                    lockstarttime="true" lockendtime="true"
                    onchange="{updateScaleCurve}"
                )
        fieldset
            label.checkbox
                input(
                    type="checkbox" checked="{parent.opts.emitter.settings.scale.isStepped}"
                    onchange="{parent.wireAndReset('this.opts.emitter.settings.scale.isStepped')}"
                )
                b {parent.voc.stepped}
        fieldset
            label
                b
                    span {parent.voc.minimumSize}
                    hover-hint(text="{parent.voc.minimumSizeHint}")
                input(
                    type="range" min="0.01" max="1" step="0.01"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.minimumScaleMultiplier}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.minimumScaleMultiplier', 'minimumScaleMultiplier', true)}"
                )

    collapsible-section(
        heading="{voc.velocityHeading}"
        ontoggle="{saveSectionState}"
        key="velocity"
        defaultstate="{opts.emitter.openedTabs.includes('velocity')? 'opened' : 'closed'}"
    )
        fieldset
            label
                b {parent.voc.velocity}
                curve-editor(
                    min="0" max="2500"
                    valuestep="10"
                    easing="{parent.opts.emitter.settings.speed.isStepped? 'none' : 'linear'}"
                    curve="{parent.opts.emitter.settings.speed.list}"
                    lockstarttime="true" lockendtime="true"
                    onchange="{parent.updateSpeedCurve}"
                )
        fieldset
            label.checkbox
                input(
                    type="checkbox" checked="{parent.opts.emitter.settings.speed.isStepped}"
                    onchange="{parent.wireAndReset('this.opts.emitter.settings.speed.isStepped')}"
                )
                b {parent.voc.stepped}
        fieldset
            label
                b
                    span {parent.voc.minimumSpeed}
                    hover-hint(text="{parent.voc.minimumSpeedHint}")
                input(
                    type="range" min="0.01" max="1" step="0.01"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.minimumSpeedMultiplier}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.minimumSpeedMultiplier', 'minimumSpeedMultiplier', true)}"
                )
            label
                b {parent.voc.maxSpeed}
                input.wide(
                    type="number" min="0" max="1000" step="8"
                    value="{parent.opts.emitter.settings.maxSpeed}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.maxSpeed', 'maxSpeed', true)}"
                )

    collapsible-section(
        heading="{voc.gravityHeading}"
        ontoggle="{saveSectionState}"
        key="gravity"
        defaultstate="{opts.emitter.openedTabs.includes('gravity')? 'opened' : 'closed'}"
    )
        label.fifty.npt.npl.nmt
            span X:
            input.wide(
                type="number" step="32" min="-4096" max="4096"
                value="{parent.opts.emitter.settings.acceleration.x}"
                oninput="{parent.wireAndReset('this.opts.emitter.settings.acceleration.x')}"
            )
        label.fifty.npt.npr.nmt
            span Y:
            input.wide(
                type="number" step="32" min="-4096" max="4096"
                value="{parent.opts.emitter.settings.acceleration.y}"
                oninput="{parent.wireAndReset('this.opts.emitter.settings.acceleration.y')}"
            )
        .clear
        p.aNotice {parent.voc.gravityNotice}

    collapsible-section(
        heading="{voc.directionHeading}"
        ontoggle="{saveSectionState}"
        key="direction"
        defaultstate="{opts.emitter.openedTabs.includes('direction')? 'opened' : 'closed'}"
    )
        fieldset
            b {parent.voc.startingDirection}
            br
            label.fifty.npt.npl.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="1" min="-360" max="360"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.startRotation.min}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.startRotation.min', 'minStartRotation', true)}"
                )
            label.fifty.npt.npr.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="1" min="-360" max="360"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.startRotation.max}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.startRotation.max', 'maxStartRotation', true)}"
                )
            .clear
            label.checkbox
                input(
                    type="checkbox" checked="{parent.opts.emitter.settings.noRotation}"
                    onchange="{parent.wireAndReset('this.opts.emitter.settings.noRotation')}"
                )
                b {parent.voc.preserveTextureDirection}

    collapsible-section(
        heading="{voc.rotationHeading}"
        ontoggle="{saveSectionState}"
        key="rotation"
        defaultstate="{opts.emitter.openedTabs.includes('rotation')? 'opened' : 'closed'}"
    )
        fieldset
            b {parent.voc.rotationSpeed}
            br
            label.fifty.npt.npl.npb.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="15" min="-720" max="720"
                    value="{parent.opts.emitter.settings.rotationSpeed.min}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.rotationSpeed.min', 'minRotationSpeed', true)}"
                )
            label.fifty.npt.npr.npb.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="15" min="-720" max="720"
                    value="{parent.opts.emitter.settings.rotationSpeed.max}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.rotationSpeed.max', 'maxRotationSpeed', true)}"
                )
            .clear
        fieldset
            label
                b {parent.voc.rotationAcceleration}
                input.wide(
                    type="number" step="30" min="-3000" max="3000"
                    value="{parent.opts.emitter.settings.rotationAcceleration}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.rotationAcceleration', 'rotationAcceleration', true)}"
                )

    collapsible-section(
        heading="{voc.spawningHeading}"
        ontoggle="{saveSectionState}"
        key="spawning"
        defaultstate="{opts.emitter.openedTabs.includes('spawningHeading')? 'opened' : 'closed'}"
    )
        fieldset
            label(if="{parent.opts.emitter.settings.spawnType !== 'burst'}")
                b {parent.voc.spawnAtOnce}
                input.wide(
                    type="number" min="1" max="512" step="1"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.particlesPerWave}"
                    oninput="{parent.setParticleSpacing}"
                )
            label
                b {parent.voc.timeBetweenBursts}
                input.wide(
                    type="number" step="0.001" min="0.001" max="10"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.frequency}"
                    oninput="{parent.wireAndUpdate('this.opts.emitter.settings.frequency', '_frequency', true)}"
                )
            label
                b {parent.voc.maxParticles}
                input.wide(
                    type="number" step="100" min="1" max="10000"
                    value="{parent.opts.emitter.settings.maxParticles}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.maxParticles', 'maxParticles')}"
                )
            label
                b {parent.voc.chanceToSpawn}
                input(
                    type="range" min="0.01" max="1" step="0.01"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.spawnChance}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.spawnChance', 'spawnChance')}"
                )
        fieldset
            b {parent.voc.lifetime}
            br
            label.fifty.npt.npl.npb.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="0.01" min="0.01" max="600"
                    value="{parent.opts.emitter.settings.lifetime.min}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.lifetime.min')}"
                )
            label.fifty.npt.npr.npb.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="0.01" min="0.01" max="600"
                    value="{parent.opts.emitter.settings.lifetime.max}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.lifetime.max')}"
                )
            .clear

        fieldset
            label
                b {parent.voc.emitterLifetime}
                input.wide(
                    type="number" min="-1" step="0.1"
                    value="{parent.opts.emitter.settings.emitterLifetime}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.emitterLifetime')}"
                )
            label
                b
                    span {parent.voc.prewarmDelay}
                    hover-hint(text="{parent.voc.prewarmDelayNotice}")
                input.wide(
                    type="number" min="-100" max="100"
                    value="{parent.opts.emitter.settings.delay}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.delay')}"
                )
            .spacer

    collapsible-section(
        heading="{voc.shapeAndPositioningHeading}"
        ontoggle="{saveSectionState}"
        key="shape"
        defaultstate="{opts.emitter.openedTabs.includes('shape')? 'opened' : 'closed'}"
    )
        fieldset
            label
                b {parent.voc.spawnType}
                select.wide(onchange="{parent.changeSpawnType}")
                    option(selected="{parent.opts.emitter.settings.spawnType === 'point'}" value="point") {parent.voc.spawnShapes.point}
                    option(selected="{parent.opts.emitter.settings.spawnType === 'rect'}" value="rect") {parent.voc.spawnShapes.rectangle}
                    option(selected="{parent.opts.emitter.settings.spawnType === 'circle'}" value="circle") {parent.voc.spawnShapes.circle}
                    option(selected="{parent.opts.emitter.settings.spawnType === 'ring'}" value="ring") {parent.voc.spawnShapes.ring}
                    option(selected="{parent.opts.emitter.settings.spawnType === 'burst'}" value="burst") {parent.voc.spawnShapes.star}

        // emitter.settings.spawnType === 'point' does not have additional settings

        fieldset(if="{parent.opts.emitter.settings.spawnType === 'rect'}")
            label.fifty.npt.npl.npb.nmt
                b {parent.voc.width}
                input.wide(
                    type="number" step="8" min="-4096" max="4096"
                    value="{parent.opts.emitter.settings.spawnRect.w}"
                    oninput="{parent.setRectWidth}"
                )
            label.fifty.npt.npr.npb.nmt
                b {parent.voc.height}
                input.wide(
                    type="number" step="8" min="-4096" max="4096"
                    value="{parent.opts.emitter.settings.spawnRect.h}"
                    oninput="{parent.setRectHeight}"
                )
            .clear
        fieldset(if="{parent.opts.emitter.settings.spawnType === 'circle'}")
            label
                b {parent.voc.radius}
                input.wide(
                    type="number" step="8" min="1" max="4096"
                    value="{parent.opts.emitter.settings.spawnCircle.r}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.spawnCircle.r')}"
                )

        fieldset(if="{parent.opts.emitter.settings.spawnType === 'ring'}")
            b {parent.voc.radius}
            .clear
            label.fifty.npt.npl.npb.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="8" min="1" max="4096"
                    value="{parent.opts.emitter.settings.spawnCircle.minR}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.spawnCircle.minR')}"
                )
            label.fifty.npt.npr.npb.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="8" min="1" max="4096"
                    value="{parent.opts.emitter.settings.spawnCircle.r}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.spawnCircle.r')}"
                )
            .clear

        fieldset
            label.checkbox
                input(
                    type="checkbox" checked="{parent.opts.emitter.showShapeVisualizer}"
                    onchange="{parent.wireAndReset('this.opts.emitter.showShapeVisualizer')}"
                )
                b {parent.voc.showShapeVisualizer}

        fieldset(if="{parent.opts.emitter.settings.spawnType === 'burst'}")
            label
                b {parent.voc.starPoints}
                input.wide(
                    type="number" min="1" max="128" step="1"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.particlesPerWave}"
                    oninput="{parent.setParticleSpacing}"
                )
            label
                b {parent.voc.startAngle}
                .flexrow
                    input(
                        type="number" min="0" max="360" step="1"
                        data-wired-force-minmax="yes"
                        value="{parent.opts.emitter.settings.angleStart}"
                        oninput="{parent.wireAndUpdate('this.opts.emitter.settings.angleStart', 'angleStart', true)}"
                    )
                    .spacer
                    input.wide(
                        type="range" min="0" max="360" step="1"
                        data-wired-force-minmax="yes"
                        value="{parent.opts.emitter.settings.angleStart}"
                        oninput="{parent.wireAndUpdate('this.opts.emitter.settings.angleStart', 'angleStart', true)}"
                    )

        fieldset
            b {parent.voc.relativeEmitterPosition}
            label.fifty.npt.npl.npb.nmt
                span X:
                input.wide(
                    type="number" step="8" min="-1024" max="1024"
                    value="{parent.opts.emitter.settings.pos.x}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.pos.x')}"
                )
            label.fifty.npt.npr.npb.nmt
                span Y:
                input.wide(
                    type="number" step="8" min="-1024" max="1024"
                    value="{parent.opts.emitter.settings.pos.y}"
                    oninput="{parent.wireAndReset('this.opts.emitter.settings.pos.y')}"
                )
            .clear

    texture-selector(if="{pickingTexture}" onselected="{onTexturePicked}" oncancelled="{onTextureCancel}")
    particle-importer(if="{importingTexture}" onselected="{onTextureImport}" oncancelled="{onTextureImportCancel}")
    script.
        this.namespace = 'particleEmitters';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        const {getTexturePreview, getTextureFromName, importImageToTexture} = require('./data/node_requires/resources/textures');
        this.getPreview = () => {
            return getTexturePreview(this.opts.emitter.texture);
        };

        this.wireAndReset = path => e => {
            this.wire(path)(e);
            window.signals.trigger('emitterResetRequest');
        };
        this.wireAndUpdate = (path, field, useDirectValue) => e => {
            const val = this.wire(path)(e);
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                if (useDirectValue) {
                    if (field === '_frequency') {
                        emtInst[field] = Math.max(0.001, val); // otherwise it results into an infinite loop + crash
                    } else {
                        emtInst[field] = val;
                    }
                } else {
                    emtInst[field] = this.opts.emitter[field];
                }
            } else {
                window.signals.trigger('emitterResetRequest');
            }
        };

        this.pickingTexture = false;

        this.setParticleSpacing = e => {
            const emt = this.opts.emitter.settings;
            emt.particleSpacing = 360 / Math.min(128, Math.max(1, Number(e.target.value)));
            emt.particlesPerWave = Number(e.target.value);
            window.signals.trigger('emitterResetRequest');
        };

        this.setRectWidth = e => {
            const emt = this.opts.emitter.settings;
            emt.spawnRect.w = Number(e.target.value);
            emt.spawnRect.x = -emt.spawnRect.w / 2;
            window.signals.trigger('emitterResetRequest');
        };
        this.setRectHeight = e => {
            const emt = this.opts.emitter.settings;
            emt.spawnRect.h = Number(e.target.value);
            emt.spawnRect.y = -emt.spawnRect.h / 2;
            window.signals.trigger('emitterResetRequest');
        };

        this.updateScaleCurve = curve => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = PIXI.particles;
                emtInst.startScale = PropertyNode.createList(this.opts.emitter.settings.scale);
            } else {
                window.signals.trigger('emitterResetRequest');
            }
        };
        this.updateSpeedCurve = curve => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = PIXI.particles;
                emtInst.startSpeed = PropertyNode.createList(this.opts.emitter.settings.speed);
            } else {
                window.signals.trigger('emitterResetRequest');
            }
        };
        this.updateColorCurve = (alphaCurve, colorCurve) => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = PIXI.particles;

                emtInst.startColor = PropertyNode.createList(this.opts.emitter.settings.color);
                emtInst.startAlpha = PropertyNode.createList(this.opts.emitter.settings.alpha);
            } else {
                window.signals.trigger('emitterResetRequest');
            }
        };
        /* Expects color and alpha to be the same length */
        this.combineAlphaAndColors = () => {
            const Color = net.brehaut.Color;
            const combinedList = [];
            const emt = this.opts.emitter.settings;
            const l = Math.min(emt.color.list.length, emt.alpha.list.length);
            for (let i = 0; i < l; i++) {
                const color = Color('#'+emt.color.list[i].value);
                color.alpha = emt.alpha.list[i].value;
                combinedList.push({
                    value: color.toString(),
                    time: emt.color.list[i].time
                });
            }
            return combinedList;
        };

        this.changeSpawnType = e => {
            const emt = this.opts.emitter.settings;
            const oldType = emt.spawnType;
            const type = e.target.value;
            emt.spawnType = type;
            if (type === 'rect') {
                emt.spawnRect = {
                    x: -100,
                    y: -100,
                    w: 200,
                    h: 200
                };
            } else if (type === 'circle' || type === 'ring') {
                emt.spawnCircle = {
                    x: 0,
                    y: 0,
                    r: 200,
                    minR: 100
                }
            } else if (type === 'burst') {
                emt.particlesPerWave = 5;
                emt.particleSpacing = 360 / 5;
            }
            if (oldType === 'burst' && type !== 'burst') {
                emt.particlesPerWave = 1;
            }
            window.signals.trigger('emitterResetRequest');
        };

        this.saveSectionState = (opened, tag) => {
            if (opened) {
                if (!this.opts.emitter.openedTabs.includes(tag.opts.key)) {
                    this.opts.emitter.openedTabs.push(tag.opts.key);
                }
            } else {
                const ind = this.opts.emitter.openedTabs.indexOf(tag.opts.key);
                if (ind !== -1) {
                    this.opts.emitter.openedTabs.splice(ind, 1);
                }
            }
        };

        this.showTexturesSelector = e => {
            this.pickingTexture = true;
            this.update();
        };
        this.onTexturePicked = texture => e => {
            const emt = this.opts.emitter;
            emt.texture = texture.uid;
            this.pickingTexture = false;
            this.update();
            window.signals.trigger('emitterResetRequest');
        };
        this.onTextureCancel = () => {
            this.pickingTexture = false;
            this.update();
        };

        this.showTextureImport = e => {
            this.importingTexture = true;
            this.update();
        };
        this.onTextureImport = texture => e => {
            try {
                getTextureFromName(texture.name);
                // a texture with the same name already exists; show an error
                alertify.error(this.voc.alreadyHasAnImportingTexture.replace('$1', texture.name));
                return false;
            } catch (e) {
                // No such texture; add it.
                importImageToTexture(texture.path)
                .then(texture => {
                    this.opts.emitter.texture = texture.uid;
                    this.importingTexture = false;
                    this.update();
                    window.signals.trigger('emitterResetRequest');
                });
            }
        };
        this.onTextureImportCancel = e => {
            this.importingTexture = false;
            this.update();
        };


        this.deleteEmitter = e => {
            this.parent.deleteEmitter(this.opts.emitter);
        };
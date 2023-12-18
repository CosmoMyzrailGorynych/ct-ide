emitter-editor.aPanel.pad.nb
    .emitter-editor-aHeader
        img.emitter-editor-aTexture(src="{getPreview()}")
        h3 {voc.emitterHeading} {opts.emitter.uid.slice(-8)}
        svg.feather.act(title="{vocGlob.delete}" onclick="{deleteEmitter}")
            use(xlink:href="#trash")
    collapsible-section(
        heading="{voc.textureHeading}"
        ontoggle="{saveSectionState}"
        key="texture"
        defaultstate="{opts.emitter.openedTabs.includes('texture')? 'opened' : 'closed'}"
    )
        fieldset
            asset-input.wide(
                assettypes="texture"
                onchanged="{parent.onTexturePicked}"
                allowclear="yes"
                assetid="{parent.opts.emitter.texture || -1}"
                selecttext="{parent.voc.selectTexture}"
            )
        fieldset
            b {parent.voc.textureMethod}
            .aButtonGroup.wide
                button.small(onclick="{parent.changeTextureMethod('textureRandom')}" class="{active: parent.opts.emitter.textureBehavior === 'textureRandom'}" )
                    svg.feather
                        use(xlink:href="#grid-random")
                    span  {parent.voc.textureMethods.random}
                button.small(onclick="{parent.changeTextureMethod('animatedSingle')}" class="{active: parent.opts.emitter.textureBehavior === 'animatedSingle'}" )
                    svg.feather
                        use(xlink:href="#film")
                    span  {parent.voc.textureMethods.animated}
        fieldset(if="{parent.opts.emitter.textureBehavior === 'animatedSingle'}")
            label
                b {parent.voc.animatedFramerate}
                input.wide(
                    type="number" step="1" min="1" max="60"
                    value="{parent.opts.emitter.animatedSingleFramerate}"
                    oninput="{parent.wireAndReset('opts.emitter.animatedSingleFramerate')}"
                )
    //-
        collapsible-section(
            heading="{voc.easingHeader}"
            ontoggle="{saveSectionState}"
            key="easing"
            defaultstate="{opts.emitter.openedTabs.includes('easing')? 'opened' : 'closed'}"
        )
            .aButtonGroup
                button(onclick="{parent.wireAndReset('opts.emitter.easing')}" value="none" class="{active: parent.opts.emitter.easing === 'none'}")
                    svg.feather
                        use(xlink:href="#interpolation-none")
                    span  {parent.voc.easing.none}
                button(onclick="{parent.wireAndReset('opts.emitter.easing')}" value="linear" class="{active: parent.opts.emitter.easing === 'linear'}")
                    svg.feather
                        use(xlink:href="#interpolation-linear")
                    span  {parent.voc.easing.linear}
                button(onclick="{parent.wireAndReset('opts.emitter.easing')}" value="smooth" class="{active: parent.opts.emitter.easing === 'smooth'}")
                    svg.feather
                        use(xlink:href="#interpolation-smooth")
                    span  {parent.voc.easing.smooth}

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
                    easing="{parent.alpha.isStepped ? 'none' : 'linear'}"
                    coloreasing="{parent.color.isStepped ? 'none' : 'linear'}"
                    curve="{parent.alpha.list}"
                    colorcurve="{parent.color.list}"
                    lockstarttime="true" lockendtime="true"
                    type="color"
                    onchange="{parent.updateColorCurve}"
                ).safecolors
        fieldset
            label.checkbox
                input(
                    type="checkbox" checked="{parent.color.isStepped}"
                    onchange="{parent.wireAndReset('color.isStepped')}"
                )
                b {parent.voc.steppedColor}
            label.checkbox
                input(
                    type="checkbox" checked="{parent.alpha.isStepped}"
                    onchange="{parent.wireAndReset('alpha.isStepped')}"
                )
                b {parent.voc.steppedAlpha}
        fieldset
            label
                b {parent.voc.blendMode}
                select.wide(onchange="{parent.wireAndReset('blendMode.blendMode')}")
                    option(value="normal" selected="{parent.blendMode.blendMode === 'normal'}") {parent.voc.regular}
                    option(value="multiply" selected="{parent.blendMode.blendMode === 'multiply'}") {parent.voc.darken}
                    option(value="screen" selected="{parent.blendMode.blendMode === 'screen'}") {parent.voc.lighten}
                    option(value="add" selected="{parent.blendMode.blendMode === 'add'}") {parent.voc.burn}

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
                    easing="{parent.scale.isStepped ? 'none' : 'linear'}"
                    curve="{parent.scale.scale.list}"
                    lockstarttime="true" lockendtime="true"
                    onchange="{parent.updateScaleCurve}"
                )
        fieldset
            label.checkbox
                input(
                    type="checkbox" checked="{parent.scale.scale.isStepped}"
                    onchange="{parent.wireAndReset('scale.scale.isStepped')}"
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
                    value="{parent.scale.minMult}"
                    oninput="{parent.wireAndReset('scale.minMult')}"
                )

    collapsible-section(
        heading="{voc.velocityHeading}"
        ontoggle="{saveSectionState}"
        key="velocity"
        defaultstate="{opts.emitter.openedTabs.includes('velocity')? 'opened' : 'closed'}"
    )
        fieldset
            b {parent.voc.movementType}
            .aButtonGroup.wide
                button.small(onclick="{parent.changeMovementType('moveSpeed')}" class="{active: parent.movement.type === 'moveSpeed'}")
                    svg.feather
                        use(xlink:href="#chart-line")
                    span  {parent.voc.movementTypes.linear}
                button.small(onclick="{parent.changeMovementType('moveAcceleration')}" class="{active: parent.movement.type === 'moveAcceleration'}")
                    svg.feather
                        use(xlink:href="#fall")
                    span  {parent.voc.movementTypes.accelerated}
        // type: 'moveSpeed'
        fieldset(if="{parent.movement.type === 'moveSpeed'}")
            label
                b {parent.voc.velocity}
                curve-editor(
                    min="0" max="2500"
                    valuestep="10"
                    easing="{parent.movement.config.speed.isStepped ? 'none' : 'linear'}"
                    curve="{parent.movement.config.speed.list}"
                    lockstarttime="true" lockendtime="true"
                    onchange="{parent.updateSpeedCurve}"
                )
        fieldset(if="{parent.movement.type === 'moveSpeed'}")
            label.checkbox
                input(
                    type="checkbox" checked="{parent.movement.config.speed.isStepped}"
                    onchange="{parent.wireAndReset('movement.config.speed.isStepped')}"
                )
                b {parent.voc.stepped}
        fieldset(if="{parent.movement.type === 'moveSpeed'}")
            label
                b
                    span {parent.voc.minimumSpeed}
                    hover-hint(text="{parent.voc.minimumSpeedHint}")
                input(
                    type="range" min="0.01" max="1" step="0.01"
                    data-wired-force-minmax="yes"
                    value="{parent.movement.config.minMult}"
                    oninput="{parent.wireAndReset('movement.config.minMult')}"
                )
        // type: 'moveAcceleration'
        fieldset(if="{parent.movement.type === 'moveAcceleration'}")
            b {parent.voc.velocity}
            .flexrow
                label
                    span {parent.voc.from}
                    input.wide(
                        type="number" step="8" min="0" max="2500"
                        value="{parent.movement.config.minStart}"
                        oninput="{parent.patchAcceleration('movement.config.minStart', 'minStart')}"
                    )
                .aSpacer.noshrink
                label
                    span {parent.voc.to}
                    input.wide(
                        type="number" step="8" min="0" max="2500"
                        value="{parent.movement.config.maxStart}"
                        oninput="{parent.patchAcceleration('movement.config.maxStart', 'maxStart')}"
                    )
            b {parent.voc.gravityHeading}
            .flexrow
                label
                    span X:
                    input.wide(
                        type="number" step="32" min="-4096" max="4096"
                        value="{parent.movement.config.accel.x}"
                        oninput="{parent.wireAndReset('movement.config.accel.x')}"
                    )
                .aSpacer.noshrink
                label
                    span Y:
                    input.wide(
                        type="number" step="32" min="-4096" max="4096"
                        value="{parent.movement.config.accel.y}"
                        oninput="{parent.wireAndReset('movement.config.accel.y')}"
                    )
            label
                b {parent.voc.maxSpeed}
                input.wide(
                    type="number" min="0" max="1000" step="8"
                    value="{parent.movement.config.maxSpeed}"
                    oninput="{parent.wireAndReset('movement.config.maxSpeed')}"
                )
            label.checkbox
                input(
                    type="checkbox" checked="{parent.movement.config.rotate}"
                    onchange="{parent.wireAndReset('movement.config.rotate')}"
                )
                b {parent.voc.rotateTexture}

    collapsible-section(
        heading="{voc.rotationHeading}"
        ontoggle="{saveSectionState}"
        key="rotation"
        defaultstate="{opts.emitter.openedTabs.includes('rotation')? 'opened' : 'closed'}"
    )
        // rotation
        fieldset(if="{parent.rotation.type === 'rotation'}")
            b {parent.voc.startingDirection}
            br
            label.fifty.npt.npl.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="1" min="-360" max="360"
                    data-wired-force-minmax="yes"
                    value="{parent.rotation.config.minStart}"
                    oninput="{parent.patchRotation('this.rotation.config.minStart', 'minStart')}"
                )
            label.fifty.npt.npr.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="1" min="-360" max="360"
                    data-wired-force-minmax="yes"
                    value="{parent.rotation.config.maxStart}"
                    oninput="{parent.patchRotation('this.rotation.config.maxStart', 'maxStart')}"
                )
        fieldset(if="{parent.rotation.type === 'rotation'}")
            b {parent.voc.rotationSpeed}
            br
            label.fifty.npt.npl.npb.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="8" min="0" max="2500"
                    value="{parent.rotation.config.minSpeed}"
                    oninput="{parent.patchRotation('rotation.config.minSpeed', 'minSpeed')}"
                )
            label.fifty.npt.npr.npb.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="8" min="0" max="2500"
                    value="{parent.rotation.config.maxSpeed}"
                    oninput="{parent.patchRotation('rotation.config.maxSpeed', 'maxSpeed')}"
                )
            .clear
        fieldset(if="{parent.rotation.type === 'rotation'}")
            label
                b {parent.voc.rotationAcceleration}
                input.wide(
                    type="number" step="30" min="-3000" max="3000"
                    value="{parent.rotation.config.accel}"
                    oninput="{parent.patchRotation('rotation.config.accel', 'accel')}"
                )

    collapsible-section(
        heading="{voc.spawningHeading}"
        ontoggle="{saveSectionState}"
        key="spawning"
        defaultstate="{opts.emitter.openedTabs.includes('spawningHeading')? 'opened' : 'closed'}"
    )
        fieldset
            label
                b {parent.voc.spawnAtOnce}
                input.wide(
                    type="number" min="1" max="512" step="1"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.particlesPerWave}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.particlesPerWave')}"
                )
            label
                b {parent.voc.timeBetweenBursts}
                input.wide(
                    type="number" step="0.001" min="0.001" max="10"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.frequency}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.frequency')}"
                )
            label
                b {parent.voc.maxParticles}
                input.wide(
                    type="number" step="100" min="1" max="10000"
                    value="{parent.opts.emitter.settings.maxParticles}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.maxParticles')}"
                )
            label
                b {parent.voc.chanceToSpawn}
                input(
                    type="range" min="0.01" max="1" step="0.01"
                    data-wired-force-minmax="yes"
                    value="{parent.opts.emitter.settings.spawnChance}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.spawnChance')}"
                )
        fieldset
            b {parent.voc.lifetime}
            br
            label.fifty.npt.npl.npb.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="0.01" min="0.01" max="600"
                    value="{parent.opts.emitter.settings.lifetime.min}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.lifetime.min')}"
                )
            label.fifty.npt.npr.npb.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="0.01" min="0.01" max="600"
                    value="{parent.opts.emitter.settings.lifetime.max}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.lifetime.max')}"
                )
            .clear

        fieldset
            label
                b {parent.voc.emitterLifetime}
                input.wide(
                    type="number" min="-1" step="0.1"
                    value="{parent.opts.emitter.settings.emitterLifetime}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.emitterLifetime')}"
                )
            label
                b
                    span {parent.voc.prewarmDelay}
                    hover-hint(text="{parent.voc.prewarmDelayNotice}")
                input.wide(
                    type="number" min="-100" max="100"
                    value="{parent.opts.emitter.settings.delay}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.delay')}"
                )
            .aSpacer

    collapsible-section(
        heading="{voc.shapeAndPositioningHeading}"
        ontoggle="{saveSectionState}"
        key="shape"
        defaultstate="{opts.emitter.openedTabs.includes('shape')? 'opened' : 'closed'}"
    )
        fieldset
            b {parent.voc.spawnType}
            .aButtonGroup.wide
                button.small(onclick="{parent.changeSpawnType('torus')}" class="{active: parent.spawnBh.type === 'spawnShape' && parent.spawnBh.config.type === 'torus'}")
                    svg.feather
                        use(xlink:href="#circle")
                    span {parent.voc.spawnShapes.torus}
                button.small(onclick="{parent.changeSpawnType('rect')}" class="{active: parent.spawnBh.type === 'spawnShape' && parent.spawnBh.config.type === 'rect'}")
                    svg.feather
                        use(xlink:href="#square")
                    span {parent.voc.spawnShapes.rectangle}
                //- Exclusive with texture rotation. And I don't want to mess with behavior order
                //- on which everything hangs.

                //- button.small(onclick="{parent.changeSpawnType('spawnBurst')}" class="{active: parent.spawnBh.type === 'spawnBurst'}")
                //-     svg.feather
                //-         use(xlink:href="#loader")
                //-     span {parent.voc.spawnShapes.star}
        fieldset(if="{parent.spawnBh.type === 'spawnShape' && parent.spawnBh.config.type === 'torus'}")
            // Circular shapes
            b {parent.voc.radius}
            .clear
            label.fifty.npt.npl.npb.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="8" min="1" max="4096"
                    value="{parent.spawnBh.config.data.innerRadius}"
                    oninput="{parent.wireAndReset('spawnBh.config.data.innerRadius')}"
                )
            label.fifty.npt.npr.npb.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="8" min="1" max="4096"
                    value="{parent.spawnBh.config.data.radius}"
                    oninput="{parent.wireAndReset('spawnBh.config.data.radius')}"
                )
            .clear
        fieldset(if="{parent.spawnBh.type === 'spawnShape' && parent.spawnBh.config.type === 'torus'}")
            b {parent.voc.rotationMethod}
            .aButtonGroup.wide
                button.small(
                    onclick="{parent.changeTorusRotation(false)}"
                    class="{active: !parent.spawnBh.config.data.affectRotation}"
                )
                    svg.feather
                        use(xlink:href="#particles-no-rotate")
                    span  {parent.voc.rotationMethods.static}
                button.small(
                    onclick="{parent.changeTorusRotation(true)}"
                    class="{active: parent.spawnBh.config.data.affectRotation}"
                )
                    svg.feather
                        use(xlink:href="#particles-rotate")
                    span  {parent.voc.rotationMethods.dynamic}

        fieldset(if="{parent.spawnBh.type === 'spawnShape' && parent.spawnBh.config.type === 'rect'}")
            // Rectangles
            label.fifty.npt.npl.npb.nmt
                b {parent.voc.width}
                //- oninput="{parent.setRectWidth}"
                input.wide(
                    type="number" step="8" min="-4096" max="4096"
                    value="{parent.spawnBh.config.data.w}"
                    oninput="{parent.wireAndReset('spawnBh.config.data.w')}"
                )
            label.fifty.npt.npr.npb.nmt
                b {parent.voc.height}
                //- oninput="{parent.setRectHeight}"
                input.wide(
                    type="number" step="8" min="-4096" max="4096"
                    value="{parent.spawnBh.config.data.h}"
                    oninput="{parent.wireAndReset('spawnBh.config.data.h')}"
                )
            .clear
        fieldset
            label.checkbox
                input(
                    type="checkbox" checked="{parent.opts.emitter.showShapeVisualizer}"
                    onchange="{parent.wireAndReset('opts.emitter.showShapeVisualizer')}"
                )
                b {parent.voc.showShapeVisualizer}

        fieldset
            b {parent.voc.relativeEmitterPosition}
            label.fifty.npt.npl.npb.nmt
                span X:
                input.wide(
                    type="number" step="8" min="-1024" max="1024"
                    value="{parent.opts.emitter.settings.pos.x}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.pos.x')}"
                )
            label.fifty.npt.npr.npb.nmt
                span Y:
                input.wide(
                    type="number" step="8" min="-1024" max="1024"
                    value="{parent.opts.emitter.settings.pos.y}"
                    oninput="{parent.wireAndReset('opts.emitter.settings.pos.y')}"
                )
            .clear
    script.
        this.namespace = 'particleEmitters';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);

        const particles = require('@pixi/particle-emitter');

        // Ct.js' emitter asset's behaviors is ensured to be a tuple
        // @see src/node_requires/resources/emitterTandems/types.d.ts
        this.updateShortcuts = () => {
            const em = this.opts.emitter;
            this.emitter = em;
            /* eslint-disable prefer-destructuring */
            this.alpha = em.settings.behaviors[0].config.alpha;
            this.color = em.settings.behaviors[1].config.color;
            this.blendMode = em.settings.behaviors[2].config;
            this.scale = em.settings.behaviors[3].config;
            this.movement = em.settings.behaviors[4];
            this.spawnBh = em.settings.behaviors[5];
            this.rotation = em.settings.behaviors[6];
            /* eslint-enable prefer-destructuring */
        };
        this.on('update', () => {
            if (this.emitter !== this.opts.emitter) {
                this.updateShortcuts();
            }
        });
        this.updateShortcuts();

        const {getThumbnail, getById} = require('./data/node_requires/resources');
        this.getPreview = () => getThumbnail(getById('texture', this.opts.emitter.texture));

        this.wireAndReset = path => e => {
            this.wire(path)(e);
            window.signals.trigger('emitterResetRequest', this.opts.emitter.uid);
        };
        this.reset = () => {
            window.signals.trigger('emitterResetRequest', this.opts.emitter.uid);
        };

        this.pickingTexture = false;

        this.patchRotationNow = (path, field) => e => {
            this.wire(path)(e);
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const bh = emtInst.initBehaviors
                    .find(b => b instanceof particles.behaviors.RotationBehavior);
                bh[field] = Number(e.target.value) * Math.PI / 180;
            } else {
                window.signals.trigger('emitterResetRequest', this.opts.emitter.uid);
            }
        };
        this.patchRotation = (path, field) =>
            window.throttle(this.patchRotationNow(path, field), 100);

        this.patchAccelerationNow = (path, field) => e => {
            this.wire(path)(e);
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const bh = emtInst.initBehaviors
                    .find(b => b instanceof particles.behaviors.AccelerationBehavior);
                bh[field] = Number(e.target.value);
            } else {
                window.signals.trigger('emitterResetRequest', this.opts.emitter.uid);
            }
        };
        this.patchAcceleration = (path, field) =>
            window.throttle(this.patchAccelerationNow(path, field), 100);

        this.updateScaleCurveNow = () => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = particles;
                const bh = emtInst.initBehaviors
                    .find(b => b instanceof particles.behaviors.ScaleBehavior);
                bh.list.first = PropertyNode.createList(this.scale.scale);
            } else {
                window.signals.trigger('emitterResetRequest', this.opts.emitter.uid);
            }
        };
        this.updateScaleCurve = window.throttle(this.updateScaleCurveNow, 100);

        this.updateSpeedCurveNow = () => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = particles;
                const bh = emtInst.initBehaviors
                    .find(b => b instanceof particles.behaviors.SpeedBehavior);
                bh.list.first =
                    PropertyNode.createList(this.movement.config.speed);
            } else {
                window.signals.trigger('emitterResetRequest', this.opts.emitter.uid);
            }
        };
        this.updateSpeedCurve = window.throttle(this.updateSpeedCurveNow, 100);

        this.updateColorCurveNow = () => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = particles;
                const bha = emtInst.initBehaviors
                    .find(b => b instanceof particles.behaviors.AlphaBehavior);
                const bhc = emtInst.initBehaviors
                    .find(b => b instanceof particles.behaviors.ColorBehavior);
                bha.list.first = PropertyNode.createList(this.alpha);
                bhc.list.first = PropertyNode.createList(this.color);
            } else {
                window.signals.trigger('emitterResetRequest', this.opts.emitter.uid);
            }
        };
        this.updateColorCurve = window.throttle(this.updateColorCurveNow, 100);

        /* Expects color and alpha to be the same length */
        this.combineAlphaAndColors = () => {
            /* global net */
            const brehautColor = net.brehaut.Color;
            const combinedList = [];
            const emt = this.opts.emitter.settings;
            const l = Math.min(emt.color.list.length, emt.alpha.list.length);
            for (let i = 0; i < l; i++) {
                const color = brehautColor('#' + emt.color.list[i].value);
                color.alpha = emt.alpha.list[i].value;
                combinedList.push({
                    value: color.toString(),
                    time: emt.color.list[i].time
                });
            }
            return combinedList;
        };

        this.changeTextureMethod = type => () => {
            this.opts.emitter.textureBehavior = type;
            window.signals.trigger('emitterResetRequest');
        };
        this.changeSpawnType = type => () => {
            const oldType = this.spawnBh.config?.type || this.spawnBh.type;
            if (oldType === type) {
                return; // nothing to do if changing to the same shape
            }
            const {behaviors} = this.opts.emitter.settings;
            let newBh;
            switch (type) {
            case 'rect':
                newBh = {
                    type: 'spawnShape',
                    config: {
                        type: 'rect',
                        // eslint-disable-next-line id-blacklist
                        data: {
                            x: -100,
                            y: -100,
                            w: 200,
                            h: 200
                        }
                    }
                };
                break;

            case 'torus':
                newBh = {
                    type: 'spawnShape',
                    config: {
                        type: 'torus',
                        // eslint-disable-next-line id-blacklist
                        data: {
                            x: 0,
                            y: 0,
                            radius: 200,
                            innerRadius: 100,
                            rotation: true
                        }
                    }
                };
                break;

            default:
                throw new Error(`Unknown shape: ${type}`);
            }
            behaviors.splice(5, 1, newBh);
            this.updateShortcuts();
            window.signals.trigger('emitterResetRequest');
        };
        this.changeTorusRotation = value => () => {
            this.spawnBh.config.data.affectRotation = value;
            window.signals.trigger('emitterResetRequest');
        };
        this.changeMovementType = type => () => {
            const oldType = this.movement.type;
            if (oldType === type) {
                return; // nothing to do if changing to the same movement method
            }
            const {behaviors} = this.opts.emitter.settings;
            let newBh;
            if (type === 'moveSpeed') {
                newBh = {
                    type: 'moveSpeed',
                    config: {
                        speed: {
                            list: [{
                                value: 500,
                                time: 0
                            }, {
                                value: 100,
                                time: 1
                            }]
                        },
                        minMult: 1
                    }
                };
            } else {
                newBh = {
                    type: 'moveAcceleration',
                    config: {
                        minStart: 0,
                        maxStart: 0,
                        accel: {
                            x: 0,
                            y: 980
                        },
                        rotate: true,
                        maxSpeed: 3000
                    }
                };
            }
            behaviors.splice(4, 1, newBh);
            this.updateShortcuts();
            window.signals.trigger('emitterResetRequest');
        };

        this.saveSectionState = (opened, sectionTag) => {
            if (opened) {
                if (!this.opts.emitter.openedTabs.includes(sectionTag.opts.key)) {
                    this.opts.emitter.openedTabs.push(sectionTag.opts.key);
                }
            } else {
                const ind = this.opts.emitter.openedTabs.indexOf(sectionTag.opts.key);
                if (ind !== -1) {
                    this.opts.emitter.openedTabs.splice(ind, 1);
                }
            }
        };

        this.onTexturePicked = textureId => {
            const emt = this.opts.emitter;
            emt.texture = textureId === -1 ? -1 : textureId;
            this.update();
            window.signals.trigger('emitterResetRequest');
        };

        this.deleteEmitter = () => {
            this.parent.deleteEmitter(this.opts.emitter);
        };

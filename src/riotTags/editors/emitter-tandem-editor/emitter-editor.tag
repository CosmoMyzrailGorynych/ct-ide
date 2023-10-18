emitter-editor.aPanel.pad.nb
    .emitter-editor-aHeader
        img.emitter-editor-aTexture(src="{getPreview()}")
        h3 {voc.emitterHeading} {opts.emitter.uid.split('-').pop()}
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
            label
                b {parent.voc.velocity}
                br
                label.fifty.npt.npl.npb.nmt
                    span {parent.voc.from}
                    input.wide(
                        type="number" step="8" min="0" max="2500"
                        value="{parent.movement.config.minStart}"
                        oninput="{parent.wireAndReset('movement.config.minStart')}"
                    )
                label.fifty.npt.npr.npb.nmt
                    span {parent.voc.to}
                    input.wide(
                        type="number" step="8" min="0" max="2500"
                        value="{parent.movement.config.maxStart}"
                        oninput="{parent.wireAndReset('movement.config.maxStart')}"
                    )
                .clear
            b {parent.voc.gravityHeading}
            label.fifty.npt.npl.nmt
                span X:
                input.wide(
                    type="number" step="32" min="-4096" max="4096"
                    value="{parent.movement.config.accel.x}"
                    oninput="{parent.wireAndReset('movement.config.accel.x')}"
                )
            label.fifty.npt.npr.nmt
                span Y:
                input.wide(
                    type="number" step="32" min="-4096" max="4096"
                    value="{parent.movement.config.accel.y}"
                    oninput="{parent.wireAndReset('movement.config.accel.y')}"
                )
            .clear
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
        fieldset
            b {parent.voc.rotationMethod}
            .aButtonGroup.wide
                button.small(onclick="{parent.changeRotationMethod('noRotation')}" class="{active: parent.rotation.type === 'noRotation'}" )
                    svg.feather
                        use(xlink:href="#particles-no-rotate")
                    span  {parent.voc.rotationMethods.static}
                button.small(onclick="{parent.changeRotationMethod('rotation')}" class="{active: parent.rotation.type === 'rotation'}" )
                    svg.feather
                        use(xlink:href="#particles-rotate")
                    span  {parent.voc.rotationMethods.dynamic}
        // noRotation
        fieldset(if="{parent.rotation.type === 'noRotation'}")
            label
                b {parent.voc.startingDirection}
                input(
                    type="range" min="0" max="360"
                    data-wired-force-minmax="yes"
                    value="{parent.rotation.config.rotation}"
                    oninput="{parent.wireAndReset('rotation.config.rotation')}"
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
                    oninput="{parent.wireAndReset('this.rotation.config.minStart')}"
                )
            label.fifty.npt.npr.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="1" min="-360" max="360"
                    data-wired-force-minmax="yes"
                    value="{parent.rotation.config.maxStart}"
                    oninput="{parent.wireAndReset('this.rotation.config.maxStart')}"
                )
        fieldset(if="{parent.rotation.type === 'rotation'}")
            b {parent.voc.rotationSpeed}
            br
            label.fifty.npt.npl.npb.nmt
                span {parent.voc.from}
                input.wide(
                    type="number" step="8" min="0" max="2500"
                    value="{parent.rotation.config.minSpeed}"
                    oninput="{parent.wireAndReset('rotation.config.minSpeed')}"
                )
            label.fifty.npt.npr.npb.nmt
                span {parent.voc.to}
                input.wide(
                    type="number" step="8" min="0" max="2500"
                    value="{parent.rotation.config.maxSpeed}"
                    oninput="{parent.wireAndReset('rotation.config.maxSpeed')}"
                )
            .clear
        fieldset(if="{parent.rotation.type === 'rotation'}")
            label
                b {parent.voc.rotationAcceleration}
                input.wide(
                    type="number" step="30" min="-3000" max="3000"
                    value="{parent.rotation.config.accel}"
                    oninput="{parent.wireAndReset('rotation.config.accel')}"
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
                button.small(onclick="{parent.changeSpawnType('spawnBurst')}" class="{active: parent.spawnBh.type === 'spawnBurst'}")
                    svg.feather
                        use(xlink:href="#loader")
                    span {parent.voc.spawnShapes.star}
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

        fieldset(if="{parent.spawnBh.type === 'spawnShape' && parent.spawnBh.config.type === 'rect'}")
            // Rectangles
            label.fifty.npt.npl.npb.nmt
                b {parent.voc.width}
                input.wide(
                    type="number" step="8" min="-4096" max="4096"
                    value="{parent.spawnBh.config.data.width}"
                    oninput="{parent.setRectWidth}"
                )
            label.fifty.npt.npr.npb.nmt
                b {parent.voc.height}
                input.wide(
                    type="number" step="8" min="-4096" max="4096"
                    value="{parent.spawnBh.config.data.height}"
                    oninput="{parent.setRectHeight}"
                )
            .clear
            label.checkbox
                input(
                    type="checkbox" checked="{parent.spawnBh.config.data.rotation}"
                    onchange="{parent.wireAndReset('spawnBh.config.data.rotation')}"
                )
                b {parent.voc.rotateTexture}
        fieldset(if="{parent.spawnBh.type === 'spawnBurst'}")
            // Spaced bursts
            label
                b {parent.voc.burstSpacing}
                input.wide(
                    type="number" min="1" max="360"
                    value="{parent.spawnBh.config.spacing}"
                    oninput="{parent.wire('spawnBh.config.spacing')}"
                )
            label
                b {parent.voc.burstStart}
                input.wide(
                    type="number" min="1" max="360"
                    value="{parent.spawnBh.config.spacing}"
                    oninput="{parent.wire('spawnBh.config.spacing')}"
                )
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

        // Ct.js' emitter asset's behaviors is ensured to be a tuple
        // @see src/node_requires/resources/emitterTandems/types.d.ts
        this.updateShortcuts = () => {
            const em = this.opts.emitter;
            this.emitter = em;
            this.alpha = em.settings.behaviors[0].config.alpha;
            this.color = em.settings.behaviors[1].config.color;
            this.blendMode = em.settings.behaviors[2].config;
            this.scale = em.settings.behaviors[3].config;
            this.movement = em.settings.behaviors[4];
            this.spawnBh = em.settings.behaviors[5];
            this.rotation = em.settings.behaviors[6];
        };
        this.on('update', () => {
            if (this.emitter !== this.opts.emitter) {
                this.updateShortcuts();
            }
        });
        this.updateShortcuts();

        const {getTexturePreview} = require('./data/node_requires/resources/textures');
        this.getPreview = () => getTexturePreview(this.opts.emitter.texture);

        this.wireAndReset = path => e => {
            this.wire(path)(e);
            // window.signals.trigger('emitterResetRequest');
        };

        this.pickingTexture = false;

        /* TODO: check if such methods are needed, and if they are, update for v3 behaviors
        this.updateScaleCurve = () => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = PIXI.particles;
                emtInst.startScale = PropertyNode.createList(this.opts.emitter.settings.scale);
            } else {
                window.signals.trigger('emitterResetRequest');
            }
        };
        this.updateSpeedCurve = () => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = PIXI.particles;
                emtInst.startSpeed = PropertyNode.createList(this.opts.emitter.settings.speed);
            } else {
                window.signals.trigger('emitterResetRequest');
            }
        };
        this.updateColorCurve = () => {
            if (this.opts.emittermap && (this.opts.emitter.uid in this.opts.emittermap)) {
                const emtInst = this.opts.emittermap[this.opts.emitter.uid];
                const {PropertyNode} = PIXI.particles;

                emtInst.startColor = PropertyNode.createList(this.opts.emitter.settings.color);
                emtInst.startAlpha = PropertyNode.createList(this.opts.emitter.settings.alpha);
            } else {
                window.signals.trigger('emitterResetRequest');
            }
        };*/
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

        this.changeTextureMethod = type => e => {
            this.opts.emitter.textureBehavior = type;
            window.signals.trigger('emitterResetRequest');
        };
        this.changeSpawnType = type => e => {
            const oldType = this.spawnBh.config?.type || this.spawnBh.type;
            if (oldType === type) {
                return; // nothing to do if changing to the same shape
            }
            const oldBehavior = this.spawnBh;
            const {behaviors} = this.opts.emitter.settings;
            let newBh;
            switch (type) {
                case 'rect':
                newBh = {
                    type: 'spawnShape',
                    config: {
                        type: 'rect',
                        data: {
                            x: -100,
                            y: -100,
                            width: 200,
                            height: 200
                        }
                    }
                };
                break;

                case 'torus':
                newBh = {
                    type: 'spawnShape',
                    config: {
                        type: 'torus',
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

                case 'spawnBurst':
                newBh = {
                    type: 'spawnBurst',
                    config: {
                        spacing: 360 / 5,
                        start: 0,
                        distance: 0,
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
        this.changeRotationMethod = type => e => {
            const oldType = this.rotation.type;
            if (oldType === type) {
                return; // nothing to do if changing to the same rotation metho
            }
            const oldBehavior = this.rotation;
            const {behaviors} = this.opts.emitter.settings;
            let newBh;
            if (type === 'noRotation') {
                newBh = {
                    type: 'noRotation',
                    config: {
                        rotation: 0
                    }
                };
            } else {
                newBh = {
                    type: 'rotation',
                    config: {
                        minStart: 0,
                        maxStart: 360,
                        minSpeed: 0,
                        maxSpeed: 0,
                        accel: 0
                    }
                }
            }
            behaviors.splice(6, 1, newBh);
            this.updateShortcuts();
            window.signals.trigger('emitterResetRequest');
        };
        this.changeMovementType = type => e => {
            console.log(e);
            const oldType = this.movement.type;
            if (oldType === type) {
                return; // nothing to do if changing to the same movement method
            }
            const oldBehavior = this.movement;
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
                    config:  {
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

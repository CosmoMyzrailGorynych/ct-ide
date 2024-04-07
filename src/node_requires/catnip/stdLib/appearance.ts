const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'Set texture',
    type: 'command',
    code: 'set texture',
    icon: 'droplet',
    jsTemplate: (vals) => `this.tex = ${vals.texture};`,
    lib: 'core.appearance',
    i18nKey: 'set texture',
    pieces: [{
        type: 'argument',
        key: 'texture',
        typeHint: 'string',
        assets: 'texture',
        required: true
    }]
}, {
    name: 'Set scale',
    type: 'command',
    code: 'set scale',
    icon: 'droplet',
    jsTemplate: (vals) => `this.scale.x = this.scale.y = ${vals.scale};`,
    lib: 'core.appearance',
    i18nKey: 'set scale',
    pieces: [{
        type: 'argument',
        key: 'scale',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Set scale',
    type: 'command',
    code: 'set scale xy',
    icon: 'droplet',
    jsTemplate: (vals) => `this.scale.set(${vals.x}, ${vals.y});`,
    lib: 'core.appearance',
    i18nKey: 'set scale xy',
    pieces: [{
        type: 'argument',
        key: 'x',
        typeHint: 'number',
        required: true
    }, {
        type: 'argument',
        key: 'y',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Set skew',
    type: 'command',
    code: 'set skew',
    icon: 'droplet',
    jsTemplate: (vals) => `this.skew.set(${vals.x}, ${vals.y});`,
    lib: 'core.appearance',
    i18nKey: 'set skew',
    pieces: [{
        type: 'argument',
        key: 'x',
        typeHint: 'number',
        required: true
    }, {
        type: 'argument',
        key: 'y',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Set texture angle',
    type: 'command',
    code: 'set angle',
    icon: 'droplet',
    jsTemplate: (vals) => `this.angle = ${vals.degrees};`,
    lib: 'core.appearance',
    i18nKey: 'set angle',
    pieces: [{
        type: 'argument',
        key: 'degrees',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Set opacity',
    type: 'command',
    code: 'set alpha',
    icon: 'droplet',
    jsTemplate: (vals) => `this.alpha = ${vals.value};`,
    lib: 'core.appearance',
    i18nKey: 'set alpha',
    pieces: [{
        type: 'argument',
        key: 'value',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Set depth',
    type: 'command',
    code: 'set depth',
    icon: 'droplet',
    jsTemplate: (vals) => `this.zIndex = ${vals.value};`,
    lib: 'core.appearance',
    i18nKey: 'set depth',
    pieces: [{
        type: 'argument',
        key: 'value',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Set tint',
    type: 'command',
    code: 'set tint',
    icon: 'droplet',
    jsTemplate: (vals) => `this.tint = ${vals.value};`,
    lib: 'core.appearance',
    i18nKey: 'set tint',
    pieces: [{
        type: 'argument',
        key: 'value',
        typeHint: 'color',
        required: true
    }]
}, {
    name: 'Play animation',
    type: 'command',
    code: 'play animation',
    icon: 'droplet',
    jsTemplate: () => 'this.play();',
    lib: 'core.appearance',
    i18nKey: 'play animation',
    pieces: []
}, {
    name: 'Stop animation',
    type: 'command',
    code: 'stop animation',
    icon: 'droplet',
    jsTemplate: () => 'this.stop();',
    lib: 'core.appearance',
    i18nKey: 'stop animation',
    pieces: []
}, {
    name: 'Go to frame and play',
    displayName: 'Go to frame',
    type: 'command',
    code: 'goto play',
    icon: 'droplet',
    jsTemplate: (values) => `this.gotoAndPlay(${values.frame});`,
    lib: 'core.appearance',
    i18nKey: 'goto frame play',
    displayI18nKey: 'goto frame',
    pieces: [{
        type: 'argument',
        key: 'frame',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'and play',
        i18nKey: 'and play animation'
    }]
}, {
    name: 'Go to frame and stop',
    displayName: 'Go to frame',
    type: 'command',
    code: 'goto stop',
    icon: 'droplet',
    jsTemplate: (values) => `this.gotoAndStop(${values.frame});`,
    lib: 'core.appearance',
    i18nKey: 'goto frame stop',
    displayI18nKey: 'goto frame',
    pieces: [{
        type: 'argument',
        key: 'frame',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'and stop',
        i18nKey: 'and stop animation'
    }]
}, {
    name: 'Set animation speed',
    type: 'command',
    code: 'set animation speed',
    icon: 'droplet',
    jsTemplate: (values) => `this.animationSpeed = ${values.speed};`,
    lib: 'core.appearance',
    i18nKey: 'set animation speed',
    pieces: [{
        type: 'argument',
        key: 'speed',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'get texture',
    type: 'computed',
    code: 'get texture',
    icon: 'droplet',
    jsTemplate: () => 'this.tex',
    lib: 'core.appearance',
    i18nKey: 'texture',
    pieces: [],
    typeHint: 'string'
}, {
    name: 'get scale by x',
    type: 'computed',
    code: 'get scale x',
    icon: 'droplet',
    jsTemplate: () => 'this.scale.x',
    lib: 'core.appearance',
    i18nKey: 'scale x',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get scale by y',
    type: 'computed',
    code: 'get scale y',
    icon: 'droplet',
    jsTemplate: () => 'this.scale.y',
    lib: 'core.appearance',
    i18nKey: 'scale y',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get skew by x',
    type: 'computed',
    code: 'get skew x',
    icon: 'droplet',
    jsTemplate: () => 'this.skew.x',
    lib: 'core.appearance',
    i18nKey: 'skew x',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get skew by y',
    type: 'computed',
    code: 'get skew y',
    icon: 'droplet',
    jsTemplate: () => 'this.skew.y',
    lib: 'core.appearance',
    i18nKey: 'skew y',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get texture angle',
    type: 'computed',
    code: 'get angle',
    icon: 'droplet',
    jsTemplate: () => 'this.angle',
    lib: 'core.appearance',
    i18nKey: 'get angle',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get opacity',
    type: 'computed',
    code: 'get alpha',
    icon: 'droplet',
    jsTemplate: () => 'this.alpha',
    lib: 'core.appearance',
    i18nKey: 'get alpha',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get depth',
    type: 'computed',
    code: 'get depth',
    icon: 'droplet',
    jsTemplate: () => 'this.zIndex',
    lib: 'core.appearance',
    i18nKey: 'get depth',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'tint',
    type: 'computed',
    code: 'get tint',
    icon: 'droplet',
    jsTemplate: () => 'this.tint',
    lib: 'core.appearance',
    i18nKey: 'get tint',
    pieces: [],
    typeHint: 'color'
}, {
    name: 'get animation speed',
    type: 'computed',
    code: 'get animation speed',
    icon: 'droplet',
    jsTemplate: () => 'this.animationSpeed',
    lib: 'core.appearance',
    i18nKey: 'get animation speed',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get current frame',
    type: 'computed',
    code: 'get current frame',
    icon: 'droplet',
    jsTemplate: () => 'this.currentFrame',
    lib: 'core.appearance',
    i18nKey: 'get current frame',
    pieces: [],
    typeHint: 'number'
}];

export default blocks;

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'Move copy',
    type: 'command',
    code: 'move copy',
    icon: 'move',
    jsTemplate: () => 'this.move();',
    lib: 'core.movement',
    i18nKey: 'move copy',
    pieces: []
}, {
    name: 'Change speed',
    type: 'command',
    code: 'set speed',
    icon: 'move',
    jsTemplate: (vals) => `this.speed = ${vals.speed};`,
    lib: 'core.movement',
    i18nKey: 'set speed',
    pieces: [{
        type: 'argument',
        key: 'speed',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Change gravity',
    type: 'command',
    code: 'set gravity',
    icon: 'move',
    jsTemplate: (vals) => `this.gravity = ${vals.gravity};`,
    lib: 'core.movement',
    i18nKey: 'set gravity',
    pieces: [{
        type: 'argument',
        key: 'gravity',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Change gravity direction',
    type: 'command',
    code: 'set gravityDir',
    icon: 'move',
    jsTemplate: (vals) => `this.gravityDir = ${vals.degreees};`,
    lib: 'core.movement',
    i18nKey: 'set gravityDir',
    pieces: [{
        type: 'argument',
        key: 'degreees',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Change horizontal speed',
    type: 'command',
    code: 'set hspeed',
    icon: 'move',
    jsTemplate: (vals) => `this.hspeed = ${vals.speed};`,
    lib: 'core.movement',
    i18nKey: 'set hspeed',
    pieces: [{
        type: 'argument',
        key: 'speed',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Change vertical speed',
    type: 'command',
    code: 'set vspeed',
    icon: 'move',
    jsTemplate: (vals) => `this.vspeed = ${vals.speed};`,
    lib: 'core.movement',
    i18nKey: 'set vspeed',
    pieces: [{
        type: 'argument',
        key: 'speed',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Change direction',
    type: 'command',
    code: 'set direction',
    icon: 'move',
    jsTemplate: (vals) => `this.direction = ${vals.degrees};`,
    lib: 'core.movement',
    i18nKey: 'set direction',
    pieces: [{
        type: 'argument',
        key: 'degrees',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Change x',
    type: 'command',
    code: 'set x',
    icon: 'move',
    jsTemplate: (vals) => `this.x = ${vals.pixels};`,
    lib: 'core.movement',
    i18nKey: 'set x',
    pieces: [{
        type: 'argument',
        key: 'pixels',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Change y',
    type: 'command',
    code: 'set y',
    icon: 'move',
    jsTemplate: (vals) => `this.y = ${vals.pixels};`,
    lib: 'core.movement',
    i18nKey: 'set y',
    pieces: [{
        type: 'argument',
        key: 'pixels',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'get speed',
    type: 'computed',
    code: 'get speed',
    icon: 'move',
    jsTemplate: () => 'this.speed',
    lib: 'core.movement',
    i18nKey: 'get speed',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get gravity',
    type: 'computed',
    code: 'get gravity',
    icon: 'move',
    jsTemplate: () => 'this.gravity',
    lib: 'core.movement',
    i18nKey: 'get gravity',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get gravity direction',
    type: 'computed',
    code: 'get gravityDir',
    icon: 'move',
    jsTemplate: () => 'this.gravityDir',
    lib: 'core.movement',
    i18nKey: 'get gravityDir',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get horizontal speed',
    type: 'computed',
    code: 'get hspeed',
    icon: 'move',
    jsTemplate: () => 'this.hspeed',
    lib: 'core.movement',
    i18nKey: 'get hspeed',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get vertical speed',
    type: 'computed',
    code: 'get vspeed',
    icon: 'move',
    jsTemplate: () => 'this.vspeed',
    lib: 'core.movement',
    i18nKey: 'get vspeed',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'get direction',
    type: 'computed',
    code: 'get direction',
    icon: 'move',
    jsTemplate: () => 'this.direction',
    lib: 'core.movement',
    i18nKey: 'get direction',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'x',
    type: 'computed',
    code: 'x',
    icon: 'move',
    jsTemplate: () => 'this.x',
    lib: 'core.movement',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'y',
    type: 'computed',
    code: 'y',
    icon: 'move',
    jsTemplate: () => 'this.y',
    lib: 'core.movement',
    pieces: [],
    typeHint: 'number'
}, {
    name: 'x of copy',
    i18nKey: 'x of copy',
    displayName: 'x of',
    displayI18nKey: 'x of',
    type: 'computed',
    code: 'x of',
    icon: 'move',
    jsTemplate: (values) => `${values.copy}.x`,
    lib: 'core.movement',
    pieces: [{
        type: 'argument',
        key: 'copy',
        typeHint: 'wildcard',
        required: true
    }],
    typeHint: 'number'
}, {
    name: 'y of copy',
    i18nKey: 'y of copy',
    displayName: 'y of',
    displayI18nKey: 'y of',
    type: 'computed',
    code: 'y of',
    icon: 'move',
    jsTemplate: (values) => `${values.copy}.y`,
    lib: 'core.movement',
    pieces: [{
        type: 'argument',
        key: 'copy',
        typeHint: 'wildcard',
        required: true
    }],
    typeHint: 'number'
}];

export default blocks;

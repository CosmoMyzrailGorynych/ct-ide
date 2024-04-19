const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    code: 'array unshift',
    name: 'add an element at start',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'array unshift',
    pieces: [{
        type: 'argument',
        key: 'elt',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'to',
        i18nKey: 'toWrite'
    }, {
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }],
    jsTemplate: (vals) => `${vals.array}.unshift(${vals.elt})`
}, {
    code: 'array push',
    name: 'add an element at end',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'array push',
    pieces: [{
        type: 'argument',
        key: 'elt',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'to',
        i18nKey: 'toWrite'
    }, {
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }],
    jsTemplate: (vals) => `${vals.array}.push(${vals.elt})`
}, {
    code: 'add element at position',
    name: 'add an element at position',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'add element at position',
    displayName: 'add an element',
    displayI18nKey: 'add element',
    pieces: [{
        type: 'argument',
        key: 'elt',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'to',
        i18nKey: 'toDestination'
    }, {
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'at position',
        i18nKey: 'at position'
    }, {
        type: 'argument',
        key: 'position',
        typeHint: 'number'
    }],
    jsTemplate: (vals) => `${vals.array}.splice(${vals.position}, 0, ${vals.elt})`
}, {
    code: 'array pop',
    name: 'remove last element',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'array pop',
    pieces: [{
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }],
    jsTemplate: (vals) => `${vals.array}.pop()`
}, {
    code: 'array shift',
    name: 'remove first element',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'array shift',
    pieces: [{
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }],
    jsTemplate: (vals) => `${vals.array}.shift()`
}, {
    code: 'remove element',
    name: 'remove element from array',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'remove element from array',
    displayName: 'remove element',
    displayI18nKey: 'remove element',
    pieces: [{
        type: 'argument',
        key: 'elt',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'from',
        i18nKey: 'fromSource'
    }, {
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }],
    jsTemplate: (vals) => `${vals.array}.splice(${vals.array}.indexOf(${vals.elt}), 1)`
}, {
    code: 'remove at position',
    name: 'remove element at position',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'remove at position',
    pieces: [{
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'at',
        i18nKey: 'atPosition'
    }, {
        type: 'argument',
        key: 'position',
        typeHint: 'number'
    }],
    jsTemplate: (vals) => `${vals.array}.splice(${vals.position}, 1)`
}, {
    code: 'filter array',
    name: 'filter array',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'filter array',
    pieces: [{
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'with results in',
        i18nKey: 'with results in'
    }, {
        type: 'argument',
        key: 'result',
        typeHint: 'boolean'
    }, {
        type: 'label',
        name: 'and elements',
        i18nKey: 'and elements'
    }, {
        type: 'argument',
        key: 'elt',
        typeHint: 'wildcard'
    }, {
        type: 'filler'
    }, {
        type: 'label',
        name: 'store new array in',
        i18nKey: 'store new array in'
    }, {
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard'
    }, {
        type: 'blocks',
        key: 'loop'
    }],
    jsTemplate: (vals) => `${vals.return} = ${vals.array}.filter(elt => {
        ${vals.elt} = elt;
        ${vals.loop}
        return ${vals.result};
    });`
}, {
    code: 'map array',
    name: 'map array',
    type: 'command',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'map array',
    pieces: [{
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard'
    }, {
        type: 'label',
        name: 'with results in',
        i18nKey: 'with results in'
    }, {
        type: 'argument',
        key: 'result',
        typeHint: 'boolean'
    }, {
        type: 'label',
        name: 'and elements',
        i18nKey: 'and elements'
    }, {
        type: 'argument',
        key: 'elt',
        typeHint: 'wildcard'
    }, {
        type: 'filler'
    }, {
        type: 'label',
        name: 'store new array in',
        i18nKey: 'store new array in'
    }, {
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard'
    }, {
        type: 'blocks',
        key: 'loop'
    }],
    jsTemplate: (vals) => `${vals.return} = ${vals.array}.map(elt => {
        ${vals.elt} = elt;
        ${vals.loop}
        return ${vals.result};
    });`
}, {
    code: 'array length',
    name: 'array length',
    type: 'computed',
    i18nKey: 'array length',
    displayName: 'length of',
    displayI18nKey: 'lengthOf',
    icon: 'grid',
    lib: 'core.arrays',
    typeHint: 'number',
    pieces: [{
        key: 'array',
        type: 'argument',
        typeHint: 'wildcard'
    }],
    jsTemplate: (values) => `${values.array}.length`
}, {
    name: 'get array element',
    i18nKey: 'array get',
    type: 'computed',
    code: 'get',
    icon: 'grid',
    lib: 'core.arrays',
    pieces: [{
        type: 'argument',
        key: 'obj',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'at',
        i18nKey: 'atPosition'
    }, {
        type: 'argument',
        key: 'index',
        typeHint: 'number',
        required: true
    }],
    jsTemplate: (values) => `${values.obj}[${values.index}]`,
    typeHint: 'wildcard'
}, {
    name: 'new array',
    type: 'computed',
    code: 'new array',
    icon: 'grid',
    lib: 'core.arrays',
    i18nKey: 'new array',
    pieces: [],
    typeHint: 'wildcard',
    jsTemplate: () => 'new Array()',
    customClass: 'constant'
}];

export default blocks;

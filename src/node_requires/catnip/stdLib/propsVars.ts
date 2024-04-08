const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'this',
    type: 'computed',
    code: 'this',
    icon: 'crosshair',
    jsTemplate: () => 'this',
    lib: 'core.camera',
    typeHint: 'wildcard',
    pieces: [],
    i18nKey: 'this',
    customClass: 'constant'
}, {
    name: 'Set property variable value',
    type: 'command',
    code: 'set',
    icon: 'code-alt',
    jsTemplate: (vals) => `${vals.var} = ${vals.value};`,
    lib: 'core.propsVars',
    i18nKey: 'set property variable',
    displayName: 'Set',
    displayI18nKey: 'set',
    pieces: [{
        type: 'argument',
        key: 'var',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'value',
        i18nKey: 'value'
    }, {
        type: 'argument',
        key: 'value',
        typeHint: 'wildcard',
        required: true
    }]
}, {
    name: 'Increase property variable',
    type: 'command',
    code: 'increase',
    icon: 'plus-circle',
    jsTemplate: (vals) => `${vals.var} += ${vals.val};`,
    lib: 'core.propsVars',
    i18nKey: 'increase',
    pieces: [{
        type: 'argument',
        key: 'var',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'by',
        i18nKey: 'changeBy'
    }, {
        type: 'argument',
        key: 'val',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Decrease property variable',
    type: 'command',
    code: 'decrease',
    icon: 'minus-circle',
    jsTemplate: (vals) => `${vals.var} -= ${vals.val};`,
    lib: 'core.propsVars',
    i18nKey: 'decrease',
    pieces: [{
        type: 'argument',
        key: 'var',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'by',
        i18nKey: 'changeBy'
    }, {
        type: 'argument',
        key: 'val',
        typeHint: 'number',
        required: true
    }]
}, {
    name: 'Increment property variable',
    type: 'command',
    code: 'increment',
    icon: 'plus-circle',
    jsTemplate: (vals) => `${vals.var}++;`,
    lib: 'core.propsVars',
    i18nKey: 'increment',
    pieces: [{
        type: 'argument',
        key: 'var',
        typeHint: 'wildcard',
        required: true
    }]
}, {
    name: 'Decrement property variable',
    type: 'command',
    code: 'decrement',
    icon: 'minus-circle',
    jsTemplate: (vals) => `${vals.var}--;`,
    lib: 'core.propsVars',
    i18nKey: 'decrement',
    pieces: [{
        type: 'argument',
        key: 'var',
        typeHint: 'wildcard',
        required: true
    }]
}];

const getMutatorsBut = (exclude: string) => blocks
    .filter(b => b.code !== exclude && b.code !== 'this')
    .map(b => ({
        lib: b.lib,
        code: b.code
    }));
for (const block of blocks) {
    block.mutators = getMutatorsBut(block.code);
}

export default blocks;

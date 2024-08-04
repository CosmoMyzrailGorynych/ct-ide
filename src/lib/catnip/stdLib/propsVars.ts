const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'this',
    type: 'computed',
    code: 'this',
    icon: 'crosshair',
    jsTemplate: () => 'this',
    lib: 'core.propsVars',
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

blocks.push({
    name: 'Save to storage',
    type: 'command',
    code: 'save localStorage',
    icon: 'save',
    jsTemplate: (vals) => `localStorage.setItem(${vals.key}, ${vals.value});`,
    lib: 'core.propsVars',
    i18nKey: 'save to storage',
    pieces: [{
        type: 'argument',
        key: 'key',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'value',
        i18nKey: 'value'
    }, {
        type: 'argument',
        key: 'value',
        typeHint: 'string',
        required: true
    }]
}, {
    name: 'Delete from storage',
    type: 'command',
    code: 'delete localStorage',
    icon: 'save',
    jsTemplate: (vals) => `localStorage.removeItem(${vals.key});`,
    lib: 'core.propsVars',
    i18nKey: 'delete from storage',
    pieces: [{
        type: 'argument',
        key: 'key',
        typeHint: 'string',
        required: true
    }]
}, {
    name: 'load from storage',
    type: 'computed',
    typeHint: 'string',
    code: 'load localStorage',
    icon: 'save',
    jsTemplate: (vals) => `localStorage.getItem(${vals.key})`,
    lib: 'core.propsVars',
    i18nKey: 'load from storage',
    pieces: [{
        type: 'argument',
        key: 'key',
        typeHint: 'string',
        required: true
    }]
}, {
    name: 'is key in storage',
    type: 'computed',
    typeHint: 'boolean',
    code: 'is localStorage',
    icon: 'save',
    jsTemplate: (vals) => `(${vals.key} in localStorage)`,
    lib: 'core.propsVars',
    i18nKey: 'is key in storage',
    pieces: [{
        type: 'argument',
        key: 'key',
        typeHint: 'string',
        required: true
    }]
});

export default blocks;

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'Concatenate strings',
    i18nKey: 'concatenate strings',
    code: 'concat',
    icon: 'string',
    type: 'computed',
    typeHint: 'string',
    hideIcon: true,
    hideLabel: true,
    jsTemplate: (vals) => `(${vals.a} + ${vals.b})`,
    lib: 'core.math',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: '+'
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'string',
        required: true
    }]
}, {
    name: 'convert to string',
    i18nKey: 'convert to string',
    type: 'computed',
    code: 'convert to string',
    icon: 'string',
    jsTemplate: (values) => `String(${values.val})`,
    lib: 'core.utils',
    pieces: [{
        type: 'argument',
        key: 'val',
        typeHint: 'wildcard',
        required: true
    }],
    typeHint: 'string'
}];

export default blocks;

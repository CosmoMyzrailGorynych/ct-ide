const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'new array',
    type: 'computed',
    code: 'new array',
    icon: 'grid',
    jsTemplate: () => 'new Array()',
    lib: 'core.arrays',
    i18nKey: 'new array',
    pieces: [],
    typeHint: 'wildcard',
    customClass: 'constant'
}, {
    name: 'get array element',
    i18nKey: 'array get',
    type: 'computed',
    code: 'get',
    icon: 'grid',
    jsTemplate: (values) => `${values.obj}[${values.index}]`,
    lib: 'core.arrays',
    pieces: [{
        type: 'argument',
        key: 'obj',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'argument',
        key: 'index',
        typeHint: 'number',
        required: true
    }],
    typeHint: 'wildcard'
}];

export default blocks;

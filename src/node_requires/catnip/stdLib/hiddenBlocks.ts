const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'Variable',
    hideLabel: true,
    type: 'computed',
    typeHint: 'wildcard',
    code: 'variable',
    icon: 'clock',
    jsTemplate: (values) => values.variableName,
    lib: 'core.hidden',
    i18nKey: 'variable',
    pieces: [{
        type: 'propVar'
    }],
    customClass: 'userdefined'
}, {
    name: 'Property',
    hideLabel: true,
    type: 'computed',
    typeHint: 'wildcard',
    code: 'property',
    icon: 'archive',
    jsTemplate: (values) => `this['${values.variableName}']`,
    lib: 'core.hidden',
    i18nKey: 'property',
    pieces: [{
        type: 'propVar'
    }],
    customClass: 'userdefined'
}, {
    name: 'Behavior property',
    hideLabel: true,
    type: 'computed',
    typeHint: 'wildcard',
    code: 'behavior property',
    icon: 'behavior',
    jsTemplate: (values) => `this['${values.variableName}']`,
    lib: 'core.hidden',
    i18nKey: 'behavior property',
    pieces: [{
        type: 'propVar'
    }],
    customClass: 'userdefined'
}, {
    name: 'Event variable',
    hideLabel: true,
    type: 'computed',
    typeHint: 'wildcard',
    code: 'event variable',
    icon: 'bell',
    jsTemplate: (values) => values.variableName,
    lib: 'core.hidden',
    i18nKey: 'event variable',
    pieces: [{
        type: 'propVar'
    }],
    customClass: 'userdefined'
}, {
    name: 'Script options',
    code: 'script options',
    lib: 'core.hidden',
    i18nKey: 'script options',
    displayI18nKey: 'options',
    type: 'computed',
    typeHint: 'wildcard',
    icon: 'code-alt',
    jsTemplate: () => 'options',
    pieces: []
}, {
    name: 'Content type entries',
    hideLabel: true,
    type: 'computed',
    typeHint: 'wildcard',
    lib: 'core.hidden',
    code: 'content type',
    i18nKey: 'content type entries',
    icon: 'table-sidebar',
    pieces: [{
        type: 'propVar'
    }],
    jsTemplate: (values) => `content['${values.variableName}']`
}];

export default blocks;

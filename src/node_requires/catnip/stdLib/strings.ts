const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'Concatenate strings',
    i18nKey: 'concatenate strings',
    displayName: 'join',
    displayI18nKey: 'join',
    code: 'concat',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'string',
    hideLabel: true,
    jsTemplate: (vals) => `(${vals.a} + ${vals.b})`,
    lib: 'core.strings',
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
    }],
    mutators: [{
        code: 'concat3',
        lib: 'core.strings'
    }]
}, {
    name: 'Concatenate strings (triple)',
    i18nKey: 'concatenate strings triple',
    displayName: 'join',
    displayI18nKey: 'join',
    code: 'concat3',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'string',
    hideLabel: true,
    jsTemplate: (vals) => `(${vals.a} + ${vals.b} + ${vals.c})`,
    lib: 'core.strings',
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
    }, {
        type: 'label',
        name: '+'
    }, {
        type: 'argument',
        key: 'c',
        typeHint: 'string',
        required: true
    }],
    mutators: [{
        code: 'concat',
        lib: 'core.strings'
    }]
}, {
    name: 'has a substring',
    hideLabel: true,
    i18nKey: 'hasSubstring',
    code: 'hasSubstring',
    lib: 'core.strings',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'contains',
        i18nKey: 'contains'
    }, {
        type: 'argument',
        key: 'substring',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (vals) => `${vals.string}.includes(${vals.substring})`
}, {
    name: 'substring position',
    i18nKey: 'substringPosition',
    code: 'substringPosition',
    lib: 'core.strings',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'number',
    pieces: [{
        type: 'argument',
        key: 'substring',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'in',
        i18nKey: 'inInside'
    }, {
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (vals) => `${vals.string}.indexOf(${vals.substring})`
}, {
    name: 'string length',
    i18nKey: 'stringLength',
    displayName: 'length of',
    displayI18nKey: 'lengthOf',
    code: 'stringLength',
    lib: 'core.strings',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'number',
    pieces: [{
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (vals) => `${vals.string}.length`
}, {
    name: 'replace substring',
    i18nKey: 'replace substring',
    hideLabel: true,
    code: 'replaceSubstring',
    lib: 'core.strings',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'string',
    pieces: [{
        type: 'label',
        name: 'inInside',
        i18nKey: 'inInside'
    }, {
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'replace',
        i18nKey: 'replace'
    }, {
        type: 'argument',
        key: 'substring',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'with',
        i18nKey: 'with'
    }, {
        type: 'argument',
        key: 'newString',
        typeHint: 'string'
    }],
    jsTemplate: (vals) => `${vals.string}.replace(${vals.substring}, ${vals.newString})`
}, {
    name: 'replace all substrings',
    i18nKey: 'replace all substrings',
    hideLabel: true,
    code: 'replaceAllSubstrings',
    lib: 'core.strings',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'string',
    pieces: [{
        type: 'label',
        name: 'inInside',
        i18nKey: 'inInside'
    }, {
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'replace all',
        i18nKey: 'replaceAll'
    }, {
        type: 'argument',
        key: 'substring',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'with',
        i18nKey: 'with'
    }, {
        type: 'argument',
        key: 'newString',
        typeHint: 'string'
    }],
    jsTemplate: (vals) => `${vals.string}.replaceAll(${vals.substring}, ${vals.newString})`
}, {
    name: 'regex passes',
    i18nKey: 'regex passes',
    code: 'regexTest',
    lib: 'core.strings',
    icon: 'code-alt',
    type: 'computed',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        key: 'regex',
        typeHint: 'string',
        required: true
    }, {
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (vals) => `new RegExp(${vals.regex}).test(${vals.string})`
}, {
    name: 'replace by regex',
    i18nKey: 'replace by regex',
    hideLabel: true,
    code: 'replaceSubstringRegex',
    lib: 'core.strings',
    icon: 'code-alt',
    type: 'computed',
    typeHint: 'string',
    pieces: [{
        type: 'label',
        name: 'inInside',
        i18nKey: 'inInside'
    }, {
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'replace by regex',
        i18nKey: 'replaceByRegex'
    }, {
        type: 'argument',
        key: 'regex',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'with',
        i18nKey: 'with'
    }, {
        type: 'argument',
        key: 'newString',
        typeHint: 'string'
    }],
    jsTemplate: (vals) => `${vals.string}.replace(new RegExp(${vals.regex}), ${vals.newString})`
}, {
    name: 'replace all substrings by regex',
    i18nKey: 'replace all substrings by regex',
    hideLabel: true,
    code: 'replaceAllSubstringsRegex',
    lib: 'core.strings',
    icon: 'code-alt',
    type: 'computed',
    typeHint: 'string',
    pieces: [{
        type: 'label',
        name: 'inInside',
        i18nKey: 'inInside'
    }, {
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'replace all by regex',
        i18nKey: 'replace all by regex'
    }, {
        type: 'argument',
        key: 'regex',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'with',
        i18nKey: 'with'
    }, {
        type: 'argument',
        key: 'newString',
        typeHint: 'string'
    }],
    jsTemplate: (vals) => `${vals.string}.replaceAll(new RegExp(${vals.regex}, 'g'), ${vals.newString})`
}, {
    name: 'split by a substring',
    i18nKey: 'split by a substring',
    displayName: 'split',
    displayI18nKey: 'split',
    code: 'splitBySubstring',
    lib: 'core.strings',
    icon: 'grid',
    type: 'computed',
    typeHint: 'wildcard',
    pieces: [{
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'by',
        i18nKey: 'by'
    }, {
        type: 'argument',
        key: 'substring',
        typeHint: 'string'
    }],
    jsTemplate: (vals) => `${vals.string}.split(${vals.substring})`
}, {
    name: 'slice a string',
    i18nKey: 'slice a string',
    code: 'slice',
    lib: 'core.strings',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'string',
    pieces: [{
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'from',
        i18nKey: 'fromDestination'
    }, {
        type: 'argument',
        key: 'from',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'to',
        i18nKey: 'toDestination'
    }, {
        type: 'argument',
        key: 'to',
        typeHint: 'number',
        required: true
    }],
    jsTemplate: (vals) => `${vals.string}.slice(${vals.from}, ${vals.to})`
}, {
    name: 'trim whitespace',
    i18nKey: 'trim whitespace',
    code: 'trimWhitespace',
    lib: 'core.strings',
    icon: 'string',
    hideIcon: true,
    type: 'computed',
    typeHint: 'string',
    pieces: [{
        type: 'argument',
        key: 'string',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (vals) => `${vals.string}.trim()`
}, {
    name: 'to uppercase',
    i18nKey: 'to uppercase',
    type: 'computed',
    typeHint: 'string',
    code: 'to uppercase',
    icon: 'string',
    hideIcon: true,
    lib: 'core.strings',
    pieces: [{
        type: 'argument',
        key: 'val',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (values) => `${values.val}.toUpperCase()`
}, {
    name: 'to lowercase',
    i18nKey: 'to lowercase',
    type: 'computed',
    typeHint: 'string',
    code: 'to lowercase',
    icon: 'string',
    hideIcon: true,
    lib: 'core.strings',
    pieces: [{
        type: 'argument',
        key: 'val',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (values) => `${values.val}.toLowerCase()`
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
}, {
    name: 'constant string',
    i18nKey: 'const string',
    type: 'computed',
    code: 'const string',
    icon: 'string',
    jsTemplate: (values) => values.val,
    lib: 'core.utils',
    hideLabel: true,
    documentationI18nKey: 'constant string',
    pieces: [{
        type: 'argument',
        key: 'val',
        typeHint: 'string',
        required: true
    }],
    typeHint: 'string'
}];

export default blocks;

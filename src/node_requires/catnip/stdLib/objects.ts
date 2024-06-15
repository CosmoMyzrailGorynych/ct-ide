import {optionsToStringObj, getOptions} from './_utils';

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'new object',
    type: 'command',
    lib: 'core.objects',
    code: 'new object',
    icon: 'code-alt',
    i18nKey: 'new object',
    pieces: [{
        type: 'filler'
    }, {
        type: 'label',
        name: 'store in',
        i18nKey: 'store in'
    }, {
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard'
    }, {
        type: 'options',
        options: [],
        allowCustom: true
    }],
    jsTemplate: (vals, id, custom) => {
        const options = getOptions({}, [], custom) || {};
        return `${vals.return} = ${optionsToStringObj(options)};`;
    }
}, {
    name: 'Write property to self',
    type: 'command',
    code: 'this write',
    icon: 'code-alt',
    jsTemplate: (vals) => `this[${vals.property}] = ${vals.value};`,
    lib: 'core.objects',
    i18nKey: 'this write',
    pieces: [{
        type: 'argument',
        key: 'property',
        typeHint: 'string',
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
    name: 'Write property to current room',
    displayName: 'Write',
    type: 'command',
    code: 'current room write',
    icon: 'code-alt',
    jsTemplate: (vals) => `rooms.current[${vals.property}] = ${vals.value};`,
    lib: 'core.objects',
    i18nKey: 'current room write',
    displayI18nKey: 'write',
    pieces: [{
        type: 'argument',
        key: 'property',
        typeHint: 'string',
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
    }, {
        type: 'label',
        name: 'to current room',
        i18nKey: 'to current room'
    }]
}, {
    name: 'Write property to object',
    type: 'command',
    code: 'object write',
    icon: 'code-alt',
    jsTemplate: (vals) => `${vals.object}[${vals.property}] = ${vals.value};`,
    lib: 'core.objects',
    i18nKey: 'write property to object',
    displayName: 'Write',
    displayI18nKey: 'write',
    pieces: [{
        type: 'argument',
        key: 'object',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'property',
        i18nKey: 'property'
    }, {
        type: 'argument',
        key: 'property',
        typeHint: 'string',
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
    name: 'read property from self',
    i18nKey: 'this read',
    displayI18nKey: 'read',
    displayName: 'read',
    type: 'computed',
    lib: 'core.objects',
    code: 'this read',
    icon: 'code-alt',
    pieces: [{
        type: 'argument',
        key: 'property',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (vals) => `this[${vals.property}]`,
    typeHint: 'wildcard'
}, {
    name: 'read property from room',
    type: 'computed',
    lib: 'core.objects',
    code: 'room read',
    icon: 'code-alt',
    i18nKey: 'room read',
    displayName: 'read',
    displayI18nKey: 'read',
    pieces: [{
        type: 'argument',
        key: 'property',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'of current room',
        i18nKey: 'of current room'
    }],
    jsTemplate: (vals) => `rooms.current[${vals.property}]`,
    typeHint: 'wildcard'
}, {
    name: 'read property from object',
    type: 'computed',
    lib: 'core.objects',
    code: 'object read',
    icon: 'code-alt',
    i18nKey: 'object read',
    displayI18nKey: 'read',
    displayName: 'read',
    pieces: [{
        type: 'argument',
        key: 'property',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'from',
        i18nKey: 'fromRead'
    }, {
        type: 'argument',
        key: 'object',
        typeHint: 'wildcard',
        required: true
    }],
    jsTemplate: (vals) => `${vals.object}[${vals.property}]`,
    typeHint: 'wildcard'
}, {
    name: 'delete property in object',
    type: 'command',
    lib: 'core.objects',
    code: 'object delete',
    icon: 'code-alt',
    i18nKey: 'object delete',
    pieces: [{
        type: 'argument',
        key: 'object',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'argument',
        key: 'property',
        typeHint: 'string',
        required: true
    }],
    jsTemplate: (vals) => `delete ${vals.object}[${vals.property}];`
}, {
    name: 'deserialize object',
    type: 'command',
    code: 'json parse',
    icon: 'code-alt',
    lib: 'core.objects',
    i18nKey: 'deserialize object',
    pieces: [{
        type: 'argument',
        key: 'object',
        typeHint: 'string',
        required: true
    }, {
        type: 'filler'
    }, {
        type: 'label',
        name: 'store in',
        i18nKey: 'store in'
    }, {
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard'
    }],
    jsTemplate: (vals) => `${vals.return} = JSON.parse(${vals.object});`
}, {
    name: 'serialize object',
    typeHint: 'string',
    type: 'computed',
    code: 'json stringify',
    icon: 'code-alt',
    lib: 'core.objects',
    i18nKey: 'serialize object',
    pieces: [{
        type: 'argument',
        key: 'object',
        typeHint: 'wildcard',
        required: true
    }],
    documentationI18nKey: 'serialize object',
    jsTemplate: (vals) => `JSON.stringify(${vals.object})`
}, {
    name: 'new empty object',
    type: 'computed',
    code: 'new empty object',
    icon: 'code-alt',
    customClass: 'constant',
    jsTemplate: () => '{}',
    lib: 'core.objects',
    i18nKey: 'new empty object',
    pieces: [],
    typeHint: 'wildcard'
}];

export default blocks;

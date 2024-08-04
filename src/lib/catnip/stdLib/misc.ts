import {getOptions, optionsToStringObj} from './_utils';

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'Block group',
    type: 'command',
    code: 'group',
    icon: 'folder',
    lib: 'core.misc',
    hideIcon: true,
    hideLabel: true,
    i18nKey: 'Group',
    isGroup: true,
    customClass: 'group',
    pieces: [{
        type: 'blocks',
        key: 'blocks',
        placeholder: 'putBlocksHere'
    }],
    jsTemplate: (values) => values.blocks
}, {
    name: 'Note',
    type: 'command',
    code: 'note',
    icon: 'message-circle',
    lib: 'core.misc',
    i18nKey: 'note',
    pieces: [{
        type: 'textbox',
        key: 'note'
    }],
    jsTemplate: (values) => `/* ${values.note} */`,
    customClass: 'note'
}, {
    type: 'command',
    name: 'run script',
    code: 'run script',
    icon: 'code-alt',
    lib: 'core.script',
    i18nKey: 'run script',
    pieces: [{
        type: 'argument',
        typeHint: 'string',
        assets: 'script',
        key: 'name',
        required: true
    }, {
        type: 'options',
        allowCustom: true,
        options: []
    }],
    jsTemplate: (values, id, custom) => {
        const options = getOptions({}, [], custom);
        return `scripts[${values.name}](${options ? optionsToStringObj(options) : ''});`;
    }
}, {
    name: 'Execute js javascript code',
    displayName: 'Execute JavaScript',
    type: 'command',
    code: 'js',
    icon: 'code-alt',
    lib: 'core.misc',
    i18nKey: 'plainJs',
    pieces: [{
        type: 'code',
        key: 'code'
    }],
    jsTemplate: (values) => String(values.code)
}, {
    code: 'define function',
    type: 'command',
    name: 'Define a function',
    i18nKey: 'define function',
    icon: 'function',
    lib: 'core.misc',
    pieces: [{
        type: 'filler'
    }, {
        type: 'label',
        name: 'store in',
        i18nKey: 'store in'
    }, {
        type: 'argument',
        key: 'store',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'blocks',
        key: 'code'
    }],
    jsTemplate: values => `${values.store} = (options) => {\n    ${values.code}\n};`
}, {
    code: 'return',
    type: 'command',
    name: 'Return a value',
    i18nKey: 'return',
    icon: 'function',
    lib: 'core.misc',
    pieces: [{
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard',
        required: true
    }],
    jsTemplate: (values) => `return ${values.return};`
}, {
    code: 'execute function',
    type: 'command',
    name: 'Run a function',
    i18nKey: 'execute function',
    icon: 'function',
    lib: 'core.misc',
    pieces: [{
        type: 'argument',
        key: 'func',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'filler'
    }, {
        type: 'label',
        name: 'store return value in',
        i18nKey: 'store result in'
    }, {
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'options',
        allowCustom: true,
        options: []
    }],
    jsTemplate: (values, id, custom) => {
        const options = getOptions({}, [], custom);
        if (values.return) {
            return `${values.return} = ${values.func}(${options ? optionsToStringObj(options) : ''});`;
        }
        return `${values.func}(${options ? optionsToStringObj(options) : ''});`;
    }
}, {
    code: 'get function option',
    lib: 'core.misc',
    type: 'computed',
    name: 'get function\'s option',
    i18nKey: 'get function option',
    pieces: [{
        type: 'argument',
        key: 'key',
        typeHint: 'string',
        required: true
    }],
    typeHint: 'wildcard',
    icon: 'function',
    jsTemplate: (values) => `options[${values.key}]`
}, {
    name: 'color',
    type: 'computed',
    typeHint: 'color',
    code: 'color',
    icon: 'droplet',
    lib: 'core.misc',
    i18nKey: 'color',
    pieces: [{
        type: 'argument',
        typeHint: 'color',
        key: 'color'
    }],
    jsTemplate: (values) => values.color
}];

export default blocks;

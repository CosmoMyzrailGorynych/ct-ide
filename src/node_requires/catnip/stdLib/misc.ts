import {getOptions, optionsToStringObj} from './_utils';

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
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

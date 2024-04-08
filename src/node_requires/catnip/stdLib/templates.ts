import {getOptions, optionsToStringObj} from './_utils';

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    code: 'templates.copy',
    lib: 'core',
    type: 'command',
    name: 'Templates copy',
    icon: 'template',
    i18nKey: 'templates Templates copy',
    documentation: 'Creates a new copy of a given template inside the current root room.\nA shorthand for `templates.copyIntoRoom(template, x, y, ct.room, exts)`\n\n**template** The name of the template to use\n**x** The x coordinate of a new copy. Defaults to 0.\n**y** The y coordinate of a new copy. Defaults to 0.\n**params** An optional object which parameters will be applied\nto the copy prior to its OnCreate event.\n\n**Returns** The created copy.',
    pieces: [
        {
            type: 'argument',
            key: 'template',
            typeHint: 'string',
            assets: 'template'
        },
        {
            type: 'argument',
            key: 'x',
            typeHint: 'number'
        },
        {
            type: 'argument',
            key: 'y',
            typeHint: 'number'
        },
        {
            type: 'filler'
        },
        {
            type: 'label',
            name: 'store in',
            i18nKey: 'store in'
        },
        {
            type: 'argument',
            key: 'return',
            typeHint: 'wildcard'
        },
        {
            type: 'options',
            options: [],
            allowCustom: true
        }
    ],
    jsTemplate: (values, id, custom) => {
        const options = getOptions({}, [], custom);
        if (values.return && values.return !== 'undefined') {
            return `${values.return} = templates.copy(${values.template}, ${values.x}, ${values.y}${options ? ', ' + optionsToStringObj(options) : ''});`;
        }
        return `templates.copy(${values.template}, ${values.x}, ${values.y}${options ? ', ' + optionsToStringObj(options) : ''});`;
    },
    mutators: [{
        lib: 'core',
        code: 'templates.copyIntoRoom'
    }]
}, {
    code: 'templates.copyIntoRoom',
    lib: 'core',
    type: 'command',
    name: 'Templates copy into room',
    icon: 'template',
    i18nKey: 'templates Templates copy into room',
    documentation: 'Creates a new copy of a given template inside a specific room.\n\n**template** The name of the template to use\n**x** The x coordinate of a new copy. Defaults to 0.\n**y** The y coordinate of a new copy. Defaults to 0.\n**room** The room to which add the copy.\nDefaults to the current room.\n**params** An optional object which parameters will be applied\nto the copy prior to its OnCreate event.\n\n**Returns** The created copy.',
    pieces: [
        {
            type: 'argument',
            key: 'template',
            typeHint: 'string',
            assets: 'template'
        },
        {
            type: 'argument',
            key: 'x',
            typeHint: 'number'
        },
        {
            type: 'argument',
            key: 'y',
            typeHint: 'number'
        },
        {
            type: 'argument',
            key: 'room',
            typeHint: 'wildcard'
        },
        {
            type: 'filler'
        },
        {
            type: 'label',
            name: 'store in',
            i18nKey: 'store in'
        },
        {
            type: 'argument',
            key: 'return',
            typeHint: 'wildcard'
        },
        {
            type: 'options',
            options: [],
            allowCustom: true
        }
    ],
    jsTemplate: (values, id, custom) => {
        const options = getOptions({}, [], custom);
        if (values.return && values.return !== 'undefined') {
            return `${values.return} = templates.copyIntoRoom(${values.template}, ${values.x}, ${values.y}, ${values.room}${options ? ', ' + optionsToStringObj(options) : ''});`;
        }
        return `templates.copyIntoRoom(${values.template}, ${values.x}, ${values.y}, ${values.room}${options ? ', ' + optionsToStringObj(options) : ''});`;
    },
    mutators: [{
        lib: 'core',
        code: 'templates.copy'
    }]
}, {
    name: 'Kill copy',
    type: 'command',
    code: 'kill',
    icon: 'template',
    i18nKey: 'kill copy',
    jsTemplate: () => 'this.kill = true;',
    lib: 'core.templates',
    pieces: []
}, {
    name: 'is copy',
    type: 'computed',
    code: 'is copy',
    icon: 'template',
    lib: 'core.templates',
    i18nKey: 'is copy',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        typeHint: 'wildcard',
        key: 'copy',
        required: true
    }],
    jsTemplate: (values) => `templates.isCopy(${values.copy})`
}, {
    name: 'is valid',
    type: 'computed',
    code: 'is valid',
    icon: 'template',
    lib: 'core.templates',
    i18nKey: 'is valid',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        typeHint: 'wildcard',
        key: 'copy',
        required: true
    }],
    jsTemplate: (values) => `templates.valid(${values.copy})`
}];

export default blocks;

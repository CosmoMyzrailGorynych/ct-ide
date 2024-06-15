import {optionsToStringObj, getOptions} from './_utils';

const roomOptions: IBlockOptions = {
    type: 'options',
    allowCustom: true,
    options: [{
        key: 'isUi',
        name: 'isUi',
        i18nKey: 'isRoomUi',
        typeHint: 'boolean'
    }]
};

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    code: 'rooms.append',
    lib: 'core',
    type: 'command',
    name: 'Rooms append',
    i18nKey: 'rooms Rooms append',
    icon: 'room',
    pieces: [
        {
            type: 'argument',
            key: 'name',
            typeHint: 'string',
            assets: 'room',
            required: true
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
        roomOptions
    ],
    jsTemplate: (values, id, custom) => {
        const options = getOptions(values, ['isUi'], custom);
        if (values.return && values.return !== 'undefined') {
            return `${values.return} = rooms.append(${values.name}${options ? ', ' + optionsToStringObj(options) : ''});`;
        }
        return `rooms.append(${values.name}${options ? ', ' + optionsToStringObj(options) : ''});`;
    },
    mutators: [{
        lib: 'core',
        code: 'rooms.prepend'
    }]
}, {
    code: 'rooms.prepend',
    lib: 'core',
    type: 'command',
    name: 'Rooms prepend',
    i18nKey: 'rooms Rooms prepend',
    icon: 'room',
    pieces: [
        {
            type: 'argument',
            key: 'name',
            typeHint: 'string',
            assets: 'room',
            required: true
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
        roomOptions
    ],
    jsTemplate: (values, id, custom) => {
        const options = getOptions(values, ['isUi'], custom);
        if (values.return && values.return !== 'undefined') {
            return `${values.return} = rooms.prepend(${values.name}${options ? ', ' + optionsToStringObj(options) : ''});`;
        }
        return `rooms.prepend(${values.name}${options ? ', ' + optionsToStringObj(options) : ''});`;
    },
    mutators: [{
        lib: 'core',
        code: 'rooms.append'
    }]
}, {
    name: 'copy\'s owning room',
    type: 'computed',
    code: 'owning room',
    icon: 'room',
    lib: 'core',
    i18nKey: 'owning room',
    typeHint: 'wildcard',
    pieces: [],
    jsTemplate: () => 'this.getRoom()'
}];

export default blocks;

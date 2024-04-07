import {optionsToStringObj, getOptions} from './_utils';

const soundOptions: IBlockOptions = {
    type: 'options',
    options: [{
        key: 'volume',
        name: 'volume',
        i18nKey: 'soundVolume',
        typeHint: 'number'
    }, {
        key: 'speed',
        name: 'Speed',
        i18nKey: 'speed',
        typeHint: 'number'
    }, {
        key: 'start',
        name: 'Start at',
        i18nKey: 'start at',
        typeHint: 'number'
    }, {
        key: 'loop',
        name: 'Loop',
        i18nKey: 'loop',
        typeHint: 'boolean'
    }, {
        key: 'singleInstance',
        name: 'Stop other instances',
        i18nKey: 'soundSingleInstance',
        typeHint: 'boolean'
    }]
};

const getTemplate = (method: 'play' | 'playAt') => (values: Record<string, string>): string => {
    let prefix = '';
    if (values.return && values.return !== 'undefined') {
        prefix = `${values.return} = `;
    }
    const options = getOptions(values, ['volume', 'speed', 'start', 'loop', 'singleInstance']);
    if (options) {
        return prefix + `sounds.${method}(${values.name}${method === 'playAt' ? ', ' + values.position : ''}, ${optionsToStringObj(options)});`;
    }
    return prefix + `sounds.${method}(${values.name}${method === 'playAt' ? ', ' + values.position : ''});`;
};

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    code: 'sounds.play',
    lib: 'core',
    type: 'command',
    name: 'Sounds play',
    i18nKey: 'sounds Sounds play',
    icon: 'music',
    pieces: [{
        type: 'argument',
        key: 'name',
        typeHint: 'string',
        assets: 'sound'
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
    }, soundOptions],
    jsTemplate: getTemplate('play')
}, {
    code: 'sounds.playAt',
    lib: 'core',
    type: 'command',
    name: 'Sounds play 3D',
    i18nKey: 'sounds Sounds play at',
    icon: 'music',
    pieces: [{
        type: 'argument',
        key: 'name',
        typeHint: 'string',
        assets: 'sound'
    }, {
        type: 'label',
        name: 'at',
        i18nKey: 'atPosition'
    }, {
        type: 'argument',
        key: 'position',
        typeHint: 'wildcard',
        defaultConstant: 'this'
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
    }, soundOptions],
    jsTemplate: getTemplate('playAt')
}];

export default blocks;

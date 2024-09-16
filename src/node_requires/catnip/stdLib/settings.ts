const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    type: 'command',
    code: 'set ticker speed',
    lib: 'core.settings',
    name: 'Set game speed',
    i18nKey: 'set game speed',
    displayName: 'Set game speed to',
    displayI18nKey: 'set game speed to',
    icon: 'settings',
    pieces: [{
        type: 'argument',
        key: 'speed',
        typeHint: 'number',
        required: true
    }],
    jsTemplate: (values) => `pixiApp.ticker.speed = ${values.speed};`
}, {
    type: 'computed',
    typeHint: 'number',
    code: 'get ticker speed',
    lib: 'core.settings',
    name: 'Get game speed',
    i18nKey: 'get game speed',
    displayName: 'game speed',
    displayI18nKey: 'game speed',
    icon: 'settings',
    jsTemplate: () => 'pixiApp.ticker.speed',
    pieces: []
}];

export default blocks;

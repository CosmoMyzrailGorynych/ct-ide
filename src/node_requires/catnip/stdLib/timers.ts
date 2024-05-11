const makeTimerSetter = (index: number): IBlockCommandDeclaration => ({
    code: `set timer${index}`,
    lib: 'core.timers',
    type: 'command',
    name: `Set timer ${index}`,
    i18nKey: `set timer ${index}`,
    displayName: `set timer ${index} to`,
    displayI18nKey: `set timer ${index} to`,
    icon: 'clock',
    pieces: [{
        type: 'argument',
        key: 'time',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'seconds',
        i18nKey: 'secondsUnits'
    }],
    jsTemplate: values => `this.timer${index} = ${values.time};`
});
const makeTimerGetter = (index: number): IBlockComputedDeclaration => ({
    code: `get timer${index}`,
    lib: 'core.timers',
    type: 'computed',
    typeHint: 'number',
    name: `get timer ${index}`,
    i18nKey: `get timer ${index}`,
    displayName: 'timer',
    displayI18nKey: 'timer',
    icon: 'clock',
    pieces: [{
        type: 'label',
        name: String(index)
    }],
    jsTemplate: () => `this.timer${index}`
});

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [];
for (let i = 1; i <= 6; i++) {
    blocks.push(makeTimerSetter(i));
}
for (let i = 1; i <= 6; i++) {
    blocks.push(makeTimerGetter(i));
}

export default blocks;

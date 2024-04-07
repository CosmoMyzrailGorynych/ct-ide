const makeSetter = (field: string): IBlockCommandDeclaration => ({
    name: `Set ${field}`,
    type: 'command',
    code: `set ${field}`,
    icon: 'camera',
    lib: 'core.camera',
    i18nKey: `set ${field}`,
    pieces: [{
        type: 'argument',
        key: 'value',
        typeHint: ['followX', 'followY'].includes(field) ? 'boolean' : 'number',
        required: true
    }],
    jsTemplate: (values) => `camera.${field} = ${values.value};`
});
const makeGetter = (field: string): IBlockComputedDeclaration => ({
    name: `get ${field}`,
    type: 'computed',
    code: `get ${field}`,
    icon: 'camera',
    lib: 'core.camera',
    i18nKey: `get ${field}`,
    pieces: [],
    jsTemplate: () => `camera.${field}`,
    typeHint: ['followX', 'followY'].includes(field) ? 'boolean' : 'number'
});

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'Follow this copy',
    type: 'command',
    code: 'follow this',
    icon: 'camera',
    lib: 'core.camera',
    i18nKey: 'follow this',
    pieces: [],
    jsTemplate: () => 'camera.follow = this;'
}, {
    name: 'Follow',
    type: 'command',
    code: 'follow',
    icon: 'camera',
    lib: 'core.camera',
    i18nKey: 'follow',
    pieces: [{
        type: 'argument',
        key: 'target',
        typeHint: 'wildcard',
        required: true
    }],
    jsTemplate: (values) => `camera.follow = ${values.target};`
}, {
    name: 'Set zoom',
    type: 'command',
    code: 'set zoom',
    icon: 'camera',
    lib: 'core.camera',
    i18nKey: 'set zoom',
    pieces: [{
        type: 'argument',
        key: 'zoom',
        typeHint: 'number',
        required: true
    }],
    jsTemplate: (values) => `camera.scale.set(1 / ${values.zoom}, 1 / ${values.zoom});`
}, {
    name: 'followed copy',
    type: 'computed',
    code: 'followed',
    icon: 'camera',
    lib: 'core.camera',
    i18nKey: 'followed copy',
    pieces: [],
    jsTemplate: () => 'camera.follow',
    typeHint: 'wildcard'
}, {
    name: 'zoom',
    type: 'computed',
    code: 'get zoom',
    icon: 'camera',
    lib: 'core.camera',
    i18nKey: 'get zoom',
    pieces: [],
    jsTemplate: () => '(1 / camera.scale.x)',
    typeHint: 'number'
}];

for (const field of ['x', 'y', 'targetX', 'targetY', 'shiftX', 'shiftY', 'drift', 'rotation', 'followX', 'followY', 'borderX', 'borderY', 'shake', 'shakeDecay', 'shakeFrequency', 'shakeX', 'shakeY', 'shakeMax', 'minX', 'maxX', 'minY', 'maxY']) {
    blocks.push(makeSetter(field));
}
for (const field of ['x', 'y', 'targetX', 'targetY', 'computedX', 'computedY', 'shiftX', 'shiftY', 'drift', 'left', 'right', 'top', 'bottom', 'rotation', 'followX', 'followY', 'borderX', 'borderY', 'shake', 'shakeDecay', 'shakeFrequency', 'shakeX', 'shakeY', 'shakeMax', 'minX', 'maxX', 'minY', 'maxY']) {
    blocks.push(makeGetter(field));
}

export default blocks;

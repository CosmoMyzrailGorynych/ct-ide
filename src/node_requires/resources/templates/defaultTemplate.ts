const generateGUID = require('./../../generateGUID');

const defaultTemplate = {
    type: 'template' as const,
    baseClass: 'AnimatedSprite' as const,
    name: 'NewTemplate',
    depth: 0,
    texture: -1 as assetRef,
    playAnimationOnStart: false,
    loopAnimation: true,
    animationFPS: 30,
    visible: true
};

export const get = function get(): ITemplate {
    return ({
        ...defaultTemplate,
        events: [{
            eventKey: 'OnStep',
            lib: 'core',
            code: 'this.move();',
            arguments: {}
        }],
        extends: {},
        lastmod: Number(new Date()),
        uid: generateGUID(),
        behaviors: []
    });
};

export const getNineSlice = (): ITemplate['nineSliceSettings'] => ({
    top: 16,
    left: 16,
    bottom: 16,
    right: 16,
    autoUpdate: false
});
export const getSpritedCounter = (): ITemplate['repeaterSettings'] => ({
    defaultCount: 3
});
export const getTiling = (): ITemplate['tilingSettings'] => ({
    scrollSpeedX: 0,
    scrollSpeedY: 0,
    isUi: false
});

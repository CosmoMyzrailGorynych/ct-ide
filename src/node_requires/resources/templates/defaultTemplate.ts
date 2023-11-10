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
        nineSliceSettings: {
            left: 16,
            top: 16,
            right: 16,
            bottom: 16,
            autoUpdate: false
        },
        lastmod: Number(new Date()),
        uid: generateGUID(),
        behaviors: []
    });
};

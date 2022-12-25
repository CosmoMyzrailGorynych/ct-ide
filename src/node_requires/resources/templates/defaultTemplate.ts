const generateGUID = require('./../../generateGUID');

const defaultTemplate = {
    type: 'template' as resourceType,
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
        uid: generateGUID()
    });
};

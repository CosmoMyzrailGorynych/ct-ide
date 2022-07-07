const generateGUID = require('./../../generateGUID');

const defaultTemplate = {
    type: 'template' as resourceType,
    name: 'NewTemplate',
    depth: 0,
    texture: -1 as assetRef,
    playAnimationOnStart: false,
    loopAnimation: true,
    visible: true,
    extends: {}
};

module.exports = {
    get(): ITemplate {
        return ({
            ...defaultTemplate,
            events: [{
                eventKey: 'OnStep',
                lib: 'core',
                code: 'this.move();'
            }] as IScriptableEvent[],
            extends: {},
            lastmod: Number(new Date()),
            uid: generateGUID()
        });
    }
};

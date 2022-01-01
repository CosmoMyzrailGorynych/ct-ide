const generateGUID = require('./../../generateGUID');

const defaultTemplate = {
    type: 'template' as resourceType,
    name: 'NewTemplate',
    depth: 0,
    oncreate: '',
    onstep: 'this.move();',
    ondraw: '',
    ondestroy: '',
    texture: -1 as assetRef,
    visible: true,
    extends: {}
};

module.exports = {
    get(): ITemplate {
        return ({
            ...defaultTemplate,
            extends: {},
            lastmod: Number(new Date()),
            uid: generateGUID()
        });
    }
};

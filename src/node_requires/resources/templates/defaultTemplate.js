const generateGUID = require('./../../generateGUID');

const defaultTemplate = {
    name: 'NewTemplate',
    depth: 0,
    oncreate: '',
    onstep: 'this.move();',
    ondraw: '',
    ondestroy: '',
    texture: -1,
    extends: {}
};

module.exports = {
    get() {
        return ({
            ...defaultTemplate,
            extends: {},
            uid: generateGUID()
        });
    }
};

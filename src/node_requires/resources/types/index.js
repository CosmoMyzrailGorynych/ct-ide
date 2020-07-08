const getDefaultType = require('./defaultType').get;

const createNewType = function (name) {
    const type = getDefaultType();
    if (name) {
        type.name = String(name);
    }
    window.currentProject.types.push(type);
    window.signals.trigger('typesChanged');
    return type;
};

module.exports = {
    getDefaultType,
    createNewType
};

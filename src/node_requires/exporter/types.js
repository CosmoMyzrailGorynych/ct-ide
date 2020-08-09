const {getTextureFromId} = require('../resources/textures');
const {getUnwrappedExtends} = require('./utils');

const stringifyTypes = function (proj) {
    /* Stringify types */
    var types = '';
    for (const k in proj.types) {
        var type = proj.types[k];
        types += `
ct.types.templates["${type.name}"] = {
    depth: ${type.depth},
    ${type.texture !== -1 ? 'texture: "' + getTextureFromId(type.texture).name + '",' : ''}
    onStep: function () {
        ${type.onstep}
    },
    onDraw: function () {
        ${type.ondraw}
    },
    onDestroy: function () {
        ${type.ondestroy}
    },
    onCreate: function () {
        ${type.oncreate}
    },
    extends: ${type.extends ? JSON.stringify(getUnwrappedExtends(type.extends), null, 4) : '{}'}
};
ct.types.list['${type.name}'] = [];`;
    }
    return types;
};

module.exports = {
    stringifyTypes
};

const textures = require('../resources/textures');

const stringifyTypes = function (proj) {
    /* Stringify types */
    var types = '';
    for (const k in proj.types) {
        var type = proj.types[k];
        types += `
ct.types.templates["${type.name}"] = {
    depth: ${type.depth},
    ${type.texture !== -1 ? 'texture: "' + textures.getTextureFromId(type.texture).name + '",' : ''}
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
    extends: ${JSON.stringify(type.extends || {})}
};
ct.types.list['${type.name}'] = [];`;
    }
    return types;
};

module.exports = {
    stringifyTypes
};

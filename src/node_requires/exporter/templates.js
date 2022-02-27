const {getTextureFromId} = require('../resources/textures');
const {getUnwrappedExtends} = require('./utils');

const stringifyTemplates = function (proj) {
    /* Stringify templates */
    var templates = '';
    for (const k in proj.templates) {
        var template = proj.templates[k];
        templates += `
ct.templates.templates["${template.name}"] = {
    depth: ${template.depth},
    blendMode: PIXI.BLEND_MODES.${template.blendMode?.toUpperCase() ?? 'NORMAL'},
    playAnimationOnStart: ${Boolean(template.playAnimationOnStart)},
    ${template.texture !== -1 ? 'texture: "' + getTextureFromId(template.texture).name + '",' : ''}
    onStep: function () {
        ${template.onstep}
    },
    onDraw: function () {
        ${template.ondraw}
    },
    onDestroy: function () {
        ${template.ondestroy}
    },
    onCreate: function () {
        ${template.oncreate}
    },
    extends: ${template.extends ? JSON.stringify(getUnwrappedExtends(template.extends), null, 4) : '{}'}
};
ct.templates.list['${template.name}'] = [];`;
    }
    return templates;
};

module.exports = {
    stringifyTemplates
};

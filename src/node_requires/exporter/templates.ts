const {getTextureFromId} = require('../resources/textures');
const {getUnwrappedExtends} = require('./utils');

import {getBaseScripts} from './scriptableProcessor';

const stringifyTemplates = function (proj: IProject): IScriptablesFragment {
    /* Stringify templates */
    let templates = '';
    let rootRoomOnCreate = '';
    let rootRoomOnStep = '';
    let rootRoomOnDraw = '';
    let rootRoomOnLeave = '';
    for (const k in proj.templates) {
        var template = proj.templates[k];
        const scripts = getBaseScripts(template);
        templates += `
ct.templates.templates["${template.name}"] = {
    depth: ${template.depth},
    blendMode: PIXI.BLEND_MODES.${template.blendMode?.toUpperCase() ?? 'NORMAL'},
    playAnimationOnStart: ${Boolean(template.playAnimationOnStart)},
    loopAnimation: ${Boolean(template.loopAnimation)},
    ${template.texture !== -1 ? 'texture: "' + getTextureFromId(template.texture).name + '",' : ''}
    onStep: function () {
        ${scripts.thisOnStep}
    },
    onDraw: function () {
        ${scripts.thisOnDraw}
    },
    onDestroy: function () {
        ${scripts.thisOnDestroy}
    },
    onCreate: function () {
        ${scripts.thisOnCreate}
    },
    extends: ${template.extends ? JSON.stringify(getUnwrappedExtends(template.extends), null, 4) : '{}'}
};
ct.templates.list['${template.name}'] = [];
        `;
        rootRoomOnCreate += scripts.rootRoomOnCreate;
        rootRoomOnStep += scripts.rootRoomOnStep;
        rootRoomOnDraw += scripts.rootRoomOnDraw;
        rootRoomOnLeave += scripts.rootRoomOnLeave;
    }
    return {
        libCode: templates,
        rootRoomOnCreate,
        rootRoomOnStep,
        rootRoomOnDraw,
        rootRoomOnLeave
    };
};

export {stringifyTemplates};

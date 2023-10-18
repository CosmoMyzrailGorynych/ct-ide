const {getTextureFromId} = require('../resources/textures');
const {getUnwrappedExtends} = require('./utils');

import {getBaseScripts} from './scriptableProcessor';

interface IBlankTexture {
    uid: string;
    anchorX: number;
    anchorY: number;
    height: number;
    width: number;
}

const getTextureInfo = (blankTextures: IBlankTexture[], template: ITemplate) => {
    const blankTexture = blankTextures.find(tex => tex.uid === template.texture);
    if (blankTexture) {
        return `anchorX: ${blankTexture.anchorX},
        anchorY: ${blankTexture.anchorY},
        height: ${blankTexture.height},
        width: ${blankTexture.width},`;
    } else if (template.texture !== -1) {
        return `texture: "${getTextureFromId(template.texture).name}",`;
    }
    return '';
};

const stringifyTemplates = function (
    assets: {texture: ITexture[], template: ITemplate[]},
    proj: IProject
): IScriptablesFragment {
    let templates = '';
    let rootRoomOnCreate = '';
    let rootRoomOnStep = '';
    let rootRoomOnDraw = '';
    let rootRoomOnLeave = '';
    const blankTextures = assets.texture
        .filter(tex => tex.isBlank)
        .map(tex => ({
            uid: tex.uid,
            anchorX: tex.axis[0] / tex.width,
            anchorY: tex.axis[1] / tex.height,
            height: tex.height,
            width: tex.width
        }));

    for (const k in assets.template) {
        var template = assets.template[k];
        const scripts = getBaseScripts(template, proj);
        const textureInfo = getTextureInfo(blankTextures, template);
        templates += `
templates.templates["${template.name}"] = {
    depth: ${template.depth},
    blendMode: PIXI.BLEND_MODES.${template.blendMode?.toUpperCase() ?? 'NORMAL'},
    animationFPS: ${template.animationFPS ?? 60},
    playAnimationOnStart: ${Boolean(template.playAnimationOnStart)},
    loopAnimation: ${Boolean(template.loopAnimation)},
    visible: ${Boolean(template.visible ?? true)},
    ${textureInfo}
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
templates.list['${template.name.replace(/'/g, '\\\'')}'] = [];
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

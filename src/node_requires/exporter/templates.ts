import {getById} from '../resources';
import {getUnwrappedExtends} from './utils';
import {embedStaticBehaviors, getBehaviorsList} from './behaviors';

import {getBaseScripts} from './scriptableProcessor';

interface IBlankTexture {
    uid: string;
    anchorX: number;
    anchorY: number;
    height: number;
    width: number;
}

const getBaseClassInfo = (blankTextures: IBlankTexture[], template: ITemplate) => {
    if (template.baseClass !== 'Text') {
        let classInfo = '';
        const blankTexture = blankTextures.find(tex => tex.uid === template.texture);
        if (blankTexture) {
            classInfo = `anchorX: ${blankTexture.anchorX},
            anchorY: ${blankTexture.anchorY},
            height: ${blankTexture.height},
            width: ${blankTexture.width},`;
        } else if (template.texture !== -1) {
            classInfo = `texture: "${getById('texture', template.texture).name}",`;
        }
        if (template.baseClass === 'NineSlicePlane') {
            classInfo += `
            nineSliceSettings: ${JSON.stringify(template.nineSliceSettings)},`;
        } else if (template.baseClass === 'AnimatedSprite') {
            classInfo += `animationFPS: ${template.animationFPS ?? 60},
            playAnimationOnStart: ${Boolean(template.playAnimationOnStart)},
            loopAnimation: ${Boolean(template.loopAnimation)},`;
        }
        return classInfo;
    }
    if (template.baseClass === 'Text') {
        if (template.textStyle === -1) {
            return `defaultText: ${JSON.stringify(template.defaultText)},`;
        }
        return `textStyle: "${getById('style', template.textStyle).name}",
        defaultText: ${JSON.stringify(template.defaultText)},`;
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
    const templatesEmbedded = assets.template.map(t => embedStaticBehaviors(t, proj));
    for (const template of templatesEmbedded) {
        const scripts = getBaseScripts(template, proj);
        const baseClassInfo = getBaseClassInfo(blankTextures, template);
        templates += `
templates.templates["${template.name}"] = {
    name: ${JSON.stringify(template.name)},
    depth: ${template.depth},
    blendMode: PIXI.BLEND_MODES.${template.blendMode?.toUpperCase() ?? 'NORMAL'},
    visible: ${Boolean(template.visible ?? true)},
    baseClass: "${template.baseClass}",
    ${baseClassInfo}
    behaviors: JSON.parse('${JSON.stringify(getBehaviorsList(template))}'),
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

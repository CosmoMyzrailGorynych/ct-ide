import {getById} from '../resources';
import {getUnwrappedExtends} from './utils';
import {embedStaticBehaviors, getBehaviorsList, unwrapBehaviorFields} from './behaviors';
import {getTextureShape} from './textures';
import {hasCapability} from '../resources/templates';

import {getBaseScripts} from './scriptableProcessor';
import {ExporterError} from './ExporterError';

interface IBlankTexture {
    uid: string;
    anchorX: number;
    anchorY: number;
    height: number;
    width: number;
    shape: any;
}

// eslint-disable-next-line complexity
const getBaseClassInfo = (blankTextures: IBlankTexture[], template: ITemplate) => {
    let classInfo = '';
    const bc = template.baseClass;
    if ((template.texture === -1 || !template.texture) &&
        (hasCapability(bc, 'ninePatch') ||
        hasCapability(bc, 'tilingSprite'))
    ) {
        const errorMessage = `The template ${template.name} has a base class ${bc} and thus requires a texture to be set.`;
        const exporterError = new ExporterError(errorMessage, {
            resourceId: template.uid,
            resourceName: template.name,
            resourceType: 'template',
            clue: 'noTemplateTexture'
        });
        throw exporterError;
    }
    if (hasCapability(bc, 'textured')) {
        const blankTexture = blankTextures.find(tex => tex.uid === template.texture);
        if (blankTexture) {
            classInfo += `
            anchorX: ${blankTexture.anchorX},
            anchorY: ${blankTexture.anchorY},
            height: ${blankTexture.height},
            width: ${blankTexture.width},`;
        } else if (template.texture !== -1) {
            classInfo += `
            texture: "${getById('texture', template.texture).name}",`;
        } else {
            classInfo += `
            texture: -1,`;
        }
    }
    if (hasCapability(bc, 'ninePatch')) {
        classInfo += `
        nineSliceSettings: ${JSON.stringify(template.nineSliceSettings)},`;
    }
    if (hasCapability(bc, 'animatedSprite')) {
        classInfo += `
        animationFPS: ${template.animationFPS ?? 60},
        playAnimationOnStart: ${Boolean(template.playAnimationOnStart)},
        loopAnimation: ${Boolean(template.loopAnimation)},`;
    }
    if (hasCapability(bc, 'visualStates')) {
        for (const key of ['hoverTexture', 'pressedTexture', 'disabledTexture'] as const) {
            if (template[key] && template[key] !== -1) {
                classInfo += `
                ${key}: "${getById('texture', template[key] as string).name}",`;
            }
        }
    }
    if (hasCapability(bc, 'text') || hasCapability(bc, 'embeddedText')) {
        if (template.textStyle && template.textStyle !== -1) {
            classInfo += `
            textStyle: "${getById('style', template.textStyle).name}",`;
        }
        classInfo += `
        defaultText: ${JSON.stringify(template.defaultText)},`;
    }
    if (hasCapability(bc, 'scroller')) {
        classInfo += `
        scrollX: ${template.tilingSettings.scrollSpeedX},
        scrollY: ${template.tilingSettings.scrollSpeedY},
        isUi: ${template.tilingSettings.isUi},`;
    }
    if (hasCapability(bc, 'repeater')) {
        classInfo += `
        spriteCount: ${template.repeaterSettings.defaultCount},`;
    }
    return classInfo;
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
            width: tex.width,
            shape: getTextureShape(tex)
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
    extends: ${template.extends ? JSON.stringify(unwrapBehaviorFields(template, getUnwrappedExtends(template.extends)), null, 4) : '{}'}
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

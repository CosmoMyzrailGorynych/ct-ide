import {get as getDefaultTemplate} from './defaultTemplate';
import {getTextureOrig,
    getDOMTexture as getTextureDOMImage,
    getPixiTexture as getTexturePixiTexture} from '../textures';

import {TexturePreviewer} from '../preview/texture';
import {StylePreviewer} from '../preview/style';

import * as PIXI from 'node_modules/pixi.js';
import {IAssetContextItem, addAsset, getById, getOfType} from '..';
import {promptName} from '../promptName';
import generateGUID from '../../generateGUID';

const createNewTemplate = async (opts?: {name: string}): Promise<ITemplate> => {
    const template = getDefaultTemplate();

    // Fix default OnStep event for coffeescript projects
    if (window.currentProject.language === 'coffeescript') {
        template.events[0].code = '@move()';
    } else if (window.currentProject.language === 'catnip') {
        template.events[0].code = [{
            lib: 'core.movement',
            code: 'move copy',
            values: {}
        }];
        template.properties = [];
    }

    if (opts?.name) {
        template.name = opts.name;
        return template;
    }
    const name = await promptName('template', 'New Template');
    if (name) {
        template.name = name;
    } else {
        // eslint-disable-next-line no-throw-literal
        throw 'cancelled';
    }
    return template;
};

export const baseClasses: TemplateBaseClass[] = [
    'AnimatedSprite',
    'SpritedCounter',
    'RepeatingTexture',
    'NineSlicePlane',
    'Text',
    'Button',
    'TextBox',
    'Container'
];
export const baseClassToIcon: Record<TemplateBaseClass, string> = {
    AnimatedSprite: 'template',
    Text: 'font',
    NineSlicePlane: 'ninepatch',
    Container: 'maximize',
    Button: 'button',
    SpritedCounter: 'sprited-counter',
    RepeatingTexture: 'repeating-sprite',
    TextBox: 'textbox'
};
export const baseClassToTS: Record<TemplateBaseClass, string> = {
    AnimatedSprite: 'CopyAnimatedSprite',
    Text: 'CopyText',
    NineSlicePlane: 'CopyPanel',
    Container: 'CopyContainer',
    Button: 'CopyButton',
    SpritedCounter: 'CopySpritedCounter',
    RepeatingTexture: 'CopyRepeatingTexture',
    TextBox: 'CopyTextBox'
};

// First line — implements methods and fields supported by the corresponding pixi.js classes.
// repeater — has a `count` field.
// embeddedText — has a centered text label, but is not a PIXI.Text itself.
// scroller — has properties to scroll tiled sprites.
// visualStates — has additional textures for hovered, pressed, and disabled states
// textInput — has options to change text input type.
// blendModes — supports pixi.js blend modes. Everything but PIXI.Container does that.
// textured — uses a ct.js texture as its main asset.
export type BaseClassCapability = 'text' | 'ninePatch' | 'container' | 'tilingSprite' | 'animatedSprite' |
                                  'repeater' | 'embeddedText' | 'scroller' | 'visualStates' | 'textInput' |
                                  'blendModes' | 'textured';
/**
 * Defines which base classes have which abstract features.
 * This gets read by exporter, room and template editors to add relevant controls
 * and fields for these base classes.
 * The actual functionality must be implemented in /src/ct.release/templateBaseClasses.
 */
export const baseClassCapabilities: Record<TemplateBaseClass, BaseClassCapability[]> = {
    AnimatedSprite: ['blendModes', 'textured', 'animatedSprite'],
    Button: ['blendModes', 'textured', 'container', 'embeddedText', 'ninePatch', 'visualStates'],
    Container: ['container'],
    NineSlicePlane: ['blendModes', 'textured', 'ninePatch'],
    RepeatingTexture: ['blendModes', 'textured', 'tilingSprite', 'scroller'],
    SpritedCounter: ['blendModes', 'textured', 'tilingSprite', 'repeater'],
    Text: ['blendModes', 'text'],
    TextBox: ['blendModes', 'textured', 'container', 'embeddedText', 'ninePatch', 'visualStates', 'textInput']
};
export const hasCapability = (
    baseClass: TemplateBaseClass,
    capability: BaseClassCapability
): boolean => baseClassCapabilities[baseClass].includes(capability);
export {getBindingsForBaseClass} from '../../roomEditor/common';

/**
 * Returns default fields for a specified base class.
 * Mainly used to populate fields in ITemplate when changing a base class.
 */
export const getBaseClassFields = function (baseClass: TemplateBaseClass): Partial<ITemplate> {
    const out: Partial<ITemplate> = {};
    for (const capability of baseClassCapabilities[baseClass]) {
        switch (capability) {
        case 'animatedSprite':
            out.animationFPS = 30;
            out.loopAnimation = true;
            out.playAnimationOnStart = false;
            break;
        case 'text':
        case 'embeddedText':
            out.defaultText = '';
            out.textStyle = -1;
            break;
        case 'ninePatch':
            out.nineSliceSettings = {
                top: 16,
                left: 16,
                bottom: 16,
                right: 16,
                autoUpdate: false
            };
            break;
        case 'tilingSprite':
            out.tilingSettings = {
                scrollSpeedX: 0,
                scrollSpeedY: 0,
                isUi: false
            };
            break;
        case 'repeater':
            out.repeaterSettings = {
                defaultCount: 3
            };
            break;
        case 'textInput':
            out.fieldType = 'text';
            out.maxTextLength = 0;
            break;
        case 'visualStates':
            out.hoverTexture = -1;
            out.pressedTexture = -1;
            out.disabledTexture = -1;
            break;
        default:
            void 0;
        }
    }
    return out;
};

/**
 * Retrieves the full path to a thumbnail of a given template.
 * @param {string|ITemplate} template Either the id of the template, or its ct.js object
 * @param {boolean} [x2] If set to true, returns a 128x128 image instead of 64x64.
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the thumbnail.
 */
export const getTemplatePreview = function getTemplatePreview(
    template: ITemplate | assetRef,
    x2: boolean,
    fs: boolean
): string {
    if (typeof template === 'string') {
        template = getById('template', template);
    }
    if (template === -1) {
        return TexturePreviewer.get(-1, fs);
    }
    if (template.baseClass === 'Text') {
        if (template.textStyle !== -1 && template.textStyle) {
            return StylePreviewer.get(getById('style', template.textStyle), fs);
        }
        return TexturePreviewer.get(-1, fs);
    }
    if (template.baseClass === 'Container') {
        return TexturePreviewer.get(-1, fs);
    }
    return TexturePreviewer.get((!template.texture || template.texture === -1) ?
        -1 :
        getById('texture', template.texture), fs);
};
export const getThumbnail = getTemplatePreview;
export const areThumbnailsIcons = false;

/**
 * Returns the path to the source image of the template's used texture.
 */
export const getTemplateTextureOrig = (template: ITemplate | assetRef, fs: boolean): string => {
    if (typeof template === 'string') {
        template = getById('template', template);
    }
    if (template === -1) {
        throw new Error('Cannot work with -1 assetRefs');
    }
    return getTextureOrig(template.texture || -1, fs);
};

export const getPixiTexture = (template: ITemplate | assetRef):
PIXI.Texture<PIXI.ImageResource>[] => {
    if (typeof template === 'string') {
        template = getById('template', template);
    }
    if (template === -1) {
        throw new Error('Cannot work with -1 assetRefs');
    }
    return getTexturePixiTexture(template.texture || -1, void 0, true);
};

export const getDOMTexture = (template: ITemplate | assetRef): HTMLImageElement => {
    if (template === -1) {
        throw new Error('templates.getDOMTexture: Cannot work with -1 references to templates.');
    }
    if (typeof template === 'string') {
        template = getById('template', template);
    }
    return getTextureDOMImage(template.texture || -1);
};

export const assetContextMenuItems: IAssetContextItem[] = [{
    icon: 'copy',
    vocPath: 'common.duplicate',
    action: (asset: ITemplate, collection, folder): void => {
        const newTemplate = structuredClone(asset) as ITemplate & {uid: string};
        newTemplate.uid = generateGUID();
        newTemplate.name += `_${newTemplate.uid.slice(0, 4)}`;
        addAsset(newTemplate, folder);
    }
}];

/**
 * Properly removes a template from the project, cleansing it from all the associated rooms.
 * Must not be called directly from UI, use resources -> deleteAsset instead.
 */
export const removeAsset = (template: string | ITemplate): void => {
    const asset = typeof template === 'string' ? getById('template', template) : template;
    const {uid} = asset;
    for (const room of getOfType('room')) {
        room.copies = room.copies.filter((copy) => copy.uid !== uid);
        if (room.follow === uid) {
            room.follow = -1;
        }
    }
};

export {getIcons} from '../scriptables';
export {
    getDefaultTemplate,
    createNewTemplate as createAsset
};

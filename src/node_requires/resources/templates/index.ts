import {get as getDefaultTemplate} from './defaultTemplate';
import {getTexturePreview,
    getTextureOrig,
    getDOMTexture as getTextureDOMImage,
    getPixiTexture as getTexturePixiTexture} from '../textures';
import {getDOMSkeleton, getPixiTexture as getSkeletonPixiTexture} from '../skeletons';

import * as PIXI from 'node_modules/pixi.js';

const createNewTemplate = function createNewTemplate(name: string): ITemplate {
    const template = getDefaultTemplate();
    if (name) {
        template.name = String(name);
    }
    // Fix default OnStep event for coffeescript projects
    if (window.currentProject.language === 'coffeescript') {
        template.events[0].code = 'this.move()';
    }
    window.currentProject.templates.push(template);
    window.signals.trigger('templatesChanged');
    window.signals.trigger('templateCreated');
    return template;
};

/**
 * Gets the ct.js template object by its id.
 * @param {string} id The id of the ct.js template
 * @returns {ITemplate} The ct.js template object
 */
const getTemplateFromId = function getTemplateFromId(id: string): ITemplate {
    const template = global.currentProject.templates.find((t: ITemplate) => t.uid === id);
    if (!template) {
        throw new Error(`Attempt to get a non-existent template with ID ${id}`);
    }
    return template;
};
const getById = getTemplateFromId;

/**
 * Retrieves the full path to a thumbnail of a given template.
 * @param {string|ITemplate} template Either the id of the template, or its ct.js object
 * @param {boolean} [x2] If set to true, returns a 128x128 image instead of 64x64.
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the thumbnail.
 */
const getTemplatePreview = function getTemplatePreview(
    template: ITemplate | assetRef,
    x2: boolean,
    fs: boolean
): string {
    if (typeof template === 'string') {
        template = getTemplateFromId(template);
    }
    if (template === -1) {
        return getTexturePreview(-1, x2, fs);
    }
    return getTexturePreview(template.texture, x2, fs);
};
const getThumbnail = getTemplatePreview;

/**
 * Returns the path to the source image of the template's used texture.
 */
const getTemplateTextureOrig = (template: ITemplate | assetRef, fs: boolean): string => {
    if (typeof template === 'string') {
        template = getTemplateFromId(template);
    }
    if (template === -1) {
        throw new Error('Cannot work with -1 assetRefs');
    }
    return getTextureOrig(template.texture, fs);
};

const getPixiTexture = (template: ITemplate | assetRef): PIXI.Texture<PIXI.ImageResource>[] => {
    if (typeof template === 'string') {
        template = getTemplateFromId(template);
    }
    if (template === -1) {
        throw new Error('Cannot work with -1 assetRefs');
    }
    if (template.skeleton && template.skeleton !== -1) {
        return [getSkeletonPixiTexture(template.skeleton)];
    }
    return getTexturePixiTexture(template.texture, void 0, true);
};

const getDOMTexture = (template: ITemplate | assetRef): HTMLImageElement => {
    if (template === -1) {
        throw new Error('templates.getDOMTexture: Cannot work with -1 references to templates.');
    }
    if (typeof template === 'string') {
        template = getTemplateFromId(template);
    }
    if (template.skeleton && template.skeleton !== -1) {
        return getDOMSkeleton(template.skeleton);
    }
    return getTextureDOMImage(template.texture);
};

export {
    getDefaultTemplate,
    getTemplateFromId,
    getById,
    getTemplatePreview,
    getThumbnail,
    createNewTemplate,
    getPixiTexture,
    getDOMTexture,
    getTemplateTextureOrig
};

import {uidMap, getOfType, getById, createAsset, IAssetContextItem} from '..';
import {TexturePreviewer} from '../preview/texture';

const fs = require('node_modules/fs-extra');
import path from 'path';
import * as PIXI from 'node_modules/pixi.js';

/**
 * Accepts a texture ID or a texture's object itself;
 * always returns a texture object.
 */
const ensureTex = (tex: string | ITexture): ITexture => {
    if (typeof tex === 'string') {
        return getById('texture', tex);
    }
    return tex;
};

const getThumbnail = TexturePreviewer.getClassic;
export const areThumbnailsIcons = false;

/**
 * Retrieves a full path to the source image of a given texture
 * @param {string|ITexture} texture Either the id of a texture, or a ct.js texture object
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the source image.
 */
const getTextureOrig = function (texture: assetRef | ITexture, fs?: boolean): string {
    if (texture === -1) {
        return 'data/img/notexture.png';
    }
    if (typeof texture === 'string') {
        texture = getById('texture', texture);
    }
    if (fs) {
        return `${global.projdir}/img/${texture.origname}`;
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/img/${texture.origname}?cache=${texture.lastmod}`;
};

const baseTextureFromTexture = async (texture: ITexture): Promise<PIXI.BaseTexture> => {
    const path = 'file://' + global.projdir.replace(/\\/g, '/') + '/img/' + texture.origname + '?' + texture.lastmod;
    return (await PIXI.Assets.load<PIXI.Texture>(path)).baseTexture;
};

let unknownTexture = PIXI.Texture.from<PIXI.ImageResource>('data/img/unknown.png');
const pixiTextureCache: Record<string, {
    lastmod: number;
    texture: PIXI.Texture<PIXI.ImageResource>[]
}> = {};
const clearPixiTextureCache = function (): void {
    for (const i in pixiTextureCache) {
        delete pixiTextureCache[i];
    }
};
/**
 * Returns an array of frames that matches a PIXI.AnimatedSprite animation of a ct.js texture.
 * Can also be used to update cache value for this specific texture.
 * @param {ITexture} tex A ct.js texture object
 * @param {boolean} silent By default, this function triggers window.signals'
 * `pixiTextureChanged` event. You can disable it with this flag if you want to call it manually.
 * @returns {Array<PIXI.Texture>} An array of PIXI.Textures
 */
const texturesFromCtTexture = async (
    tex: ITexture,
    silent?: boolean
): Promise<PIXI.Texture<PIXI.ImageResource>[]> => {
    const frames = [] as PIXI.Texture<PIXI.ImageResource>[];
    const baseTexture = await baseTextureFromTexture(tex);
    for (let col = 0; col < tex.grid[1]; col++) {
        for (let row = 0; row < tex.grid[0]; row++) {
            const texture = new PIXI.Texture(
                baseTexture,
                new PIXI.Rectangle(
                    tex.offx + row * (tex.width + tex.marginx),
                    tex.offy + col * (tex.height + tex.marginy),
                    tex.width,
                    tex.height
                )
            ) as PIXI.Texture<PIXI.ImageResource>;
            texture.defaultAnchor = new PIXI.Point(
                tex.axis[0] / tex.width,
                tex.axis[1] / tex.height
            );
            frames.push(texture);
            if (col * tex.grid[0] + row >= tex.untill && tex.untill > 0) {
                break;
            }
        }
    }
    pixiTextureCache[tex.uid] = {
        lastmod: tex.lastmod,
        texture: frames
    };
    if (!silent) {
        window.signals.trigger('pixiTextureChanged', tex.uid);
    }
    return frames;
};
const resetPixiTextureCache = (): void => {
    PIXI.utils.destroyTextureCache();
    unknownTexture = PIXI.Texture.from('data/img/unknown.png');
};
const populatePixiTextureCache = async (): Promise<void> => {
    clearPixiTextureCache();
    const promises = [];
    for (const texture of getOfType('texture')) {
        promises.push(texturesFromCtTexture(texture, true));
    }
    await Promise.all(promises);
};

const domTextureCache = {} as Record<assetRef, HTMLImageElement>;

/**
 * @param texture Accepts texture IDs or whole texture objects.
 * Passing -1 will force to use a `deflt` texture.
 * @param deflt The default texture to use when requesting an empty texture.
 * Defaults to data/img/notexture.png (a ghostly cat)
 * @returns An offsreen `img` tag for the given texture/skeleton.
 */
const getDOMImageFromTexture = function (
    texture: assetRef | ITexture,
    deflt?: string
): Promise<HTMLImageElement> {
    let path;
    const img = document.createElement('img');
    if (texture === -1) {
        path = deflt || 'data/img/notexture.png';
    } else {
        path = getTextureOrig(texture, false);
    }
    img.src = path;
    return new Promise((resolve, reject) => {
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
    });
};
const updateDOMImage = async (texture: ITexture | assetRef): Promise<HTMLImageElement> => {
    if (typeof texture === 'string') {
        texture = getById('texture', texture);
    } else if (texture === -1) {
        domTextureCache[-1] = await getDOMImageFromTexture(-1, 'data/img/unknown.png');
        return domTextureCache[-1];
    }
    domTextureCache[texture.uid] = await getDOMImageFromTexture(texture);
    return domTextureCache[texture.uid];
};
const populateDOMTextureCache = async (): Promise<void> => {
    const promises = getOfType('texture').map(updateDOMImage);
    promises.push(updateDOMImage(-1));
    await Promise.all(promises); // drop returned values
};
const resetDOMTextureCache = (): Promise<void> => {
    for (const key of Object.keys(domTextureCache)) {
        delete domTextureCache[key];
    }
    return populateDOMTextureCache();
};
/**
 * A synchronous method that returns a preloaded DOM img tag for a given texture.
 * This relies on the texture cache; you must prepopulate the cache with updateDOMImage
 * or populateDOMTextureCache methods from the same module.
 */
const getDOMTexture = (texture: assetRef | ITexture): HTMLImageElement => {
    if (typeof texture !== 'string' && texture !== -1) {
        texture = texture.uid;
    }
    if (!(texture in domTextureCache)) {
        throw new Error(`Texture ${texture} does not exist in the DOM image cache. See if the texture actually exists.`);
    }
    return domTextureCache[texture];
};

/**
 * A synchronous method to get a pixi.js texture, or an array of pixi textures
 * for framed animations.
 * This is a synchronous method and thus requires the pixi.js texture
 * to be preloaded with `populatePixiTextureCache` method.
 * @param {assetRef | ITexture} texture Either a uid of a texture, or a ct.js texture object
 * @param {number} [frame] The frame to extract. If not defined, will return an array of all frames
 * @param {boolean} [allowMinusOne] Allows the use of `-1` as a texture uid
 * @returns {Array<PIXI.Texture>|PIXI.Texture} An array of textures, or an individual one.
 */
function getPixiTexture(texture: assetRef | ITexture): PIXI.Texture<PIXI.ImageResource>[];
function getPixiTexture(
    texture: -1
): never;
function getPixiTexture(
    texture: assetRef | ITexture,
    frame: void | null,
    allowMinusOne?: boolean
): PIXI.Texture<PIXI.ImageResource>[];
function getPixiTexture(
    texture: assetRef | ITexture,
    frame: number,
    allowMinusOne?: boolean
): PIXI.Texture<PIXI.ImageResource>;
// eslint-disable-next-line func-style
function getPixiTexture(
    texture: assetRef | ITexture,
    frame?: number | void | null,
    allowMinusOne?: boolean
): PIXI.Texture<PIXI.ImageResource> | PIXI.Texture<PIXI.ImageResource>[] {
    if (allowMinusOne && texture === -1) {
        if (frame || frame === 0) {
            return unknownTexture;
        }
        return [unknownTexture];
    }
    if (texture === -1) {
        throw new Error('Cannot turn -1 into a pixi texture in getPixiTexture method unless it is explicitly allowed.');
    }
    if (typeof texture === 'string') {
        texture = getById('texture', texture);
    }
    if (frame || frame === 0) {
        return pixiTextureCache[texture.uid].texture[frame];
    }
    return pixiTextureCache[texture.uid].texture;
}

/**
 * Returns a texture object by its name.
 * @param {string} name The name of the texture.
 * @return {ITexture} The texture's object
 */
const getTextureFromName = function (name: string): ITexture {
    const texture = getOfType('texture').find(tex => tex.name === name);
    if (!texture) {
        throw new Error(`Attempt to get a non-existent texture with name ${name}`);
    }
    return texture;
};

const texturePostfixParser = /_(?<cols>\d+)x(?<rows>\d+)(?:@(?<until>\d+))?$/;
const isBgPostfixTester = /@bg$/;
/**
 * Tries to load an image, then adds it to the projects and creates a thumbnail
 * @param {string|Buffer} src A path to the source image, or a Buffer of an already read image.
 * @param {string} [name] The name of the texture. Optional, defaults to 'NewTexture'
 * or file's basename.
 * @returns {Promise<ITexture>} A promise that resolves into the resulting texture object.
 */
// eslint-disable-next-line max-lines-per-function
const importImageToTexture = async (opts: {
    src: string | Buffer,
    name?: string,
    skipSignals?: boolean
}): Promise<ITexture> => {
    const fs = require('fs-extra'),
          path = require('path'),
          generateGUID = require('./../../generateGUID');
    const id = generateGUID();
    let dest: string;
    if (opts.src instanceof Buffer) {
        dest = path.join(global.projdir, 'img', `i${id}.png`);
        await fs.writeFile(dest, opts.src);
    } else {
        dest = path.join(global.projdir, 'img', `i${id}${path.extname(opts.src)}`);
        await fs.copy(opts.src, dest);
    }
    const image = document.createElement('img');
    // Wait while the image is loading
    await new Promise<void>((resolve, reject) => {
        image.onload = () => {
            resolve();
        };
        image.onerror = e => {
            window.alertify.error(e);
            reject(e);
        };
        image.src = 'file://' + dest + '?' + Math.random();
    });
    let texName;
    if (opts.name) {
        texName = opts.name;
    } else if (opts.src instanceof Buffer) {
        texName = 'NewTexture';
    } else {
        texName = path.basename(opts.src)
            .replace(/\.(jpg|gif|png|jpeg)/gi, '')
            .replace(/\s/g, '_');
    }
    const obj: ITexture = {
        lastmod: Number(new Date()),
        type: 'texture',
        name: texName,
        untill: 0,
        grid: [1, 1],
        axis: [0, 0],
        marginx: 0,
        marginy: 0,
        imgWidth: image.width,
        imgHeight: image.height,
        width: image.width,
        height: image.height,
        offx: 0,
        offy: 0,
        origname: path.basename(dest),
        shape: 'rect',
        left: 0,
        right: image.width,
        top: 0,
        bottom: image.height,
        uid: id,
        padding: 1,
        isBlank: false
    };
    if (!(opts.src instanceof Buffer)) {
        obj.source = opts.src;
    }

    // Test if this has a postfix _NxM@K or _NxM
    const exec = texturePostfixParser.exec(obj.name);
    if (exec) {
        obj.name = obj.name.replace(texturePostfixParser, '');
        obj.grid = [Number(exec.groups.cols) || 1, Number(exec.groups.rows) || 1];
        obj.width /= obj.grid[0];
        obj.height /= obj.grid[1];
        obj.right /= obj.grid[0];
        obj.bottom /= obj.grid[1];
        if (exec.groups.until) {
            obj.untill = Number(exec.groups.until);
        }
    } else if (isBgPostfixTester.test(obj.name)) {
        // Test whether it has a @bg postfix
        obj.name = obj.name.replace(isBgPostfixTester, '');
        obj.tiled = true;
    }

    await Promise.all([
        TexturePreviewer.save(obj),
        texturesFromCtTexture(obj),
        updateDOMImage(obj)
    ]);

    if (!opts.skipSignals) {
        window.signals.trigger('textureImported');
    }
    return obj;
};
/**
 * Loads an image into the project, generating thumbnails and updating the preview.
 * @param {string|Buffer} source A source image. It can be either a full path in a file system,
 * or a buffer.
 */
const reimportTexture = async (
    texture: ITexture | assetRef,
    source?: string | Buffer
): Promise<void> => {
    if (texture === -1) {
        throw new Error('Invalid texture: got -1 while trying to reimport one.');
    }
    const tex = ensureTex(texture);
    const dest = getTextureOrig(texture, true);
    if (source instanceof Buffer) {
        await fs.writeFile(dest, source);
    } else {
        const newSource = source || tex.source;
        if (!newSource) {
            throw new Error('Cannot reimport a texture without a source file.');
        }
        await fs.copy(newSource, dest);
    }
    const image = document.createElement('img');
    image.src = 'file://' + dest + '?' + Math.random();
    await new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
    tex.imgWidth = image.width;
    tex.imgHeight = image.height;
    // Update frame size for single-frame textures
    if (tex.tiled || (
        tex.grid[0] === 1 &&
        tex.grid[1] === 1 &&
        tex.offx === 0 &&
        tex.offy === 0
    )) {
        tex.width = tex.imgWidth;
        tex.height = tex.imgHeight;
    }
    tex.origname = path.basename(dest);
    if (typeof source === 'string') {
        tex.source = source;
    }
    tex.lastmod = Number(new Date());

    await Promise.all([
        TexturePreviewer.save(tex),
        updateDOMImage(tex),
        texturesFromCtTexture(tex)
    ]);
};

/**
 * Properly removes a texture from the project, cleansing it from all the associated assets.
 * Must not be called directly from UI, use resources -> deleteAsset instead.
 *
 * @note It does not remove the actual image assets to not break projects after a project recovery.
 */
const removeTexture = (tex: string | ITexture): void => {
    tex = ensureTex(tex);
    const {uid} = tex;
    for (const [, asset] of uidMap) {
        if (asset.type === 'template') {
            if ((asset as ITemplate).texture === uid) {
                (asset as ITemplate).texture = -1;
            }
        } else if (asset.type === 'room') {
            const room = asset as IRoom;
            if ('tiles' in room) {
                for (const layer of room.tiles) {
                    layer.tiles = layer.tiles.filter(tile => tile.texture !== uid);
                }
            }
            if ('backgrounds' in room) {
                let i = 0;
                while (i < room.backgrounds.length) {
                    // eslint-disable-next-line max-depth
                    if (room.backgrounds[i].texture === uid) {
                        room.backgrounds.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            }
        } else if (asset.type === 'tandem') {
            const tandem = asset as ITandem;
            for (const emitter of tandem.emitters) {
                if (emitter.texture === uid) {
                    emitter.texture = -1;
                }
            }
        }
    }
    if (global.currentProject.settings.branding.icon === uid) {
        delete global.currentProject.settings.branding.icon;
    }
};

const getCleanTextureName = (name: string): string =>
    name.replace(isBgPostfixTester, '').replace(texturePostfixParser, '');

const getTexturePivot = (texture: assetRef | ITexture, inPixels?: boolean): [number, number] => {
    if (texture === -1) {
        if (inPixels) {
            return [16, 16];
        }
        return [0.5, 0.5];
    }
    if (typeof texture === 'string') {
        texture = getById('texture', texture);
    }
    if (inPixels) {
        return [texture.axis[0], texture.axis[1]];
    }
    return [texture.axis[0] / texture.width, texture.axis[1] / texture.height];
};

const setPixelart = (pixelart: boolean): void => {
    PIXI.settings.SCALE_MODE = pixelart ?
        PIXI.SCALE_MODES.NEAREST :
        PIXI.SCALE_MODES.LINEAR;
    for (const tex in pixiTextureCache) {
        pixiTextureCache[tex].texture[0].baseTexture.scaleMode = PIXI.settings.SCALE_MODE;
    }
};

export const assetContextMenuItems: IAssetContextItem[] = [{
    vocPath: 'texture.createTemplate',
    icon: 'template',
    action: async (
        asset: ITexture,
        collection: folderEntries,
        folder: IAssetFolder
    ): Promise<void> => {
        const template = await createAsset('template', folder, asset.name);
        template.texture = asset.uid;
        template.name = asset.name;
    }
}];

/**
 * A polyfill for general usage that prompts a user to specify a texture file
 * if no payload was provided.
 */
const createTexture = async (payload?: Parameters<typeof importImageToTexture>[0]):
Promise<ITexture> => {
    if (payload) {
        return importImageToTexture(payload as Parameters<typeof importImageToTexture>[0]);
    }
    const inputPath = await window.showOpenDialog({
        filter: '.png,.jpg,.jpeg,.bmp,.tiff,.webp'
    });
    if (!inputPath) {
        throw new Error('No image file selected.');
    }
    return importImageToTexture({
        src: inputPath
    });
};

export {
    clearPixiTextureCache,
    populatePixiTextureCache,
    resetPixiTextureCache,
    getTextureFromName,
    getCleanTextureName,
    getThumbnail,
    getTexturePivot,
    getTextureOrig,
    texturesFromCtTexture as updatePixiTexture,
    setPixelart,
    getPixiTexture,
    updateDOMImage,
    populateDOMTextureCache,
    resetDOMTextureCache,
    getDOMImageFromTexture,
    getDOMTexture,
    importImageToTexture,
    createTexture as createAsset,
    reimportTexture,
    reimportTexture as reimportAsset,
    removeTexture,
    removeTexture as removeAsset
};

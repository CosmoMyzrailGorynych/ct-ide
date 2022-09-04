import {imageContain, toBuffer, crop} from '../../utils/imageUtils';

/**
 * Gets the ct.js texture object by its id.
 * @param {string} id The id of the texture
 * @returns {ITexture} The ct.js texture object
 */
const getTextureFromId = (id: string): ITexture => {
    const texture = global.currentProject.textures.find((tex: ITexture) => tex.uid === id);
    if (!texture) {
        throw new Error(`Attempt to get a non-existent texture with ID ${id}`);
    }
    return texture;
};
const getById = getTextureFromId;

/**
 * Retrieves the full path to a thumbnail of a given texture.
 * @param {string|ITexture} texture Either the id of the texture, or its ct.js object
 * @param {boolean} [x2] If set to true, returns a 128x128 image instead of 64x64.
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the thumbnail.
 */
const getTexturePreview = function (
    texture: assetRef | ITexture,
    x2?: boolean,
    fs?: boolean
): string {
    if (texture === -1) {
        return 'data/img/notexture.png';
    }
    if (typeof texture === 'string') {
        texture = getTextureFromId(texture);
    }
    if (fs) {
        return `${global.projdir}/img/${texture.origname}_prev${x2 ? '@2' : ''}.png`;
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/img/${texture.origname}_prev${x2 ? '@2' : ''}.png?cache=${texture.lastmod}`;
};
const getThumbnail = getTexturePreview;

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
        texture = getTextureFromId(texture);
    }
    if (fs) {
        return `${global.projdir}/img/${texture.origname}`;
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/img/${texture.origname}?cache=${texture.lastmod}`;
};

const baseTextureFromTexture = (texture: ITexture): Promise<PIXI.BaseTexture> =>
    new Promise((resolve, reject) => {
        const textureLoader = new PIXI.Loader();
        const {resources} = textureLoader;

        const path = 'file://' + global.projdir.replace(/\\/g, '/') + '/img/' + texture.origname + '?' + texture.lastmod;

        textureLoader.add(texture.uid, path);
        // Seems that PIXI.Loader typings ain't complete
        (textureLoader as any).onError.add(reject);
        textureLoader.load(() => {
            resolve(resources[texture.uid].texture.baseTexture);
        });
    });

const unknownTexture = PIXI.Texture.from('data/img/unknown.png');
const pixiTextureCache: Record<string, {
    lastmod: number;
    texture: PIXI.Texture[]
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
 * @returns {Array<PIXI.Texture>} An array of PIXI.Textures
 */
const texturesFromCtTexture = async function (tex: ITexture) {
    const frames = [];
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
            );
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
    pixiTextureCache[tex.name] = {
        lastmod: tex.lastmod,
        texture: frames
    };
    return frames;
};
const populatePixiTextureCache = async (project: IProject): Promise<void> => {
    clearPixiTextureCache();
    const promises = [];
    for (const texture of project.textures) {
        promises.push(texturesFromCtTexture(texture));
    }
    await Promise.all(promises);
};
// async
const getDOMImage = function (
    texture: assetRef | ITexture,
    deflt?: string
): Promise<HTMLImageElement> {
    let path;
    const img = document.createElement('img');
    if (texture === -1 || !texture) {
        path = deflt || 'data/img/notexture.png';
    } else {
        if (typeof texture === 'string') {
            texture = getTextureFromId(texture);
        }
        path = 'file://' + global.projdir.replace(/\\/g, '/') + '/img/' + texture.origname + '?' + texture.lastmod;
    }
    img.src = path;
    return new Promise((resolve, reject) => {
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
    });
};

/**
 * @param {assetRef | ITexture} texture Either a uid of a texture, or a ct.js texture object
 * @param {number} [frame] The frame to extract. If not defined, will return an array of all frames
 * @param {boolean} [allowMinusOne] Allows the use of `-1` as a texture uid
 * @returns {Array<PIXI.Texture>|PIXI.Texture} An array of textures, or an individual one.
 */
function getPixiTexture(texture: assetRef | ITexture): PIXI.Texture[];
function getPixiTexture(
    texture: -1
): never;
function getPixiTexture(
    texture: assetRef | ITexture,
    frame: void | null,
    allowMinusOne?: boolean
): PIXI.Texture[];
function getPixiTexture(
    texture: assetRef | ITexture,
    frame: number,
    allowMinusOne?: boolean
): PIXI.Texture;
// eslint-disable-next-line func-style
function getPixiTexture(
    texture: assetRef | ITexture,
    frame?: number | void | null,
    allowMinusOne?: boolean
): PIXI.Texture | PIXI.Texture[] {
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
        texture = getTextureFromId(texture);
    }
    if (frame || frame === 0) {
        return pixiTextureCache[texture.name].texture[frame];
    }
    return pixiTextureCache[texture.name].texture;
}

/**
 * Returns a texture object by its name.
 * @param {string} name The name of the texture.
 * @return {ITexture} The texture's object
 */
const getTextureFromName = function (name: string): ITexture {
    const texture = window.currentProject.textures.find(tex => tex.name === name);
    if (!texture) {
        throw new Error(`Attempt to get a non-existent texture with name ${name}`);
    }
    return texture;
};
const textureGenPreview = async function textureGenPreview(
    texture: string | ITexture,
    destination: string,
    size: number
): Promise<string> {
    if (typeof texture === 'string') {
        texture = getTextureFromId(texture);
    }

    const source = await getDOMImage(texture);
    const frame = crop(
        source,
        texture.offx,
        texture.offy,
        texture.width,
        texture.height
    );
    const c = imageContain(frame, size, size);
    const buf = toBuffer(c);
    const fs = require('fs-extra');
    await fs.writeFile(destination, buf);
    return destination;
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
const importImageToTexture = async (
    src: string | Buffer,
    name?: string,
    group?: string,
    skipSignals?: boolean
): Promise<ITexture> => {
    const fs = require('fs-extra'),
          path = require('path'),
          generateGUID = require('./../../generateGUID');
    const id = generateGUID();
    let dest: string;
    if (src instanceof Buffer) {
        dest = path.join(global.projdir, 'img', `i${id}.png`);
        await fs.writeFile(dest, src);
    } else {
        dest = path.join(global.projdir, 'img', `i${id}${path.extname(src)}`);
        await fs.copy(src, dest);
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
    if (name) {
        texName = name;
    } else if (src instanceof Buffer) {
        texName = 'NewTexture';
    } else {
        texName = path.basename(src)
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
        isBlank: false,
        group
    };
    if (!(src instanceof Buffer)) {
        obj.source = src;
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
        textureGenPreview(obj, dest + '_prev.png', 64),
        textureGenPreview(obj, dest + '_prev@2.png', 128),
        texturesFromCtTexture(obj)
    ]);

    global.currentProject.textures.push(obj);

    if (!skipSignals) {
        window.signals.trigger('textureImported');
    }
    return obj;
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
        texture = getTextureFromId(texture);
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

export {
    clearPixiTextureCache,
    populatePixiTextureCache,
    getTextureFromId,
    getById,
    getTextureFromName,
    getTexturePreview,
    getCleanTextureName,
    getThumbnail,
    getTexturePivot,
    getTextureOrig,
    texturesFromCtTexture as updatePixiTexture,
    setPixelart,
    getPixiTexture,
    getDOMImage,
    importImageToTexture,
    textureGenPreview
};

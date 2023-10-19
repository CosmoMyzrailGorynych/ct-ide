import type {ISkeletonData} from 'node_modules/pixi-spine';

import * as PIXI from 'node_modules/pixi.js';
import execa from 'node_modules/execa';
import {getById, getOfType, IAssetContextItem, createAsset as createAssetOfType} from '..';

import generateGUID from './../../generateGUID';
import {SkeletonPreviewer} from '../preview/skeleton';

import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Receives the contents of the skeleton's main JSON file.
 * Returns a tuple with the app's name and its version.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSkeletonAppAndVersion = (json: Record<string, any>): [skeletonApp, string] => {
    if (json?.skeleton?.spine) {
        return ['spine', json.skeleton.spine];
    }
    if (json.version && json.name && json.armature) {
        // looks to be a DragonBones export
        return ['dragonbones', json.version];
    }
    return ['unknown', '0.0.0'];
};

/** Returns the path to the stored .json file of the skeleton. */
export const getSkeletonData = (skeleton: ISkeleton, fs: boolean): string => {
    if (fs) {
        return path.join(global.projdir, 'skel', skeleton.origname);
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname}`;
};
/** Returns the path to the stored .png atlas of the skeleton. */
export const getSkeletonAtlas = (skeleton: ISkeleton, fs: boolean): string => {
    if (fs) {
        return path.join(global.projdir, 'skel', skeleton.origname.replace('.json', '.png'));
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname.replace('.json', '.png')}`;
};
/** Returns the path to the stored .atlas file of the skeleton. */
export const getSkeletonAtlasMeta = (skeleton: ISkeleton, fs: boolean): string => {
    if (fs) {
        return path.join(global.projdir, 'skel', skeleton.origname.replace('.json', '.atlas'));
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname.replace('.json', '.atlas')}`;
};

export const getSkeletonPreview = SkeletonPreviewer.getClassic;
export const getThumbnail = getSkeletonPreview;
export const areThumbnailsIcons = false;

/**
 * Returns a path to the skeleton's fully rendered image.
 */
export const getSkeletonRender = function getSkeletonRender(
    skeleton: ISkeleton,
    fs?: boolean
): string {
    if (fs) {
        return path.join(global.projdir, 'skel', `${skeleton.origname}_full.png`);
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/skel/${skeleton.origname}_full.png`;
};

/**
 * Opens a Spine JSON export data and gets the list of the animations in the specified skeleton.
 */
export const getSpineAnimationList = (json: ISkeletonData): {
    animations: string[],
    skins: string[]
} => ({
    animations: Object.keys(json.animations) || [],
    skins: Object.keys(json.skins) || []
});

/**
 * @returns The path to a new skeleton file.
 * @see https://github.com/DragonBones/Tools
 */
export const convertDragonBones = async (skeFile: string): Promise<string> => {
    const {dir, name, base} = path.parse(skeFile);
    const convertDir = path.join(dir, 'ctjsConvert');
    await fs.ensureDir(convertDir);
    await execa('db2', ['-t', 'spine', '-i', dir, '-f', base, '-o', path.join(dir, 'ctjsConvert')], {
        preferLocal: true
    });
    // Remove the _ske postfix in the filename, as DragonBones tools do that, too
    return path.join(convertDir, `${name.slice(0, -4)}.json`);
};

/**
 * Checks whether there are all the required files for the skeleton import,
 * also running convertation procedure for DragonBones skeletons beforehand.
 * @returns A tuple: The path to the skeleton's .json file (which can change after the conversion
 * process) and the content of the skeleton's data file.
 */
const skeletonPreimport = async (source: string): Promise<[string, ISkeletonData]> => {
    let initialJSON: ISkeletonData = await fs.readJSON(source);
    const [app] = getSkeletonAppAndVersion(initialJSON);
    if (app === 'unknown') {
        throw new Error(`Unknown skeleton format in file ${source}. For DragonBones, use the _ske.json file.`);
    }
    if (app === 'dragonbones') {
        window.alertify.log('Converting a DragonBones project into Spine project…');
        source = await convertDragonBones(source);
        initialJSON = await fs.readJSON(source);
        window.alertify.log(`Converted! New files stored at ${source}`);
    }

    const basename = path.basename(source, path.extname(source));
    const dirname = path.dirname(source);

    const atlasPath = path.join(dirname, `${basename}.atlas`);
    const texturePath = path.join(dirname, `${basename}.png`);

    if (!(await fs.pathExists(atlasPath))) {
        throw new Error(`Could not find an atlas metadata at ${atlasPath}`);
    }
    if (!(await fs.pathExists(texturePath))) {
        throw new Error(`Could not find an atlas at ${texturePath}`);
    }
    return [source, initialJSON];
};
/**
 * Copies three files of the Spine skeletons into a project.
 */
const importSkeletonFiles = async (source: string, savePath: string): Promise<void> => {
    const basename = path.basename(source, path.extname(source));
    const dirname = path.dirname(source);
    const atlasPath = path.join(dirname, `${basename}.atlas`);
    const texturePath = path.join(dirname, `${basename}.png`);

    await Promise.all([
        fs.copy(source, path.join(savePath, `${basename}.json`)),
        fs.copy(atlasPath, path.join(savePath, `${basename}.atlas`)),
        fs.copy(texturePath, path.join(savePath, `${basename}.png`))
    ]);
};
/**
 * Imports a Spine or DragonBones skeleton by a filesystem path.
 */
export const importSkeleton = async (source: string): Promise<ISkeleton> => {
    const uid = generateGUID();
    const savePath = path.join(global.projdir + '/skel', uid.slice(0, 6));

    const [newSource, initialJSON] = await skeletonPreimport(source);
    const basename = path.basename(newSource, path.extname(newSource));
    await importSkeletonFiles(newSource, savePath);
    const origname = `${uid.slice(0, 6)}/${basename}.json`;

    const skel = {
        name: basename,
        origname,
        from: 'spine' as skeletonApp,
        // Preserve the old path to the skeleton
        source,
        ...getSpineAnimationList(initialJSON),
        type: 'skeleton' as const,
        lastmod: Number(Date.now()),
        uid,
        axis: [0, 0] as [number, number],
        width: NaN,
        height: NaN,
        shape: 'rect' as IHasCollision['shape'],
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    const [, bounds] = await SkeletonPreviewer.saveWithBounds(skel);
    skel.width = Math.ceil(bounds.width);
    skel.height = Math.ceil(bounds.height);
    skel.axis = [Math.round(-bounds.x), Math.round(-bounds.y)];
    skel.left = Math.round(-bounds.x);
    skel.right = Math.round(bounds.x + bounds.width);
    skel.top = Math.round(-bounds.y);
    skel.bottom = Math.round(bounds.y + bounds.height);

    return skel;
};
export const createAsset = async (payload?: {src: string}): Promise<ISkeleton> => {
    if (payload && payload.src) {
        return importSkeleton(payload.src);
    }
    const inputPath = await window.showOpenDialog({
        filter: '.json'
    });
    if (!inputPath) {
        throw new Error('You need to specify DragonBones or Spine2D animation file in JSON format.');
    }
    return importSkeleton(inputPath);
};
/**
 * Properly removes a skeleton from the project, cleaning all the references to it
 * in other relevant assets.
 */
export const removeAsset = (skel: ISkeleton | string): void => {
    if (typeof skel === 'string') {
        skel = getById('skeleton', skel);
    }
    const {uid} = skel;
    for (const template of getOfType('template')) {
        if (template.skeleton === uid) {
            template.skeleton = -1;
        }
    }
};
/**
 * Replaces the old skeleton with a new one.
 * Updates the source field of the ct.js skeleton.
 */
export const reimportSkeleton = async (
    asset: ISkeleton | string,
    source?: string
): Promise<void> => {
    const skel = (typeof asset === 'string') ? getById('skeleton', asset) : asset;
    if (!source && !skel.source) {
        throw new Error('No skeleton source provided.');
    }
    const savePath = path.join(global.projdir + '/skel', skel.uid.slice(0, 6));
    const [newSource, dataJSON] = await skeletonPreimport(source || skel.source);
    const meta = getSpineAnimationList(dataJSON);
    await importSkeletonFiles(newSource, savePath);
    const [, bounds] = await SkeletonPreviewer.saveWithBounds(skel);
    skel.animations = meta.animations;
    skel.skins = meta.skins;
    skel.axis = [Math.round(-bounds.x), Math.round(-bounds.y)];
    skel.source = source;
};
export const reimportAsset = reimportSkeleton;

// Caching DOM images of the full renders

const domSkeletonCache: Record<string, HTMLImageElement> = {};

/**
 * @param skeleton Accepts skeleton's IDs or whole skeleton objects.
 * Passing -1 will result in an error.
 * @param deflt The default texture to use when requesting an empty texture.
 * Defaults to data/img/notexture.png (a ghostly cat)
 * @returns An offsreen `img` tag for the given texture/skeleton.
 */
const getDOMImageFromSkeleton = function (skeleton: assetRef | ISkeleton)
: Promise<HTMLImageElement> {
    if (skeleton === -1) {
        throw new Error('-1 skeleton reference is not supported.');
    }
    const img = document.createElement('img');
    if (typeof skeleton === 'string') {
        skeleton = getById('skeleton', skeleton);
    }
    const path = getSkeletonRender(skeleton, false);
    img.src = path;
    return new Promise((resolve, reject) => {
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
    });
};
export const updateDOMSkeleton = async (skeleton: ISkeleton | assetRef)
: Promise<HTMLImageElement> => {
    if (skeleton === -1) {
        throw new Error('-1 skeleton reference is not supported.');
    }
    if (typeof skeleton === 'string') {
        skeleton = getById('skeleton', skeleton);
    }
    domSkeletonCache[skeleton.uid] = await getDOMImageFromSkeleton(skeleton);
    return domSkeletonCache[skeleton.uid];
};
export const populateDOMSkeletonCache = async (): Promise<void> => {
    const promises = getOfType('skeleton').map(updateDOMSkeleton);
    await Promise.all(promises); // drop returned values
};
export const resetDOMTextureCache = (): Promise<void> => {
    for (const key of Object.keys(domSkeletonCache)) {
        delete domSkeletonCache[key];
    }
    return populateDOMSkeletonCache();
};
/**
 * A synchronous method that returns a preloaded DOM img tag for a given skeleton.
 * This relies on the skeletons' texture cache; you must prepopulate the cache
 * with updateDOMSkeleton or populateDOMSkeletonCache methods from the same module.
 */
export const getDOMSkeleton = (skel: assetRef | ISkeleton): HTMLImageElement => {
    if (typeof skel !== 'string' && skel !== -1) {
        skel = skel.uid;
    }
    if (!(skel in domSkeletonCache)) {
        throw new Error(`Texture ${skel} does not exist in the DOM image cache. See if the texture actually exists.`);
    }
    return domSkeletonCache[skel];
};


// Caching Pixi.js textures of the full renders
const pixiTextureCache: Record<string, PIXI.Texture<PIXI.ImageResource>> = {};
const clearPixiTextureCache = function (): void {
    for (const i in pixiTextureCache) {
        delete pixiTextureCache[i];
    }
};
/**
 * Returns a PIXI.Texture instance of the specified skeleton, to be used in pixi.js renderers.
 * @param {ISkeleton} skel A ct.js skeleton object
 * @returns {Array<PIXI.Texture>} An array of PIXI.Textures
 */
const getPixiTextureFromSkel = (skel: ISkeleton): Promise<PIXI.Texture<PIXI.ImageResource>> =>
    PIXI.Assets.load(getSkeletonRender(skel, false));

export const updatePixiTextureForSkel = async (skel: ISkeleton | assetRef)
: Promise<PIXI.Texture<PIXI.ImageResource>> => {
    if (skel === -1) {
        throw new Error('-1 skeleton reference is not supported.');
    }
    if (typeof skel === 'string') {
        skel = getById('skeleton', skel);
    }
    const tex = await getPixiTextureFromSkel(skel);
    pixiTextureCache[skel.uid] = tex;
    return tex;
};
export const populatePixiTextureCache = async (): Promise<void> => {
    clearPixiTextureCache();
    const promises = [];
    for (const skel of getOfType('skeleton')) {
        promises.push(updatePixiTextureForSkel(skel));
    }
    await Promise.all(promises);
};
/**
 * A synchronous method that returns a preloaded PIXI.Texture for a given skeleton.
 * This relies on the skeletons' pixi.js texture cache; you must prepopulate the cache
 * with updatePixiTextureForSkel or populatePixiTextureCache methods from the same module.
 */
export const getPixiTexture = (skel: assetRef | ISkeleton): PIXI.Texture<PIXI.ImageResource> => {
    if (skel === -1) {
        throw new Error('-1 skeleton reference is not supported.');
    }
    if (typeof skel !== 'string') {
        skel = skel.uid;
    }
    if (!(skel in pixiTextureCache)) {
        throw new Error(`Skeleton of ID ${skel} does not exist in the PIXI image cache. See if the skeleton actually exists.`);
    }
    return pixiTextureCache[skel];
};

export const assetContextMenuItems: IAssetContextItem[] = [{
    vocPath: 'texture.createTemplate',
    icon: 'loader',
    action: async (
        asset: ISkeleton,
        collection: folderEntries,
        folder: IAssetFolder
    ): Promise<void> => {
        const template = await createAssetOfType('template', folder, asset.name);
        template.skeleton = asset.uid;
    }
}];

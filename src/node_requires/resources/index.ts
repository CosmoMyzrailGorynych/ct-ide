import * as textures from './textures';
import * as emitterTandems from './emitterTandems';
import * as fonts from './fonts';
import * as modules from './modules';
import * as projects from './projects';
import * as sounds from './sounds';
import * as rooms from './rooms';
import * as templates from './templates';
import * as styles from './styles';
import * as skeletons from './skeletons';

/** Typing-enforcing shenanigans */
interface IResourceAPI {
    areThumbnailsIcons: boolean;
    getThumbnail: (asset: assetRef | IAsset, x2?: boolean, fs?: boolean) => string;
    getName?: (asset: string | IAsset) => string;
    createAsset: (payload: unknown) =>
        Promise<IAsset> | IAsset;
    /** Optional as there can be no cleanup needed for specific asset types */
    removeAsset?: (asset: assetRef | IAsset) => Promise<void> | void;
}
const typeToApiMap: Record<resourceType, IResourceAPI> = {
    font: fonts,
    room: rooms,
    skeleton: skeletons,
    sound: sounds,
    style: styles,
    tandem: emitterTandems,
    template: templates,
    texture: textures
};
type typeToTsTypeMap = {
    [T in resourceType]:
        T extends 'font' ? IFont :
        T extends 'room' ? IRoom :
        T extends 'sound' ? ISound :
        T extends 'style' ? IStyle :
        T extends 'skeleton' ? ISkeleton :
        T extends 'texture' ? ITexture :
        T extends 'tandem' ? ITandem :
        T extends 'template'? ITemplate :
        never;
}

/**
 * A js Map that maps uids of the assets to actual asset objects.
 */
export const uidMap: Map<string, IAsset> = new Map();
/**
 * A js Map that maps asset objects to the asset folders that contain them.
 * This is mainly used to show an asset's folder.
 * Note that if the asset is placed in the root, the returned result is `null`.
 */
export const folderMap: Map<IAsset, IAssetFolder | null> = new Map();
/**
 * A js Map that maps asset objects to the asset arrays that contain them
 * (asset folders' entities or project's root).
 * This is used to delete assets from them.
 */
export const collectionMap: Map<IAsset, folderEntries> = new Map();
/**
 * An operation that fills the asset map, which is a mandatory operation for project loading.
 */
export const buildAssetMap = (project: IProject): void => {
    uidMap.clear();
    /**
     * @param current The current asset folder (or null for project's root)
     * @param entries The array to iterate upon
     */
    const recursiveFolderWalker = (
        current: null | IAssetFolder,
        entries: folderEntries
    ) => {
        for (const entry of entries) {
            if (entry.type !== 'folder') {
                uidMap.set(entry.uid, entry);
                folderMap.set(entry, current);
                collectionMap.set(entry, entries);
            } else {
                recursiveFolderWalker(entry, entry.entries);
            }
        }
    };
    recursiveFolderWalker(null, project.assets);
};
/**
 * Returns an array of all the assets of the given type.
 */
export const getOfType = <T extends resourceType>(type: T): typeToTsTypeMap[T][] =>
    Array.from(uidMap.values())
        .filter((a: IAsset) => a.type === type) as typeToTsTypeMap[T][];

export const getByTypes = (): {[T in resourceType]: typeToTsTypeMap[T][]} => {
    const assets = {} as Record<resourceType, IAsset[]>;
    for (const i in typeToApiMap) {
        assets[i as resourceType] = [];
    }
    for (const [, asset] of uidMap) {
        assets[asset.type].push(asset);
    }
    return assets as unknown as {[T in resourceType]: typeToTsTypeMap[T][]};
};

export const getById = <T extends resourceType>(type: T, id: string): typeToTsTypeMap[T] => {
    const asset = uidMap.get(id);
    if (!asset) {
        throw new Error(`Attempt to get a non-existent ${type} with ID ${id}`);
    }
    if (asset.type !== 'skeleton') {
        throw new Error(`Asset with a ${id} uid is not a ${type}. Asset's actual type is ${asset.type}`);
    }
    return asset as typeToTsTypeMap[T];
};

/**
 * Creates a new asset of the specified type. This is the method that must be used in the UI.
 */
export const createAsset = async <T>(
    type: resourceType,
    collection: folderEntries,
    folder: IAssetFolder | null,
    payload: T
): Promise<IAsset> => {
    const asset = await typeToApiMap[type].createAsset(payload);
    collection.push(asset);
    uidMap.set(asset.uid, asset);
    folderMap.set(asset, folder);
    collectionMap.set(asset, collection);
    return asset;
};
/**
 * Deletes the asset from the project. This is the method that must be used in the UI.
 */
export const deleteAsset = async (asset: IAsset): Promise<void> => {
    if ('removeAsset' in typeToApiMap[asset.type]) {
        await typeToApiMap[asset.type].removeAsset(asset);
    }
    const collection = collectionMap.get(asset);
    collection.splice(collection.indexOf(asset), 1);
    uidMap.delete(asset.uid);
    folderMap.delete(asset);
    collectionMap.delete(asset);
};

/**
 * A method that returns an up-to-date DOM image of a texture for the specified asset.
 * Relies on caches in the textures and skeletons submodules.
 * @async
 */
export const getDOMImage = (asset: ISkeleton | ITemplate | ITexture): HTMLImageElement => {
    if (asset.type === 'texture') {
        return textures.getDOMTexture(asset);
    } else if (asset.type === 'template') {
        return templates.getDOMTexture(asset);
    }
    return skeletons.getDOMSkeleton(asset);
};

export const resourceToIconMap = {
    texture: 'texture',
    tandem: 'sparkles',
    font: 'ui',
    sound: 'headphones',
    room: 'room',
    template: 'template',
    style: 'ui',
    project: 'sliders'
};

export {
    textures,
    emitterTandems,
    emitterTandems as tandems,
    fonts,
    modules,
    projects,
    sounds,
    rooms,
    templates,
    styles
};

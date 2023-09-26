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

/**
 * The interface that describe additional asset actions callable through a context menu.
 * Items must be exported in an array from the resource API they belong to.
 */
export interface IAssetContextItem {
    /**
     * Used to determine whether the context menu item is applicable for this asset.
     * If the method is set and it returns false, the menu item is not shown.
     */
    if?: (asset: IAsset) => boolean;
    /** A path in the language file that is used for this menu item's label */
    vocPath: string;
    icon?: string;

    // TODO: Implement; can be used with rooms to mark a starting one
    /**
     * If set, turns the menu item's type to checkbox,
     * and the method determines whether the checkbox is ticked.
     */
    checked?: (asset: IAsset) => boolean;
    /**
     * The action that must happen when the menu item is clicked.
     * `collection` and `folder` define the folder the asset is residing in.
     */
    action: (
        asset: IAsset,
        collection: folderEntries,
        folder: IAssetFolder
    ) => void | Promise<void>;
}

/** Typing-enforcing shenanigans */
interface IResourceAPI {
    areThumbnailsIcons: boolean;
    getThumbnail: (asset: assetRef | IAsset, x2?: boolean, fs?: boolean) => string;
    getName?: (asset: string | IAsset) => string;
    createAsset: (payload?: unknown) =>
        Promise<IAsset> | IAsset;
    /** Optional as there can be no cleanup needed for specific asset types */
    removeAsset?: (asset: assetRef | IAsset) => Promise<void> | void;
    reimportAsset?: (asset: assetRef | IAsset) => Promise<void>;
    assetContextMenuItems?: IAssetContextItem[];
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
/** Names of all possible asset types */
export const assetTypes = Object.keys(typeToApiMap) as resourceType[];

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

export const getById = <T extends resourceType>(type: T | null, id: string): typeToTsTypeMap[T] => {
    const asset = uidMap.get(id);
    if (!asset) {
        throw new Error(`Attempt to get a non-existent ${type || 'asset'} with ID ${id}`);
    }
    if (type && asset.type !== type) {
        throw new Error(`Asset with a ${id} uid is not a ${type}. Asset's actual type is ${asset.type}`);
    }
    return asset as typeToTsTypeMap[T];
};

/**
 * Creates a new asset of the specified type. This is the method that must be used in the UI.
 */
export const createAsset = async <T extends resourceType, P>(
    type: T,
    collection: folderEntries,
    folder: IAssetFolder | null,
    payload?: P
): Promise<typeToTsTypeMap[T]> => {
    const asset = (await typeToApiMap[type].createAsset(payload)) as typeToTsTypeMap[T];
    collection.push(asset);
    uidMap.set(asset.uid, asset);
    folderMap.set(asset, folder);
    collectionMap.set(asset, collection);
    window.signals.trigger('assetCreated', asset);
    window.signals.trigger(`${type}Created`, asset);
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

export const areThumbnailsIcons = (asset: IAsset | IAssetFolder): boolean => {
    if (asset.type === 'folder') {
        return true;
    }
    return typeToApiMap[asset.type].areThumbnailsIcons;
};
export const getThumbnail = (asset: IAsset | IAssetFolder, x2?: boolean, fs?: boolean): string => {
    if (asset.type === 'folder') {
        return asset.icon;
    }
    return typeToApiMap[asset.type].getThumbnail(asset, x2, fs);
};
export const getName = (asset: IAsset | IAssetFolder): string => {
    if (asset.type === 'folder') {
        return asset.name;
    }
    return typeToApiMap[asset.type].getName ?
        typeToApiMap[asset.type].getName(asset) :
        (asset as IAsset & {name: string}).name;
};
export const getContextActions = (asset: IAsset): IAssetContextItem[] => {
    const api = typeToApiMap[asset.type];
    if (!api.assetContextMenuItems) {
        return [];
    }
    return api.assetContextMenuItems.filter(item => !item.if || item.if(asset));
};

export const resourceToIconMap: Record<resourceType, string> = {
    texture: 'texture',
    tandem: 'sparkles',
    font: 'ui',
    sound: 'headphones',
    room: 'room',
    template: 'template',
    style: 'ui',
    skeleton: 'template' // TODO: Design a unique icon
};
export const editorMap: Record<resourceType, string> = {
    font: 'font-editor',
    room: 'room-editor',
    skeleton: 'skeletal-animation',
    sound: 'sound-editor',
    style: 'style-editor',
    tandem: 'emitter-tandem-editor',
    template: 'template-editor',
    texture: 'texture-editor'
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

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
import * as behaviors from './behaviors';

import getUid from '../generateGUID';
import {getLanguageJSON, getByPath} from '../i18n';

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
    /**
     * An optional method that returns a list of icons used to graphically characterize
     * an asset in an asset browser.
     */
    getIcons?: (asset: IAsset) => string[];
    /**
     * An optional method for retrieving the name of an asset.
     * If not set, the asset's `name` property is used.
     */
    getName?: (asset: string | IAsset) => string;
    createAsset: (payload?: unknown) =>
        Promise<IAsset> | IAsset;
    /**
     * Optional as there can be no cleanup needed for specific asset types.
     * These methods should never be called directly from UI.
     */
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
    texture: textures,
    behavior: behaviors
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
        T extends 'template' ? ITemplate :
        T extends 'behavior' ? IBehavior :
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

/**
 * Returns the asset of the specified uid.
 * @param type This can be either the type of the asset,
 * a comma-separated list of the allowed types, or `null` to allow any asset.
 * If the type is not set to `null`, the method will throw an error if the asset
 * is not of the specified type.
 * @param uid The uid of the asset.
 */
export const getById = <T extends resourceType>(
    type: T | string | null,
    id: string
): typeToTsTypeMap[T] => {
    const asset = uidMap.get(id);
    if (!asset) {
        throw new Error(`Attempt to get a non-existent ${type || 'asset'} with ID ${id}`);
    }
    if (type === null) {
        // No type restrictions
        // TODO: make an overload
        return asset as typeToTsTypeMap[T];
    }
    const types = type.split(',');
    if (!types.some((t) => asset.type === t)) {
        throw new Error(`Asset with a ${id} uid is none of ${types.join(', ')}. Asset's actual type is ${asset.type}`);
    }
    return asset as typeToTsTypeMap[T];
};

export const getFolderById = (uid: string | null): IAssetFolder => {
    const recursiveFolderWalker = (
        uid: string,
        collection: folderEntries
    ): IAssetFolder => {
        for (const entry of collection) {
            if (entry.type === 'folder') {
                if (entry.uid === uid) {
                    return entry;
                }
                const result = recursiveFolderWalker(uid, entry.entries);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    };
    return recursiveFolderWalker(uid, window.currentProject.assets);
};

export const getParentFolder = (object: IAsset | IAssetFolder): IAssetFolder | null => {
    if (object.type === 'folder') {
        const recursiveFolderWalker = (
            child: IAssetFolder,
            entries: folderEntries,
            current: IAssetFolder | null
        ): IAssetFolder | null => {
            for (const entry of entries) {
                if (entry.type === 'folder') {
                    if (entry === child) {
                        return current;
                    }
                    const result = recursiveFolderWalker(child, entry.entries, entry);
                    if (result) {
                        return result;
                    }
                }
            }
            return null;
        };
        return recursiveFolderWalker(object, window.currentProject.assets, null);
    }
    return folderMap.get(object);
};

/**
 * Creates a new asset of the specified type. This is the method that must be used in the UI.
 */
export const createAsset = async <T extends resourceType, P>(
    type: T,
    folder: IAssetFolder | null,
    payload?: P
): Promise<typeToTsTypeMap[T]> => {
    const asset = (await typeToApiMap[type].createAsset(payload)) as typeToTsTypeMap[T];
    const collection = (folder === null) ? window.currentProject.assets : folder.entries;
    collection.push(asset);
    uidMap.set(asset.uid, asset);
    folderMap.set(asset, folder);
    collectionMap.set(asset, collection);
    window.signals.trigger('assetCreated', asset.uid);
    window.signals.trigger(`${type}Created`, asset.uid);
    return asset;
};

/**
 * Creates a folder, puts it in a parent collection, and returns it.
 *
 * @param parentFolder The folder that will contain the new folder.
 * If set to `null`, the folder is placed into the project's root.
 */
export const createFolder = (parentFolder: IAssetFolder | null): IAssetFolder => {
    if (parentFolder === void 0) {
        throw new Error('[resources.createFolder] You must specify a parent folder or null for project\'s root.');
    }
    const collection = parentFolder === null ? window.currentProject.assets : parentFolder.entries;
    const newFolder = {
        type: 'folder' as const,
        uid: getUid(),
        colorClass: 'act',
        icon: 'help-circle',
        name: getLanguageJSON().assetViewer.newFolderName,
        lastmod: Number(new Date()),
        entries: [] as folderEntries
    };
    collection.push(newFolder);
    return newFolder;
};

/**
 * Moves the asset to a new folder.
 * @param newFolder The folder to move the asset to.
 * If set to `null`, the asset is moved to the project's root.
 */
export const moveAsset = (asset: IAsset, newFolder: IAssetFolder | null): void => {
    const oldCollection = collectionMap.get(asset);
    const newCollection = newFolder === null ? window.currentProject.assets : newFolder.entries;
    oldCollection.splice(oldCollection.indexOf(asset), 1);
    collectionMap.delete(asset);
    folderMap.delete(asset);
    newCollection.push(asset);
    collectionMap.set(asset, newCollection);
    folderMap.set(asset, newFolder);
};

/**
 * Moves a folder to a new parent folder, checking if it is possible to do
 * withrout creating circular dependencies.
 */
export const moveFolder = (
    folder: IAssetFolder,
    newParentFolder: IAssetFolder | null
): void => {
    if (folder === newParentFolder) {
        throw new Error('Cannot move a folder to itself.');
    }
    const recursiveFolderWalker = (entries: folderEntries): boolean => {
        for (const entry of entries) {
            if (entry.type === 'folder') {
                if (entry === newParentFolder) {
                    return false;
                }
                const result = recursiveFolderWalker(entry.entries);
                if (!result) {
                    return false;
                }
            }
        }
        return true;
    };
    if (!recursiveFolderWalker(folder.entries)) {
        throw new Error('Cannot move a folder inside its child folder.');
    }
    const oldParentFolder: IAssetFolder | null = getParentFolder(folder);
    const from: folderEntries = oldParentFolder === null ?
        window.currentProject.assets :
        oldParentFolder.entries;
    const to: folderEntries = newParentFolder === null ?
        window.currentProject.assets :
        newParentFolder.entries;
    from.splice(from.indexOf(folder), 1);
    to.push(folder);
};

/**
 * Deletes the asset from the project. This is the method that must be used in the UI.
 */
export const deleteAsset = async (asset: IAsset): Promise<void> => {
    // Execute additional cleanup steps for this asset type, if applicable
    if ('removeAsset' in typeToApiMap[asset.type]) {
        await typeToApiMap[asset.type].removeAsset(asset);
    }
    // Clear asset references from content types' entries
    for (const contentType of window.currentProject.contentTypes) {
        for (const entry of contentType.entries) {
            for (const key in entry) {
                if (Array.isArray(entry[key])) {
                    (entry[key] as []).filter(val => val !== asset.uid);
                } else if (entry[key] === asset.uid) {
                    entry[key] = -1;
                }
            }
        }
    }
    // Do the same for potential behaviors' keys
    for (const other of [...getOfType('room'), ...getOfType('template')]) {
        for (const key in other.extends) {
            if (Array.isArray(other.extends[key])) {
                (other.extends[key] as []).filter(val => val !== asset.uid);
            } else if (other.extends[key] === asset.uid) {
                other.extends[key] = -1;
            }
        }
    }
    // Remove from the parent folder
    const collection = collectionMap.get(asset);
    collection.splice(collection.indexOf(asset), 1);
    // Clear references from converting maps and
    uidMap.delete(asset.uid);
    folderMap.delete(asset);
    collectionMap.delete(asset);
    // Notify the UI about asset removal
    window.signals.trigger('assetRemoved', asset.uid);
    window.signals.trigger(`${asset.type}Removed`, asset.uid);
};

/**
 * Deletes the specified folder.
 * @param folder The folder to delete.
 * @param unwrapTo If set to another folder, the old contents will be put in this specified folder.
 * If set to `null`, the folder's contents will be moved to the project's root.
 */
export const deleteFolder = (
    folder: IAssetFolder,
    unwrapTo: IAssetFolder | null | false
): Promise<void> => {
    if (unwrapTo || unwrapTo === null) {
        for (const entry of folder.entries) {
            if (entry.type === 'folder') {
                moveFolder(entry, unwrapTo as IAssetFolder | null);
            } else {
                moveAsset(entry, unwrapTo as IAssetFolder | null);
            }
        }
        return deleteFolder(folder, false);
    }
    return Promise.all(folder.entries.map((entry) => {
        if (entry.type === 'folder') {
            return deleteFolder(entry, false);
        }
        return deleteAsset(entry);
    })).then(() => {
        const parent = getParentFolder(folder);
        const from = parent === null ? window.currentProject.assets : parent.entries;
        from.splice(from.indexOf(folder), 1);
    });
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
export const getIcons = (asset: IAsset): string[] =>
    typeToApiMap[asset.type].getIcons?.(asset) ?? [];
export const getName = (asset: IAsset | IAssetFolder): string => {
    if (asset.type === 'folder') {
        return asset.name;
    }
    return typeToApiMap[asset.type].getName ?
        typeToApiMap[asset.type].getName(asset) :
        (asset as IAsset & {name: string}).name;
};
export const getContextActions = (
    asset: IAsset,
    callback?: (asset: IAsset) => unknown
): IMenuItem[] => {
    const api = typeToApiMap[asset.type];
    if (!api.assetContextMenuItems) {
        return [];
    }
    const actions: IMenuItem[] = api.assetContextMenuItems
        .filter(item => !item.if || item.if(asset))
        .map(item => ({
            label: getByPath(item.vocPath) as string,
            icon: item.icon,
            click: async () => {
                await item.action(asset, collectionMap.get(asset), folderMap.get(asset));
                if (callback) {
                    callback(asset);
                }
            },
            checked: item.checked && (() => item.checked(asset))
        }));
    return actions;
};

export const resourceToIconMap: Record<resourceType, string> = {
    texture: 'texture',
    tandem: 'sparkles',
    font: 'ui',
    sound: 'headphones',
    room: 'room',
    template: 'template',
    style: 'ui',
    skeleton: 'skeletal-animation',
    behavior: 'behavior'
};
export const editorMap: Record<resourceType, string> = {
    font: 'font-editor',
    room: 'room-editor',
    skeleton: 'skeletal-animation',
    sound: 'sound-editor',
    style: 'style-editor',
    tandem: 'emitter-tandem-editor',
    template: 'template-editor',
    texture: 'texture-editor',
    behavior: 'behavior-editor'
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

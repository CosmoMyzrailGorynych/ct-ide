import {get as getDefaultScript} from './defaultScript';
import {IAssetContextItem, addAsset} from '..';
import {promptName} from '../promptName';

import generateGUID from '../../generateGUID';

export const getThumbnail = (): string => 'code-alt';
export const areThumbnailsIcons = true;

export const createAsset = async (opts?: {
    name?: string
}): Promise<IScript> => {
    const script = getDefaultScript();
    if (opts && opts.name) {
        script.name = opts.name;
        return script;
    }
    const name = await promptName('script', 'New Script');
    if (name) {
        script.name = name;
        return script;
    }
    // eslint-disable-next-line no-throw-literal
    throw 'cancelled';
};

export const getIcons = (asset: IScript): string[] => {
    if (asset.runAutomatically) {
        return ['play', asset.language];
    }
    return [asset.language];
};

export const assetContextMenuItems: IAssetContextItem[] = [{
    icon: 'copy',
    vocPath: 'common.duplicate',
    action: (asset: IScript, collection, folder): void => {
        const newScript = structuredClone(asset) as IScript & {uid: string};
        newScript.uid = generateGUID();
        newScript.name += `_${newScript.uid.slice(0, 4)}`;
        addAsset(newScript, folder);
    }
}];

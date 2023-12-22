import generateGUID from '../../generateGUID';
import {StylePreviewer} from '../preview/style';
import {promptName} from '../promptName';
import {IAssetContextItem, addAsset, getOfType} from '..';

export const createAsset = async (): Promise<IStyle> => {
    const name = await promptName('style', 'New Style');
    if (!name) {
        // eslint-disable-next-line no-throw-literal
        throw 'cancelled';
    }
    const id = generateGUID();
    const style: IStyle = {
        type: 'style',
        name,
        uid: id,
        font: {
            family: 'sans-serif',
            halign: 'left',
            italic: false,
            size: 12,
            weight: '400',
            wrap: false,
            wrapPosition: 640,
            lineHeight: 16
        },
        lastmod: Number(new Date())
    };
    await StylePreviewer.save(style);
    return style;
};

export const removeAsset = (style: IStyle): void => {
    const templates = getOfType('template');
    for (const template of templates) {
        if (template.textStyle === style.uid) {
            template.textStyle = -1;
        }
    }
};

export const getThumbnail = StylePreviewer.getClassic;

export const areThumbnailsIcons = false;

export const assetContextMenuItems: IAssetContextItem[] = [{
    icon: 'copy',
    vocPath: 'common.duplicate',
    action: async (asset: IStyle, collection, folder): Promise<void> => {
        const newStyle = structuredClone(asset) as IStyle & {uid: string};
        newStyle.uid = generateGUID();
        newStyle.name += `_${newStyle.uid.slice(0, 4)}`;
        await StylePreviewer.save(newStyle);
        addAsset(newStyle, folder);
    }
}];

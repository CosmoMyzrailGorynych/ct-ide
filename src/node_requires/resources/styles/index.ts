import generateGUID from '../../generateGUID';
import {StylePreviewer} from '../preview/style';
import {promptName} from '../promptName';
import {IAssetContextItem, addAsset, getOfType, createAsset as createProjAsset} from '..';
import {getBaseClassFields} from '../templates';

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
        fill: {
            type: 0,
            color: '#ffffff',
            color1: '#cccccc',
            color2: '#ffffff',
            gradtype: 1
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
    vocPath: 'texture.createTemplate',
    icon: 'template',
    action: async (
        asset: ITexture,
        collection: folderEntries,
        folder: IAssetFolder
    ): Promise<void> => {
        let template: ITemplate;
        if (getOfType('template').some(t => t.name === asset.name)) {
            template = await createProjAsset('template', folder);
        } else {
            template = await createProjAsset('template', folder, {
                name: asset.name
            });
        }
        template.baseClass = 'Text';
        Object.assign(template, getBaseClassFields('Text'));
        template.textStyle = asset.uid;
    }
}, {
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

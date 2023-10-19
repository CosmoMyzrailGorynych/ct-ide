import generateGUID from '../../generateGUID';
import {getById} from '..';
import path from 'path';
import {StylePreviewer} from '../preview/style';

export const createAsset = (): IStyle => {
    const id = generateGUID(),
          slice = id.slice(-6);
    const style: IStyle = {
        type: 'style',
        name: 'Style_' + slice,
        uid: id,
        font: {
            family: 'sans-serif',
            halign: 'left',
            italic: false,
            size: 12,
            weight: 400,
            wrap: false,
            wrapPosition: 640,
            lineHeight: 16
        },
        lastmod: Number(new Date())
    };
    return style;
};

export const getThumbnail = StylePreviewer.getClassic;

export const areThumbnailsIcons = false;

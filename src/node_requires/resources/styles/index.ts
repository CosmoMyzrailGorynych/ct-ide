import generateGUID from '../../generateGUID';
import {getById} from '..';
import path from 'path';

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

export const getThumbnail = (style: assetRef | IStyle, x2?: boolean, fs?: boolean): string => {
    if (style === -1) {
        throw new Error('Cannot get a thumbnail for a -1 style.');
    }
    if (typeof style === 'string') {
        style = getById('style', style);
    }
    if (fs) {
        return path.join(window.global.projdir, 'img', `s${style.uid}_prev.png`);
    }
    return `file://${window.global.projdir}/img/s${style.uid}_prev.png?${style.lastmod}`;
};

export const areThumbnailsIcons = false;

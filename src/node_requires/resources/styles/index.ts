import generateGUID from '../../generateGUID';
import {StylePreviewer} from '../preview/style';
import {promptName} from '../promptName';
import {outputCanvasToFile} from '../../utils/imageUtils';

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
    StylePreviewer.create(style)
        .then(canvas => outputCanvasToFile(
            canvas,
            StylePreviewer.get(style, true)
        ));
    return style;
};

export const getThumbnail = StylePreviewer.getClassic;

export const areThumbnailsIcons = false;

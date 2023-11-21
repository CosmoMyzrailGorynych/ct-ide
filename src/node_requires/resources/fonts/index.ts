import {FontPreviewer} from '../preview/font';
import {getOfType} from '..';

const getName = function getName(font: IFont): string {
    return `${font.typefaceName} ${font.weight} ${font.italic ? 'Italic' : ''}`;
};

/**
 * @param {object|string} font The font object in ct.js project, or its UID.
 * @param {boolean} fs If set to `true`, returns a clean path in a file system.
 * Otherwise, returns an URL.
 */
const getPathToTtf = function getPathToTtf(font: IFont, fs?: boolean): string {
    const path = require('path');
    if (fs) {
        return path.join(global.projdir, 'fonts', font.origname);
    }
    return `file://${global.projdir.replace(/\\/g, '/')}/fonts/${font.origname}`;
};

const importTtfToFont = async function importTtfToFont(src: string): Promise<IFont> {
    const fs = require('fs-extra'),
          path = require('path');
    if (path.extname(src).toLowerCase() !== '.ttf') {
        throw new Error(`[resources/fonts] Rejecting a file as it does not have a .ttf extension: ${src}`);
    }
    const generateGUID = require('./../../generateGUID');
    const uid = generateGUID();
    await fs.copy(src, path.join(global.projdir, '/fonts/f' + uid + '.ttf'));
    const obj: IFont = {
        type: 'font',
        typefaceName: path.basename(src).replace(/\.ttf$/i, ''),
        weight: '400' as fontWeight,
        italic: false,
        origname: `f${uid}.ttf`,
        lastmod: Number(new Date()),
        bitmapFont: false,
        bitmapFontSize: 16,
        bitmapFontLineHeight: 18,
        charsets: ['allInFont' as builtinCharsets],
        customCharset: '',
        uid
    };
    await FontPreviewer.save(obj);
    window.signals.trigger('fontCreated');
    return obj;
};

const getThumbnail = FontPreviewer.getClassic;

export const areThumbnailsIcons = false;

export const createAsset = async (payload?: {src: string}): Promise<IFont> => {
    if (payload && payload.src) {
        return importTtfToFont(payload.src);
    }
    const inputPath = await window.showOpenDialog({
        filter: '.ttf'
    });
    if (!inputPath) {
        throw new Error('You need to select a TTF file.');
    }
    return importTtfToFont(inputPath);
};

interface IExternalFont extends FontFace {
    external?: boolean;
    ctId?: string;
}

const refreshFonts = (): void => {
    const fonts = getOfType('font');
    for (const font of document.fonts as Iterable<IExternalFont>) {
        if (font.external) {
            document.fonts.delete(font);
        }
    }
    for (const font of fonts) {
        const template = {
            weight: font.weight,
            style: font.italic ? 'italic' : 'normal'
        };
        const source = `${global.projdir}/fonts/${font.origname}`,
              cleanedSource = source.replace(/ /g, '%20').replace(/\\/g, '/');
        const face = new FontFace('CTPROJFONT' + font.typefaceName, `url(file://${cleanedSource})`, template) as IExternalFont;
        face.load()
        .then((loaded: IExternalFont) => {
            loaded.external = true;
            loaded.ctId = face.ctId = font.uid;
            document.fonts.add(loaded);
        });
    }
};

export {
    importTtfToFont,
    getName,
    getThumbnail,
    refreshFonts,
    getPathToTtf
};

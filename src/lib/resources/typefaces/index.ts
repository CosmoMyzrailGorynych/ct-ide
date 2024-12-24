import {TypefacePreviewer} from '../preview/typeface';
import {getOfType, getById, IAssetContextItem, createAsset as createAssetResources} from '..';
import fs from '../../neutralino-fs-extra';
import path from 'path';
import generateGUID from '../../generateGUID';

import {BlobCache} from 'src/lib/blobCache';
const fontsCache = new BlobCache();

const {os} = Neutralino;

const guessItalic = (filename: string) => {
    const testname = filename.toLowerCase();
    return testname.includes('italic') || testname.includes('oblique') || testname.includes('slanted');
};
const weightGuessMap: Record<fontWeight, string[]> = {
    100: ['extralight', 'extra light', 'extra-light', 'extrathin'],
    200: ['thin'],
    300: ['light'],
    400: ['regular'],
    500: ['medium', 'book'],
    600: ['semibold', 'semi-bold'],
    800: ['extrabold', 'extra bold', 'extra-bold', 'bolder'],
    700: ['bold'],
    900: ['black']
};
const guessWeight = (filename: string): fontWeight => {
    const testname = filename.toLowerCase();
    for (const weight in weightGuessMap) {
        for (const name of weightGuessMap[weight as fontWeight]) {
            if (testname.includes(name)) {
                return weight as fontWeight;
            }
        }
    }
    return '400';
};

/**
 * @param font The font object in ct.js project.
 * @param fs If set to `true`, returns a clean path in a file system.
 * Otherwise, returns an URL.
 */
export const getPathToTtf = ((font: IFont, getFsPath?: boolean) => {
    if (getFsPath) {
        return path.join(window.projdir, 'fonts', `f${font.uid}.ttf`);
    }
    return fontsCache.getUrl(getPathToTtf(font, true));
}) as ((font: IFont, getFsPath?: false) => Promise<string>) &
      ((font: IFont, getFsPath: true) => string);

export const addFont = async (
    typeface: ITypeface,
    src: string | ArrayBuffer,
    name?: string
): Promise<IFont> => {
    const uidTypeface = generateGUID();
    if (!name && typeof src === 'string') {
        name = path.basename(src, path.extname(src));
    }
    const weight = name ? guessWeight(name) : '400';
    const italic = name ? guessItalic(name) : false;
    const font: IFont = {
        weight,
        italic,
        uid: uidTypeface,
        origname: name ?? 'New Font'
    };
    const targetPath = getPathToTtf(font, true);
    await fs.ensureDir(path.dirname(targetPath));
    if (typeof src === 'string') {
        await fs.copy(src, targetPath);
    } else {
        await fs.writeFile(targetPath, src);
    }
    typeface.fonts.push(font);
    if (typeface.fonts.length === 1) {
        await TypefacePreviewer.save(typeface);
    }
    return font;
};

export const importTtfToFont = async function importTtfToFont(
    src: string | ArrayBuffer,
    name?: string
): Promise<ITypeface> {
    if (typeof src === 'string') {
        if (path.extname(src).toLowerCase() !== '.ttf') {
            throw new Error(`[resources/fonts] Rejecting a file as it does not have a .ttf extension: ${src}`);
        }
    }
    if (!name && typeof src === 'string') {
        name = path.basename(src, '.ttf');
    }
    const uidFont = generateGUID();
    const obj: ITypeface = {
        name: name ?? 'New Typeface',
        type: 'typeface',
        fonts: [],
        lastmod: Number(new Date()),
        bitmapFont: false,
        bitmapFontSize: 16,
        bitmapFontLineHeight: 18,
        bitmapPrecision: false,
        charsets: ['allInFont' as builtinCharsets],
        customCharset: '',
        uid: uidFont
    };
    await addFont(obj, src);
    await TypefacePreviewer.save(obj);
    window.signals.trigger('fontCreated');
    return obj;
};

export const getThumbnail = TypefacePreviewer.get;

export const areThumbnailsIcons = false;

export const getFontDomName = (font: IFont): string => `CTPROJFONT-${font.uid}`;

const fontsMap = new Map<string, FontFace>();
export const refreshFonts = async (): Promise<void> => {
    const typefaces = getOfType('typeface');
    await Promise.all(typefaces.map(typeface => Promise.all(typeface.fonts.map(async font => {
        if (fontsMap.has(font.uid)) {
            return;
        }
        const template = {
            weight: '400',
            style: 'normal'
        };
        const blobUrl = await getPathToTtf(font);
        const face = new FontFace(getFontDomName(font), `url(${blobUrl})`, template);
        const loadedFontFace = await face.load();
        fontsMap.set(font.uid, loadedFontFace);
        document.fonts.add(loadedFontFace);
    }))));
};

export const createAsset = async (payload?: {
    src: string | ArrayBuffer,
    name?: string
}): Promise<ITypeface> => {
    if (payload && payload.src) {
        return importTtfToFont(payload.src, payload.name);
    }
    const inputPath = await os.showOpenDialog(void 0, {
        filters: [{
            name: 'TrueType Fonts',
            extensions: ['ttf']
        }],
        multiSelections: true
    }) as string[] | false;
    if (!inputPath || !inputPath.length) {
        throw new Error('You need to select a TTF file.');
    }
    const typeface = await importTtfToFont(inputPath[0]);
    if (inputPath.length > 1) {
        await Promise.all(inputPath.slice(1).map((src) => addFont(typeface, src)));
    }
    await refreshFonts();
    return typeface;
};

/**
 * Properly removes a typeface from any styles
 */
export const removeAsset = (typeface: string | ITypeface): void => {
    const asset = typeof typeface === 'string' ? getById('typeface', typeface) : typeface;
    const styles = getOfType('style');
    for (const style of styles) {
        if (style.typeface === asset.uid) {
            style.typeface = -1;
        }
    }
};


export const assetContextMenuItems: IAssetContextItem[] = [{
    vocPath: 'common.createStyleFromIt',
    icon: 'droplet',
    action: async (
        asset: ITypeface,
        collection: folderEntries,
        folder: IAssetFolder
    ): Promise<void> => {
        const style = await createAssetResources('style', folder);
        if (style) {
            style.typeface = asset.uid;
            if (asset.bitmapFont) {
                style.font.size = asset.bitmapFontSize;
                style.font.lineHeight = asset.bitmapFontLineHeight;
            }
        }
    }
}];

signals.on('resetAll', () => {
    fontsMap.clear();
    fontsCache.reset();
});

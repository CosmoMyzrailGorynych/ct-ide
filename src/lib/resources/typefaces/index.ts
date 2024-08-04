import {TypefacePreviewer} from '../preview/typeface';
import {getOfType, getById, IAssetContextItem, createAsset as createAssetResources} from '..';
import fs from '../../neutralino-fs-extra';
import path from 'path';
import generateGUID from '../../generateGUID';

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
export const getPathToTtf = function getPathToTtf(font: IFont, fs?: boolean): string {
    const path = require('path');
    if (fs) {
        return path.join(window.projdir, 'fonts', `f${font.uid}.ttf`);
    }
    return `file://${window.projdir.replace(/\\/g, '/')}/fonts/f${font.uid}.ttf`;
};

export const addFont = async (typeface: ITypeface, src: string): Promise<IFont> => {
    const uidTypeface = generateGUID();
    const basename = path.basename(src, path.extname(src));
    const weight = guessWeight(basename);
    const italic = guessItalic(basename);
    const font: IFont = {
        weight,
        italic,
        uid: uidTypeface,
        origname: basename
    };
    const targetPath = getPathToTtf(font, true);
    await fs.copy(src, targetPath);
    typeface.fonts.push(font);
    if (typeface.fonts.length === 1) {
        await TypefacePreviewer.save(typeface);
    }
    return font;
};

export const importTtfToFont = async function importTtfToFont(src: string): Promise<ITypeface> {
    if (path.extname(src).toLowerCase() !== '.ttf') {
        throw new Error(`[resources/fonts] Rejecting a file as it does not have a .ttf extension: ${src}`);
    }
    const uidFont = generateGUID();
    const obj: ITypeface = {
        name: path.basename(src, '.ttf'),
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

export const getThumbnail = TypefacePreviewer.getClassic;

export const areThumbnailsIcons = false;

export const getFontDomName = (font: IFont): string => `CTPROJFONT-${font.uid}`;

const fontsMap = new Map<string, FontFace>();
export const refreshFonts = async (): Promise<void> => {
    const typefaces = getOfType('typeface');
    const loadPromises = [];
    for (const typeface of typefaces) {
        for (const font of typeface.fonts) {
            if (fontsMap.has(font.uid)) {
                continue;
            }
            const template = {
                weight: '400',
                style: 'normal'
            };
            const source = getPathToTtf(font),
                  cleanedSource = source.replace(/ /g, '%20').replace(/\\/g, '/');
            const face = new FontFace(getFontDomName(font), `url(${cleanedSource})`, template);
            loadPromises.push(face.load()
            .then(loaded => {
                fontsMap.set(font.uid, loaded);
                document.fonts.add(loaded);
            }));
        }
    }
    if (loadPromises.length) {
        await Promise.all(loadPromises);
    }
};

export const createAsset = async (payload?: {src: string}): Promise<ITypeface> => {
    if (payload && payload.src) {
        return importTtfToFont(payload.src);
    }
    const inputPath = await window.showOpenDialog({
        filter: '.ttf',
        multiple: true
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

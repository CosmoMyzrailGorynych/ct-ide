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
        return path.join((global as any).projdir, 'fonts', font.origname);
    }
    return `file://${(global as any).projdir.replace(/\\/g, '/')}/fonts/${font.origname}`;
};

/**
 * @param {object|string} font The font object in ct.js project, or its UID.
 * @param {boolean} fs If set to `true`, returns a clean path in a file system.
 * Otherwise, returns an URL.
 */
const getFontPreview = function getFontPreview(font: IFont, fs?: boolean): string {
    const path = require('path');
    if (fs) {
        return path.join((global as any).projdir, 'fonts', `${font.origname}_prev.png`);
    }
    return `file://${(global as any).projdir.replace(/\\/g, '/')}/fonts/${font.origname}_prev.png?cache=${font.lastmod}`;
};

const fontGenPreview = async function fontGenPreview(font: IFont): Promise<void> {
    const template = {
        weight: font.weight,
        style: font.italic ? 'italic' : 'normal'
    };
    const fs = require('fs-extra');
    const face = new FontFace('CTPROJFONT' + font.typefaceName, `url('${getPathToTtf(font)}')`, template);

    // Trigger font loading by creating an invisible label with this font
    // const elt = document.createElement('span');
    // elt.innerHTML = 'testString';
    // elt.style.position = 'fixed';
    // elt.style.right = '200%';
    // elt.style.fontFamily = 'CTPROJFONT' + font.typefaceName;
    // document.body.appendChild(elt);

    const loaded = await face.load();
    (loaded as any).external = true;
    (loaded as any).ctId = (face as any).ctId = font.uid;
    document.fonts.add(loaded);
    // document.body.removeChild(elt);

    const c = document.createElement('canvas');
    const cx = c.getContext('2d');
    c.width = c.height = 64;
    cx.clearRect(0, 0, 64, 64);
    cx.font = `${font.italic ? 'italic ' : ''}${font.weight} ${Math.floor(64 * 0.75)}px "${loaded.family}"`;
    cx.fillStyle = '#000';
    cx.fillText('Ab', 64 * 0.05, 64 * 0.75);

    // strip off the data:image url prefix to get just the base64-encoded bytes
    const dataURL = c.toDataURL();
    const previewBuffer = dataURL.replace(/^data:image\/\w+;base64,/, '');
    const buf = new Buffer(previewBuffer, 'base64');
    await fs.writeFile(getFontPreview(font, true), buf);
};

const importTtfToFont = async function importTtfToFont(src: string): Promise<IFont> {
    const fs = require('fs-extra'),
          path = require('path');
    if (path.extname(src).toLowerCase() !== '.ttf') {
        throw new Error(`[resources/fonts] Rejecting a file as it does not have a .ttf extension: ${src}`);
    }
    const generateGUID = require('./../../generateGUID');
    const uid = generateGUID();
    await fs.copy(src, path.join((global as any).projdir, '/fonts/f' + uid + '.ttf'));
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
    await fontGenPreview(obj);
    window.signals.trigger('fontCreated');
    return obj;
};

const getThumbnail = function getThumbnail(font: IFont, x2?: boolean, fs?: boolean): string {
    return getFontPreview(font, fs);
};

export const areThumbnailsIcons = false;

export {
    importTtfToFont,
    importTtfToFont as createAsset,
    fontGenPreview,
    getFontPreview,
    getName,
    getThumbnail,
    getPathToTtf
};

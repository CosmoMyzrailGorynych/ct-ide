import {getDOMImage, getTextureOrig} from './../resources/textures';
import {revHash} from './../utils/revHash';
const png2icons = require('png2icons');
const path = require('path'),
      fs = require('fs-extra');

export const resizeIcon = async function (
    img: HTMLImageElement,
    length: number,
    dest: string,
    soft: boolean
): Promise<void> {
    const canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
    canvas.width = canvas.height = length;
    ctx.imageSmoothingQuality = soft ? 'high' : 'low';
    // eslint-disable-next-line id-length
    ctx.imageSmoothingEnabled = soft;
    const k = length / Math.max(img.width, img.height);
    ctx.drawImage(
        img,
        (length - img.width * k) / 2, (length - img.height * k) / 2,
        img.width * k, img.height * k
    );
    var iconBase64data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    var buf = Buffer.from(iconBase64data, 'base64');
    await fs.writeFile(dest, buf);
};

/**
 * @returns {string} Icon revision string that must be added into index.html, to icon filenames.
 */
export const bakeFavicons = async function (
    proj: IProject,
    writeDir: string,
    production: boolean
): Promise<string> {
    const iconMap = {
        // 'android-chrome': [36, 48, 72, 96, 192, 256, 384, 512], // maybe, someday
        'apple-touch-icon': [57, 60, 72, 76, 114, 120, 144, 152, 167, 180, 1024],
        coast: [228],
        favicon: [16, 32, 48, 64],
        mstile: [150, 310],
        'yandex-browser': [50]
    };
    let iconRevision = 'dev';
    if (production) {
        if (!proj.settings.branding.icon || proj.settings.branding.icon === -1) {
            iconRevision = 'default';
        } else {
            const sourceImg = getTextureOrig(proj.settings.branding.icon, true);
            const buff = await fs.readFile(sourceImg);
            iconRevision = revHash(buff);
        }
    }
    const img = await getDOMImage(proj.settings.branding.icon, 'ct_ide.png'),
          fsPath = proj.settings.branding.icon ? getTextureOrig(proj.settings.branding.icon, true) : path.resolve('ct_ide.png');
    const promises = [];
    const soft = !proj.settings.rendering.pixelatedrender;
    for (const name in iconMap) {
        for (const size of iconMap[name as keyof typeof iconMap]) {
            promises.push(resizeIcon(img, size, path.join(writeDir, `${name}-${size}x${size}.${iconRevision}.png`), soft));
        }
    }
    const interpolation = soft ? png2icons.HERMITE : png2icons.BILINEAR;
    promises.push(fs.readFile(fsPath)
        .then((buff: Buffer) => png2icons.createICO(buff, interpolation))
        .then((buff: Buffer) => fs.outputFile(path.join(writeDir, 'favicon.ico'), buff)));
    await Promise.all(promises);
    return iconRevision;
};

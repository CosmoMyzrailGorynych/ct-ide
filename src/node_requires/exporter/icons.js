const {getDOMImage, getTextureOrig} = require('./../resources/textures');
const png2icons = require('png2icons');
const path = require('path'),
      fs = require('fs-extra');

const resizeTo = async function (img, length, dest, soft) {
    const canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
    canvas.width = canvas.height = length;
    ctx.imageSmoothingQuality = soft ? 'high' : 'low';
    // eslint-disable-next-line id-length
    ctx.imageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = soft;
    const k = length / Math.max(img.width, img.height);
    ctx.drawImage(
        img,
        (length - img.width * k) / 2, (length - img.height * k) / 2,
        img.width * k, img.height * k
    );
    var iconBase64data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    var buf = new Buffer(iconBase64data, 'base64');
    await fs.writeFile(dest, buf);
};
const bakeFavicons = async function (proj, writeDir) {
    const iconMap = {
        // 'android-chrome': [36, 48, 72, 96, 192, 256, 384, 512], // maybe, someday
        'apple-touch-icon': [57, 60, 72, 76, 114, 120, 144, 152, 167, 180, 1024],
        coast: [228],
        favicon: [16, 32, 48, 64],
        mstile: [150, 310],
        'yandex-browser': [50]
    };
    const img = await getDOMImage(proj.settings.branding.icon, 'ct_ide.png'),
          fsPath = proj.settings.branding.icon ? getTextureOrig(proj.settings.branding.icon, true) : path.resolve('ct_ide.png');
    const promises = [];
    const soft = !proj.settings.rendering.pixelatedrender;
    for (const name in iconMap) {
        for (const size of iconMap[name]) {
            promises.push(resizeTo(img, size, path.join(writeDir, `${name}-${size}x${size}.png`), soft));
        }
    }
    const interpolation = soft ? png2icons.HERMITE : png2icons.BILINEAR;
    promises.push(fs.readFile(fsPath)
        .then(buff => png2icons.createICO(buff, interpolation))
        .then(buff => fs.outputFile(path.join(writeDir, 'favicon.ico'), buff)));
    await Promise.all(promises);
};

module.exports = {
    resizeIcon: resizeTo,
    bakeFavicons
};

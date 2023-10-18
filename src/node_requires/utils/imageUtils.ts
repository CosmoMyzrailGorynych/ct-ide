type GenericImage = HTMLImageElement | HTMLCanvasElement;

/**
 * Creates a new image of a given size with a source image proportionally filling the whole canvas.
 */
const imageCover = function (
    image: GenericImage,
    w: number,
    h: number,
    forceSmooth?: boolean
): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const cx = canvas.getContext('2d');
    cx.clearRect(0, 0, w, h);
    const k = Math.max(w / image.width, h / image.height);
    if (!forceSmooth && window.currentProject.settings.rendering.pixelatedrender) {
        cx.imageSmoothingEnabled = false;
    }
    cx.drawImage(
        image,
        (w - image.width * k) / 2, (h - image.height * k) / 2,
        image.width * k, image.height * k
    );
    return canvas;
};
/**
 * Creates a new image of a given size .
 * If the source image exceeds the rectangle, it is scaled down proportionately.
 * If the source image is smaller and image smoothing is disabled, scales the image
 * by integer multipliers.
 * Otherwise, draws the image as is, centered in the middle of a canvas.
 */
const imageContain = function (
    image: GenericImage,
    w: number,
    h: number,
    forceSmooth?: boolean
): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const cx = canvas.getContext('2d');
    cx.clearRect(0, 0, w, h);
    let k;
    if (w / image.width < h / image.height) {
        k = w / image.width;
    } else {
        k = h / image.height;
    }
    if (k > 1) {
        if (!forceSmooth && window.currentProject.settings.rendering.pixelatedrender) {
            k = Math.floor(k);
            cx.imageSmoothingEnabled = false;
        }
    }
    cx.drawImage(
        image,
        (w - image.width * k) / 2, (h - image.height * k) / 2,
        image.width * k, image.height * k
    );
    return canvas;
};

/**
 * Similar to imageContain, but contains an image in a box different from the canvas' size.
 */
// eslint-disable-next-line max-params
const imagePlaceInRect = function (
    image: GenericImage,
    wb: number,
    hb: number,
    wi: number,
    hi: number,
    forceSmooth?: boolean
): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = wb;
    canvas.height = hb;
    const cx = canvas.getContext('2d');
    cx.clearRect(0, 0, wb, hb);
    let k;
    if (wi / image.width < hi / image.height) {
        k = wi / image.width;
    } else {
        k = hi / image.height;
    }
    if (k > 1) {
        if (!forceSmooth && window.currentProject.settings.rendering.pixelatedrender) {
            k = Math.floor(k);
            cx.imageSmoothingEnabled = false;
        }
    }
    cx.drawImage(
        image,
        (wb - image.width * k) / 2, (hb - image.height * k) / 2,
        image.width * k, image.height * k
    );
    return canvas;
};

const imageRound = function (image: GenericImage): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const w = canvas.width = image.width;
    const h = canvas.height = image.height;
    const cx = canvas.getContext('2d');
    cx.clearRect(0, 0, w, h);
    cx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    cx.fill();
    cx.globalCompositeOperation = 'source-in';
    cx.drawImage(image, 0, 0);
    return canvas;
};
/**
 * Returns a new canvas with an image-like object drawn into it.
 */
const toCanvas = function (image: GenericImage): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const cx = canvas.getContext('2d');
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.drawImage(image, 0, 0);
    return canvas;
};
/**
 * Crops an input image, returning a new canvas element.
 */
const crop = function (
    image: GenericImage,
    x: number,
    y: number,
    w: number,
    h: number
): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const cx = canvas.getContext('2d');
    cx.clearRect(0, 0, w, h);
    cx.drawImage(
        image,
        x, y, w, h,
        0, 0, w, h
    );
    return canvas;
};
/**
 * Converts a canvas into a node.js buffer (PNG data).
 */
const toBuffer = function (image: GenericImage): Buffer {
    if (!(image instanceof HTMLCanvasElement)) {
        image = toCanvas(image);
    }
    const base64 = image.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    return buffer;
};

const outputCanvasToFile = function (canvas: HTMLCanvasElement, targetFile: string): Promise<void> {
    const fs = require('fs-extra');
    const buffer = toBuffer(canvas);
    return fs.outputFile(targetFile, buffer);
};

export {
    imageCover,
    imageContain,
    imagePlaceInRect,
    imageRound,
    toCanvas,
    toBuffer,
    outputCanvasToFile,
    crop
};

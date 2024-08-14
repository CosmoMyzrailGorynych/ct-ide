/* eslint-disable no-bitwise */
type GenericImage = HTMLImageElement | HTMLCanvasElement;
import fs from '../neutralino-fs-extra';

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
    const cx = canvas.getContext('2d') as CanvasRenderingContext2D;
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
    const cx = canvas.getContext('2d') as CanvasRenderingContext2D;
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
    const cx = canvas.getContext('2d') as CanvasRenderingContext2D;
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
    const cx = canvas.getContext('2d') as CanvasRenderingContext2D;
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
    const cx = canvas.getContext('2d') as CanvasRenderingContext2D;
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
    const cx = canvas.getContext('2d') as CanvasRenderingContext2D;
    cx.clearRect(0, 0, w, h);
    cx.drawImage(
        image,
        x, y, w, h,
        0, 0, w, h
    );
    return canvas;
};

const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

/**
 * Converts a canvas or an image into an ArrayBuffer (PNG data).
 */
export const toArrayBuffer = function (image: GenericImage): ArrayBuffer {
    if (!(image instanceof HTMLCanvasElement)) {
        image = toCanvas(image);
    }
    const base64 = image.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    const buffer = base64ToArrayBuffer(base64);
    return buffer;
};

const outputCanvasToFile = function (canvas: HTMLCanvasElement, targetFile: string): Promise<void> {
    const buffer = toArrayBuffer(canvas);
    return fs.outputFile(targetFile, buffer);
};

/**
 * @returns The destination file path.
 */
const convertToPng = function (source: string, destination: string): Promise<string> {
    const img = document.createElement('img');
    return new Promise<string>((resolve, reject) => {
        img.addEventListener('load', () => {
            const canvas = toCanvas(img);
            outputCanvasToFile(canvas, destination).then(() => resolve(destination));
        });
        img.addEventListener('error', e => {
            reject(e);
        });
        img.src = source;
    });
};


const byteOffsetsForMask = {
    0xff000000: 3,
    0x00ff0000: 2,
    0x0000ff00: 1,
    0x000000ff: 0
};

export const clipboardToCanvas = (input: Neutralino.clipboard.ClipboardImage)
: HTMLCanvasElement => {
  // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.width = input.width;
    canvas.height = input.height;

  // Get the 2D drawing context of the canvas
    const ctx = canvas.getContext('2d')!;

  // Create a new ImageData object with the given dimensions
    const imageData = ctx.createImageData(input.width, input.height);

  // Get the data array of the ImageData object
    const pixels = imageData.data;

    const redOffset = byteOffsetsForMask[input.redMask as keyof typeof byteOffsetsForMask],
          greenOffset = byteOffsetsForMask[input.greenMask as keyof typeof byteOffsetsForMask],
          blueOffset = byteOffsetsForMask[input.blueMask as keyof typeof byteOffsetsForMask];

  // Convert the raw RGBA binary data to RGBA pixel values
    const view = new DataView(input.data);
    for (let y = 0; y < input.height; y++) {
        for (let x = 0; x < input.width; x++) {
            const offset = (y * input.bpr + x * (input.bpp / 8)) | 0;
            const pixelIndex = (y * input.width + x) * 4;

            const red = view.getUint8(offset + redOffset);
            const green = view.getUint8(offset + greenOffset);
            const blue = view.getUint8(offset + blueOffset);
            // Set alpha to 255 (fully opaque) for non-transparent images
            const alpha = input.bpp === 32 ? view.getUint8(offset + 3) : 255;

            pixels[pixelIndex] = red;
            pixels[pixelIndex + 1] = green;
            pixels[pixelIndex + 2] = blue;
            pixels[pixelIndex + 3] = alpha;
        }
    }

  // Set the pixel data of the ImageData object to the canvas
    ctx.putImageData(imageData, 0, 0);

  // Return the canvas element
    return canvas;
};

export {
    imageCover,
    imageContain,
    imagePlaceInRect,
    imageRound,
    toCanvas,
    toArrayBuffer as toBuffer,
    outputCanvasToFile,
    convertToPng,
    crop
};

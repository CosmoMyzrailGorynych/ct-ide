/* eslint-disable max-len */
import util, {glyph} from './util';
import opentype, {Glyph, Font} from 'opentype.js';
import fs from '../../../neutralino-fs-extra';
import {outputCanvasToFile} from '../../../utils/imageUtils';

type generatorOptions = {
    width?: number,
    height: number,
    baseline?: number,
    margin: number,
    fill: string,
    stroke?: string,
    list: string,
    missingGlyph?: HTMLCanvasElement | string,
    pixelPerfect: boolean,
    fontOrigname: string,
    typefaceName: string
}

const draw = (
    ctx: CanvasRenderingContext2D,
    glyphList: glyph[],
    descend: number,
    options: generatorOptions
) => {
    var dict: Record<number, {
        x: number,
        y: number,
        width: number,
        height: number
    }> = {};

    var drawX = 1;
    var drawY = 1;
    var drawHeight = options.baseline! + descend;
    var mg;

    glyphList.forEach((g, index) => {
        if (g.glyph === void 0) {
            if (options.width !== void 0) {
                g.width = options.width;
            }
            ctx.drawImage(options.missingGlyph as HTMLCanvasElement, drawX, drawY, g.width, drawHeight);
            mg = {
                x: drawX, y: drawY, width: g.width, height: drawHeight
            };
        } else {
            var drawWidth = options.width;
            if (drawWidth === void 0) {
                drawWidth = g.width;
            }
            // Account that the final canvas will be downscaled by x0.5
            if (drawX + drawWidth > ctx.canvas.width / 2) {
                drawX = 1;
                drawY += drawHeight + options.margin * 2;
            }
            var path = g.glyph.getPath(drawX + (drawWidth / 2) - (g.width / 2), drawY + options.baseline!, options.height);
            path.fill = options.fill;
            path.stroke = options.stroke!;
            path.draw(ctx);
            if (index === glyphList.length - 1) {
                mg = {
                    x: drawX, y: drawY, width: drawWidth, height: drawHeight
                };
            } else {
                g.glyph.unicodes.forEach((unicode) => {
                    dict[unicode] = {
                        x: drawX, y: drawY, width: drawWidth!, height: drawHeight
                    };
                });
            }
            drawX += drawWidth + options.margin * 2;
        }
    });

    return {
        map: dict, missingGlyph: mg
    };
};

// eslint-disable-next-line max-lines-per-function, complexity
export const generateBitmapFont = async function generateBitmapFont(
    fontSrc: string,
    outputPath: string,
    options: generatorOptions
) {
    const buffer = await fs.readFile(fontSrc);
    const font = opentype.parse(buffer); // TODO: This will most likely fail

    if (!options.list || options.list.length === 0) {
        // Get private values
        options.list = Object.keys((font.glyphs as any).glyphs)
        .map(code => String.fromCharCode((font.glyphs as any).glyphs[code].unicode) || ' ')
        .join('');
    }


    var lostChars: string[] = [];
    var glyphList: Partial<glyph>[] = [];

    Array.from(options.list).forEach((char) => {
        const glyph = Object.assign(font.stringToGlyphs(char)[0], {
            font
        });
        if (glyph.unicodes.length === 0) {
            lostChars.push(char);
        }
        const scale = 1 / font.unitsPerEm * options.height;
        glyphList.push({
            glyph,
            width: Math.ceil((glyph.advanceWidth ?? 0) * scale)
        });
    });

    if (isNaN(options.baseline!)) {
        options.baseline = util.getMaxBaseline(glyphList as glyph[], options.height);
    }

    // Update baseline value while adding missingGlyph to glyphList
    if (options.missingGlyph === void 0 || typeof options.missingGlyph === 'string') {
        // Get private values
        // eslint-disable-next-line prefer-destructuring
        var g: Glyph & {
            font: Font
        } = (font.glyphs as any).glyphs[0];
        if (options.missingGlyph) {
            g = font.charToGlyph(options.missingGlyph) as Glyph & {
                font: Font
            };
        }
        var scale = 1 / font.unitsPerEm * options.height;
        g.font = font;
        glyphList.push({
            glyph: g,
            width: Math.ceil((g.advanceWidth ?? 0) * scale)
        });
        if (options.baseline! < (g.yMax || 0) * scale) {
            options.baseline = Math.ceil((g.yMax || 0) * scale);
        }
    }

    var descend = util.getMinDescend(glyphList as glyph[], options.height);
    var adjustedHeight = util.getAdjustedHeight(descend, options.height, options.baseline!);

    // Calculate the required canvas size
    var canvasSize;
    if (options.width === void 0) {
        canvasSize = util.calculateCanvasSizeProp(
            options.list,
            glyphList as glyph[],
            adjustedHeight,
            options.baseline! + descend,
            options.margin || 1
        );
    } else {
        canvasSize = util.calculateCanvasSize(
            options.list,
            options.width,
            adjustedHeight,
            options.margin || 1
        );
    }

    var drawResult, canvas, ctx;
    canvas = document.createElement('canvas');
    // Check if the created canvas size is valid
    const maxSize = options.pixelPerfect ? 4096 : 8192;
    if (canvasSize.width > maxSize || canvasSize.height > maxSize) {
        throw new Error(`The resulting canvas for the font ${options.fontOrigname} in typeface ${options.typefaceName} is too big. (More than ${maxSize} by ${maxSize} pixels.) Try reducing the list of characters this typeface requires or decrease the size of the bitmap font.`);
    }
    if (canvasSize.width === -1 || canvasSize.height === -1) {
        throw new Error(`Couldn't form layout for the font ${options.fontOrigname} in typeface ${options.typefaceName}. Either the font is buggy as heck or it doesn't have the characters you've listed in typeface's settings.`);
    }
    if (options.pixelPerfect) {
        // We need to firstly draw an upscaled canvas, then scale it back,
        // because otherwise pixel fonts will miss some of their pieces due to rounding errors
        canvas.width = canvasSize.width * 2;
        canvas.height = canvasSize.height * 2;
        ctx = canvas.getContext('2d')!;
        ctx.save();
        ctx.scale(2, 2);
        drawResult = draw(ctx, glyphList as glyph[], descend, options);
        ctx.restore();
    } else {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        ctx = canvas.getContext('2d')!;
        drawResult = draw(ctx, glyphList as glyph[], descend, options);
    }

    // Notify about characters that could not be drawn
    if (lostChars.length > 0) {
        // eslint-disable-next-line no-console
        console.warn('Cannot find ' + lostChars.join(',') + ' from the given font. ' +
            'Generated image does not include these characters. ' +
            'Try using other font or characters.');
    }
    let downscaleCanvas;
    if (options.pixelPerfect) {
        downscaleCanvas = document.createElement('canvas');
        downscaleCanvas.width = canvas.width / 2;
        downscaleCanvas.height = canvas.height / 2;
        const downscalex = downscaleCanvas.getContext('2d')!;
        downscalex.drawImage(canvas, 0, 0, canvas.width / 2, canvas.height / 2);
        await outputCanvasToFile(downscaleCanvas, outputPath);
    } else {
        await outputCanvasToFile(canvas, outputPath);
    }
    return {
        map: drawResult.map,
        missingGlyph: drawResult.missingGlyph,
        width: options.width,
        height: adjustedHeight,
        canvas: options.pixelPerfect ? downscaleCanvas : canvas
    };
};

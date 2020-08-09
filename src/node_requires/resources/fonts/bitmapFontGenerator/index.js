/* eslint-disable max-len */
const util = require('./util');
const opentype = require('opentype.js');

const draw = function draw(ctx, glyphList, descend, options) {
    var dict = {};

    var drawX = 0;
    var drawY = 0;
    var drawHeight = options.baseline + descend;
    var mg;

    glyphList.forEach((g, index) => {
        if (g.glyph === void 0) {
            if (options.width !== void 0) {
                g.width = options.width;
            }
            ctx.drawImage(options.missingGlyph, drawX, drawY, g.width, drawHeight);
            mg = {
                x: drawX, y: drawY, width: g.width, height: drawHeight
            };
        } else {
            var drawWidth = options.width;
            if (drawWidth === void 0) {
                drawWidth = g.width;
            }
            if (drawX + drawWidth > ctx.canvas.width) {
                drawX = 0;
                drawY += drawHeight + options.margin;
            }
            var path = g.glyph.getPath(drawX + (drawWidth / 2) - (g.width / 2), drawY + options.baseline, options.height);
            path.fill = options.fill;
            path.stroke = options.stroke;
            path.draw(ctx);
            if (index === glyphList.length - 1) {
                mg = {
                    x: drawX, y: drawY, width: drawWidth, height: drawHeight
                };
            } else {
                g.glyph.unicodes.forEach((unicode) => {
                    dict[unicode] = {
                        x: drawX, y: drawY, width: drawWidth, height: drawHeight
                    };
                });
            }
            drawX += drawWidth + options.margin;
        }
    });

    return {
        map: dict, missingGlyph: mg
    };
};

const generateBitmapFont = async function generateBitmapFont(fontSrc, outputPath, options, callback) {
    const fs = require('fs-extra');
    const buffer = await fs.readFile(fontSrc);
    const font = opentype.parse(buffer.buffer);

    if (!options.list || options.list.length === 0) {
        options.list = Object.keys(font.glyphs.glyphs)
        .map(code => String.fromCharCode(font.glyphs.glyphs[code].unicode) || ' ')
        .join('');
    }


    var lostChars = [];
    var glyphList = [];
    Array.from(options.list).forEach((char) => {
        const [glyph] = font.stringToGlyphs(char);
        glyph.font = font;
        if (glyph.unicodes.length === 0) {
            lostChars.push(char);
        }
        const scale = 1 / font.unitsPerEm * options.height;
        glyphList.push({
            glyph,
            width: Math.ceil(glyph.advanceWidth * scale)
        });
    });

    if (isNaN(options.baseline)) {
        options.baseline = util.getMaxBaseline(glyphList, options.height);
    }

    // Update baseline value while adding missingGlyph to glyphList
    if (options.missingGlyph === void 0 || typeof options.missingGlyph === 'string') {
        // eslint-disable-next-line prefer-destructuring
        var g = font.glyphs.glyphs[0];
        if (options.missingGlyph) {
            g = font.charToGlyph(options.missingGlyph);
        }
        var scale = 1 / font.unitsPerEm * options.height;
        g.font = font;
        glyphList.push({
            glyph: g,
            width: Math.ceil(g.advanceWidth * scale)
        });
        if (options.baseline < (g.yMax || 0) * scale) {
            options.baseline = Math.ceil((g.yMax || 0) * scale);
        }
    }

    var descend = util.getMinDescend(glyphList, options.height);
    var adjustedHeight = util.getAdjustedHeight(descend, options.height, options.baseline);

    // Calculate the required canvas size
    var canvasSize;
    if (options.width === void 0) {
        canvasSize = util.calculateCanvasSizeProp(options.list, glyphList, adjustedHeight, options.baseline + descend);
    } else {
        canvasSize = util.calculateCanvasSize(options.list, options.width, adjustedHeight);
    }

    // Check if the created canvas size is valid
    if (canvasSize.width > 8192 || canvasSize.height > 8192) {
        callback('list is too long');
        return false;
    }
    if (canvasSize.width === -1 || canvasSize.height === -1) {
        callback('char size is too small');
        return false;
    }

    var canvas = document.createElement('canvas');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    var ctx = canvas.getContext('2d');

    /* if (options.noAntiAlias)
        ctx.antialias = "none";*/

    // drawing
    var drawResult = draw(ctx, glyphList, descend, options);

    // Notify about characters that could not be drawn
    if (lostChars.length > 0) {
        // eslint-disable-next-line no-console
        console.warn('Cannot find ' + lostChars.join(',') + ' from the given font. ' +
            'Generated image does not include these characters. ' +
            'Try Using other font or characters.');
    }
    await util.outputBitmapFont(outputPath, canvas, callback);
    return {
        map: drawResult.map,
        missingGlyph: drawResult.missingGlyph,
        width: options.width,
        height: adjustedHeight,
        canvas
    };
};

module.exports = generateBitmapFont;

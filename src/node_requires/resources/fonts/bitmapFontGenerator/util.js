/* eslint-disable max-len */
const fs = require('fs').promises;

const calculateCanvasSize = function calculateCanvasSize(text, charWidth, charHeight, margin) {
    if (charWidth <= 0 || charHeight <= 0) {
        return {
            width: -1, height: -1
        };
    }

    var textSize = text.split('').length + 1; // +1 is for the missing glyph
    var canvasSquareSideSize = 1;

    // Find the length of the side of a square that can contain characters
    while ((canvasSquareSideSize / (charWidth + margin * 2)) * (canvasSquareSideSize / (charHeight + margin * 2)) < textSize) {
        canvasSquareSideSize *= 2;
    }
    var canvasWidth = canvasSquareSideSize;

    // CanvasSquareSideSize cannot be used because it may not be square
    var tmpCanvasHeight = Math.ceil(textSize / Math.floor(canvasWidth / (charWidth + margin * 2))) * (charHeight + margin * 2);
    var canvasHeight = 1;
    while (canvasHeight < tmpCanvasHeight) {
        canvasHeight *= 2;
    }

    return {
        width: canvasWidth, height: canvasHeight
    };
};

const canGoIn = function canGoIn(canvasSize, glyphList, charHeight, margin) {
    var drawX = 1;
    var drawY = 1;

    glyphList.forEach(glyph => {
        if (drawX + glyph.width + margin * 2 > canvasSize.width) {
            drawX = 1;
            drawY += charHeight + margin * 2;
        }
        drawX += glyph.width + margin * 2;
    });

    return drawY + charHeight + margin * 2 < canvasSize.height;
};

const calculateCanvasSizeProp = function calculateCanvasSizeProp(
    text,
    glyphList,
    height,
    charHeight,
    margin
) {
    var widthAverage = 0;
    var widthMax = 0;
    glyphList.forEach(glyph => {
        if (glyph.width + margin * 2 > widthMax) {
            widthMax = glyph.width + margin * 2;
        }
        widthAverage += glyph.width + margin * 2;
    });
    widthAverage /= glyphList.length;

    if (height <= 0) {
        return {
            width: -1, height: -1
        };
    }
    // Use the average value to calculate the approximate size
    var canvasSize = calculateCanvasSize(text, widthAverage, height, margin);
    // Increase the vertical width until the text can be entered
    while (!canGoIn(canvasSize, glyphList, charHeight, margin)) {
        canvasSize.height *= 2;
    }
    return canvasSize;
};

const outputBitmapFont = function outputBitmapFont(outputPath, canvas) {
    const buffer = Buffer.from(canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ''), 'base64');
    return fs.writeFile(outputPath, buffer);
};

const getMaxBaseline = function getMaxBaseline(glyphList, height) {
    const baseline = Math.ceil(Math.max(-Infinity, ...glyphList.map(glyph => {
        var scale = 1 / glyph.glyph.font.unitsPerEm * height;
        return (glyph.glyph.yMax || 0) * scale;
    })));
    return baseline;
};

const getMinDescend = function getMinDescend(glyphList, height) {
    var descend = Math.min(Infinity, ...glyphList.map((g) => {
        var scale = 1 / g.glyph.font.unitsPerEm * height;
        return (g.glyph.yMin || 0) * scale;
    }));
    return Math.ceil(Math.abs(descend));
};

const getAdjustedHeight = function getAdjustedHeight(descend, height, baseline) {
    var extraDescend = Math.ceil(descend - (height - baseline));
    var adjustedHeight = height;
    if (extraDescend > 0) {
        adjustedHeight += extraDescend;
    }
    return adjustedHeight;
};

module.exports = {
    calculateCanvasSizeProp,
    getAdjustedHeight,
    outputBitmapFont,
    getMaxBaseline,
    getMinDescend
};

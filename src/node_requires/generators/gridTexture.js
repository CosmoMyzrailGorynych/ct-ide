const generateCanvasGrid = function(size, color) {

    color = color || '#666';
    if (typeof size === 'number') {
        size = [size, size];
    } else {
        size = size || [64, 64];
    }

    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size[0], size[1]);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0.5, 0);
    ctx.lineTo(0.5, size[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0.5);
    ctx.lineTo(size[0], 0.5);
    ctx.stroke();

    return canvas;
};

const generatePixiTextureGrid = function(size, color) {
    const canvas = generateCanvasGrid(size, color);
    return PIXI.Texture.from(canvas);
};

module.exports = {
    generateCanvasGrid,
    generatePixiTextureGrid
};

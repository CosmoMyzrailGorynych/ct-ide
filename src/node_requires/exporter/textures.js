const fs = require('fs-extra');
const glob = require('./../glob');

const getTextureShape = texture => {
    if (texture.shape === 'rect') {
        return {
            type: 'rect',
            top: texture.top,
            bottom: texture.bottom,
            left: texture.left,
            right: texture.right
        };
    }
    if (texture.shape === 'circle') {
        return {
            type: 'circle',
            r: texture.r
        };
    }
    if (texture.shape === 'strip') {
        return {
            type: 'strip',
            points: texture.stripPoints,
            closedStrip: texture.closedStrip
        };
    }
    return {
        type: 'point'
    };
};

const getTextureFrameCrops = tex => {
    const frames = [];
    for (var yy = 0; yy < tex.grid[1]; yy++) {
        for (var xx = 0; xx < tex.grid[0]; xx++) {
            const key = `${tex.name}@frame${tex.grid[0] * yy + xx}`; // PIXI.Texture's name in a shared loader
            // Put each frame individually, with a padding on each side
            frames.push({
                // eslint-disable-next-line id-blacklist
                data: {
                    name: tex.name,
                    tex,
                    frame: {// A crop from the source texture
                        x: tex.offx + xx * (tex.width + tex.marginx),
                        y: tex.offy + yy * (tex.height + tex.marginy),
                        width: tex.width,
                        height: tex.height
                    },
                    key
                },
                width: tex.width + tex.padding * 2,
                height: tex.height + tex.padding * 2
            });
            // skip unnecessary frames when tex.untill is set
            // eslint-disable-next-line max-depth
            if (yy * tex.grid[0] + xx >= tex.untill && tex.untill > 0) {
                break;
            }
        }
    }
    return frames;
};

// eslint-disable-next-line max-lines-per-function
const drawAtlasFromBin = (bin, binInd) => {
    const atlas = document.createElement('canvas');
    atlas.width = bin.width;
    atlas.height = bin.height;
    atlas.x = atlas.getContext('2d');
    atlas.x.imageSmoothingQuality = 'low';
    // eslint-disable-next-line id-length
    atlas.x.imageSmoothingEnabled = atlas.x.webkitImageSmoothingEnabled = false;

    const atlasJSON = {
        meta: {
            app: 'https://ctjs.rocks/',
            version: process.versions.ctjs,
            image: `a${binInd}.png`,
            format: 'RGBA8888',
            size: {
                w: bin.width,
                h: bin.height
            },
            scale: '1'
        },
        frames: {},
        animations: {}
    };
    for (const block of bin.rects) {
        const {tex} = block.data,
              {frame} = block.data,
              {key} = block.data,
              img = glob.texturemap[tex.uid];
        if (!(tex.name in atlasJSON.animations)) {
            atlasJSON.animations[tex.name] = [];
        }
        atlasJSON.animations[tex.name].push(key);
        const p = tex.padding;
        // draw the main crop rectangle
        atlas.x.drawImage(
            img,
            frame.x, frame.y, frame.width, frame.height,
            block.x + p, block.y + p, frame.width, frame.height
        );
        // repeat the left side of the image
        atlas.x.drawImage(
            img,
            frame.x, frame.y, 1, frame.height,
            block.x, block.y + p, p, frame.height
        );
        // repeat the right side of the image
        atlas.x.drawImage(
            img,
            frame.x + frame.width - 1, frame.y, 1, frame.height,
            block.x + frame.width + p, block.y + p, p, frame.height
        );
        // repeat the top side of the image
        atlas.x.drawImage(
            img,
            frame.x, frame.y, frame.width, 1,
            block.x + p, block.y, frame.width, p
        );
        // repeat the bottom side of the image
        atlas.x.drawImage(
            img,
            frame.x, frame.y + frame.height - 1, frame.width, 1,
            block.x + p, block.y + frame.height + p, frame.width, p
        );
        // A multi-frame sprite
        atlasJSON.frames[key] = {
            frame: {
                x: block.x + p,
                y: block.y + p,
                w: frame.width,
                h: frame.height
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: tex.width,
                h: tex.height
            },
            sourceSize: {
                w: tex.width,
                h: tex.height
            },
            anchor: {
                x: tex.axis[0] / tex.width,
                y: tex.axis[1] / tex.height
            }
        };
    }

    return {
        canvas: atlas,
        json: atlasJSON
    };
};

const MRP = require('maxrects-packer');
const Packer = MRP.MaxRectsPacker;
const savePacker = function savePacker() {
    const saveBins = [];
    // eslint-disable-next-line no-underscore-dangle
    saveBins._currentBinIndex = this._currentBinIndex;
    this.bins.forEach((bin => {
        const saveBin = {
            width: bin.width,
            height: bin.height,
            maxWidth: bin.maxWidth,
            maxHeight: bin.maxHeight,
            oversized: bin.oversized,
            freeRects: [],
            rects: [],
            options: bin.options,
            // eslint-disable-next-line id-blacklist
            data: bin.data
        };
        if (bin.tag) {
            // eslint-disable-next-line id-blacklist
            saveBin.tag = bin.tag;
        }
        bin.freeRects.forEach(r => {
            saveBin.freeRects.push({
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height
            });
        });
        bin.rects.forEach(r => {
            saveBin.rects.push({
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height,
                // eslint-disable-next-line id-blacklist
                data: r.data
            });
        });
        saveBins.push(saveBin);
    }));
    return saveBins;
};
const loadPacker = function loadPacker(bins) {
    this.reset();
    // eslint-disable-next-line no-underscore-dangle
    this._currentBinIndex = bins._currentBinIndex;
    bins.forEach((bin, index) => {
        if (bin.maxWidth > this.width || bin.maxHeight > this.height || bin.oversized) {
            this.bins.push(new MRP.OversizedElementBin(bin.width, bin.height, bin.data));
        } else {
            const newBin = new MRP.MaxRectsBin(
                this.width,
                this.height,
                this.padding
            );
            newBin.freeRects.splice(0);
            newBin.rects.splice(0);
            bin.freeRects.forEach(r => {
                newBin.freeRects.push(new MRP.Rectangle(r.width, r.height, r.x, r.y));
            });
            bin.rects.forEach(r => {
                const rect = new MRP.Rectangle(r.width, r.height, r.x, r.y);
                // eslint-disable-next-line id-blacklist
                rect.data = r.data;
                newBin.rects.push(rect);
            });
            newBin.width = bin.width;
            newBin.height = bin.height;
            if (bin.tag) {
                // eslint-disable-next-line id-blacklist
                newBin.tag = bin.tag;
            }
            this.bins[index] = newBin;
        }
    }, this);
};

const atlasWidth = 2048,
      atlasHeight = atlasWidth;
const packerSettings = [atlasWidth, atlasHeight, 0, {
    pot: true,
    square: true,
    allowRotation: true
}];

// eslint-disable-next-line max-lines-per-function
const packImages = async (proj, writeDir) => {
    /*
    So here is the algorithm:

    (1) We sort all the ct.js textures in an array A by the max length
        of either side of a frame (thus enforcers go first).
    (2) Then we create a bin B
    (3) We put the first texture from the beginning of A to B
    (4) Then we add textures from the end of A one by one until the B is filled
    (5) Once B is filled, it gets closed (read-only), and we repeat the algorithm from (2).

    (*) Tiled sprites are copied separately as is
    */
    const spritedTextures = proj.textures.filter(texture => !texture.tiled),
          tiledTextures = proj.textures.filter(texture => texture.tiled);

    // Write functions will be run in parallel,
    // and this array will block the finalization of the function
    const writePromises = [];

    const packer = new Packer(...packerSettings); // (2)

    // (1): Sort the textures by their longest side
    const animations = spritedTextures
        .sort((a, b) =>
            Math.max(b.width, b.height) -
            Math.max(a.width, a.height))
        .map(getTextureFrameCrops);

    while (animations.length) {
        const enforcers = animations.shift(); // (3)
        const previousSize = packer.bins.length;
        packer.addArray(enforcers);
        if (packer.bins.length > previousSize + 1) {
            // We expected this texture to fit into one bin. Throw an error.
            throw new Error(`The texture ${enforcers[0].data.name} cannot be fit into maximum atlas size of ${atlasWidth}×${atlasHeight}px. Consider resizing it or splitting into individual frames.`);
        }
        // We still have cases with one individual big texture that is an atlas itself,
        // and they are okayish as they can still be exported to standard json map.
        if (packer.bins[packer.bins.length - 1].oversized) {
            packer.next(); // Close the latest bin
            continue;
        }
        while (animations.length) {
            const previousState = savePacker.call(packer);
            const previousSize = previousState.length;
            const tail = animations.pop();
            packer.addArray(tail);
            // Bin count should not change!
            if (packer.bins.length > previousSize) {
                // Oh no, we got an overflow! Revert
                loadPacker.call(packer, previousState);
                // We will repack the latest bin and try to squeeze the latest sprite again
                // Make sure every in except the last one is frozen
                for (let i = 0; i < packer.bins.length - 1; i++) {
                    packer.bins[i].dirty = false;
                }
                packer.bins[packer.bins.length - 1].dirty = true;
                packer.repack();
                // Try again
                packer.addArray(tail);
                if (packer.bins.length > previousSize) {
                    // Give up, revert
                    loadPacker.call(packer, previousState);
                    packer.next(); // Close the latest bin
                    // Bring the smallest animation back into array
                    animations.push(tail);
                    break; // (5)
                }
            }
        }
    }

    // Output all the atlases into JSON and PNG files
    const atlases = [];
    packer.bins.map(drawAtlasFromBin).forEach((atlas, ind) => {
        writePromises.push(fs.outputJSON(`${writeDir}/img/a${ind}.json`, atlas.json));
        var atlasBase64 = atlas.canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        var buf = new Buffer(atlasBase64, 'base64');
        writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.png`, buf));
        atlases.push(`./img/a${ind}.json`);
    });

    const tiledMeta = {};
    let tiledCounter = 0;
    for (const tex of tiledTextures) {
        tiledMeta[tex.name] = {
            frames: 0,
            source: `./img/t${tiledCounter}.png`,
            shape: getTextureShape(tex),
            anchor: {
                x: tex.axis[0] / tex.width,
                y: tex.axis[1] / tex.height
            }
        };
        const atlas = document.createElement('canvas'),
              img = glob.texturemap[tex.uid];
        atlas.x = atlas.getContext('2d');
        atlas.width = tex.width;
        atlas.height = tex.height;
        atlas.x.drawImage(img, 0, 0);
        var buf = new Buffer(atlas.toDataURL().replace(/^data:image\/\w+;base64,/, ''), 'base64');
        writePromises.push(fs.writeFile(`${writeDir}/img/t${tiledCounter}.png`, buf));
        tiledCounter++;
    }

    await Promise.all(writePromises);
    return {
        atlases: JSON.stringify(atlases),
        tiledMeta: JSON.stringify(tiledMeta)
    };
};

module.exports = {
    packImages
};

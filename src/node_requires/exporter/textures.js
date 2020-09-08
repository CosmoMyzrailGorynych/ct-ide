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
        const keys = [];
        keys.push(key);
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

const packImages = async (proj, writeDir) => {
    const blocks = [],
          tiledImages = [],
          keys = {}; // A collection of frame names for each texture name
                     // It is then used for ct.res to create animation sequences

    // Write functions will be run in parallel,
    // and this array will block the finalization of the function
    const writePromises = [];

    for (const tex of proj.textures) {
        if (!tex.tiled) {
            keys[tex.origname] = [];
            const frames = getTextureFrameCrops(tex);
            for (const frame of frames) {
                blocks.push(frame);
                keys[tex.origname].push(frame.data.key);
            }
        } else {
            tiledImages.push({
                origname: tex.origname,
                tex
            });
        }
    }
    // eager sort
    blocks.sort((a, b) => Math.max(b.height, b.width) > Math.max(a.height, a.width));
    // this is the beginning of a resulting string that will be written to res.js
    let res = 'PIXI.Loader.shared';
    let registry = {};
    const atlases = []; // names of atlases' json files
    const Packer = require('maxrects-packer').MaxRectsPacker;
    const atlasWidth = 2048,
          atlasHeight = 2048;
    const pack = new Packer(atlasWidth, atlasHeight, 0);
    // pack all the frames
    pack.addArray(blocks);
    // get all atlases
    pack.bins.map(drawAtlasFromBin).forEach((atlas, ind) => {
        writePromises.push(fs.outputJSON(`${writeDir}/img/a${ind}.json`, atlas.json));
        res += `\n.add('./img/a${ind}.json')`;
        var atlasBase64 = atlas.canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        var buf = new Buffer(atlasBase64, 'base64');
        writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.png`, buf));
        atlases.push(`./img/a${ind}.json`);
    });
    for (const tex of proj.textures) {
        registry[tex.name] = {
            frames: tex.untill > 0 ?
                Math.min(tex.untill, tex.grid[0] * tex.grid[1]) :
                tex.grid[0] * tex.grid[1],
            shape: getTextureShape(tex),
            anchor: {
                x: tex.axis[0] / tex.width,
                y: tex.axis[1] / tex.height
            }
        };
    }
    for (let i = 0, l = tiledImages.length; i < l; i++) {
        const atlas = document.createElement('canvas'),
              {tex} = tiledImages[i],
              img = glob.texturemap[tex.uid];
        atlas.x = atlas.getContext('2d');
        atlas.width = tex.width;
        atlas.height = tex.height;
        atlas.x.drawImage(img, 0, 0);
        var buf = new Buffer(atlas.toDataURL().replace(/^data:image\/\w+;base64,/, ''), 'base64');
        writePromises.push(fs.writeFile(`${writeDir}/img/t${i}.png`, buf));
        registry[tex.name] = {
            atlas: `./img/t${i}.png`,
            frames: 0,
            shape: getTextureShape(tex),
            anchor: {
                x: tex.axis[0] / tex.width,
                y: tex.axis[1] / tex.height
            }
        };
        res += `\n.add('./img/t${i}.png')`;
    }
    res += ';';
    registry = JSON.stringify(registry);

    await Promise.all(writePromises);
    return {
        res,
        registry
    };
};

module.exports = {
    packImages
};

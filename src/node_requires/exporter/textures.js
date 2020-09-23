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
                // eslint-disable-next-line id-blacklist
                tag: tex.name,
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
            },
            shape: getTextureShape(tex)
        };
    }

    return {
        canvas: atlas,
        json: atlasJSON
    };
};

const Packer = require('maxrects-packer').MaxRectsPacker;

const atlasWidth = 2048,
      atlasHeight = atlasWidth;
const packerSettings = [atlasWidth, atlasHeight, 0, {
    // allowRotation: true,
    pot: true,
    square: true,
    // eslint-disable-next-line id-blacklist
    tag: true,
    exclusiveTag: false
}];

const packImages = async (proj, writeDir) => {
    const spritedTextures = proj.textures.filter(texture => !texture.tiled),
          tiledTextures = proj.textures.filter(texture => texture.tiled);

    // Write functions will be run in parallel,
    // and this array will block the finalization of the function
    const writePromises = [];

    const packer = new Packer(...packerSettings);

    const animationsByTextures = spritedTextures
        .map(getTextureFrameCrops);
    const animations = [].concat(...animationsByTextures);
    packer.addArray(animations);

    // Output all the atlases into JSON and PNG files
    const atlases = [];
    packer.bins.map(drawAtlasFromBin).forEach((atlas, ind) => {
        writePromises.push(fs.outputJSON(`${writeDir}/img/a${ind}.json`, atlas.json));
        var atlasBase64 = atlas.canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        var buf = new Buffer(atlasBase64, 'base64');
        writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.png`, buf));
        atlases.push(`./img/a${ind}.json`);
    });

    const tiledImages = {};
    let tiledCounter = 0;
    for (const tex of tiledTextures) {
        tiledImages[tex.name] = {
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
        tiledImages: JSON.stringify(tiledImages)
    };
};

module.exports = {
    packImages
};

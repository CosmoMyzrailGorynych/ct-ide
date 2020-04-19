/**
 * Gets the ct.js texture object by its id.
 * @param {string} id The id of the texture
 * @returns {ITexture} The ct.js texture object
 */
const getTextureFromId = id => {
    const texture = global.currentProject.textures.find(tex => tex.uid === id);
    if (!texture) {
        throw new Error(`Attempt to get a non-existent texture with ID ${id}`);
    }
    return texture;
};

/**
 * Retrieves the full path to a thumbnail of a given texture.
 * @param {string|ITexture} texture Either the id of the texture, or its ct.js object
 * @param {boolean} [x2] If set to true, returns a 128x128 image instead of 64x64.
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the thumbnail.
 */
const getTexturePreview = function (texture, x2, fs) {
    if (texture === -1) {
        return 'data/img/notexture.png';
    }
    if (typeof texture === 'string') {
        texture = getTextureFromId(texture);
    }
    if (fs) {
        return `${global.projdir}/img/${texture.origname}_prev${x2? '@2' : ''}.png`;
    }
    return `file://${global.projdir}/img/${texture.origname}_prev${x2? '@2' : ''}.png?cache=${texture.lastmod}`;
};

/**
 * Retrieves a full path to the source image of a given texture
 * @param {string|ITexture} texture Either the id of a texture, or a ct.js texture object
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the source image.
 */
const getTextureOrig = function(texture, fs) {
    if (texture === -1) {
        return 'data/img/notexture.png';
    }
    if (typeof texture === 'string') {
        texture = getTextureFromId(texture);
    }
    if (fs) {
        return `${global.projdir}/img/${texture.origname}`;
    }
    return `file://${global.projdir}/img/${texture.origname}?cache=${texture.lastmod}`;
};

const loadBaseTextureForCtTexture = texture => new Promise((resolve, reject) => {
    const textureLoader = new PIXI.Loader();
    const {resources} = textureLoader;

    const path = 'file://' + global.projdir + '/img/' + texture.origname + '?' + texture.lastmod;

    textureLoader.add(texture.uid, path);
    textureLoader.onError.add(reject);
    textureLoader.load(() => {
        resolve(resources[texture.uid].texture.baseTexture);
    });
});

const pixiTextureCache = {};
const clearPixiTextureCache = function () {
    for (const i in pixiTextureCache) {
        delete pixiTextureCache[i];
    }
};
/**
 * @param {any} tex A ct.js texture object
 * @returns {Array<PIXI.Texture>} An array of PIXI.Textures
 */
const textureArrayFromCtTexture = async function (tex) {
    const frames = [];
    const baseTexture = await loadBaseTextureForCtTexture(tex);
    for (let col = 0; col < tex.grid[1]; col++) {
        for (let row = 0; row < tex.grid[0]; row++) {
            const texture = new PIXI.Texture(
                baseTexture,
                new PIXI.Rectangle(
                    tex.offx + row * (tex.width + tex.marginx),
                    tex.offy + col * (tex.height + tex.marginy),
                    tex.width,
                    tex.height
                )
            );
            texture.defaultAnchor = new PIXI.Point(tex.axis[0] / tex.width, tex.axis[1] / tex.height);
            frames.push(texture);
            if (col * tex.grid[0] + row >= tex.grid.untill && tex.grid.untill > 0) {
                break;
            }
        }
    }
    return frames;
};

let defaultTexture;

const getDOMImage = function(texture, deflt) {
    let path;
    const img = document.createElement('img');
    if (texture === -1 || !texture) {
        path = deflt || 'data/img/notexture.png';
    } else {
        if (typeof texture === 'string') {
            texture = getTextureFromId(texture);
        }
        path = 'file://' + global.projdir + '/img/' + texture.origname + '?' + texture.lastmod;
    }
    img.src = path;
    return new Promise((resolve, reject) => {
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
    });
};

/**
 * @param {string|-1|any} texture Either a uid of a texture, or a ct.js texture object
 * @param {number} [frame] The frame to extract. If not defined, will return an array of all frames
 * @param {boolean} [allowMinusOne] Allows the use of `-1` as a texture uid
 * @returns {Array<PIXI.Texture>|PIXI.Texture} An array of textures, or an individual one.
 */
const getPixiTexture = async function (texture, frame, allowMinusOne) {
    if (allowMinusOne && texture === -1) {
        if (!defaultTexture) {
            defaultTexture = PIXI.Texture.from('data/img/unknown.png');
        }
        if (frame || frame === 0) {
            return defaultTexture;
        }
        return [defaultTexture];
    }
    if (typeof texture === 'string') {
        texture = getTextureFromId(texture);
    }
    const {uid} = texture;
    if (!pixiTextureCache[uid] ||
        pixiTextureCache[uid].lastmod !== texture.lastmod
    ) {
        const tex = await textureArrayFromCtTexture(texture);
        // Everything is constant, and the key gets overridden. Where's the race condition? False positive??
        // eslint-disable-next-line require-atomic-updates
        pixiTextureCache[uid] = {
            lastmod: texture.lastmod,
            texture: tex
        };
    }
    if (frame || frame === 0) {
        return pixiTextureCache[uid].texture[frame];
    }
    return pixiTextureCache[uid].texture;
};

/**
 * Returns a texture object by its name.
 * @param {string} name The name of the texture.
 * @return {boolean} True if the texture exists.
 */
const getTextureFromName = function(name) {
    const texture = currentProject.textures.find(tex => tex.name === name);
    if (!texture) {
        throw new Error(`Attempt to get a non-existent texture with name ${name}`);
    }
    return texture;
};

/**
 * Generates a square preview for a given skeleton
 * @param {string} source Path to the image
 * @param {string} destFile Path to the destinating image
 * @param {number} size Size of the square thumbnail, in pixels
 * @returns {Promise<string>} Resolves after creating a thumbnail. On success, passes `destFile`, the path to the created thumbnail.
 */
const imgGenPreview = (source, destFile, size) => {
    const thumbnail = document.createElement('img');
    const fs = require('fs-extra');
    return new Promise((accept, reject) => {
        thumbnail.onload = () => {
            var c = document.createElement('canvas'),
            w, h, k;
            c.x = c.getContext('2d');
            c.width = c.height = size;
            c.x.clearRect(0, 0, size, size);
            w = thumbnail.width;
            h = thumbnail.height;
            if (w > h) {
                k = size / w;
            } else {
                k = size / h;
            }
            if (k > 1) {
                k = 1;
            }
            c.x.drawImage(
                thumbnail,
                (size - thumbnail.width*k)/2,
                (size - thumbnail.height*k)/2,
                thumbnail.width*k,
                thumbnail.height*k
            );
            // strip off the data:image url prefix to get just the base64-encoded bytes
            var dataURL = c.toDataURL();
            var data = dataURL.replace(/^data:image\/\w+;base64,/, '');
            var buf = new Buffer(data, 'base64');
            var stream = fs.createWriteStream(destFile);
            stream.on('finish', () => {
                setTimeout(() => { // WHY THE HECK I EVER NEED THIS?!
                    accept(destFile);
                }, 100);
            });
            stream.on('error', err => {
                reject(err);
            });
            stream.end(buf);
        };
        thumbnail.src = 'file://' + source;
    });
};

const texturePostfixParser = /_(?<cols>\d+)x(?<rows>\d+)(?:@(?<until>\d+))?$/;
const isBgPostfixTester = /@bg$/;
/**
 * Tries to load an image, then adds it to the projects and creates a thumbnail
 * @param {string} src A path to the source image
 * @returns {Promise<object>} A promise that resolves into the resulting texture object.
 */
const importImageToTexture = async src => {
    const fs = require('fs-extra'),
          path = require('path'),
          generateGUID = require('./../generateGUID');
    const id = generateGUID();
    const dest = path.join(global.projdir, 'img', `i${id}${path.extname(src)}`);
    await fs.copy(src, dest);
    const image = document.createElement('img');
    // Wait while the image is loading
    await new Promise((resolve, reject) => {
        image.onload = () => {
            resolve();
        };
        image.onerror = e => {
            window.alertify.error(e);
            reject(e);
        };
        image.src = 'file://' + dest + '?' + Math.random();
    });
    await Promise.all([
        imgGenPreview(dest, dest + '_prev.png', 64),
        imgGenPreview(dest, dest + '_prev@2.png', 128)
    ]);
    const obj = {
        name: path.basename(src)
                  .replace(/\.(jpg|gif|png|jpeg)/gi, '')
                  .replace(/\s/g, '_'),
        untill: 0,
        grid: [1, 1],
        axis: [0, 0],
        marginx: 0,
        marginy: 0,
        imgWidth: image.width,
        imgHeight: image.height,
        width: image.width,
        height: image.height,
        offx: 0,
        offy: 0,
        origname: path.basename(dest),
        source: src,
        shape: 'rect',
        left: 0,
        right: image.width,
        top: 0,
        bottom: image.height,
        uid: id,
        padding: 1
    };

    // Test if this has a postfix _NxM@K or _NxM
    const exec = texturePostfixParser.exec(obj.name);
    if (exec) {
        obj.name = obj.name.replace(texturePostfixParser, '');
        obj.grid = [Number(exec.groups.cols) || 1, Number(exec.groups.rows) || 1];
        obj.width /= obj.grid[0];
        obj.height /= obj.grid[1];
        obj.right /= obj.grid[0];
        obj.bottom /= obj.grid[1];
        if (exec.groups.until) {
            obj.untill = Number(exec.groups.until);
        }
    } else if (isBgPostfixTester.test(obj.name)) {
        // Test whether it has a @bg postfix
        obj.name = obj.name.replace(isBgPostfixTester, '');
        obj.tiled = true;
    }

    global.currentProject.textures.push(obj);
    window.signals.trigger('textureImported');
    return obj;
};

const getTexturePivot = (texture, inPixels) => {
    if (typeof texture === 'string') {
        texture = getTextureFromId(texture);
    }
    if (inPixels) {
        return [texture.axis[0], texture.axis[1]];
    }
    return [texture.axis[0] / texture.width, texture.axis[1] / texture.height];
};

module.exports = {
    clearPixiTextureCache,
    getTextureFromId,
    getTextureFromName,
    getTexturePreview,
    getTexturePivot,
    getTextureOrig,
    getPixiTexture,
    getDOMImage,
    importImageToTexture,
    imgGenPreview
};

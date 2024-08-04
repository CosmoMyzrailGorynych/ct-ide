import fs from '../neutralino-fs-extra';
import {revHash} from './../utils/revHash';
import {getDOMTexture} from './../resources/textures';

import {ExportedTiledTexture, TextureShape} from './_exporterContracts';

const Packer = require('maxrects-packer').MaxRectsPacker;
type packerBin = {
    width: number;
    height: number;
    rects: {
        x: number,
        y: number,
        width: number,
        height: number,
        // eslint-disable-next-line id-blacklist
        tag: string,
        // eslint-disable-next-line id-blacklist
        data: {
            tex: ITexture,
            frame: {
                x: number;
                y: number;
                width: number;
                height: number;
            },
            key: string
        }
    }[]
};

/* eslint-disable id-blacklist */

export const getTextureShape = (texture: ITexture): TextureShape => {
    if (texture.shape === 'rect') {
        return {
            type: 'rect',
            top: texture.top || 0,
            bottom: texture.bottom || 0,
            left: texture.left || 0,
            right: texture.right || 0
        };
    }
    if (texture.shape === 'circle') {
        return {
            type: 'circle',
            r: texture.r || 0
        };
    }
    if (texture.shape === 'strip') {
        return {
            type: 'strip',
            points: texture.stripPoints!,
            closedStrip: texture.closedStrip || false
        };
    }
    return {
        type: 'point'
    };
};

const getTextureFrameCrops = (tex: ITexture) => {
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

type exportedTextureFrame = {
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    },
    rotated: boolean,
    trimmed: boolean,
    spriteSourceSize: {
        x: number;
        y: number;
        w: number;
        h: number;
    },
    sourceSize: {
        w: number;
        h: number;
    },
    anchor: {
        x: number;
        y: number;
    },
    shape: textureShape
};

type exportedTextureAtlasJson = {
    meta: {
        app: 'https://ctjs.rocks/',
        version: number,
        image: string,
        format: 'RGBA8888',
        size: {
            w: number,
            h: number
        },
        scale: '1'
    },
    frames: Record<string, exportedTextureFrame>,
    animations: Record<string, string[]>
};
type exportedTextureAtlas = {
    json: exportedTextureAtlasJson,
    canvas: HTMLCanvasElement
}

// eslint-disable-next-line max-lines-per-function
const drawAtlasFromBin = (bin: packerBin, binInd: number) => {
    const atlas = document.createElement('canvas');
    atlas.width = bin.width;
    atlas.height = bin.height;
    const cx = atlas.getContext('2d')!;
    cx.imageSmoothingQuality = 'low';
    cx.imageSmoothingEnabled = false;

    const atlasJSON = {
        meta: {
            app: 'https://ctjs.rocks/',
            version: window.ctjsVersion,
            image: `a${binInd}.webp`,
            format: 'RGBA8888',
            size: {
                w: bin.width,
                h: bin.height
            },
            scale: '1'
        },
        frames: {} as Record<string, exportedTextureFrame>,
        animations: {} as Record<string, string[]>
    };
    for (const block of bin.rects) {
        const {tex} = block.data,
              {frame} = block.data,
              {key} = block.data,
              img = getDOMTexture(tex);
        if (!(tex.name in atlasJSON.animations)) {
            atlasJSON.animations[tex.name] = [];
        }
        atlasJSON.animations[tex.name].push(key);
        const p = tex.padding;
        // draw the main crop rectangle
        cx.drawImage(
            img,
            frame.x, frame.y, frame.width, frame.height,
            block.x + p, block.y + p, frame.width, frame.height
        );
        // repeat the left side of the image
        cx.drawImage(
            img,
            frame.x, frame.y, 1, frame.height,
            block.x, block.y + p, p, frame.height
        );
        // repeat the right side of the image
        cx.drawImage(
            img,
            frame.x + frame.width - 1, frame.y, 1, frame.height,
            block.x + frame.width + p, block.y + p, p, frame.height
        );
        // repeat the top side of the image
        cx.drawImage(
            img,
            frame.x, frame.y, frame.width, 1,
            block.x + p, block.y, frame.width, p
        );
        // repeat the bottom side of the image
        cx.drawImage(
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

const atlasWidth = 2048,
      atlasHeight = atlasWidth;
const packerSettings = [atlasWidth, atlasHeight, 0, {
    // allowRotation: true,
    pot: true,
    square: true,
    tag: true,
    exclusiveTag: false
}];

const getPackerFor = (textures: ITexture[], spritedTextures: ITexture[]) => {
    const packer = new Packer(...packerSettings);
    const animationsByTextures = spritedTextures
        .map(getTextureFrameCrops);
    const animations = ([] as typeof animationsByTextures[0]).concat(...animationsByTextures);
    const getFailedPacks = () => {
        const failedPacks: string[] = [];
        const allTags: Record<string, number> = {};
        textures.forEach(tex => {
            allTags[tex.name] = -1;
        });
        packer.bins.forEach((bin: packerBin, binInd: number) => bin.rects.forEach(rect => {
            if (allTags[rect.tag] < 0) {
                allTags[rect.tag] = binInd;
            } else if (allTags[rect.tag] !== binInd &&
                failedPacks.indexOf(rect.tag) < 0) {
                failedPacks.push(rect.tag);
            }
        }));
        return failedPacks;
    };

    if (animations.length) {
        packer.addArray(animations);

        let failedPacks = getFailedPacks();

        const addToFailedPacks = (newPacks: string[]) => {
            failedPacks = failedPacks.concat(newPacks.filter(tag =>
                failedPacks.indexOf(tag) === -1));
        };

        if (failedPacks.length) {
            let firstRepack = true;
            let newFailedPacks = [];

            do {
                const lastFailedPack = failedPacks;

                // eslint-disable-next-line no-console
                console.warn('Packing failed...repacking...');

                packer.reset();
                if (firstRepack) {
                    packer.addArray(animations.filter(tex => lastFailedPack.indexOf(tex.tag) > -1));
                    packer.next();
                } else {
                    textures.forEach(tex => {
                        const tag = tex.name;
                        if (lastFailedPack.indexOf(tag) > -1) {
                            packer.addArray(animations.filter(tex => tex.tag === tag));
                            packer.next();
                        }
                    });
                }
                packer.addArray(animations.filter(tex => lastFailedPack.indexOf(tex.tag) < 0));

                newFailedPacks = getFailedPacks();
                firstRepack = false;
                addToFailedPacks(newFailedPacks);
            } while (newFailedPacks.length);
        }
    }

    return packer;
};

const isBigTexture = (texture: ITexture) => {
    const area = texture.grid[0] * texture.width * texture.grid[1] * texture.height;
    if (area > atlasWidth * atlasHeight * 0.9) {
        return true;
    }
    if (texture.width > atlasWidth) {
        return true;
    }
    if (texture.height > atlasHeight) {
        return true;
    }
    return false;
};

type exportedTextureData = {
    atlases: string,
    tiledImages: string
};

let cachedTextureData: exportedTextureData | null = null;
// eslint-disable-next-line max-lines-per-function
export const packImages = async (
    textures: ITexture[],
    writeDir: string,
    production: boolean
): Promise<exportedTextureData> => {
    // Return the cached data if possible
    if (!production &&
        sessionStorage.canSkipTextureGeneration === 'yes' &&
        cachedTextureData
    ) {
        return cachedTextureData;
    }
    // Dev builds use WebP only, PNG is added to production
    // to support poopy browsers like Safari.
    const formats = ['webp'];
    if (production) {
        formats.push('png');
    }
    // PIXI.Loader supports patterns like `filename.{webp,png}`.
    const pixiMask = `.{${formats.join(',')}}`;
    const bigTextures = textures.filter(isBigTexture);
    const spritedTextures = textures.filter(tex => !tex.tiled && bigTextures.indexOf(tex) < 0);
    const tiledTextures = textures.filter(tex => tex.tiled && bigTextures.indexOf(tex) < 0);

    // Write functions will be run in parallel,
    // and this array will block the finalization of the function
    const writePromises: Promise<unknown>[] = [];
    const packer = getPackerFor(textures, spritedTextures);

    // Output all the atlases into JSON and WebP files
    const atlases: string[] = [];
    await Promise.all(packer.bins
        .map(drawAtlasFromBin)
        .map(async (atlas: exportedTextureAtlas, ind: number) => {
            let jsonHash: string | undefined;
            await Promise.all(formats.map(async format => {
                const atlasBase64 = atlas.canvas.toDataURL(`image/${format}`, 1).replace(/^data:image\/\w+;base64,/, '');
                const buf = Buffer.from(atlasBase64, 'base64');
                if (production) {
                    const imageHash = revHash(buf);
                    atlas.json.meta.image = `a${ind}.${imageHash}.${format}`;
                    const json = JSON.stringify(atlas.json);
                    jsonHash = await revHash(json);
                    writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.${imageHash}.${format}`, buf));
                    writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.${format}.${jsonHash}.json`, json));
                } else {
                    writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.${format}`, buf));
                    writePromises.push(fs.outputJSON(`${writeDir}/img/a${ind}.${format}.json`, atlas.json));
                }
            }));
            if (production) {
                atlases.push(`./img/a${ind}${pixiMask}.${jsonHash!}.json`);
            } else {
                atlases.push(`./img/a${ind}${pixiMask}.json`);
            }
        }));

    // Big textures have separate atlases that are not limited in size
    await Promise.all(bigTextures.map(async (texture, btInd) => {
        const tw = texture.grid[0] * (texture.width + texture.padding * 2);
        const th = texture.grid[1] * (texture.height + texture.padding * 2);
        const bigPacker = new Packer(tw, th, 0, {
            smart: false
        });
        bigPacker.addArray(getTextureFrameCrops(texture));
        if (bigPacker.bins.length > 1) {
            // eslint-disable-next-line no-console
            console.warn('Big packer has failed!');
        }
        const ind = packer.bins.length + btInd;
        const atlas = drawAtlasFromBin(bigPacker.bins[0], ind);
        let jsonHash: string | undefined;
        for (const format of formats) {
            const atlasBase64 = atlas.canvas.toDataURL(`image/${format}`, 1).replace(/^data:image\/\w+;base64,/, '');
            const buf = Buffer.from(atlasBase64, 'base64');
            if (production) {
                const imageHash = revHash(buf);
                atlas.json.meta.image = `a${ind}.${imageHash}.${format}`;
                const json = JSON.stringify(atlas.json);
                if (!jsonHash) {
                    // eslint-disable-next-line no-await-in-loop
                    jsonHash = await revHash(json);
                }
                writePromises.push(fs.outputJSON(`${writeDir}/img/a${ind}.${format}.${jsonHash}.json`, atlas.json));
                writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.${imageHash}.${format}`, buf));
            } else {
                writePromises.push(fs.outputJSON(`${writeDir}/img/a${ind}.${format}.json`, atlas.json));
                writePromises.push(fs.writeFile(`${writeDir}/img/a${ind}.${format}`, buf));
            }
        }
        if (production) {
            atlases.push(`./img/a${ind}${pixiMask}.${jsonHash!}.json`);
        } else {
            atlases.push(`./img/a${ind}${pixiMask}.json`);
        }
    }));

    // Tiled images do not have atlases at all
    const tiledImages: Record<string, ExportedTiledTexture> = {};
    let tiledCounter = 0;
    await Promise.all(tiledTextures.map(async tex => {
        const atlas = document.createElement('canvas'),
              img = getDOMTexture(tex);
        const cx = atlas.getContext('2d')!;
        atlas.width = tex.width;
        atlas.height = tex.height;
        cx.drawImage(img, 0, 0);
        tiledImages[tex.name] = {
            source: `./img/t${tiledCounter}${pixiMask}`,
            shape: getTextureShape(tex),
            anchor: {
                x: tex.axis[0] / tex.width,
                y: tex.axis[1] / tex.height
            }
        };
        // Use one hash for both formats to simplify loading on Pixi.js side.
        let imageHash: string | undefined;
        await Promise.all(formats.map(async format => {
            const buf = Buffer.from(atlas.toDataURL(`image/${format}`, 1).replace(/^data:image\/\w+;base64,/, ''), 'base64');
            if (production) {
                imageHash = await revHash(buf);
                tiledImages[tex.name].source = `./img/t${tiledCounter}.${imageHash}${pixiMask}`;
                writePromises.push(fs.writeFile(`${writeDir}/img/t${tiledCounter}.${imageHash}.${format}`, buf));
            } else {
                writePromises.push(fs.writeFile(`${writeDir}/img/t${tiledCounter}.${format}`, buf));
            }
        }));
        tiledCounter++;
    }));

    await Promise.all(writePromises);
    // eslint-disable-next-line require-atomic-updates
    cachedTextureData = {
        atlases: JSON.stringify(atlases),
        tiledImages: JSON.stringify(tiledImages)
    };
    // eslint-disable-next-line require-atomic-updates
    sessionStorage.canSkipTextureGeneration = 'yes';
    return cachedTextureData;
};

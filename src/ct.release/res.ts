import {required} from './u';
import type {TextureShape, ExportedTiledTexture, ExportedSound} from '../node_requires/exporter/_exporterContracts';
import {sound as pixiSound, Sound} from 'node_modules/@pixi/sound';
import {pixiSoundPrefix, exportedSounds, soundMap, pixiSoundInstances} from './sounds.js';

import * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod & {
    sound: typeof pixiSound
};

export type CtjsTexture = pixiMod.Texture & {
    shape: TextureShape,
    defaultAnchor: {
        x: number,
        y: number
    }
};
export type CtjsAnimation = CtjsTexture[] & {
    shape: TextureShape,
    defaultAnchor: {
        x: number,
        y: number
    }
};

export interface ITextureOptions {
    anchor?: {
        x: number,
        y: number
    }
    shape?: TextureShape
}

const loadingScreen = document.querySelector('.ct-aLoadingScreen') as HTMLDivElement,
      loadingBar = loadingScreen.querySelector('.ct-aLoadingBar') as HTMLDivElement;

export const textures: Record<string, CtjsAnimation> = {};
export const skeletons: Record<string, any> = {};

/**
 * An object that manages and stores textures and other assets,
 * also exposing API for dynamic asset loading.
 */
const resLib = {
    sounds: soundMap,
    pixiSounds: pixiSoundInstances,
    textures: {} as Record<string, CtjsAnimation>,
    groups: [/*!@resourceGroups@*/][0] as Record<string, string[]>,
    /**
     * Loads and executes a script by its URL
     * @param {string} url The URL of the script file, with its extension.
     * Can be relative or absolute.
     * @returns {Promise<void>}
     * @async
     */
    loadScript(url: string = required('url', 'ct.res.loadScript')): Promise<void> {
        var script = document.createElement('script');
        script.src = url;
        const promise = new Promise<void>((resolve, reject) => {
            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                reject();
            };
        });
        document.getElementsByTagName('head')[0].appendChild(script);
        return promise;
    },
    /**
     * Loads an individual image as a named ct.js texture.
     * @param {string|boolean} url The path to the source image.
     * @param {string} name The name of the resulting ct.js texture
     * as it will be used in your code.
     * @param {ITextureOptions} textureOptions Information about texture's axis
     * and collision shape.
     * @returns {Promise<CtjsAnimation>} The imported animation, ready to be used.
     */
    async loadTexture(
        url: string = required('url', 'ct.res.loadTexture'),
        name: string = required('name', 'ct.res.loadTexture'),
        textureOptions: ITextureOptions = {}
    ): Promise<CtjsAnimation> {
        let texture: CtjsTexture;
        try {
            texture = await PIXI.Assets.load(url);
        } catch (e) {
            console.error(`[ct.res] Could not load image ${url}`);
            throw e;
        }
        const ctTexture = [texture] as CtjsAnimation;
        ctTexture.shape = texture.shape = textureOptions.shape || ({} as TextureShape);
        texture.defaultAnchor = ctTexture.defaultAnchor = new PIXI.Point(
            textureOptions.anchor.x || 0,
            textureOptions.anchor.x || 0
        );
        resLib.textures[name] = ctTexture;
        return ctTexture;
    },
    /**
     * Loads a Texture Packer compatible .json file with its source image,
     * adding ct.js textures to the game.
     * @param {string} url The path to the JSON file that describes the atlas' textures.
     * @returns A promise that resolves into an array
     * of all the loaded textures' names.
     */
    async loadAtlas(url: string = required('url', 'ct.res.loadAtlas')): Promise<string[]> {
        const sheet = await PIXI.Assets.load<pixiMod.Spritesheet>(url);
        for (const animation in sheet.animations) {
            const tex = sheet.animations[animation];
            const animData = sheet.data.animations;
            for (let i = 0, l = animData[animation].length; i < l; i++) {
                const a = animData[animation],
                      f = a[i];
                (tex[i] as CtjsTexture).shape = (
                    sheet.data.frames[f] as pixiMod.ISpritesheetFrameData & {shape: TextureShape}
                ).shape;
            }
            (tex as CtjsAnimation).shape = (tex[0] as CtjsTexture).shape || ({} as TextureShape);
            resLib.textures[animation] = tex as CtjsAnimation;
        }
        return Object.keys(sheet.animations);
    },
    /**
     * Unloads the specified atlas by its URL and removes all the textures
     * it has introduced to the game.
     * Will do nothing if the specified atlas was not loaded (or was already unloaded).
     */
    async unloadAtlas(url: string = required('url', 'ct.res.unloadAtlas')): Promise<void> {
        const {animations} = PIXI.Assets.get(url);
        if (!animations) {
            // eslint-disable-next-line no-console
            console.log(`[ct.res] Attempt to unload an atlas that was not loaded/was unloaded already: ${url}`);
            return;
        }
        for (const animation of animations) {
            delete resLib.textures[animation];
        }
        await PIXI.Assets.unload(url);
    },
    /**
     * Loads a bitmap font by its XML file.
     * @param url The path to the XML file that describes the bitmap fonts.
     * @returns A promise that resolves into the font's name (the one you've passed with `name`).
     */
    async loadBitmapFont(url: string = required('url', 'ct.res.loadBitmapFont')): Promise<void> {
        await PIXI.Assets.load(url);
    },
    async unloadBitmapFont(url: string = required('url', 'ct.res.unloadBitmapFont')): Promise<void> {
        await PIXI.Assets.unload(url);
    },
    /**
     * Loads a sound.
     * @param path Path to the sound
     * @param name The name of the sound as it will be used in ct.js game.
     * @param preload Whether to start loading now or postpone it.
     * Postponed sounds will load when a game tries to play them, or when you manually
     * trigger the download with `sounds.load(name)`.
     * @returns A promise with the name of the imported sound.
     */
    loadSound(
        path: string = required('path', 'ct.res.loadSound'),
        name: string = required('name', 'ct.res.loadSound'),
        preload = true
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const asset = PIXI.sound.add(name, {
                url: path,
                preload,
                loaded: preload ?
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resLib.pixiSounds[name] = asset;
                            resolve(name);
                        }
                    } :
                    void 0
            });
            if (!preload) {
                resolve(name);
            }
        });
    },

    async loadGame(): Promise<void> {
        // !! This method is intended to be filled by ct.IDE and be executed
        // exactly once at game startup.
        const changeProgress = (percents: number) => {
            loadingScreen.setAttribute('data-progress', String(percents));
            loadingBar.style.width = percents + '%';
        };

        /* eslint-disable prefer-destructuring */
        const atlases: string[] = [/*!@atlases@*/][0];
        const tiledImages: ExportedTiledTexture[] = [/*!@tiledImages@*/][0];
        const bitmapFonts: string[] = [/*!@bitmapFonts@*/][0];
        /* eslint-enable prefer-destructuring */

        const totalAssets = atlases.length;
        let assetsLoaded = 0;
        const loadingPromises: Promise<unknown>[] = [];

        loadingPromises.push(...atlases.map(atlas =>
            resLib.loadAtlas(atlas)
            .then(texturesNames => {
                assetsLoaded++;
                changeProgress(assetsLoaded / totalAssets * 100);
                return texturesNames;
            })));

        for (const name in tiledImages) {
            loadingPromises.push(resLib.loadTexture(
                tiledImages[name].source,
                name,
                {
                    anchor: tiledImages[name].anchor,
                    shape: tiledImages[name].shape
                }
            ));
        }
        for (const font in bitmapFonts) {
            loadingPromises.push(resLib.loadBitmapFont(bitmapFonts[font]));
        }
        for (const sound of exportedSounds) {
            for (const variant of sound.variants) {
                loadingPromises.push(resLib.loadSound(variant.source, `${pixiSoundPrefix}${variant.uid}`));
            }
        }

        /*!@res@*/
        /*!%res%*/

        await Promise.all(loadingPromises);
        loadingScreen.classList.add('hidden');
    },
    /**
     * Gets a pixi.js texture from a ct.js' texture name,
     * so that it can be used in pixi.js objects.
     * @param name The name of the ct.js texture, or -1 for an empty texture
     * @param [frame] The frame to extract
     * @returns {PIXI.Texture|PIXI.Texture[]} If `frame` was specified,
     * returns a single PIXI.Texture. Otherwise, returns an array
     * with all the frames of this ct.js' texture.
     */
    getTexture: ((
        name: string | -1,
        frame?: number
    ): CtjsAnimation | CtjsTexture | pixiMod.Texture | pixiMod.Texture[] => {
        if (frame === null) {
            frame = void 0;
        }
        if (name === -1) {
            if (frame !== void 0) {
                return PIXI.Texture.EMPTY;
            }
            return [PIXI.Texture.EMPTY];
        }
        if (!(name in resLib.textures)) {
            throw new Error(`Attempt to get a non-existent texture ${name}`);
        }
        const tex = resLib.textures[name];
        if (frame !== void 0) {
            return tex[frame];
        }
        return tex;
    }) as {
        (name: -1): [pixiMod.Texture];
        (name: -1, frame: 0): typeof PIXI.Texture.EMPTY;
        (name: -1, frame: number): never;
        (name: string): CtjsAnimation;
        (name: string, frame: number): CtjsTexture;
    },
    /**
     * Returns the collision shape of the given texture.
     * @param name The name of the ct.js texture, or -1 for an empty collision shape
     */
    getTextureShape(name: string | -1): TextureShape {
        if (name === -1) {
            return {
                type: 'point'
            };
        }
        if (!(name in resLib.textures)) {
            throw new Error(`Attempt to get a shape of a non-existent texture ${name}`);
        }
        return resLib.textures[name].shape;
    }
};


/*!@fonts@*/

export default resLib;

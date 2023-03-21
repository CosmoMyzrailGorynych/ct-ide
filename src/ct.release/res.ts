import {u} from './u';
import {ctjsGame} from '.';
import {sounds} from './sounds';
import * as PIXI from 'node_modules/pixi.js';

import {TextureShape, ExportedTiledTexture, ExportedSkeleton} from '../node_requires/exporter/_exporterContracts';

export type CtjsTexture = PIXI.Texture & {
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
//const dbFactory = window.dragonBones ? dragonBones.PixiFactory.factory : null;


/**
 * An object that manages and stores textures and other assets,
 * also exposing API for dynamic asset loading.
 */
const resLib = {
    sounds: {},
    textures: {} as Record<string, CtjsAnimation>,
    skeletons: {} as Record<string, ExportedSkeleton>,
    groups: [/*@resourceGroups@*/][0] as Record<string, string[]>,
    /**
     * Loads and executes a script by its URL
     * @param {string} url The URL of the script file, with its extension.
     * Can be relative or absolute.
     * @returns {Promise<void>}
     * @async
     */
    loadScript(url: string = u.required('url', 'ct.res.loadScript')): Promise<void> {
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
     * @param {string} url The path to the source image.
     * @param {string} name The name of the resulting ct.js texture
     * as it will be used in your code.
     * @param {ITextureOptions} textureOptions Information about texture's axis
     * and collision shape.
     * @returns {Promise<CtjsAnimation>} The imported animation, ready to be used.
     */
    async loadTexture(
        url: string = u.required('url', 'ct.res.loadTexture'),
        name: string = u.required('name', 'ct.res.loadTexture'),
        textureOptions: ITextureOptions = {}
    ): Promise<CtjsAnimation> {
        let texture: CtjsAnimation;
        try {
            texture = await PIXI.Assets.load(url);
        } catch (e) {
            console.error(`[ct.res] Could not load image ${url}`);
            throw e;
        }
        texture.shape = texture[0].shape = textureOptions.shape || ({} as TextureShape);
        texture[0].defaultAnchor = new PIXI.Point(
            textureOptions.anchor.x || 0,
            textureOptions.anchor.x || 0
        );
        resLib.textures[name] = texture;
        return texture;
    },
    /*
     * Loads a skeleton made in DragonBones into the game
     * @param {string} ske Path to the _ske.json file that contains
     * the armature and animations.
     * @param {string} tex Path to the _tex.json file that describes the atlas
     * with a skeleton's textures.
     * @param {string} png Path to the _tex.png atlas that contains
     * all the textures of the skeleton.
     * @param {string} name The name of the skeleton as it will be used in ct.js game
     */
    /*loadDragonBonesSkeleton(
        ske: string,
        tex: string,
        png: string,
        name: string = u.required('name', 'ct.res.loadDragonBonesSkeleton')
    ): Promise<string> {
        const dbf = dragonBones.PixiFactory.factory;
        const loader = new PIXI.Loader();
        loader
            .add(ske, ske)
            .add(tex, tex)
            .add(png, png);
        return new Promise<string>((resolve, reject) => {
            loader.load(() => {
                resolve(name);
            });
            loader.onError.add(() => {
                reject(new Error(`[ct.res] Could not load skeleton with _ske.json:
                ${ske}, _tex.json: ${tex}, _tex.png: ${png}.`));
            });
        }).then(() => {
            dbf.parseDragonBonesData(loader.resources[ske].data);
            dbf.parseTextureAtlasData(
                loader.resources[tex].data,
                loader.resources[png].texture
            );
            // eslint-disable-next-line id-blacklist
            resLib.skeletons[name] = loader.resources[ske].data;
            return name;
        });
    },*/
    /**
     * Loads a Texture Packer compatible .json file with its source image,
     * adding ct.js textures to the game.
     * @param {string} url The path to the JSON file that describes the atlas' textures.
     * @returns A promise that resolves into an array
     * of all the loaded textures' names.
     */
    async loadAtlas(url: string = u.required('url', 'ct.res.loadAtlas')): Promise<string[]> {
        const sheet = await PIXI.Assets.load<PIXI.Spritesheet>(url);
        for (const animation in sheet.animations) {
            const tex = sheet.animations[animation];
            const animData = sheet.data.animations;
            for (let i = 0, l = animData[animation].length; i < l; i++) {
                const a = animData[animation],
                      f = a[i];
                (tex[i] as CtjsTexture).shape = (
                    sheet.data.frames[f] as PIXI.ISpritesheetFrameData & {shape: TextureShape}
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
    async unloadAtlas(url: string = u.required('url', 'ct.res.unloadAtlas')): Promise<void> {
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
    async loadBitmapFont(url: string = u.required('url', 'ct.res.loadBitmapFont')): Promise<void> {
        await PIXI.Assets.load(url);
    },
    async unloadBitmapFont(url: string = u.required('url', 'ct.res.unloadBitmapFont')): Promise<void> {
        await PIXI.Assets.unload(url);
    },
    loadGame(): void {
        // !! This method is intended to be filled by ct.IDE and be executed
        // exactly once at game startup. Don't put your code here.
        const changeProgress = (percents: number) => {
            loadingScreen.setAttribute('data-progress', String(percents));
            loadingBar.style.width = percents + '%';
        };

        /* eslint-disable prefer-destructuring */
        const atlases: string[] = [/*@atlases@*/][0];
        const tiledImages: ExportedTiledTexture[] = [/*@tiledImages@*/][0];
        const sounds: string[] = [/*@sounds@*/][0];
        const bitmapFonts: string[] = [/*@bitmapFonts@*/][0];
        // DB means DragonBones
        //const dbSkeletons: [string, string, string][] = [/*@dbSkeletons@*/][0];
        /* eslint-enable prefer-destructuring */

        const totalAssets = atlases.length;
        let assetsLoaded = 0;
        const loadingPromises = [];

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
        /*
        for (const skel of dbSkeletons) {
            loadingPromises.push(resLib.loadDragonBonesSkeleton(...skel));
        }
        */
        /*
        for (const sound of sounds) {
            // TODO:
            sounds.init(sound.name, {
                wav: sound.wav || false,
                mp3: sound.mp3 || false,
                ogg: sound.ogg || false
            }, {
                poolSize: sound.poolSize,
                music: sound.isMusic
            });
        }*/

        /*@res@*/
        /*%res%*/

        Promise.all(loadingPromises)
        .then(() => {
            /*%start%*/
            loadingScreen.classList.add('hidden');
            ctjsGame.pixiApp.ticker.add(ctjsGame.loop);
            ctjsGame.rooms.forceSwitch(ctjsGame.rooms.starting);
        })
        .catch(console.error);
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
    ): CtjsAnimation | CtjsTexture | PIXI.Texture | PIXI.Texture[] => {
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
        (name: -1): [PIXI.Texture];
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
    /*
     * Creates a DragonBones skeleton, ready to be added to your copies.
     * @param {string} name The name of the skeleton asset
     * @param {string} [skin] Optional; allows you to specify the used skin
     * @returns {object} The created skeleton
     *
    makeSkeleton(name: string, skin?: string): any { // TODO:
        const r = resLib.skeletons[name],
              skel = dbFactory.buildArmatureDisplay('Armature', r.name, skin);
        skel.ctName = name;
        skel.on(dragonBones.EventObject.SOUND_EVENT, function skeletonSound(event) {
            if (sounds.exists(event.name)) {
                sounds.play(event.name);
            } else {
                // eslint-disable-next-line no-console
                console.warn(`Skeleton ${skel.ctName} tries to play
                a non-existing sound ${event.name}
                at animation ${skel.animation.lastAnimationName}`);
            }
        });
        return skel;
    }
    */
};

/*@fonts@*/

export const res = resLib;

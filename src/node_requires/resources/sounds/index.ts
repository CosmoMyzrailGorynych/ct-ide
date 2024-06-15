import fs from 'fs-extra';

import {getVariantPath} from './common';
import {SoundPreviewer} from '../preview/sound';
import {promptName} from '../promptName';

export const getThumbnail = SoundPreviewer.getClassic;
export const areThumbnailsIcons = false;

export const createAsset = async (name?: string): Promise<ISound> => {
    if (!name) {
        const newName = await promptName('sound', 'New Sound');
        if (!newName) {
            // eslint-disable-next-line no-throw-literal
            throw 'cancelled';
        }
        name = newName;
    }
    const generateGUID = require('./../../generateGUID');
    var id = generateGUID();
    const newSound: ISound = {
        name,
        uid: id,
        type: 'sound' as const,
        lastmod: Number(new Date()),
        preload: true,
        variants: [],
        distortion: {
            enabled: false,
            min: 0,
            max: 1
        },
        pitch: {
            enabled: false,
            min: 0,
            max: 1
        },
        reverb: {
            enabled: false,
            decayMin: 2,
            decayMax: 2,
            secondsMin: 2,
            secondsMax: 3,
            reverse: false
        },
        volume: {
            enabled: false,
            min: 0,
            max: 1
        },
        eq: {
            enabled: false,
            bands: Array(10).fill(0)
                .map(() => ({
                    min: -1,
                    max: 1
                }) as randomized) as eqBands
        },
        panning: {
            refDistance: 0.5,
            rolloffFactor: 1
        }
    };
    return newSound;
};

export const addSoundFile = async (sound: ISound, file: string): Promise<soundVariant> => {
    try {
        const generateGUID = require('./../../generateGUID');
        const uid = generateGUID();
        sound.lastmod = Number(new Date());
        const variant: soundVariant = {
            uid,
            source: file
        };
        await fs.copy(file, getVariantPath(sound, variant));
        await SoundPreviewer.save(sound, variant);
        sound.variants.push(variant);
        return variant;
    } catch (e) {
        console.error(e);
        (window as Window).alertify.error(e);
        throw e;
    }
};

const pixiSoundPrefix = 'pixiSound-';

import type {sound as pixiSound, filters as pixiSoundFilters} from '@pixi/sound';
import type * as pixiMod from 'pixi.js';
declare var PIXI: typeof pixiMod & {
    sound: typeof pixiSound & {
        filters: typeof pixiSoundFilters;
    }
};

export const loadSound = (asset: ISound): void => {
    for (const variant of asset.variants) {
        const key = `${pixiSoundPrefix}${variant.uid}`;
        if (PIXI.sound.exists(key)) {
            continue;
        }
        PIXI.sound.add(key, {
            url: 'file://' + getVariantPath(asset, variant),
            preload: true
        });
    }
};

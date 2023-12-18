import {SoundPreviewer} from '../preview/sound';

const path = require('path'),
      fs = require('fs-extra');

import {sound} from 'node_modules/@pixi/sound';

export const getThumbnail = SoundPreviewer.getClassic;
export const areThumbnailsIcons = false;

export const createAsset = function (): ISound {
    const generateGUID = require('./../../generateGUID');
    var id = generateGUID(),
        slice = id.slice(-6);
    const newSound: ISound = {
        name: ('Sound_' + slice),
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
            bands: Array(10).fill(({
                min: 0,
                max: 0
            }) as randomized) as eqBands
        }
    };
    return newSound;
};

export const getVariantBasePath = (sound: ISound, variant: ISound['variants'][0]): string =>
    `${global.projdir}/snd/s${sound.uid}_${variant.uid}`;
export const getVariantPath = (sound: ISound, variant: ISound['variants'][0]): string =>
    `${getVariantBasePath(sound, variant)}${path.extname(variant.source)}`;

export const addSoundFile = async (sound: ISound, file: string): Promise<soundVariant> => {
    try {
        const generateGUID = require('./../../generateGUID');
        const uid = generateGUID();
        sound.lastmod = Number(new Date());
        const variant: soundVariant = {
            uid,
            source: file
        };
        sound.variants.push(variant);
        await fs.copy(file, getVariantPath(sound, variant));
        await SoundPreviewer.save(sound, variant);
        return variant;
    } catch (e) {
        console.error(e);
        (window as Window).alertify.error(e);
        throw e;
    }
};

const pixiSoundPrefix = 'pixiSound-';

export const loadSound = (asset: ISound): void => {
    for (const variant of asset.variants) {
        const key = `${pixiSoundPrefix}${variant.uid}`;
        if (sound.exists(key)) {
            continue;
        }
        sound.add(key, {
            url: getVariantPath(asset, variant),
            preload: true
        });
    }
};

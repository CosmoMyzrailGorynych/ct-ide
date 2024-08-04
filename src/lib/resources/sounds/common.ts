import path from 'path';

export const getVariantBasePath = (sound: ISound, variant: ISound['variants'][0]): string =>
    `${window.projdir}/snd/s${sound.uid}_${variant.uid}`;
export const getVariantPath = (sound: ISound, variant: ISound['variants'][0]): string =>
    `${getVariantBasePath(sound, variant)}${path.extname(variant.source)}`;

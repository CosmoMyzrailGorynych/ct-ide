import path from 'path';

export const getVariantName = (sound: ISound, variant: ISound['variants'][0]): string =>
    `s${sound.uid}_${variant.uid}${path.extname(variant.source)}`;
export const getVariantPath = (sound: ISound, variant: ISound['variants'][0], fs: boolean): string => {
    if (fs) {
        return `${window.projdir}/snd/${getVariantName(sound, variant)}`;
    }
    return `/project/snd/${getVariantName(sound, variant)}`;
};

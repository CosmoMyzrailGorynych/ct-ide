import {ExporterError} from './ExporterError';
import {ExportedSound} from './_exporterContracts';

export const getSounds = (input: ISound[]): ExportedSound[] => {
    const sounds = [];
    for (const s of input) {
        if (!s.variants.length) {
            const errorMessage = `The sound asset "${s.name}" does not have actual sound files attached.`;
            const exporterError = new ExporterError(errorMessage, {
                resourceId: s.uid,
                resourceName: s.name,
                resourceType: 'sound',
                clue: 'emptySound'
            });
            throw exporterError;
        }

        sounds.push({
            name: s.name,
            variants: s.variants.map((v) => ({
                uid: v.uid,
                source: `./snd/${v.uid}.${v.source.slice(-3)}`
            })),
            preload: s.preload,
            volume: (s.volume.enabled && s.volume) || void 0,
            pitch: (s.pitch.enabled && s.pitch) || void 0,
            distortion: (s.distortion.enabled && s.distortion) || void 0,
            reverb: (s.reverb.enabled && s.reverb) || void 0,
            eq: (s.eq.enabled && s.eq) || void 0
        });
    }
    return sounds;
};

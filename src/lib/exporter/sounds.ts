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
        const out: ExportedSound = {
            name: s.name,
            variants: s.variants.map((v) => ({
                uid: v.uid,
                source: `./snd/${v.uid}.${v.source.slice(-3)}`
            })),
            preload: s.preload,
            panning: s.panning
        };
        const keys = ['volume', 'pitch', 'eq', 'distortion', 'reverb'] as const;
        for (const k of keys) {
            if (s[k].enabled) {
                (out as any)[k] = s[k];
            }
        }
        sounds.push(out);
    }
    return sounds;
};

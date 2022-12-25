import {ExporterError} from './ExporterError';

type exportedSoundData = {
    name: string;
    wav: string | false;
    mp3: string | false;
    ogg: string | false;
    poolSize: number;
    isMusic: boolean;
};

export const getSounds = (proj: IProject): exportedSoundData[] => {
    const sounds = [];
    for (const s of proj.sounds) {
        if (!s.origname) {
            const errorMessage = `The sound asset "${s.name}" does not have an actual sound file attached.`;
            const exporterError = new ExporterError(errorMessage, {
                resourceId: s.uid,
                resourceName: s.name,
                resourceType: 'sound',
                clue: 'emptySound'
            });
            throw exporterError;
        }
        const wav = s.origname.slice(-4) === '.wav',
              mp3 = s.origname.slice(-4) === '.mp3',
              ogg = s.origname.slice(-4) === '.ogg';
        sounds.push({
            name: s.name,
            wav: wav ? `./snd/${s.uid}.wav` : false,
            mp3: mp3 ? `./snd/${s.uid}.mp3` : false,
            ogg: ogg ? `./snd/${s.uid}.ogg` : false,
            poolSize: s.poolSize || 5,
            isMusic: Boolean(s.isMusic)
        } as exportedSoundData);
    }
    return sounds;
};

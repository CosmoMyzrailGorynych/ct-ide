const getSounds = proj => {
    const sounds = [];
    for (const k in proj.sounds) {
        const s = proj.sounds[k];
        if (!s.origname) {
            throw new Error(`The sound asset "${s.name}" does not have an actual sound file attached.`);
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
        });
    }
    return sounds;
};

module.exports = {
    getSounds
};

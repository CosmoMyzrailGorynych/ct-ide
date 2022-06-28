const getSounds = proj => {
    const sounds = [];
    for (const k in proj.sounds) {
        const s = proj.sounds[k];
        if (!s.origname) {
            throw new Error(`The sound asset "${s.name}" does not have an actual sound file attached.`);
        }
        const formats = [];
        if (s.origname.slice(-4) === '.mp3') {
            formats.push('mp3');
        }
        if (s.origname.slice(-4) === '.ogg') {
            formats.push('ogg');
        }
        if (s.origname.slice(-4) === '.wav') {
            formats.push('wav');
        }
        sounds.push({
            name: s.name,
            path: `./snd/${s.uid}.{${formats.join(',')}}`,
            preload: s.preload === void 0 ? true : s.preload,
            stereoSettings: {
                maxHearDistance: 4000
            }
        });
    }
    return sounds;
};

module.exports = {
    getSounds
};

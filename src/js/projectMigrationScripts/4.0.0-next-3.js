window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-3',
    process: async project => {
        const toPatchScriptables = [];
        const toPatchSounds = [];
        const walker = collection => {
            for (const item of collection) {
                if (['room', 'template'].includes(item.type)) {
                    toPatchScriptables.push(item);
                } else if (item.type === 'sound') {
                    toPatchSounds.push(item);
                } else if (item.type === 'folder') {
                    walker(item.entries);
                }
            }
        };
        walker(project.assets);
        for (const item of toPatchScriptables) {
            item.behaviors ??= [];
            if (item.type === 'template') {
                if (!item.baseClass) {
                    item.baseClass = 'AnimatedSprite';
                    item.nineSliceSettings = {
                        left: 16,
                        top: 16,
                        right: 16,
                        bottom: 16
                    };
                    item.style = -1;
                }
            }
        }
        if (toPatchSounds.length > 0) {
            const path = require('path');
            const fs = require('src/node_requires/neutralino-fs-extra');
            const {createAsset, addSoundFile} = require('src/node_requires/resources/sounds');
            await Promise.all(toPatchSounds.map(async sound => {
                if (!sound.origname) {
                    return;
                }
                const oldFile = window.projdir + '/snd/s' + sound.uid + path.extname(sound.origname);
                const preload = sound.isMusic;

                const newSound = await createAsset(sound.name);
                newSound.preload = preload;
                await addSoundFile(newSound, oldFile);

                for (const key of ['isMusic', 'origname', 'wav', 'ogg', 'mp3', 'poolSize']) {
                    delete sound[key];
                }
                Object.assign(sound, newSound);

                await fs.remove(oldFile);
            }));
        }
    }
});

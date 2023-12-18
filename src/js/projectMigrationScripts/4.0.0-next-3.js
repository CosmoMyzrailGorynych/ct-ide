window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-3',
    process: project => new Promise(resolve => {
        const toPatchScriptables = [];
        const toPatchSounds = [];
        const async = [];
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
            const fs = require('fs-extra');
            const getUID = require('./data/node_requires/generateGUID');
            const {createAsset, addSoundFile} = require('./data/node_requires/resources/sounds');
            for (const sound of toPatchSounds) {
                if (!sound.origname) {
                    continue;
                }
                const oldFile = global.projdir + '/snd/s' + sound.uid + path.extname(sound.origname);
                const preload = sound.isMusic;
                for (const oldKey of ['origname', 'ogg', 'mp3', 'wav', 'poolSize', 'isMusic']) {
                    delete sound[oldKey];
                }

                const newSound = createAsset();
                delete newSound.name;
                delete newSound.uid;
                newSound.preload = preload;

                Object.assign(sound, newSound);

                async.push(addSoundFile(sound, oldFile)
                    .then(() => fs.remove(oldFile)));
            }
        }
        if (async.length > 0) {
            Promise.all(async)
            .then(() => resolve());
        } else {
            resolve();
        }
    })
});

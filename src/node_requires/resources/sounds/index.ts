const path = require('path'),
      fs = require('fs-extra');

const getThumbnail = (sound: ISound): string => (sound.isMusic ? 'music' : 'volume-2');

const getById = function getById(id: string): ISound {
    const sound = global.currentProject.sounds.find((s: ISound) => s.uid === id);
    if (!sound) {
        throw new Error(`Attempt to get a non-existent sound with ID ${id}`);
    }
    return sound;
};

const createNewSound = function (name?: string): ISound {
    const generateGUID = require('./../../generateGUID');
    var id = generateGUID(),
        slice = id.slice(-6);
    var newSound = {
        name: name || ('Sound_' + slice),
        uid: id,
        isMusic: false,
        type: 'sound' as resourceType,
        lastmod: Number(new Date()),
        poolSize: 5
    };
    global.currentProject.sounds.push(newSound);
    return newSound;
};

const addSoundFile = async function addSoundFile(sound: ISound, file: string): Promise<void> {
    try {
        const newOrigName = 's' + sound.uid + path.extname(file);
        await fs.copy(file, (global as any).projdir + '/snd/s' + sound.uid + path.extname(file));
        // eslint-disable-next-line require-atomic-updates
        sound.origname = newOrigName;
        // eslint-disable-next-line require-atomic-updates
        sound.lastmod = Number(new Date());
    } catch (e) {
        console.error(e);
        (window as Window).alertify.error(e);
        throw e;
    }
};

export {
    getThumbnail,
    getById,
    createNewSound,
    addSoundFile
};

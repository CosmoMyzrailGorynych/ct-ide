const path = require('path'),
      fs = require('fs-extra');

import {promptName} from '../promptName';

const getThumbnail = (sound: ISound): string => (sound.isMusic ? 'music' : 'volume-2');

const createNewSound = async (name?: string): Promise<ISound> => {
    if (!name) {
        const newName = await promptName('sound', 'New Sound');
        if (!newName) {
            // eslint-disable-next-line no-throw-literal
            throw 'cancelled';
        }
        name = newName;
    }
    const generateGUID = require('./../../generateGUID');
    var id = generateGUID();
    var newSound: ISound = {
        type: 'sound',
        name,
        uid: id,
        isMusic: false,
        lastmod: Number(new Date()),
        poolSize: 5
    };
    return newSound;
};

const addSoundFile = async function addSoundFile(sound: ISound, file: string): Promise<void> {
    try {
        const newOrigName = 's' + sound.uid + path.extname(file);
        await fs.copy(file, global.projdir + '/snd/s' + sound.uid + path.extname(file));
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

export const areThumbnailsIcons = true;

export {
    getThumbnail,
    createNewSound,
    createNewSound as createAsset,
    addSoundFile
};

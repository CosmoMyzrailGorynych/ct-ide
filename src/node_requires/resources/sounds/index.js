const path = require('path'),
      fs = require('fs-extra');
module.exports = {
    createNewSound() {
        const generateGUID = require('./../../generateGUID');
        var id = generateGUID(),
            slice = id.slice(-6);
        var newSound = {
            name: 'Sound_' + slice,
            uid: id
        };
        global.currentProject.sounds.push(newSound);
        return newSound;
    },
    async addSoundFile(sound, file) {
        try {
            const newOrigName = 's' + sound.uid + path.extname(file);
            await fs.copy(file, global.projdir + '/snd/s' + sound.uid + path.extname(file));
            // eslint-disable-next-line require-atomic-updates
            sound.origname = newOrigName;
            // eslint-disable-next-line require-atomic-updates
            sound.lastmod = Number(new Date());
        } catch (e) {
            console.error(e);
            alertify.error(e);
            throw e;
        }
    }
};

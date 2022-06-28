window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '3.0.0',
    process: project => new Promise(resolve => {
        // Old sound libs are not needed!
        delete project.libs.sound;
        delete project.libs['sound.howler'];
        delete project.libs['sound.basic'];

        for (const sound of project.sounds) {
            if ('preload' in sound) {
                continue;
            }
            sound.preload = sound.isMusic;
            delete sound.isMusic;
        }
        resolve();
    })
});

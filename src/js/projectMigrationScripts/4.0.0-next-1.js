window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-1',
    process: project => new Promise(resolve => {
        const particles = require('@pixi/particle-emitter');
        for (const tandem of project.emitterTandems) {
            for (const emitter of tandem.emitters) {
                emitter.settings = particles.upgradeConfig(emitter.settings, {});
            }
        }
        resolve();
    })
});

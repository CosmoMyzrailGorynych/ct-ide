window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.3.0',
    process: project => new Promise((resolve) => {
        project.emitterTandems = project.emitterTandems || [];
        project.settings.branding = project.settings.branding || {
            icon: -1,
            accent: '#446adb',
            invertPreloaderScheme: true
        };
        for (const texture of project.textures) {
            if (!('padding' in texture)) {
                texture.padding = texture.tiled? 0 : 1;
            }
        }
        resolve();
    })
});

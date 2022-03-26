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
                texture.padding = texture.tiled ? 0 : 1;
            }
        }
        const oldSettings = project.settings.export;
        project.settings.export = {
            linux: oldSettings.linux || oldSettings.linux64 || oldSettings.linux32,
            windows: oldSettings.windows || oldSettings.windows64 || oldSettings.windows32,
            mac: oldSettings.mac || oldSettings.mac64
        };
        project.settings.desktopMode = project.settings.desktopMode || 'maximized';
        resolve();
    })
});

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
        project.settings.export = {
            linux: project.settings.export.linux || project.settings.export.linux64 || project.settings.export.linux32,
            windows: project.settings.export.windows || project.settings.export.windows64 || project.settings.export.windows32,
            mac: project.settings.export.mac || project.settings.export.mac64
        };
        project.settings.desktopMode = project.settings.desktopMode || 'maximized';
        resolve();
    })
});

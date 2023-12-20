window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-4',
    process: project => new Promise(resolve => {
        project.settings.export.bundleAssetTree ??= false;
        if (!project.settings.export.bundleAssetTypes) {
            project.settings.export.bundleAssetTypes = {
                texture: true,
                template: true,
                room: true,
                behavior: false,
                font: false,
                sound: false,
                style: false,
                tandem: false
            };
        }
        resolve();
    })
});

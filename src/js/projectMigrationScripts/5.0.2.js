window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '5.0.2',
    process: project => new Promise(resolve => {
        // Enum asset type appeared
        project.settings.export.bundleAssetTypes ??= false;
        resolve();
    })
});

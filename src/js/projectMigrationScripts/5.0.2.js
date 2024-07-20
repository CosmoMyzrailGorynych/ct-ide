window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '5.0.2',
    process: project => new Promise(resolve => {
        // Enum asset type appeared
        project.settings.export.bundleAssetTypes ??= false;
        // Content types' fields can now choose between atomic values, arrays, and maps
        for (const contentType of project.contentTypes) {
            for (const field of contentType.specification) {
                if (!('structure' in field)) {
                    field.structure = field.array ? 'array' : 'atomic';
                    field.mappedType = 'text';
                    delete field.array;
                }
            }
        }
        resolve();
    })
});

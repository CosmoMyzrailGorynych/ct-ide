window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '0.5.0',
    process: project => new Promise((resolve) => {
        const ps = project.settings || {};
        // ct.place has configs now
        if ('place' in project.libs) {
            project.libs.place.gridX = project.libs.place.gridY = 512;
        }
        // Fields for versioning your project appeared
        ps.version = [0, 0, 0];
        ps.versionPostfix = '';
        // Export settings for desktop builds appeared
        ps.export = {
            windows64: true,
            windows32: true,
            linux64: true,
            linux32: true,
            mac64: true,
            debug: false
        };
        resolve();
    })
});

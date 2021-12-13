window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.8.0',
    process: project => new Promise(resolve => {
        project.contentTypes = project.contentTypes || [];

        resolve();
    })
});

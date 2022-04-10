window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '2.0.2',
    process: project => new Promise(resolve => {
        for (const tandem of project.emitterTandems) {
            tandem.uid = tandem.uid || tandem.origname;
        }
        resolve();
    })
});

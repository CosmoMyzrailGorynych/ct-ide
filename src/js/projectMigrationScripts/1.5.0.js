window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.5.0',
    process: project => new Promise(resolve => {
        project.settings.export.functionWrap = project.settings.export.functionWrap || false;
        project.settings.export.codeModifier = project.settings.export.codeModifier || 'none';

        resolve();
    })
});

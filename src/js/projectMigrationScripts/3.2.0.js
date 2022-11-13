window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '3.2.0',
    process: project => new Promise(resolve => {
        // Mark all older projects as TypeScript projects
        project.language = 'typescript';
        resolve();
    })
});

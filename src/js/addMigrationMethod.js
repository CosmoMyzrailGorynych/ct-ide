(function addMigrationMethod() {
    window.migrationProcess = window.migrationProcess || [];
    window.applyMigrationCode = function applyMigrationCode(version) {
        const process = window.migrationProcess.find(process => process.version === version);
        if (!process) {
            throw new Error(`Cannot find migration code for version ${version}`);
        }
        process.process(window.currentProject)
        .then(() => window.alertify.success(`Applied migration code for version ${version}`, 'success', 3000));
    };
})();

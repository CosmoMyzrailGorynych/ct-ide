window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.4.2',
    process: project => new Promise(resolve => {
        /**
         * Copies now have their own extensions
         */
        for (const room of project.rooms) {
            for (const copy of room.copies) {
                copy.exts = copy.exts || {};
            }
        }

        resolve();
    })
});

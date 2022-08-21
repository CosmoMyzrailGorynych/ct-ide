window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '2.2.0',
    // eslint-disable-next-line max-lines-per-function
    process: project => new Promise(resolve => {
        for (const room of project.rooms) {
            room.isUi = room.extends.isUi;
            delete room.extends.isUi;
            for (const copy of room.copies) {
                copy.exts = copy.exts ?? {};
                copy.customProperties = copy.customProperties ?? {};
                copy.opacity = copy.opacity ?? 1;
                copy.tint = copy.tint ?? 0xffffff;
                copy.rotation = copy.rotation ?? 0;
                copy.scale = copy.scale ?? {
                    x: 1,
                    y: 1
                };
            }
        }
        resolve();
    })
});

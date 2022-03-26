window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.0.0-next-2',
    process: project => new Promise((resolve) => {
        for (const room of project.rooms) {
            if ('layers' in room) {
                room.copies = [];
                for (const layer of room.layers) {
                    room.copies.push(...layer.copies);
                }
                delete room.layers;
            }
        }
        for (const type of project.types) {
            if (!('extends' in type)) {
                type.extends = {};
            }
        }
        if (!('skeletons' in project)) {
            project.skeletons = [];
        }
        resolve();
    })
});

window.migrationProcess = window.migrationProcess || [];

/**
 * Tile editor
 */
window.migrationProcess.push({
    version: '0.3.1',
    process: project => new Promise((resolve) => {
        for (const room of project.rooms) {
            room.tiles = room.tiles || [];
        }
        resolve();
    })
});

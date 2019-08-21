window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.0.0-next-3',
    process: project => new Promise((resolve) => {
        // Add fields for Actions system
        project.actions = [];
        if ('keyboard' in project.libs) {
            delete project.libs.keyboard;
            project.libs['keyboard.legacy'] = {};
        }
        project.libs['mouse.legacy'] = {};

        // Rename Graphics into Textures
        if (project.textures) {
            resolve(); // some work on migration was done before, get out!
            return;
        }
        project.textures = project.graphs;
        project.texturetick = project.graphtick;
        delete project.graphs;
        delete project.graphtick;
        for (const type of project.types) {
            type.texture = type.graph;
            delete type.graph;
        }
        for (const room of project.rooms) {
            if (room.backgrounds) {
                for (const bg of room.backgrounds) {
                    bg.texture = bg.graph;
                    delete bg.graph;
                }
            }
            if (room.tiles) {
                for (const layer of room.tiles) {
                    // eslint-disable-next-line max-depth
                    for (const tile of layer.tiles) {
                        tile.texture = tile.graph;
                        delete tile.graph;
                    }
                }
            }
        }
        resolve();
    })
});

window.migrationProcess = window.migrationProcess || [];

/**
 * Git-friendly asset identifiers
 */
window.migrationProcess.push({
    version: '0.3.0',
    process: project => new Promise((resolve) => {
        const generateGUID = require('./data/node_requires/generateGUID');
        /* replace numerical IDs with RFC4122 version 4 UIDs */
        let startingRoom;
        const graphmap = {},
              typemap = {};
        for (const graph of project.graphs) {
            graph.uid = generateGUID();
            graphmap[graph.origname] = graph.uid;
        }
        for (const sound of project.sounds) {
            sound.uid = generateGUID();
        }
        for (const style of project.styles) {
            style.uid = generateGUID();
            if (style.fill && Number(style.fill.type) === 2) {
                /* eslint no-loop-func: off */
                style.fill.pattern = project.graphs.find(gr => gr.name === style.fill.patname).uid;
            }
        }
        for (const type of project.types) {
            const oldId = type.uid;
            type.uid = generateGUID();
            typemap[oldId] = type.uid;
            type.graph = graphmap[type.graph] || -1;
        }
        for (const room of project.rooms) {
            const oldId = room.uid;
            room.thumbnail = room.uid;
            room.uid = generateGUID();
            if (project.startroom === oldId) {
                startingRoom = room.uid;
            }
            if (room.layers && room.layers.length) {
                for (const layer of room.layers) {
                    for (let i = 0, l = layer.copies.length; i < l; i++) {
                        layer.copies[i].uid = typemap[layer.copies[i].uid];
                    }
                }
            }
            if (room.backgrounds && room.backgrounds.length) {
                for (const bg of room.backgrounds) {
                    bg.graph = graphmap[bg.graph];
                }
            }
        }
        if (!startingRoom) {
            startingRoom = project.rooms[0].uid;
        }
        project.startroom = startingRoom;
        resolve();
    })
});

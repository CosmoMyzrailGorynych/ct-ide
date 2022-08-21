window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '2.1.0',
    // eslint-disable-next-line max-lines-per-function
    process: project => new Promise(resolve => {
        const templateEventMap = {
            oncreate: 'OnCreate',
            onstep: 'OnStep',
            ondestroy: 'OnDestroy',
            ondraw: 'OnDraw'
        };
        const roomEventMap = {
            oncreate: 'OnRoomStart',
            onstep: 'OnStep',
            ondraw: 'OnDraw',
            onleave: 'OnRoomEnd'
        };
        for (const template of project.templates) {
            if (!template.events) {
                template.events = [];
                for (const key in templateEventMap) {
                    if (template[key]) {
                        template.events.push({
                            lib: 'core',
                            arguments: {},
                            code: template[key],
                            eventKey: templateEventMap[key]
                        });
                    }
                    delete template[key];
                }
            }
            template.type = 'template';
            if (!('loopAnimation' in template)) {
                template.loopAnimation = true;
            }
        }
        for (const room of project.rooms) {
            room.simulate = true;
            if (!room.events) {
                room.events = [];
                for (const key in roomEventMap) {
                    if (room[key]) {
                        room.events.push({
                            lib: 'core',
                            arguments: {},
                            code: room[key],
                            eventKey: roomEventMap[key]
                        });
                        delete room[key];
                    }
                }
            }
            room.type = 'room';
        }
        // Break up tile chunks into individual tiles
        for (const room of project.rooms) {
            for (const layer of room.tiles) {
                layer.tiles = layer.tiles.reduce((tiles, tile) => {
                    const tex = project.textures.find(t => t.uid === tile.texture);
                    if (!tile.grid) {
                        tiles.push(tile);
                        return tiles;
                    }
                    // grid: [tileX, tileY, tileSpanX, tileSpanY]
                    // eslint-disable-next-line prefer-destructuring
                    for (let x = tile.grid[0]; x < tile.grid[0] + tile.grid[2]; x++) {
                        // eslint-disable-next-line prefer-destructuring
                        for (let y = tile.grid[1]; y < tile.grid[1] + tile.grid[3]; y++) {
                            tiles.push({
                                x: tile.x + tex.axis[0],
                                y: tile.y + tex.axis[1],
                                opacity: tile.opacity ?? 1,
                                tint: tile.tint ?? 0xffffff,
                                scale: {
                                    x: tile.scale?.x ?? 1,
                                    y: tile.scale?.y ?? 1
                                },
                                frame: x + y * tex.grid[0],
                                rotation: tile.rotation ?? 0,
                                texture: tile.texture
                            });
                        }
                    }
                    delete tile.grid;
                    return tiles;
                }, []);
            }
        }
        resolve();
    })
});

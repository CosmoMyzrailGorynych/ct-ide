window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '2.2.0',
    // eslint-disable-next-line max-lines-per-function
    process: project => new Promise(resolve => {
        // Break up tile chunks into individual tiles
        for (const room of project.rooms) {
            room.simulate = true;
            room.isUi = Boolean(room.extends?.isUi);
            delete room.extends.isUi;
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

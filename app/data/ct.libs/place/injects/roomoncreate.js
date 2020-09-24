if (this === ct.room) {
    ct.place.tileGrid = {};
    const debugTraceGraphics = new PIXI.Graphics();
    debugTraceGraphics.depth = 10000000; // Why not. Overlap everything.
    ct.room.addChild(debugTraceGraphics);
    ct.place.debugTraceGraphics = debugTraceGraphics;
}
if (ct.types.list.TILEMAP) {
    for (const layer of ct.types.list.TILEMAP) {
        if (this.children.indexOf(layer) === -1) {
            continue;
        }
        ct.place.enableTilemapCollisions(layer);
        if ([/*%debugMode%*/][0]) {
            for (let i = 0; i < layer.tiles.length; i++) {
                const pixiTile = layer.pixiTiles[i],
                      logicTile = layer.tiles[i];
                pixiTile.$cDebugCollision = new PIXI.Graphics();
                ct.place.drawDebugTileGraphic.apply(pixiTile, [logicTile]);
                pixiTile.addChild(pixiTile.$cDebugCollision);
            }
        }
    }
}

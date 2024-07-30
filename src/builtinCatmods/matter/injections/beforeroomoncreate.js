if (this === rooms.current) {
    rooms.current.matterEngine = Matter.Engine.create();
    rooms.current.matterWorld = rooms.current.matterEngine.world;
    rooms.current.matterGravity = rooms.current.matterGravity || [0, 9.8];
    [
        rooms.current.matterWorld.gravity.x,
        rooms.current.matterWorld.gravity.y
    ] = rooms.current.matterGravity;
    matter.rulebookStart = [];
    matter.rulebookActive = [];
    matter.rulebookEnd = [];
}

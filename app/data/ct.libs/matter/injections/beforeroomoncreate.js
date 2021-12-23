ct.room.matterEngine = Matter.Engine.create();
ct.room.matterWorld = ct.room.matterEngine.world;
ct.room.matterGravity = ct.room.matterGravity || [0, 9.8];
[ct.room.matterWorld.gravity.x, ct.room.matterWorld.gravity.y] = ct.room.matterGravity;

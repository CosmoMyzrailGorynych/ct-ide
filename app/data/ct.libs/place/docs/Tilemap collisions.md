# Enabling tilemap collisions

Tile layers created in ct.IDE automatically get their collisions enabled. For those layers created with `ct.tilemap` API, you will need to manually enable collisions on them. This can be done with the methods `ct.place.enableTilemapCollisions(tilemap, cgroup)` and `tilemap.enableCollisions(cgroup)`.

## Example: Generate a map with Perlin noise and enable its collisions

```js
const tilemap = ct.tilemaps.create(-100);
ct.noise.setSeed();

// Assuming you have a texture called 'RockTile' which is 64x64px in size.
for (var x = 0; x < ct.camera.width / 64; x++) {
    for (var y = 0; y < ct.camera.height / 64; y++) {
        var value = ct.noise.perlin2d(x / 7, y / 7); // Returns a value from -1 to 1.
        if (value > 0) {
            const tile = ct.tilemaps.addTile(tilemap, 'RockTile', x*64, y*64);
            tile.alpha = value * 0.5 + 0.5;
        }
    }
}

tilemap.cache();

// Either...
tilemap.enableCollisions('Solid');
// ...or ct.place.enableTilemapCollisions(tilemap, 'Solid');
```
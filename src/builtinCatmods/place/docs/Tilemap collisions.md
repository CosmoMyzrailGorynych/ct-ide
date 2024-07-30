# Enabling tilemap collisions

Tile layers created in ct.IDE automatically get their collisions enabled. For those layers created with `tilemap` API, you will need to manually enable collisions on them. This can be done with the methods `place.enableTilemapCollisions(tilemap, cgroup)` and `tilemap.enableCollisions(cgroup)`.

## Example: Generate a map with Perlin noise and enable its collisions

```js
const tilemap = tilemaps.create(-100);
noise.setSeed();

// Assuming you have a texture called 'RockTile' which is 64x64px in size.
for (var x = 0; x < camera.width / 64; x++) {
    for (var y = 0; y < camera.height / 64; y++) {
        var value = noise.perlin2d(x / 7, y / 7); // Returns a value from -1 to 1.
        if (value > 0) {
            const tile = tilemaps.addTile(tilemap, 'RockTile', x*64, y*64);
            tile.alpha = value * 0.5 + 0.5;
        }
    }
}

tilemap.cache();

// Either...
tilemap.enableCollisions('Solid');
// ...or place.enableTilemapCollisions(tilemap, 'Solid');
```

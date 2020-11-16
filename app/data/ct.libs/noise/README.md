# NOISE!

This is a simple library for 2d & 3d perlin noise and simplex noise in javascript. The original library library is written by Joseph Gentle ([git repo](https://github.com/josephg/noisejs)). The code is based on Stefan Gustavson's implementation.

## Example: Fill the area with tiles by using a perlin noise

```js
this.tilemap = ct.tilemaps.create(-100);
ct.noise.setSeed();

// Assuming you have a texture called 'RockTile' which is 64x64px in size.
for (var x = 0; x < ct.camera.width / 64; x++) {
    for (var y = 0; y < ct.camera.height / 64; y++) {
        var value = ct.noise.perlin2d(x / 7, y / 7); // Returns a value from -1 to 1.
        if (value > 0) {
            const tile = ct.tilemaps.addTile(this.tilemap, 'RockTile', x*64, y*64);
            tile.alpha = value * 0.5 + 0.5;
        }
    }
}

this.tilemap.cache();
ct.place.enableTilemapCollisions(this.tilemap, 'Solid');
```

The library exposes an object called `ct.noise` with the following properties:

* `simplex2d(x, y)`: 2D Simplex noise function;
* `simplex3d(x, y, z)`: 3D Simplex noise function;
* `perlin2d(x, y)`: 2D Perlin noise function;
* `perlin3d(x, y, z)`: 3D Perlin noise function;
* `seed(val)`: Seed the noise functions. Only 65536 different seeds are supported. Use a float between 0 and 1 or an integer from 1 to 65536, or leave the parenthesis empty to pick a random seed.

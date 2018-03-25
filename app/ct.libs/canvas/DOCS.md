## `ct.canvas.create(width, height)`

Creates and returns a new canvas.

```js
var decals = ct.canvas.create(ct.room.width, ct.room.height);
```

## `ct.canvas.drawTile(canv, img: String, imgindex: Number, x, y)`

Draws an image of a given graphic asset to a canvas.

```js
ct.canvas.drawTile(decals, 'Dirt', ct.random.dice(0, 1, 2, 3), this.x, this.y);
```

## `ct.canvas.drawTileExt(canv, img, imgindex, x, y, hs, vs, r, a)`

Draws an image, applying listed transformations.

```js
ct.canvas.drawTile(
    decals, 'Dirt', ct.random.dice(0, 1, 2, 3),
    this.x, this.y, 
    ct.random.range(0.8, 1.2), ct.random.range(0.8, 1.2), ct.random.deg(), 1);
```

## `ct.canvas.appendTo(canv, tag: String|HTMLTag)`

Adds a canvas to a document. `tag` can be either an HTML tag, or an id of the needed tag.

## `ct.canvas.draw(canv, x, y)`

Draws a given canvas on the main one.
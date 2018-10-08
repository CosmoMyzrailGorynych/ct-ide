# ct.types

This object allows you to create new Copies and manipulate them.


## Copies' parameters

Each Copy has these parameters:

- `x`, `y` — its location;
- `xprev`, `yprev` — location of a Copy in a previous frame;
- `xstart`, `ystart` — coordinates at which a copy was created;
- `uid` — unique identifier for the current room;
- `spd` — movement speed;
- `dir` — movement direction (from 0 to 360);
- `grav` — gravity force;
- `gravdir` — gravity direction (from 0 to 360);
- `depth` — drawing layer;
- `type` — the name of the Type from which a Copy was created;
- `frame` — current drawing frame number;
- `imgspd` — animation speed (frames per room frame, 0 by default);
- `transform` — can be either `true` or `false`. Tells whether a Copy should be transformed while drawing. The actual transformation is set by these parameters:
    - `tx` — horizontal stretch;
    - `ty` — vertical stretch;
    - `tr` — rotation (from 0 to 360);
    - `ta` — opacity (from 0 to 1).
- `graph` — the name of graphic asset to use.


## Deleting Copies

To delete a Copy, simply set its `kill` parameter to `true`.

**Example:** delete a Copy, if its health is depleted

```js 
if (this.health <= 0) {
    this.kill = true;
}
```

> Note: OnStep code [will still be executed](ct.html#Event-sequence) until the drawing phase.


## Copies' methods

Draw the current Copy in its place

```js
this.draw();
```

Draw a Copy in a specified location

```js 
this.draw(x, y);
```

Move a Copy according to its 'spd' and 'grav' parameters

```js 
this.move();
```

Add speed vector to a Copy in a given direction.

```js 
this.addSpeed(speed, dir);
```

## Methods and properties of ct.types

### `ct.types.copy(type: String, x, y)` and `ct.types.make(type: String, x, y)`

Creates a Copy of a given Type. If x or y is omitted, they are set to 0.

### `ct.types.each(func: Function)`

Applies a function to all the active copies.

**Example:** destroy all the copies within a 150px radius

```js 
var me = this;
ct.types.each(function () {
    if (this !== me) { // aren't we trying to destroy ourselves?
        if (ct.u.pdc(this.x, this.y, me.x, me.y) <= 150) {
            this.kill = true;
        }
    }
});
```

> `ct.u.pdc` computes distance between two points. This and other similar functions can be found [here](ct.u.html).


### `ct.types.with(copy: Copy, func: Function)`

Works like `ct.types.each`, but only for the specified Copy.

### `ct.types.list['TypeName']`

Returns an array with all the existing copies of the specified type.

**Example:** make an order to destroy all the 'Bonus' Copies

```js 
for (var bonus of ct.types.list['Bonus']) {
    bonus.kill = true;
}
```

### `ct.types.addSpeed(o: Copy, spd, dir)`

Adds a speed vector to a given Copy. This is the same as calling `o.addSpeed(spd, dir)`;
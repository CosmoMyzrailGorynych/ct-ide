title: ct.types Object
---

# ct.types

This object allows you to create new Copies and manipulate them.

---

## Copies' attributes

Each Copy has these parameters:

- `x`, `y` – its location;
- `xprev`, `yprev` – location of a Copy in a previous frame;
- `xstart`, `ystart` – coordinates at which a copy was created;
- `uid` – unique identifier for the current room;
- `spd` – movement speed;
- `dir` – movement direction (from 0 to 360);
- `grav` – gravity force;
- `gravdir` – gravity direction (from 0 to 360);
- `depth` – drawing layer;
- `type` – the name of the Type from which a Copy was created;
- `frame` – current drawing frame number;
- `imgspd` – animation speed (frames per room frame, 0 by default);
- `transform` – can be either `true` or `false`. Tells whether a Copy should be transformed while drawing. The actual transformation is set by these parameters:
    - `tx` – horizontal stretch;
    - `ty` – vertical stretch;
    - `tr` – rotation (from 0 to 360);
    - `ta` – opacity (from 0 to 1).
- `graph` – the name of graphic asset to use.

---

## Deleting Copies

To delete a Copy, simply set its `kill` parameter to `true`.

```js Example: delete Copy, if its health is depleted
if (this.health <= 0) {
    this.kill = true;
}
```

> Note: onstep code [will still be executed](ct.html#Event-sequence) until the drawing phase.

---

## Common procedures with Copies

```js Draw the current Copy in its place
ct.draw(this);
```

```js Draw a Copy in a specified location
ct.draw.copy(copy, x, y);
```

```js Move a Copy according to its 'spd' and 'grav' parameters
ct.types.move(this);
```

---

## Methods and properties of ct.types

### `ct.types.copy(type: String, x, y)` and `ct.types.make(type: String, x, y)`

Creates a Copy of a given Type.

### `ct.types.each(func: Function)`

Applies a function to all active copies. The function is passed a Copy, which called this method (which called `ct.types.each`).

```js Example: destroy all the copies within a 150px radius
ct.types.each(function (other) {
    if (this !== other) { // aren't we trying to destroy ourselves?
        if (ct.u.pdc(this.x, this.y, other.x, other.y) <= 150) {
            this.kill = true;
        }
    }
});
```

{% pullquote %}
`ct.u.pdc` computes distance between two points. This and other similar functions can be found [here](ct.u.html).
{% endpullquote %}

### `ct.types.with(copy: Copy, func: Function)`

Works like `ct.types.each`, but only for the specified Copy.

### `ct.types.list['TypeName']`

Returns an array with all the existing copies of the specified type.

```js Example: make an order to destroy all the 'Bonus' Copies
for (var i = 0, l = ct.types.list['Bonus'].length; i < l; i++) {
    ct.types.list['Bonus'][i].kill = true;
}
```

### `ct.types.addSpeed(o: Copy, spd, dir)`

Adds a speed vector to a given Copy.
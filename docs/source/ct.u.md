title: ct.u Object
---

# ct.u

This object contains some handy utility functions to ease the development process.

---

## Methods and properties

### `ct.u.ldx(length, direction)`

Gets the horizontal part of a vector.

### `ct.u.ldy(length, direction)`

Gets the vertical part of a vector.

### `ct.u.pdn(x1, y1, x2, y2)`

Gets the direction of vector which is pointing from (x1;y1) to (x2;y2).

### `ct.u.pdc(x1, y1, x2, y2)`

Gets the distance between points (x1;y1) and (x2;y2).

### `ct.u.load(url: String, callback: Function)`

Loads the specified script and calls the callback when it was loaded.

### `ct.u.ext(o1, o2[, arr: Array[String]])`

Transfers objects' properties from `o2` to `o1`. You can specify an array of properties' names you want to transfer; otherwise everything is transferred.

> Note: this doesn't create a deep copy.
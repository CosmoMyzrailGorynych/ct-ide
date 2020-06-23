## ct.place.free(me, [x, y, ctype])

Checks whether there is a free place at (x;y) for a copy `me`. `ctype` is optional and filters collision by using `ctype` parameter). If `x` and `y` are skipped, the current coordinates of `me` will be used.

Returns `true` if a place is free, and `false` otherwise.


## ct.place.occupied(me, [x, y, ctype], [multiple])

The opposite for `ct.place.free`, but it also returns a Copy which blocks `me` at given coordinates. If `x` and `y` are skipped, the current coordinates of `me` will be used.

If `multiple` is `true`, the function will find all the possible collisions, and will always return an array, which is either empty or filled with collided copies. Otherwise, it returns `false` or the first Copy which blocked `me`.

## ct.place.meet(me, [x, y,] type, [multiple])

Checks whether there is a collision between a Copy `me` and any of the Copies of a given `type`. If `x` and `y` are skipped, the current coordinates of `me` will be used.

If `multiple` is `true`, the function will find all the possible collisions, and will always return an array, which is either empty or filled with collided copies. Otherwise, it returns `false` or the first Copy which blocked `me`.

## ct.place.collide(c1, c2)

Returns `true` if there is a collision between `c1` and `c2` Copies.

## ct.place.tile(me, [x, y, ctype])

Checks for a collision between a copy `me` and a tile layer of a given collision group (`ctype`). If `ctype` is not set for a tile layer, then ct.place will compare against a tile layer's depth. (This is made for compatibility with older versions of ct.place and ct.js as is.)

If `x` and `y` are skipped, the current coordinates of `me` will be used.

> **Warning:** Each tile is considered a rectangle, and a possible collision mask defined in the graphics asset (in the tileset) is ignored.

This method returns either `true` (a copy collides with a tile layer) or `false` (no collision).

## ct.place.moveAlong(me, direction, maxLength, [ctype, stepSize])

Moves a copy by `stepSize` in a given `direction` untill a `maxLength` is reached or a copy is next to another colliding copy. You can filter collided copies with `ctype`, and set precision with `stepSize` (default is `1`, which means pixel-by-pixel movement). This function is especially useful for side-view games and any fast-moving copies, as it allows precise movement without clipping or passing through surfaces.


## ct.place.nearest(x, y, type)

Gets the nearest Copy of a given `type`.


## ct.place.furthest(x, y, type)

Gets the furthest Copy of a given `type`.


## ct.place.lastdist

Returns the latest distance after calling `ct.place.furthest` or `ct.place.nearest`.


## ct.place.go(me, x, y, length, [ctype])

Tries to reach the target with a simple obstacle avoidance algorithm.

`me` is a copy to move around, `x` and `y` is a target point; `length` is the maximum amount of pixels to move in one step. `ctype` is an option parameter that tells to test collisions against a certain collision group.

This function doesn't require the `ct.types.move(this);` call.

## ct.place.trace(x1, y1, x2, y2, [ctype])

Throws a ray from point (x1, y1) to (x2, y2), returning all the copies that touched the ray.
The first copy in the returned array is the closest copy, the last one is the furthest. The order is not always exact, especially with overlapping shapes.

`ctype` is an optional collision group to trace against. If omitted, ct.place will trace through all the copies in the current room.

**This is an expensive operation.**
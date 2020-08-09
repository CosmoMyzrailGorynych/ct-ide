# Collision checks with `ct.place`

`ct.place` checks collisions with the methods listed below. Most of the time, it uses a collision group (aka `ctype`) to check against a specific, defined by you, subset of copies, as well as tile layers. After enabling this module, you will find additional fields in type editor and for tile layers in the room editor, where you can set this collision group.

While runnning a game, you can change a copy's `this.ctype` parameter so `ct.place` detects it under a different collision group. Think of a one-way platform or a barrier that can be turned off.

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

Returns `true` if there is a collision between `c1` and `c2` Copies. This is rarely used on its own, as it is often more appropriate to use `ct.place.occupied` or `ct.place.meet`.

## ct.place.tile(me, [x, y, ctype])

Checks for a collision between a copy `me` and a tile layer of a given collision group (`ctype`). If `ctype` is not set for a tile layer, then ct.place will compare against a tile layer's depth. (This is made for compatibility with older versions of ct.place and ct.js as is.)

If `x` and `y` are skipped, the current coordinates of `me` will be used.

> **Warning:** Each tile is considered a rectangle, and a possible collision mask defined in the graphics asset (in the tileset) is ignored.

This method returns either `true` (a copy collides with a tile layer) or `false` (no collision).

## ct.place.trace(x1, y1, x2, y2, [ctype])

Throws a ray from point (x1, y1) to (x2, y2), returning all the copies that touched the ray.
The first copy in the returned array is the closest copy, the last one is the furthest. The order is not always exact, especially with overlapping shapes.

`ctype` is an optional collision group to trace against. If omitted, ct.place will trace through all the copies in the current room.

**This is an expensive operation.**
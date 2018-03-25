## ct.place.free(me, x, y, type)

Checks whether there is a free place at (x;y) for a copy `me`. `type` is optional and filters collision by using `ctype` parameter).

Returns `true` if a place is free, and `false` otherwise.


## ct.place.occupied(me, x, y, type)

The opposite for `ct.place.free`, but it also returns a Copy which blocks `me` at given coordinates.


## ct.place.collide(c1, c2)

Returns `true` if there is a collision between `c1` and `c2` Copies.

## ct.place.meet(me, x, y, type)

Checks whether there is a collision between a Copy `me` and any of the Copies of a given `type`. 

Returns `false` or the first Copy which blocked `me`.


## ct.place.nearest(x, y, type)

Gets the nearest Copy of a given `type`.


## ct.place.furthest(x, y, type)

Gets the furthest Copy of a given `type`.


## ct.place.lastdist

Returns the latest distance after calling `ct.place.furthest` or `ct.place.nearest`.
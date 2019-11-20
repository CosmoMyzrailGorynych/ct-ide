## `ct.eqs.query(options: Object)`

Constructs a new query with the given options and returns it.

There are three required fields in the options:

Parameter | Explanation | Default
--        | -           |-
`x`       | The horizontal center of a query | —
`y`       | The vertical center of a query | —
`type`    | One of: `'grid'`, `'ring'`, `'circle'`, `'copies'` | `'grid'`

If `type` equals `grid`, then you must provide additional parameters:

Parameter | Explanation | Default
--        | -           | -
`w`       | The number of columns in your grid | —
`h`       | The number of rows in your grid    | —
`sizeX`   | The horizontal gap between two points | —
`sizeY`   | The vertical gap between two poins | —
`triangle`| Whether to shift each second row in the grid, thus forming a triangle grid | `false`

If `type` equals `circle`, then you must provide these parameters:

Parameter | Explanation | Default
--        | -           | -
`r`       | The radius of the circle | —
`sizeX`   | The horizontal gap between two points | —
`sizeY`   | The vertical gap between two poins | —
`triangle`| Whether to shift each second row in the grid, thus forming a triangle grid | `false`

If `type` equals `ring`, then you must provide additional parameters:

Parameter | Explanation | Default
--        | -           | -
`n`       | The number of points to create | —
`r`       | The radius of the ring | —

If `type` equals `copies`, then you must provide additional parameters:

Parameter | Explanation | Default
--        | -           | -
`copyType`| A type's name from which copies to take coordinates | —
`limit`   | *Optional.* The maximum radius from the center of your query at which your copies are included. | —


## `ct.eqs.query(points: Array)`

Creates a new query from an array of points. Each point should be an object with `x`, `y` and `score` fields.

## `ct.eqs.query(options: EQSQuery)`

Creates a new separate query by copying points from another query.

## `EQSQuery` class

### Modifying methods

#### `score(func)`

Execute a function for each point in the query. Function is passed the only argument, the current `point`. Modify its `score` value to rank it.

#### `scoreSpaced(func)`

Works only with queries of `'grid'` type. Execute a function for each point in the query. Function is passed four arguments:

0. the current point;
1. the whole map of points (a two-dimentional array of points);
2. the current point's column index (the `x` position);
3. the current point's row index (the `y` position);

#### `sort()`

Sorts all the points in a query based on their `score`, descending.

#### `normalize()`

Normalizes points' `score` values to a `[0;1]` range.

#### `invert()`

Inverts points' `score` value.

#### `reverse()`

Reverses the current points array.

#### `portion(rate)`

Removes a portion of points, e.g. if `rate` is `0.25`, then only the first 25% of points are leaved as is, and other are removed.


### Non-modifying methods (getters)

#### `getFirst([n])`

Gets the first `n` points from a query, or the first one, if `n` is not defined.

#### `getLast([n])`

Gets the last `n` points from a query, or the last one, if `n` is not defined.

#### `getPortion(rate)`

Gets a portion of points, e.g. if `rate` is `0.15`, then the first 15% of points will be returned in an array.

#### `getRandom()`

Gets a random point from a query.

#### `getBetterRandom()`

Gets a random point from a query, but the first ones have the highest chance to be picked.

### Utilities

#### `concat(EQSQuery)`

Returns a new query combined from two other queries.

## Built-in querying functions

### `ct.eqs.scoreFree(ctype, multiplier)`

Creates a scoring function that tests whether a point collides with a `ctype` group. `multiplier` is multiplied with a point's `score` value if a point does not collide with a given collision group (default one is `0`).

### `ct.eqs.scoreOccupied(ctype, multiplier)`

Creates a scoring function that tests whether a point collides with a `ctype` group. `multiplier` is multiplied with a point's `score` value if a point collides with a given collision group (default one is `0`).

### `ct.eqs.scoreTile(layer, multiplier)`

Creates a scoring function that tests whether a point collides with a tile layer. `layer` determines the depth of a tested tile layer. `multiplier` is multiplied with a point's `score` value if a point collides with any tile (default one is `0`).

### `ct.eqs.scoreDirection(direction, fromx, fromy, weight)`

Given a point (`fromx`, `fromy`), this method creates a scoring function that calculates direction values from each points to the (`fromx`, `fromy`) point, and then ranks these points depending on how close the resulting direction is to a given `direction` argument. If directions are equal, a point's `score` is unchanged. If directions are perpendicular, a point's `score` is halved. If directions are opposite, then a point's `score` is set to 0.

The `weight` parameter tells how much this ranking function should affect a point's `score`.
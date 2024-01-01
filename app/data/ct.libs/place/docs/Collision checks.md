# Collision checks with `place`

`place` checks collisions with the methods listed below. Most of the time, it uses a collision group (aka `cgroup`, or `this.cgroup`) to check against a specific, defined by you, subset of copies, as well as tile layers. After enabling this module, you will find additional fields in template editor and for tile layers in the room editor, where you can set this collision group.

While runnning a game, you can change a copy's `this.cgroup` parameter so `place` detects it under a different collision group. Think of a one-way platform or a barrier that can be turned off.


## `place.occupied(me, [x, y, cgroup])`

Looks for a copy or a tile that collides with the passed copy `me`, and returns this copy or tile. If no obstructions were found, the method returns `false`.

You can set `x` and `y` to make a check as if the copy was in different coordinates.

Use `cgroup` to filter out all the copies and tiles that don't belong to the specified collision group.

`x` and `y` can be skipped (but not individually), as well as `cgroup`.

### Example: Find obstacles in one's way, and destroy itself if there are any

```js
if (place.occupied(this, 'Solid')) {
    this.kill = true;
}
```

### Example: Bullet logic. Destroy the bullet and an enemy if they collide

```js
// Save collision result in a variable
var enemy = place.occupied(this, 'Enemies');
// Did we get a copy?
if (templates.isCopy(enemy)) {
    this.kill = true;
    enemy.kill = true;
}
```

## `place.free(me, [x, y, cgroup])`

Checks whether there is a free place at (x;y) for a copy `me`. `cgroup` is optional and filters collision by using `cgroup` parameter. If `x` and `y` are skipped, the current coordinates of `me` will be used.

Returns `true` if a place is free, and `false` otherwise.

### Example: On clicks, check for free space before spawning new copes

Here the current copy is some marker or silhouette of the copy that is being spawned.

```js
if (actions.Click.released) {
    if (place.free(this)) {
        templates.copy('Tree', this.x, this.y);
    }
}
```

## `place.meet(me, [x, y,] template)`

Checks whether there is a collision between a Copy `me` and any of the Copies of a given `template`. If `x` and `y` are skipped, the current coordinates of `me` will be used. It returns `false` or the first Copy which blocked `me`.

### Example: Check for collisions for a copy of template "Hero" and switch to a different room on collisions

```js
if (place.meet(this, 'Hero')) {
    rooms.switch('Level_02');
}
```

## `place.collide(c1, c2)`

Returns `true` if there is a collision between `c1` and `c2` Copies. This is rarely used on its own, as it is often more appropriate to use `place.occupied` or `place.meet`.

## `place.copies(me, [x, y, cgroup])`

Checks for a collision between a copy `me` and copies of the given collision group (`cgroup`). If there was a collision with a copy, the method returns this copy. Otherwise, the method will return `false`.

Use this method instead of `place.occupied` when you don't need collision checks with tiles. (For example, when you query for 'Enemies' collision group and you know there are no tiles of the 'Enemies' group.) This will give a performance boost in tilemap-heavy rooms.

If `x` and `y` are skipped, the current coordinates of `me` will be used. If `cgroup` is skipped, collision check will be made against all the copies in the room in close proximity.

## `place.tiles(me, [x, y, cgroup])`

Checks for a collision between a copy `me` and tiles of a given collision group (`cgroup`). If there was a collision with a tile, the method returns this tile. Otherwise, the method will return `false`.

If `x` and `y` are skipped, the current coordinates of `me` will be used. If `cgroup` is skipped, collision check will be made against all the tiles in the room in close proximity.

## Collision checks for multiple entities

There are several additional methods for cases when you need to get all the objects that collide with your copy:

* `place.occupiedMultiple`
* `place.meetMultiple`
* `place.copiesMultiple`
* `place.tilesMultiple`

They all have the same arguments, but return an array of objects if there was at least one collision. Consider the example below.

### Example: Destroy all the objects that collide with the current copy

This can be a bomb that exists for one frame and leaves an FX, or can be a death orb that erases all the enemies.
You can also deal continuous damage to copies' HP instead of instantly killing them.

```js
var enemies = place.occupiedMultiple(this, 'Enemies');
if (enemies) { // Were there any collisions at all?
    for (const enemy of enemies) { // Loop over every copy in the returned array
        enemy.kill = true;
    }
}
```

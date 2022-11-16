# Movement methods

`ct.place` provides two methods for moving copies: `ct.place.moveAlong` for continuous movement and `ct.place.go` for basic collision avoidance.


## ct.place.moveAlong(me, direction, maxLength, [cgroup, stepSize])

Moves a copy by `stepSize` in a given `direction` untill a `maxLength` is reached or a copy is next to another colliding copy or tile. You can filter collided copies with `cgroup`, and set precision with `stepSize` (default is `1`, which means pixel-by-pixel movement). This function is especially useful for side-view games and any fast-moving copies, as it allows precise movement without clipping or passing through surfaces.


## `ct.place.moveByAxes(me, dx, dy, [cgroup, stepSize])`

Similar to ct.place.moveAlong, this method moves a copy by X and Y axes until dx and dy are reached
or a copy meets an obstacle on both axes. If an obstacle was met on one axis, a copy may continue
moving by another axis. You can filter collided copies with `cgroup`,
and set precision with `stepSize` (default is `1`, which means pixel-by-pixel movement).
This movement suits characters in top-down and side-view worlds.


## `this.moveContinuous(cgroup, [precision])`, or `this.moveBullet(cgroup, [precision])`

You can call `this.moveBullet('CollisionGroup')` at any copy to perform precise movement with collision checks. It takes gravity and `ct.delta` into account, too, and uses the `ct.place.moveAlong` method.

## `this.moveContinuousByAxes(cgroup, [precision])`, or `this.moveSmart(cgroup, [precision])`

You can call `this.moveSmart('CollisionGroup')` at any copy to perform precise movement with collision checks. It takes gravity and `ct.delta` into account, too, and uses the `ct.place.moveByAxes` method.


## `ct.place.go(me, x, y, length, [cgroup])`

Tries to reach the target with a simple obstacle avoidance algorithm.

`me` is a copy to move around, `x` and `y` is a target point; `length` is the maximum amount of pixels to move in one step. `cgroup` is an option parameter that tells to test collisions against a certain collision group.

This function doesn't require the `ct.templates.move(this);` call.

# Read this or you will create a black hole

Working with copies when `matter` is enabled is drastically different from the regular workflow.

## `vspeed`, `hspeed`, `scale`, `x`, `y` and many others are read-only

Changing any of these values will have no effect as Matter.js provides properties a bit more complex than these. Instead of that, use these methods:

* `matter.teleport(copy, x, y)` to move a copy in an arbitrary place;
* `matter.push(copy, forceX, forceY)` to apply a force so that a copy gradually accelerates where you want;
* `matter.launch(copy, hspeed, vspeed)` to set copy's velocity. Use it for actions like jumpts, or for explosion impacts.
* `matter.spin(copy, speed)` to set angular velocity.
* `matter.rotate(copy, amgle)` to set copy's orientation.
* `matter.scale(copy, x, y)` to resize a copy.

You can still read `x`, `y`, `hspeed`, `vspeed`, `speed`, `direction`, but these are to be considered read-only.

See "Manipulating copies" page for more information.

## Remove `this.move();`

`this.move();` will conflict with the physics system and cause jittering and other unpleasanties.

## Texture's axis is the center of mass

This affects how a copy rotates when in contact with other copies. The axis must be inside the collision shape.

## Collision logic is defined differently

Use special events in templates' editor under the Physics category.

If it for some reason doesn't fit you, define a rulebook that will listen to all the collisions in a room, and you will filter out these collisions according to your gameplay logic. **Never** listen to these events in events like Frame Start / Frame End, as each your copy will have to loop over all the collision events, hindering performance badly. Instead, set up a listener once in your Room Start event.

See "Listening to collision events" for more information.

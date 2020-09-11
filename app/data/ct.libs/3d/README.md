# 3D Projection

> Warning: this module is in its early stages, it is more a proof of concept than a thing to be used.
> It does render stuff, but doesn't hide items behind the camera.
> It also has a drawback: as ct.js v1.x uses AnimatedSprite for everything and the underlying projection module
> doesn't support them, all the copies are transfromed as parallelograms.

> Oh, and there is still no `ct.place3d` or such.

> And no support for tiles. Yet.

## The Axes

Initially, the camera looks along the Z axis.

* X points to the right;
* Y points downwards;
* Z points forwards.

## The Idea

Rooms are still designed in 2D space. Making a full-featured room editor would be a pain.
The module needs to transform these 2D rooms into 3D space. A number of rules are applied:

* X coordinate is remained as is.
* If the 2D room is a side-view level, Y is left as is, and Z coordinate is set by the Depth property.
* If the 2D room is a top-down level, 2D Y axis becomes Z, and Y in 3D is set by the negated Depth property.

You can set whether a room is a side-view or a top-down level in a room's settings tab.

## 3D Camera

A new object `ct.camera3d` is added. Use it to position the camera in the 3D world. It has all the properties listed below.

## 3D transforms

`this.x`, `this.y`, `this.position`, `this.angle`, and `this.scale` still exist, but they should not be used. Instead,

* Use `this.position3d` with `x`, `y` and `z` parameters to position objects.
* Use `this.euler` with `pitch`, `yaw` and `roll` parameters to rotate them.
* Use `this.scale3d` with `x`, `y` and `z` parameters to scale stuff.
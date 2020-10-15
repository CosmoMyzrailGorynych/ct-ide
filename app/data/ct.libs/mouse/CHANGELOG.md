v3.0.2

* Initialize `ct.mouse.x`, `ct.mouse.y`, and `ct.mouse.xui`, `ct.mouse.yui` with zero values.

v3.0.1

* Fix wrong values returned for `ct.mouse.x`, `ct.mouse.y`, and `ct.mouse.xui`, `ct.mouse.yui` when camera moves, but mouse doesn't.

v3.0.0

* Support the new ct.camera object
* Introduce `ct.mouse.xui`, `ct.mouse.yui`, as well as `ct.mouse.xuiprev` and `ct.mouse.yuiprev`
* Remove `ct.mouse.rx` and `ct.mouse.ry`
* Fix broken `Wheel` input method

v2.0.0

* Support the new Actions system
* remove `ct.mouse.wheel`. Use Actions -> `mouse.Wheel` instead.

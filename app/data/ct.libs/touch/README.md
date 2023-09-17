This module provides support for touch events, capable of registering multiple touches. Its API is similar to `ct.mouse`, and it provides input methods for the Actions system that supports panning, rotation and scaling.

Note that Internet Explorer, Edge and Safari do not support such events. Mobile clients usually do have touch support. See support stats at [Can I use… tables](https://caniuse.com/#feat=touch).

## Reading Touch Events

`ct.touch.events` contains all the current touches to the surface. A "touch" is an object with these properties:

* `id` is a unique number that identifies a touch;
* `x` is the horizontal position at which a touch occures;
* `y` is the vertical position at which a touch occures;
* `xui` is the horizontal position at which a touch occures in UI coordinates;
* `yui` is the vertical position at which a touch occures in UI coordinates;
* `r` is the size of a touch, in game pixels. Sometimes this variable is not available and is equal to `0`;
* `xprev` is the horizontal position at which a touch occured in the previous frame;
* `yprev` is the vertical position at which a touch occured in the previous frame.
* `xuiprev` is the horizontal position at which a touch occured in the previous frame, but in UI coordinates;
* `yuiprev` is the vertical position at which a touch occured in the previous frame, but in UI coordinates.

There are also variables `ct.touch.x`, `ct.touch.y`, `ct.touch.xui` and `ct.touch.yui`. They represent the position at which a surface was pressed lastly.

Here, the whole process of pressing a surface with one finger (or stylus, whatever), moving it, and finally releasing is called a **touch event**.

If you need to check whether there is any touch event, you could write something like this:

```js
if (ct.touch.events.length) {
    // Something presses a surface.
}
```

Or you could add an action that listens for the `touch.Any` code.

If you already know an `id` of a touch event and want to get a detailed information of it, use `ct.touch.getById(id)`. It will return either a Touch object or `false` (in case it couldn't find a touch event with this `id`).

You can generalize mouse and touch events by enabling a corresponding option at the "Settings" tab. A touch event that was triggered by mouse will have an `id` equal to `-1`.

## Checking button touches

`ct.touch.collide(copy, id)`, **which is dependant on `ct.place` catmod**, checks whether there is a collision between a copy and a touch event of a particular id. You can also omit `id` to check against all possible touch events. `ct.touch.collideUi` does the same, but in UI coordinates.

There are variants of this method that also check for mouse, `ct.touch.hovers(copy, id)` and `ct.touch.hoversUi(copy, id)`.

`ct.touch.hovers(copy)` and `ct.touch.collide(copy, id)` don't work well with just released touches (because they become inactive), and a special version of `ct.touch.hovers` exists for handling such events: `ct.touch.hovers(copy, id, true)`. You can set `id` to `false` if you don't need it. The same goes for `ct.touch.hoversUi`.

As this variant combines both hover event and release one, writing a code for a button is very simple:

```js
if (ct.touch.hovers(this, false, true)) {
    ct.rooms.switch('InGame');
}
```

## Pinching, panning and rotation

`ct.touch` exposes four input methods for handling common gestures. *They don't need to be multiplied with ct.delta as they are already the deltas for the last frame.*

### Pinching and expanding

`touch.DeltaPinch` describes the gesture of scaling with two or more fingers and how the scale of an imaginary object will change in the last frame. It will use the first two touch events in its calculations, ignoring the distance to the third and other fingers. It will return a value between `-1` and `1`, usually something near 0, and a proper way of scaling with `touch.DeltaPinch` will look like the following code in the Step event (assuming you have an action called "Scale" with `touch.DeltaPinch` registered):

```js
this.scale.x *= 1 + ct.actions.Scale.value;
this.scale.y = this.scale.x;
```

### Rotation

`touch.DeltaRotation` returns a value between `-1` and `1`, describing the rotation amount in the last frame in radians. A proper way of using this can look like this:

```js
this.angle += ct.u.radToDeg(ct.actions.Rotate.value);
```

`touch.DeltaRotation` uses the first two touch events for its calculations, ignoring third and next fingers.

### Panning

`touch.PanX` and `touch.PanY` describe the movement of fingers on screen in the last frame. They return a value between `-1` and `1`. These are relative to the view's size: for example, if a value of an action returns 0.1 for an X axis, then it means that fingers moved to `0.1 * ct.camera.width` pixels in the last frame.

## Any touch, double touch and triple touch inputs

* `Any` equals `1` if there is one or more touch events at the current time;
* `Double` touch equals `1` if there is two or more touch events at the current time;
* `Triple` touch equals `1` if there is three or more touch events at the current time. Thus triple touch also counts as a double touch.

## Getting whether touch is supported

You can read `ct.touch.enabled` to get whether touch events are supported on the current machine.

**Beware:** because of tons of hybrid devices like laptops with touchscreens and some subsequent technical limitations, `ct.touch` can only determine this **after a user touches the screen**. That means that `ct.touch.enabled` will be `false` at startup till the first interaction, even on smartphones, so please design you UI and gameplay stuff around this limitation.

## `ct.touch.permitDefault`

When you call `ct.touch.permitDefault = true`, tells `ct.touch` not to execute `e.preventDefault()`. Useful if you have HTML controls that must respond to the standard browser events or wish to show the context menu. If the setting "Do not cancel standard browser events" is checked this value will be ignored.

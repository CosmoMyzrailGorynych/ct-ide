This module provides a basic support for touch events, capable of registering multiple touches. Its API is similar to `ct.mouse`.

Note that Internet Explorer, Safari and Opera for desktop do not support such events. Mobile clients usually do have touch support.

## Reading Touch Events

There are three arrays analogous to `ct.mouse` properties: `ct.touch.pressed`, `ct.touch.down` and `ct.touch.released`. They contain all the current touches to the surface. A "touch" is an object with these properties:

* `id` is a unique number that identifies a touch;
* `x` is the horizontal position at which a touch occures;
* `y` is the vertical position at which a touch occures;
* `r` is the size of a touch, in game pixels. Sometimes this variable is not available and is equal to `0`;
* `xprev` is the horizontal position at which a touch occured in the previous frame;
* `yprev` is the vertical position at which a touch occured in the previous frame.


There are also variables `ct.touch.x` and `ct.touch.y`. They represent the position at which a surface was pressed before.

The whole process of pressing a surface with one finger (or stylus, whatever), moving it, and finally releasing it is called a **touch event** here.

If you need to check whether there was any touch event, you could write something like this:

```js
if (ct.touch.pressed.length) {
    // Something pressed a surface.
}
```

If you know an `id` of a touch event already and want to get a detailed information of it, use `ct.touch.getById(id)`. It will return either a Touch object or `false` (in case it couldn't find a touch event with this `id`).

You can generalize mouse and touch events by enabling a corresponding option at the "Settings" tab. A touch event that was triggered by mouse will have an `id` equal to `-1`.

There is also a method `ct.touch.collide(copy, id)`, **which is dependant on `ct.place` catmod**, and it checks whether there is a collision between a copy and a touch event of a particular id. You can also omit `id` to check against all possible touch events.
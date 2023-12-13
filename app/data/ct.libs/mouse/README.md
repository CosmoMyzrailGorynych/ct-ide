# Mouse Input

This module allows you to listen to mouse events, pipe these events to the Actions system, and get the location of the mouse.

## `ct.mouse.x`, `ct.mouse.y`

Current cursor position at horisontal and vertical axes, in game coordinates.

**Example: make a copy follow the cursor**

```js
this.x = ct.mouse.x;
this.y = ct.mouse.y;
```

# `ct.mouse.xui`, `ct.mouse.yui`

A cursor position relative to the current view (UI coordinates), but not relative to the room.

## `ct.mouse.pressed`

Can be either `true` or `false`. Determines whether a mouse button was pressed.

**Example: create a bullet on mouse click**

```js
if (ct.mouse.pressed) {
    ct.templates.make('Bullet',this.x,this.y);
}
```

*You should probably use [Actions](/actions.html) for this case.*

## `ct.mouse.down`

Can be either `true` or `false`. Determines whether a mouse button is held down.

## `ct.mouse.released`

Can be either `true` or `false`. Determines whether a mouse button was released.

## `ct.mouse.inside`

Can be either `true` or `false`. Determines whether there is a cursor inside the drawing canvas.

## `ct.mouse.hovers(copy)`

Returns `true` if the mouse hovers over a given `copy` in game coordinates. This does **not** take scaling and rotation into account, as well as polygonal shapes (as they are hollow).

## `ct.mouse.hoversUi(copy)`

Returns `true` if the mouse hovers over a given `copy` in UI coordinates. This does **not** take scaling and rotation into account, as well as polygonal shapes (as they are hollow).

## `ct.mouse.hide()`, `ct.mouse.show()`
Change the visibility of the mouse cursor.

## `ct.mouse.permitDefault`

When you call `ct.mouse.permitDefault = true`, tells `ct.mouse` not to execute `e.preventDefault()`. Useful if you have HTML controls that must respond to the standard browser events or wish to show the context menu.

## Codes for Actions

* `Left`;
* `Right`;
* `Middle`;
* `Wheel` (alternates between -1, 0 and 1);
* `Special1`;
* `Special2`;
* `Special3`;
* `Special4`;
* `Special5`;
* `Special6`.

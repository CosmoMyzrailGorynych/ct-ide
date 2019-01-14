# ct.rooms

This object manages your rooms and current view (camera).

## Methods and properties

### `ct.rooms.switch(newRoom: String)`

Destroys all the existing copies and moves to a new room.

> This action also resets all the drawing settings, like fill color, opacity, etc. You might need to set them again.

### `ct.rooms.clear()`

Destroys all the existing copies in the room.

### `ct.room`

The current room's object.

### `ct.rooms.templates`

Existing rooms to switch to.

### `ct.rooms.make`

A function that is called by a room to create its copies, backgrounds and tiles on load. It is mostly an internal function that is not intended for use in ct.IDE, but you still can use this method to add copies from one room to existing one. The method returns an array of all the created copies, including tile layers and backgrounds. Example:

```js
this.interfaceCopies = ct.rooms.make.apply(ct.rooms.templates.MainInterface);
```

## Managing current viewport

You can manage the viewport anytime by editing properties listed below of `ct.room` object. You can also use `this` keyword in room's events.

### `ct.room.x`, `ct.room.y`

Current horizontal and vertical shift of the view.

### `ct.room.follow`

You can set a copy to follow here, so the camera moves to it automatically.

### `ct.room.borderX`, `ct.room.borderY`

Horizontal and vertical padding from the edges of the canvas, within which the camera moves.

```js Example: following a copy
// Place this code, e.g, to your hero's `OnCreate` code
var room = ct.room;
room.follow = this;

// Follow the hero so it is always at the center of the screen
room.borderX = room.viewWidth / 2;
room.borderY = room.viewHeight / 2;
```

### `ct.room.center`

When set to `true`, the followed copy will always stay in the middle of the viewport. This parameter has a higher priority over `ct.room.borderX`, `ct.room.borderY`.

### `ct.room.followDrift`

A value between 0 and 1. Defines how fast a room reacts to a followed copy's movement. `0` means instant camera movement, higher values mean a more smooth movement.

### `ct.room.followShiftX`, `ct.room.followShiftY`

Shifts the camera so that it stays above/below/etc the followed copy.
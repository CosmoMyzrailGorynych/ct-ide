# ct.rooms

This object manages your rooms and current view (camera).

## Methods and properties

### `ct.rooms.switch(newRoom: String)`

Destroys all the existing copies and moves to a new room.

> This action also resets all the drawing settings, like fill color, opacity, etc. You might need to set them again.

### `ct.rooms.clear()`

Destroys all the existing copies in the room.

### `ct.rooms.current`

The current room's object.

### `ct.rooms.templates`

Existing rooms to switch to.

## Managing current viewport

You can manage the viewport anytime by editing properties listed below of `ct.rooms.current` object. You can also use `this` keyword in room's events.

### `ct.rooms.current.x`, `ct.rooms.current.y`

Current horizontal and vertical shift of the view.

### `ct.rooms.current.width`, `ct.rooms.current.height`

The size of current room.

### `ct.rooms.current.follow`

You can set a copy to follow here, so the camera moves to it automatically.

### `ct.rooms.current.borderx`, `ct.rooms.current.bordery`

Horizontal and vertical padding from the edges of the canvas, within which the camera moves.

```js Example: following a copy
// Place this code, e.g, to your hero's `OnCreate` code
var room = ct.rooms.current;
room.follow = this;

// Follow the hero so it is always at the center of the screen
room.borderx = room.width / 2;
room.bordery = room.height / 2;
```
# ct

`ct` represents the drawing canvas itself, extended with modules and core libraries. But let's talk a bit about how it all works.

## Event sequence

These events are always executed in the following order:

1. `oncreate` event, which is emitted when a user starts a game or navigates to a new room;
1. main game loop occurs:
    1. `onstep` event is emitted for all the copies in the room;
    1. `onstep` event for current room is called;
    1. `ondestroy` is called for all the copies marked to be `kill`ed;
    1. all the copies are reordered, the canvas is cleaned here;
    1. `ondraw` is called for all the copies;
    1. `ondraw` is called for a room;
    1. input events are cleared. Waiting for a new game loop iteration.
1. When a user moves to a new room, an `ondestroy` event is called for current (previous) room.

## Methods and properties

### `ct.newspeed(fps: Number)`

Sets new max frames per second.

### `ct.speed`

A read-only variable representing the current max FPS.

### `ct.x`

The [drawing context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) of the main canvas.

### `ct.HTMLCanvas`

The [drawing canvas](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) of the game.

### `ct.meta`

Returns the metadata that you supplied inside the ct.js editor, such as `author`, `site`, `version` and `name`.


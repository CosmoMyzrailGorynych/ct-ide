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

### `ct.pixiApp`

The [Pixi.js application](https://pixijs.download/release/docs/PIXI.Application.html) of the game.

### `ct.stage`

The game's root [stage](https://pixijs.download/release/docs/PIXI.Application.html#stage).

### `ct.meta`

Returns the metadata that you supplied inside the ct.js editor, such as `author`, `site`, `version` and `name`.

### `ct.delta`

A multiplier that shows how much a current frame differs from the target FPS. For example, it will be `2` at 30 FPS, as a target one is 60 FPS, and it will be `1` at completely smooth target framerate.

You can use this delta while designing movement, so things move uniformly at any framerate, e.g.:

```js
this.x += 10 * ct.delta;
```

But this delta is mostly useful while designing complex or logic-driven movement, as [the default movement system](ct.types.html#Moving-Copies-Around) already takes `ct.delta` into account.
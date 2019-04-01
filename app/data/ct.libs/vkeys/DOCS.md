## `ct.vkeys.button(options)`

Creates a new button, adds it to the current viewport, and returns it as a Copy.

Options include:

* `key` — the key to bind to. Should be a code from `Vk1` to `Vk12`.
* `texNormal` — the texture for a normal button state.
* `texHover` — the texture for a hover state. If not provided, it will use `texNormal` instead.
* `texActive` — the texture for a pressed state. If not provided, it will use `texNormal` instead.
* `x` and `y` — number that position a button in the room. If a function is provided, it will update each frame.
* `depth` — the depth value.

Example of a button that self-aligns in the viewport:

```js
var keyLeft = ct.vkeys.button({
    key: 'Vk1',
    texNormal: 'Key_Normal',
    texHover: 'Key_Active',
    x: () => ct.room.x + ct.viewWidth - 130,
    y: () => ct.room.y + ct.viewHeight - 130,
    depth: 14000
});
```
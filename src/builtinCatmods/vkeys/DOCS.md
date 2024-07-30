## `ct.vkeys.button(options)`

Creates a new button, adds it to the current viewport, and returns it as a Copy.

Options include:

* `key` — the key to bind to. Should be a code from `Vk1` to `Vk12`.
* `texNormal` — the texture for a normal button state.
* `texHover` — the texture for a hover state. If not provided, it will use `texNormal` instead.
* `texActive` — the texture for a pressed state. If not provided, it will use `texNormal` instead.
* `x` and `y` — number that position a button in the room. If a function is provided, it will update the position every frame.
* `depth` — the depth value.
* `alpha` - the alpha value between 0 (transparent) and 1 (opaque).
* `container` — the parent of the created button. It defaults to the current room.

Example of a button that self-aligns in the viewport:

```js
var keyLeft = ct.vkeys.button({
    key: 'Vk1',
    texNormal: 'Key_Normal',
    texHover: 'Key_Active',
    x: () => ct.camera.right - 130,
    y: () => ct.camera.bottom - 130,
    alpha: 0.7,
    depth: 14000
});
```

## `ct.vkeys.joystick(options)`

Creates a new joystick, adds it to the current viewport, and returns it as a Copy.

Options include:

* `key` — the key to bind to. Should be a code from `Vjoy1` to `Vjoy4`.
* `tex` — the texture for the trackpad. Its collision shape is used to calculate joystick's values and to position the trackball.
* `trackballTex` — the texture for the trackball.
* `x` and `y` — number that position a button in the room. If a function is provided, it will update the position every frame.
* `depth` — the depth value.
* `alpha` - the alpha value between 0 (transparent) and 1 (opaque).
* `container` — the parent of the created button. It defaults to the current room.

Example of a joystick that self-aligns in the viewport:

```js
ct.vkeys.joystick({
    tex: 'TrackPad',
    trackballTex: 'TrackBall',
    depth: 14000,
    x: () => ct.camera.left + 212,
    y: () => ct.camera.bottom - 212
});
```

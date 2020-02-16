## `ct.fittoscreen();`

Resizes the canvas immediately.

## `ct.fittoscreen.toggleFullscreen();`

Tries to toggle the fullscreen mode. Errors, if any, will be logged to console. Also, this won't work in the internal ct.js debugger. Instead, test it in your browser.

This should be called on mouse / keyboard press event, not the "release" event, or the actual transition will happen on the next mouse/keyboard interaction. For example, this will work:

```js
if (ct.mouse.pressed) {
    if (ct.u.prect(ct.mouse.x, ct.mouse.y, this)) {
        ct.fittoscreen.toggleFullscreen();
    }
}
```

## `ct.fittoscreen.getIsFullscreen();`

Returns whether the game is in the fullscreen mode (`true`) or not (`false`).

## `ct.fittoscreen.mode`

A string that indicates the current scaling approach. Can be changed at runtime to `'fastScale'`, `'expand'`, `'expandViewport'`, `'scaleFit'`, or `'scaleFill'`.
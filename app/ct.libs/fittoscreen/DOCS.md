## `ct.fittoscreen();`

Resizes the canvas immediately.

## `ct.fittoscreen.manageViewport();`

Shifts the viewport so the previous central point stays in the same place. You usually don't need to call it manually. Works only if "Manage the view" option is enabled.

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
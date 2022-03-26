# Pointer Lock mode

`ct.pointer` supports and abstracts [Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API), meaning that it can capture a pointer inside window's boundaries to allow continuous movement not bound to window's size. Think of a 3D shooter where you can move mouse horizontally in both directions infinitely, or of an RTS where mouse stays inside the window to move the camera.

This mode also works with touch and pen events, though its advantages are noticeable with mouse controls only.

The locking mode can be enabled in two ways:

* By turning on the option "Start with locking mode" inside ct.pointer's settings, or
* By calling `ct.pointer.lock()` any time during your game.

You can disable the locking mode with `ct.pointer.unlock()`.

**When the locking mode is on, the following happens:**

* System cursor becomes hidden — you will need to create a copy that follows `ct.pointer.xlocked` and `ct.pointer.ylocked` if you need one.
* Most of the properties of `ct.pointer`, like `ct.pointer.x`, `ct.pointer.xui`, remain unchanged during the pointer movement, so they should **not** be used.
* Due to that, `ct.pointer.collides`, `ct.pointer.hovers` and their UI-space versions will always return `false`. Use the `ct.place.occupiedUi` method with your custom cursor if you still need UI events, or disable the locking mode for pause menus and other interfaces.
  * For touch controls, consider not using the locking mode at all, as locking mode makes little sense with control methods already bound to screen size hardware-wise. You can use `ct.pointer.type` to differ between mouse and touch controls.

You should use the following properties during the lock mode:

* `ct.pointer.xlocked` and `ct.pointer.ylocked` to read the position of the pointer in UI space. Use `ct.u.uiToGameCoord(ct.pointer.xlocked, ct.pointer.ylocked)` to convert them in gameplay space.
  * Contrary to `ct.pointer.xui` and `ct.pointer.yui`, these two can be changed by you. For example, you can limit the area a cursor inside an RTS game can move in, or move the cursor to specific buttons automatically as an accessibility feature.
* `ct.pointer.xmovement` and `ct.pointer.ymovement` to read the movement speed of the pointer. These can be used, for example, to rotate camera in a shooter.

## Getting whether a pointer is locked

A property `ct.pointer.locked` tells whether a pointer is currently locked (`true`) or not (`false`).
This property may be `false` after calling `ct.pointer.lock()` in several cases:

* A player switched to another app;
* A player interrupted the pointer lock with the Escape key;
* Pointer Lock is not supported in player's browser. This may happen on several mobile browsers, notably with Samsung's browser, and in Internet Explorer.

In any case, `ct.pointer` will lock the pointer again once a user clicks inside the game's window.

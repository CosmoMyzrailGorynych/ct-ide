# Reading Pointer Events

`ct.pointer` tracks all the current pointers on-screen, but selects one as a **primary pointer**. For touch-only devices, it will be the first touch in a multi-touch session. For devices with mouse, it will probably be the mouse.

The properties of a primary pointer can be read with these properties (in form of `pointer.x`, `pointer.y` and so on):

* `x`, `y` — the current position of the pointer in gameplay coordinates;
* `xprev`, `yprev` — the position of the pointer in gameplay coordinates during the passed frame;
* `xui`, `yui` — the current position of the pointer in UI coordinates;
* `xuiprev`, `yuiprev` — the position of the pointer in UI coordinates during the passed frame;
* `pressure` — a float between 0 and 1 representing the pressure dealt on the pointer (think of a tablet pen where values close to 0 represent light strokes, and values close to 1 — ones made with strong pressure);
* `buttons` — a bit mask showing which buttons are pressed on the pointer's device. Use `pointer.isButtonPressed` to get whether a particular button is pressed. See more info about the `buttons` property on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events#determining_button_states).
* `tiltX`, `tiltY` — floats between -90 and 90 indicating a pen's tilt.
* `twist` — a value between 0 and 360 indicating the rotation of the pointer's device, clockwise.
* `width`, `height` — the size of the pointer in gameplay coordinates.
* `type` — usually is `'mouse'`, `'pen'`, or `'touch'`. Tells which device is used as a primary pointer.

You can also read pointers from arrays `pointer.hover`, `pointer.down`, and `pointer.released`. These have all the current pointer events in three different states. **Note that pointers that are currently pressed down also count as hovering pointers.**

Besides that, you can get pointers from methods `pointer.hovers`, `pointer.collides`, and from their UI-space versions. All these pointer objects have the same properties as `pointer`.

## Getting currently pressed buttons

Generally you will only need to use data from the Actions system, but if you need to check against a specific pointer, you can use the `pointer.isButtonPressed` method. Consider the following example:

```js
// Say, `this` is a UI button that queues units production in RTS or production facilities in a clicker game.
const pointer = pointer.collidesUi(this);
if (pointer) {
    // Was the secondary button pressed? (Right-click for mouse, additional buttons for tablet pens)
    if (pointer.isButtonPressed(pointer, 'Secondary')) {
        buyFive('Tanks');
    } else {
        buyOne('Tanks');
    }
}
```

The names of the buttons are as the following:

* `'Primary'` — left mouse button, pen contact, touch contact.
* `'Middle'` — mouse wheel.
* `'Secondary'` — right mouse button and an additional button of a pen.
* `'ExtraOne'` — extra button, usually present on the side of a mouse as a "Back" action.
* `'ExtraTwo'` — extra button, usually present on the side of a mouse as a "Forward" action.
* `'Eraser'` — the tip of a digital pen's eraser.

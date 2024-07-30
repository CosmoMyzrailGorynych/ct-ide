# Helper methods for buttons

There are four methods that can tell whether your copy is currently under a cursor (or a pen) and whether it is currently being pressed:

* `pointer.collides(copy, specificPointer, releasedOnly)`
* `pointer.collidesUi(copy, specificPointer, releasedOnly)`
* `pointer.hovers(copy, specificPointer)`
* `pointer.hoversUi(copy, specificPointer)`

`copy` is the copy you want to check against.

`specificPointer` can be set to track events for a specific pointer. If you want to check against all the pointers, set this argument to `false` or `undefined`.

`releasedOnly` is used with `collides` methods to catch released buttons instead of currently pressed ones.

A generic button code with three states plus an action would look like this:

```js
if (pointer.collides(this, undefined, true)) {
    sound.spawn('UI_Click');
    // Do something
}
if (pointer.collides(this)) {
    this.tex = 'Button_Pressed';
} else if (pointer.hovers(this)) {
    this.tex = 'Button_Hover';
} else {
    this.tex = 'Button_Normal';
}
```

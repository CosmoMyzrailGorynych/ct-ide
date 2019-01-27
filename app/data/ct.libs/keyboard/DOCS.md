## ct.keyboard.clear()

Clears all the keyboard events for this frame. This can be used e.g. to consume input.

## ct.keyboard.key

Tells the last pressed button. It can be either one of `shift`, `space`, `control`, `alt`, `escape`, `pageup`, `pagedown`, `end`, `home`, `left`, `up`, `right`, `down`, `insert`, `delete`, `backspace`, or a digit, or an uppercase english letter. If the browser supports KeyboardEvent.key (which is supported by all modern browsers), it can also be one of the [pre-defined key values](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key/Key_Values), in lower case.

## ct.keyboard.string

Contains text which was written by keyboard. Can be cleared or changed, and it automatically cleares on an 'enter' button.

## ct.keyboard.pressed

An array of currently pressed buttons. The keys are the same as in `ct.keyboard.key`. For example:

```
if (ct.keyboard.pressed['space']) {
    this.spd = 12;
    this.dir = 90;
}
```

## ct.keyboard.down

An array of currently pressed and held buttons. The keys are the same as in `ct.keyboard.key`.

## ct.keyboard.released

An array of recently released buttons. The keys are the same as in `ct.keyboard.key`.

## ct.keyboard.alt

Tells if an `alt` button is held now.

## ct.keyboard.shift

Tells if a `shift` button is held now.

## ct.keyboard.ctrl

Tells if a `ctrl` button is held now.

## ct.keyboard.e

Stores the latest [keyboard event](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

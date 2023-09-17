# Keyboard

This module registers all the keyboard events in the game and allows your code to listen button presses and handle inputed strings. This also integrates with `ct.js` action system.

Please note that button codes correspond to a physical location of a button on a QWERTY layout, meaning that if you press `q` on QWERTY, `'` on Dvorak or `a` on AZERTY, it will always be `KeyQ`. This will result into a uniform control layout on different keyboard layouts, but will return, for example, non-Dvorak codes if you try to directly write them on screen. Bear that in mind when designing tutorials, tip screens, settings panels, etc.

You can't use input codes to get typed characters. Instead, use `ct.keyboard.string`, which records all the user input, or `ct.keyboard.lastKey`.

## ct.keyboard.lastKey

Tells the last pressed button. It can be either one of command buttons like `Shift`, `Space`, `Control`, etc., or a digit, or a letter.

## ct.keyboard.lastCode

Tells the last pressed button's code.

## ct.keyboard.string

Contains text which was written by keyboard. Can be cleared or changed, and it automatically clears on an 'Enter' button.

## ct.keyboard.alt

Tells if an `alt` button is held now.

## ct.keyboard.shift

Tells if a `shift` button is held now.

## ct.keyboard.ctrl

Tells if a `ctrl` button is held now.

## ct.keyboard.clear();

Resets all the parameters listed above.

## ct.keyboard.permitDefault

When you call `ct.keyboard.permitDefault = true`, tells `ct.keyboard` not to execute `e.preventDefault()`. Useful if you have a HTML text box that must respond to the standard browser events.

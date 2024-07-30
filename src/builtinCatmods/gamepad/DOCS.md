## gamepad.on('connected', func)

Represents an event handler that will run when a gamepad is connected (when the `gamepadconnected` event fires).

## gamepad.on('disconnected', func)

Represents an event handler that will run when a gamepad is disconnected (when the `gamepaddisconnected` event fires).

## gamepad.list

An array of Gamepad objects, one for each connected gamepad (with extension to the Navigator object).

## gamepad.getButton(code)

Returns whether the button is pressed (1) or not (0). The `code` is one of:

* `'Button1'`,
* `'Button2'`,
* `'Button3'`,
* `'Button4'`,
* `'L1'`,
* `'R1'`,
* `'L2'`,
* `'R2'`,
* `'Select'`,
* `'Start'`,
* `'L3'`,
* `'R3'`,
* `'Up'`,
* `'Down'`,
* `'Left'`,
* `'Right'`,
* `'Any'`.

## gamepad.getAxis(code)

Returns the position of a joystick, in the range from -1 to 1m, with 0 being its resting position. The `code` is one of:

* `'LStickX'`,
* `'LStickY'`,
* `'RStickX'`,
* `'RStickY'`.

## gamepad.lastButton

The last button pressed, useful for rebinding keys by a player if used in conjunction with the `Any` input.

NB: Implemention of the Gamepad_API.
Quotes from: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API

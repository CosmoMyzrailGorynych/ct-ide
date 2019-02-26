This module registers all the keyboard events in the game and allows your code to listen button presses and handle inputed strings. This also integrates with `ct.js` action system.

Please note that button codes correspond to a physical location of a button on a QWERTY layout, meaning that if you press `q` on QWERTY, `'` on Dvorak or `a` on AZERTY, it will always be `KeyQ`. This will result into a uniform control layout on different keyboard layouts, but will return, for example, non-Dvorak codes if you try to directly write them on screen. Bear that in mind when designing tutorials, tip screens, settings panels, etc.

You can't use input codes to get typed characters. Instead, use `ct.keyboard.string`, which records all the user input, or `ct.keyboard.lastKey`.
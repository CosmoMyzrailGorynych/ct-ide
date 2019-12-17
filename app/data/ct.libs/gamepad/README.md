This module registers all the gamepad events in the game and allows your code to listen them. This also integrates with `ct.js` action system.

Mapping used:
https://w3c.github.io/gamepad/#remapping

**Note:** all controllers have their mappings, and operating systems handle them differently as well. This results in inconsistent inputs while working with various controllers, and one controller may produce different results if connected to a PC with another OS. Because of this, it is important to provide players with configurable controls, so they can mitigate the inconsistencies and tune the controls to their liking.

See [documentation on ct.inputs](https://docs.ctjs.rocks/ct.inputs.html) on how to implement input remapping inside your game.

*Never remap controllers by default* if it doesn't work with your controller, as the current implementation *is* the canonical one. It is 99% more likely that the problem is not in ct.js or in this module, but in your controller, browser, controller's driver, or even OS as is.
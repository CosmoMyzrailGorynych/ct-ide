# Fit to Screen

This module allows you to automagically fit your game to screen, either by resizing the whole drawing canvas or by simple scaling. See the settings for this module for different scaling methods.

It also gives you functions to enter a real fullscreen mode programmatically (see the "Reference" tab).

## `ct.fittoscreen();`

Resizes the canvas immediately. You usually don't need to call this method as it gets called automatically.

## `ct.fittoscreen.toggleFullscreen();`

**This method works only in pointer events, like Click, Pointer down and other.**

Tries to toggle the fullscreen mode. The success of it depends on player's browser settings or the environment your project runs in. Errors, if any, will be logged to console.

## `ct.fittoscreen.getIsFullscreen();`

Returns whether the game is in the fullscreen mode (`true`) or not (`false`).

## `ct.fittoscreen.mode`

A string that indicates the current scaling approach. Can be changed at runtime to `'fastScale'`, `'expand'`, `'expandViewport'`, `'scaleFit'`, or `'scaleFill'`.

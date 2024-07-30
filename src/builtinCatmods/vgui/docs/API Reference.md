# API Reference

This API reference is taken from the `types.d.ts` file that comes with the catmod.

# ct.vgui

## `ct.vgui.TextBox()`
* Creates a text box that accepts keyboard input
* @param {object} - template Pass "this" into this argument so that collision boundaries can be obtained
* @param {TextBoxProps} props - Extra configuration goes here
* @returns {TextBox} 

# TextBoxProps
## `trueText`
* text that is stored on the textbox. not necessarily what is rendered. use this for inserting default text

## `width`
* How wide the text input should be. defaults to 256

## `height`
* How tall the text input should be. defaults to 48

## `offsetX`
* offset the location of text horizontally in pixels. defaults to 8

## `offsetY`
* offset the location of text vertically in pixels. defaults to 2

## `maxLength`
* maximum number of characters to store in the input. defaults to 32

## `lengthThresholdOffset`
* how much sooner should text be cutoff when input reached end of textbox in pixels. defaults to 48

## `font`
* a ct.styles font

## `hideText`
* if true, replaces characters with '•'. good for password fields. defaults to false


# TextBox
## `useDefaultBoxGraphics()`
* for when you're too lazy to make your own textbox graphics. only invoke once

## `useDefaultCursorGraphics()`
* for when you're too lazy to make your own textbox graphics. only invoke once

## `reload()`
* recalculates the textbox dimensions, style, and text positioning

## `step()`
* call this method on the step event of your template. updates focus, text and cursor

## `isFocused`
* whether the textbox will accept input. automatically handled by the library depending where the user clicks

## `cursorPosition`
* which character in the string to add/remove text to. automatically handle by the library

## `container`
* top level graphics for the textbox, text and cursor

## `textGraphics`
* textbox graphics

## `textInput`
* text input font. this is what the user sees

## `hiddenInput`
* hidden text font that renders only up to the cursor position. this is so that the cursor renders at the right position

## `cursor`
* cursor graphics

# TextBox

Make some text boxes! This text box will only have its text modified when the user clicks on the text box, and it will disable editing the text box when the user clicks away from it. It handles keyboard input for you, and even supports backspace and delete inputs. You can also use the arrow keys to seek the cursor left and right in the text! It also supports hidden text and text cutoff when the text goes outside the boundaries of the text box. It's smart!

Simple example (Add in the Creation event):
```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
})
```

In the Frame start event, add this so that the TextBox can update its state on every frame of the game:
```js
this.textbox.step()
```

Example using all "public" properties
```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
    offsetX: 20,
    offsetY: -5,
    maxLength: 32,
    lengthThresholdOffset: -5,
    font: ct.styles.get('Testing'),
    hideText: false,
})
```

### Warning

You should make a Template specifically for drawing a single textbox. This is because the PIXI Container that renders the textbox requires a parent to attach a collision shape for managing the focus property. If you try and instantiate multiple TextBoxes in a single Template the focusing will break. Just remember: create a Template that holds a TextBox and edit properties when needed, and don't instantiate multiple TextBoxes in one Template!

### Features

You can choose to let the library make default graphics for you. This uses PIXI.Graphics to render some primitives.
Put this in the On Create event:

```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
    font: ct.styles.get('Testing')
})

this.textbox.useDefaultBoxGraphics() // creates a default text box surrounding the text
this.textbox.useDefaultCursorGraphics() // creates a default cursor graphic for seeking through text
this.textbox.reload() // re-render the graphics so they show up
```

Or, you can use your own graphics! The TextBox class object has exposed properties you can edit to use the full power of PIXI.Graphics.

```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: "Placeholder",
    width: 350,
    height: 200,
    font: ct.styles.get('Testing')
})

// change the text box
let textGraphics = this.textbox.textGraphics
textGraphics.lineStyle(5, 0xFFAAFF, 1)
textGraphics.beginFill(0xAAFFAA, 1)
textGraphics.drawRoundedRect(0, 0, 350, 200, 0)
textGraphics.endFill()

// change the font dynamically
this.textbox.props.font = ct.styles.get('Testing')
// changing the font requires the use of reload()
this.textbox.reload()
```

If you want to change the cursor, that requires a redraw on every frame so code should be added in the Frame start event. Be aware that you will also need to handle the case of whether the text box is in focus by the user.
```js
this.textbox.step()
// change the cursor
this.textbox.cursor.clear()
if (this.textbox.isFocused) { // check if the user is focused on this text box
    this.textbox.cursor.beginFill(0xFF3366)
    this.textbox.cursor.drawRect(this.textbox.hiddenInput.width + 5, 2, 2, this.textbox.hiddenInput.height)
    this.textbox.cursor.endFill()
}
```

Don't want to use vector graphics at all for the text box? Not a problem. Simply assign a sprite to the template through the ct.js UI. Don't use `useDefaultBoxGraphics()` because it will draw over your sprite!

### Tricks

Let's say you created your TextBox template and now want to retrieve the textbox input. This is an example you can use if you attached your TextBox to the copy via `this.textbox` and you only have one TextBox copy in the room:

```js
const onetextbox = ct.templates.list['TextBox'][0]
const textValue = onetextbox.textbox.props.trueText
```

What if you made a template to create multiple TextBoxes and wanted to configure each of them? Pass in some arguments using the `ct.templates.copy` method like this:

```js
this.text1 = ct.templates.copy('TextBox', this.x, this.y, {
    trueText: "Hi"
})
this.text2 = ct.templates.copy('TextBox', this.x, this.y + 200, {
    trueText: "Hello"
})
```

Then in your TextBox template's Creation event you can pull that information in:

```js
this.textbox = new ct.vgui.TextBox(this, {
    trueText: this.trueText ? this.trueText : "",
    width: 350,
    height: 200
})
```


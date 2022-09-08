(function () {
    class TextBox {
        constructor (template, props = {}) {
            this.props = {
                trueText: "", // text that is stored on the textbox. not necessarily what is rendered
                width: 256,
                height: 48,
                offsetX: 8, // offset the location of text in x pixels
                offsetY: 2, // offset the location of text in y pixels
                maxLength: 32, // maximum number of characters to store in the input
                lengthThresholdOffset: 48, // how much sooner should text be cutoff when input reached end of textbox in pixels
                font: undefined, // ct.styles font
                hideText: false // if true, replaces characters with '•'. good for password fields.
            }
            // override defaults
            Object.assign(this.props, props)

            this.displayText = ""; // the text that is shown to the user. this library handles this property
            this.maxCharsInBox = 0 // figures out the number of characters that can be rendered within the textbox at runtime
            this.isFocused = false // whether the user wants to type with the textbox
            this.parent = template // for getting the collision boundaries of the textbox
            this.cursorPosition = this.props.trueText.length // which character in the string to add/remove text to. start the cursor at the end of the string
            this.useDefaultCursor = false // whether to let this class render its own cursor

            this.container = new PIXI.Container() // graphics for the textbox, text and cursor

            // frame graphics
            this.textGraphics = new PIXI.Graphics()
            this.container.addChild(this.textGraphics)

            // text input font. this is what the user sees
            this.textInput = new PIXI.Text(this.displayText, this.props.font)
            this.textInput.x = this.props.offsetX
            this.textInput.y = (this.props.height / 2) - (this.textInput.height / 2) + this.props.offsetY
            this.textInput.alpha = 1
            this.container.addChild(this.textInput)

            // hidden text that renders only up to the cursor position. this is so that the cursor renders at the right position
            this.hiddenInput = new PIXI.Text(this.displayText, this.props.font)
            this.hiddenInput.x = this.props.offsetX
            this.hiddenInput.y = (this.props.height / 2) - (this.hiddenInput.height / 2) + this.props.offsetY
            this.hiddenInput.alpha = 0
            this.container.addChild(this.hiddenInput)

            this.parent.shape = { // create a collision mask to be able to handle the textbox getting into focus 
                type: 'rect',
                top: 0,
                left: 0,
                bottom: this.props.height,
                right: this.props.width
            }

            // cursor graphics
            this.cursor = new PIXI.Graphics()
            this.cursor.y = (this.props.height / 2) - (this.hiddenInput.height / 2) + this.props.offsetY
            this.container.addChild(this.cursor)

            this.parent.addChild(this.container)

            // perform a single step even if unfocused, so at least the textbox/text is rendered
            this.isFocused = true
            this.step()
            this.isFocused = false
        }

        // for when you're too lazy to make your own textbox graphics. only invoke once
        useDefaultBoxGraphics () {
            // text box graphics
            this.textGraphics.lineStyle(2, 0x000000, 1)
            this.textGraphics.beginFill(0xFFFFFF, 1)
            this.textGraphics.drawRoundedRect(0, 0, this.props.width, this.props.height, 12)
            this.textGraphics.endFill()
        }

        // for when you're too lazy to make your own textbox graphics. only invoke once
        useDefaultCursorGraphics () {
            this.useDefaultCursor = true
        }

        // recalculates the textbox dimensions, style, and text positioning
        reload () {
            this.textInput.style = this.props.font
            this.textInput.x = this.props.offsetX
            this.textInput.y = (this.props.height / 2) - (this.textInput.height / 2) + this.props.offsetY

            this.hiddenInput.style = this.props.font
            this.hiddenInput.x = this.props.offsetX
            this.hiddenInput.y = (this.props.height / 2) - (this.hiddenInput.height / 2) + this.props.offsetY

            this.parent.shape = {
                type: 'rect',
                top: 0,
                left: 0,
                bottom: this.props.height,
                right: this.props.width
            }
        }

        step () {
            // mouse focus detection
            this.updateFocus()
            if (!this.isFocused) {
                this.clearCursor()
                return
            }

            this.updateTrueTextAndCursor()

            // check if the text is going outside the box. truncate text if so
            this.displayText = this.props.trueText

            if (this.props.hideText) { // mask the characters if the user wants the text to be hidden
                this.displayText = this.displayText.replace(/./g, "•")
            }

            this.truncateText()

            this.clearCursor()
            this.renderCursor()
        }

        // logic to check if the user clicked on the textbox for focus. requires ct.pointer catmod
        updateFocus () {
            if (!this.prevMouseDown) {
                if (ct.pointer.collides(this.parent)) {
                    this.isFocused = true
                } else if (ct.pointer.buttons & 1) {
                    this.isFocused = false
                }
            }
            this.prevMouseDown = ct.pointer.buttons & 1
        }

        // listen to key inputs, then update true text and cursor position
        updateTrueTextAndCursor () {
            // cursor update logic
            if (ct.keyboard.lastKey === 'ArrowLeft') {
                this.cursorPosition -= 1 // move cursor left
                this.cursorPosition = Math.max(0, this.cursorPosition)
            }
            if (ct.keyboard.lastKey === 'ArrowRight') {
                this.cursorPosition += 1 // move cursor right
                this.cursorPosition = Math.min(this.props.trueText.length, this.cursorPosition)
            }

            if (this.props.trueText.length < this.props.maxLength && ct.keyboard.string !== '') { // add a character to the position of the cursor
                this.props.trueText = `${this.props.trueText.slice(0, this.cursorPosition)}${ct.keyboard.string}${this.props.trueText.slice(this.cursorPosition)}`
                this.cursorPosition += ct.keyboard.string.length
            }

            if (ct.keyboard.lastKey === 'Backspace') { // remove a character to the left of the cursor
                const lowestCursorPos = Math.max(0, this.cursorPosition - 1)
                this.props.trueText = `${this.props.trueText.slice(0, lowestCursorPos)}${this.props.trueText.slice(this.cursorPosition)}`
                this.cursorPosition -= 1
            }

            if (ct.keyboard.lastKey === 'Delete') { // remove a character to the right of the cursor
                this.props.trueText = `${this.props.trueText.slice(0, this.cursorPosition)}${this.props.trueText.slice(this.cursorPosition + 1)}`
            }

            // perform bounds on cursor position. Not less than 0, not greater than the text length
            this.cursorPosition = Math.max(0, this.cursorPosition)
            this.cursorPosition = Math.min(this.props.trueText.length, this.cursorPosition)
        }

        // update the display text to render it nicely in the textbox
        truncateText () {
            // detect if the text is near the end of the textbox, and truncate further to keep all text within the box
            if (this.textInput.width + this.props.lengthThresholdOffset > this.props.width) {
                if (this.props.trueText.length > this.maxCharsInBox) {
                    this.displayText = this.displayText.slice(0, this.maxCharsInBox) + ".."
                }
            } else {
                this.displayText = this.props.trueText
                this.maxCharsInBox = this.textInput.text.length
            }

            // render the truncated text
            this.textInput.text = this.displayText
            // cut off the text up to the cursor position so it's known where to render the cursor, or to the end of the text box plus one of the periods
            this.hiddenInput.text = this.displayText.slice(0, Math.min(this.maxCharsInBox + 1, this.cursorPosition))
        }

        // draw the cursor if the user requested this class to do it for them
        renderCursor () {
            if (!this.useDefaultCursor) {
                return;
            }
            this.cursor.beginFill(0x00000)
            // draw it with an x offset only if the cursor is not at the complete left
            const xOffset = this.cursorPosition === 0 ? this.hiddenInput.x : this.hiddenInput.width + 6
            this.cursor.drawRect(xOffset, 2, 2, this.hiddenInput.height);
            this.cursor.endFill();
        }

        // self explanatory
        clearCursor () {
            this.cursor.clear()
        }
    }

    ct.vgui = {
        TextBox: TextBox,
    }
})();

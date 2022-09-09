declare namespace ct {
    /**
     * Vector Graphics User Interface library
     */
    namespace vgui {

        class TextBox {

            /**
             * Creates a text box that accepts keyboard input
             * @param {object} template Pass "this" into this argument so that collision boundaries can be obtained
             * @param {TextBoxProps} props Extra configuration goes here
             */
            constructor(template: object, props: TextBoxProps);

            /**
             * for when you're too lazy to make your own textbox graphics. only invoke once
             */
            useDefaultBoxGraphics(): void;
            /**
             * for when you're too lazy to make your own textbox graphics. only invoke once
             */
            useDefaultCursorGraphics(): void;
            /**
             * recalculates the textbox dimensions, style, and text positioning
             */
            reload(): void;
            /**
             * call this method on the step event of your template. updates focus, text and cursor
             */
            step(): void;
            /** whether the textbox will accept input. automatically handled by the library depending where the user clicks */
            isFocused: boolean;
            /** which character in the string to add/remove text to. automatically handle by the library */
            cursorPosition: number;
            /** top level graphics for the textbox, text and cursor */
            container: PIXI.Container;
            /** textbox graphics */
            textGraphics: PIXI.Graphics;
            /** text input font. this is what the user sees */
            textInput: PIXI.Text;
            /** hidden text font that renders only up to the cursor position. this is so that the cursor renders at the right position */
            hiddenInput: PIXI.Text;
            /** cursor graphics */
            cursor: PIXI.Graphics;
        }

    }
}

interface TextBoxProps {
    /** text that is stored on the textbox. not necessarily what is rendered. use this for inserting default text */
    trueText?: string;
    /** How wide the text input should be. defaults to 256 */
    width?: number;
    /** How tall the text input should be. defaults to 48 */
    height?: number;
    /** offset the location of text horizontally in pixels. defaults to 8 */
    offsetX?: number;
    /** offset the location of text vertically in pixels. defaults to 2 */
    offsetY?: number;
    /** maximum number of characters to store in the input. defaults to 32 */
    maxLength?: number;
    /** how much sooner should text be cutoff when input reached end of textbox in pixels. defaults to 48 */
    lengthThresholdOffset?: number;
    /** a ct.styles font */
    font?: object;
    /** if true, replaces characters with '•'. good for password fields. defaults to false */
    hideText?: boolean;
}
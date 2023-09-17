interface VkeysReturnNumber {
    (): number;
}

type VKeysButtonCode = 'Vk1' | 'Vk2' | 'Vk3' | 'Vk4' | 'Vk5' | 'Vk6' | 'Vk7' | 'Vk8' | 'Vk9' | 'Vk10' | 'Vk11' | 'Vk12';
interface IVkeysButtonOptions {
    /** The key to bind to. Should be a code from `Vk1` to `Vk12`. */
    key: VKeysButtonCode;
    /** The texture for a normal button state. */
    texNormal: string | -1;
    /** The texture for a hover state. If not provided, it will use `texNormal` instead. */
    texHover?: string | -1;
    /** The texture for a pressed state. If not provided, it will use `texNormal` instead. */
    texActive?: string | -1;
    /** The alpha of the button. Defaults to 1 (fully opaque). */
    alpha?: number;
    /** A number that position a button in the room. If a function is provided, it will update the position every frame. */
    x: number | VkeysReturnNumber;
    /** A number that position a button in the room. If a function is provided, it will update the position every frame. */
    y: number | VkeysReturnNumber;
    /** The depth value. */
    depth: number;
    /** The container to attach the button to. Defaults to the current room. */
    container?: PIXI.DisplayObject;
}
interface VkeysButton extends Copy {
    opts: IVkeysButtonOptions;
}

type VKeysJoystickCode = 'Vjoy1' | 'Vjoy2' | 'Vjoy3' | 'Vjoy4';
interface IVkeysJoystickOptions {
    /** The key to bind to. Should be a code from `Vjoy1` to `Vjoy4`. */
    key: VKeysJoystickCode;
    /** The texture for the trackpad. Its collision shape is used to calculate joystick's values and to position the trackball. */
    tex: string | -1;
    /** The alpha of the button. Defaults to 1 (fully opaque). */
    alpha?: number;
    /** The texture for the trackball. */
    trackballTex: string | -1;
    /** A number that position a button in the room. If a function is provided, it will update the position every frame. */
    x: number | VkeysReturnNumber;
    /** A number  that position a button in the room. If a function is provided, it will update the position every frame. */
    y: number | VkeysReturnNumber;
    /** The depth value. */
    depth: number;
    /** The container to attach the joystick to. Defaults to the current room. */
    container?: PIXI.DisplayObject;
}
interface VkeysJoystick extends Copy {
    opts: IVkeysJoystickOptions;
}

declare namespace ct {
    /** Alows to create on-screen controls, such as buttons and joysticks. */
    namespace vkeys {
        /**
         * Creates a new button, adds it to the current viewport, and returns it as a Copy.
         *
         * Example of a button that self-aligns in the viewport:
         *
         * ```js
         * var keyLeft = ct.vkeys.button({
         *     key: 'Vk1',
         *     texNormal: 'Key_Normal',
         *     texHover: 'Key_Active',
         *     x: () => ct.room.x + ct.camera.width - 130,
         *     y: () => ct.room.y + ct.camera.height - 130,
         *     depth: 14000
         * });
         * ```
         */
        function button(options: IVkeysButtonOptions): VkeysButton;
        function joystick(options: IVkeysJoystickOptions): VkeysJoystick;
    }
}
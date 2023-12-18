/**
 * Use gamepads in the actions system
 */
declare namespace gamepad {
    /**
     * Represents an event handler that runs when a gamepad is connected or disconnected
     * @param event - Run when connected or disconnected
     * @param eventHandler - Function to run
     */
    function on(event: 'connected' | 'disconnected', eventHandler:Function): void;
    /**
     * An array of Gamepad objects, one for each connected gamepad
     */
    var list: Array<any>;
    /**
     * Returns whether the button is pressed (1) or not (0)
     * @param code - Button code, can be "Button1", "Button2", "Button3", "Button4", "L1", "R1", "L2", "R2", "Select", "Start", "L3", "R3", "Up", "Down", "Left", "Right", or "Any"
     */
    function getButton(
      code:
        'Button1' |
        'Button2' |
        'Button3' |
        'Button4' |
        'L1' |
        'R1' |
        'L2' |
        'R2' |
        'Select' |
        'Start' |
        'L3' |
        'R3' |
        'Up' |
        'Down' |
        'Left' |
        'Right' |
        'Any'
    ): number;
    /**
     * Gets the position of a joystick, from -1 to 1, with 0 being its resting position
     * @param code - Joystick axis, one of "LStickX", "LStickY", "RStickX", or "RStickY"
     */
    function getAxis(
      code:
        'LStickX' |
        'LStickY' |
        'RStickX' |
        'RStickY'
    ): number;
    /**
     * The last button pressed
     */
    var lastButton:
        'Button1' |
        'Button2' |
        'Button3' |
        'Button4' |
        'L1' |
        'R1' |
        'L2' |
        'R2' |
        'Select' |
        'Start' |
        'L3' |
        'R3' |
        'Up' |
        'Down' |
        'Left' |
        'Right' |
        'Any';
}

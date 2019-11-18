declare namespace ct {
    /** A module that tells mouse coordinates and integrates with ct.js' Actions system */
    namespace mouse {
        /** Current cursor position at horisontal and vertical axes, in world coordinates */
        var x: number;
        /** Current cursor position at horisontal and vertical axes, in world coordinates */
        var y: number;
        /** A cursor position relative to the current view (or camera), but not relative to the room. */
        var rx: number;
        /** A cursor position relative to the current view (or camera), but not relative to the room. */
        var ry: number;
        /** Can be either `true` or `false`. Determines whether a mouse button was pressed. */
        var pressed: boolean;
        /** Can be either `true` or `false`. Determines whether a mouse button is held down. */
        var down: boolean;
        /** Can be either `true` or `false`. Determines whether a mouse button was released. */
        var released: boolean;
        /** Can be either `true` or `false`. Determines whether there is a cursor inside the drawing canvas. */
        var inside: boolean;
        /** Returns `true` if the mouse hovers over a given `copy`. This does **not** take scaling and rotation into account, as well as polygonal shapes (as they are hollow). */
        function hovers(copy: Copy): boolean;
    }
}
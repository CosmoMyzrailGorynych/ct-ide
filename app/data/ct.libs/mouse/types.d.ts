declare namespace ct {
    /** A module that tells mouse coordinates and integrates with ct.js' Actions system */
    namespace mouse {
        /** Current cursor position at horisontal and vertical axes, in game coordinates */
        var x: number;
        /** Current cursor position at horisontal and vertical axes, in game coordinates */
        var y: number;
        /** A cursor position in UI coordinates. */
        var xui: number;
        /** A cursor position in UI coordinates. */
        var yui: number;
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
        /** Returns `true` if the mouse hovers over a given `copy`. This does **not** take scaling and rotation into account, as well as polygonal shapes (as they are hollow). */
        function hoversUi(copy: Copy): boolean;
    }
}
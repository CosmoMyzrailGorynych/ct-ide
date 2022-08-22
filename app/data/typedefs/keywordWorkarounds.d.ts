declare namespace ct {
    namespace rooms {
        /**
         * Switches to a room with a given name.
         * Note that this does not stop your code execution and everything past this line will still be evaluated.
         * If you want to stop code execution, place `return;` right after the method call.
         * @param {string} name The name of the new room.
         */
        var _switch: function(string): void;
        export {_switch as switch};
    }
    namespace styles {
        /**
         * Creates a new style with a given name. Options are the same as if you were creating a TextStyle.
         * @param {string} name The name of a new style
         * @param {(any|PIXI.TextStyle)} data Options that configure the look of the style.
         */
        var _new: function(string, object): void;
        export {_new as new};
    }
}

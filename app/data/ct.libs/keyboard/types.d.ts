declare namespace ct {
    /**
     * This module provides keyboard inputs for ct.js' Actions system. It also has a number of its own
     * handy methods and variables.
     */
    namespace keyboard {
        /**
         * Tells the last pressed button. It can be either one of command buttons like `Shift`,
         * `Space`, `Control`, etc., or a digit, or a letter.
         */
        var lastKey: string;

        /**
         * Tells the last pressed button's code. This can be something like:
         */
        var lastCode: number;

        /**
         * Contains text which was written by keyboard. Can be cleared or changed,
         * and it automatically clears on an 'Enter' button.
         */
        var string: string;

        /**
         * Tells if an `alt` button is held now.
         */
        var alt: boolean;

        /**
         * Tells if a `shift` button is held now.
         */
        var shift: boolean;

        /**
         * Tells if a `ctrl` button is held now.
         */
        var ctrl: boolean;

        /**
         * Temporarily suspend e.preventDefault() calls. For example, to allow for a HTML text
         * box to be used.
         */
        var permitDefault: boolean;

        /**
         * Resets all the `ct.keyboard` parameters.
         */
        function clear(): void;
    }
}
declare namespace ct {
    /**
     * Resizes the canvas immediately.
     */
    function fittoscreen(): void;

    /**
     * This module allows you to automagically fit your game to screen, either by resizing the whole drawing canvas or by simple scaling.
     *
     * It also gives you functions to enter a real fullscreen mode programmatically.
     */
    namespace fittoscreen {
        /**
         * Shifts the viewport so the previous central point stays in the same place.
         * You usually don't need to call it manually. Works only if "Manage the view" option is enabled.
         */
        function manageViewport(): void;

        /**
         * Tries to toggle the fullscreen mode. Errors, if any, will be logged to console. Also, this won't work in the internal ct.js debugger. Instead, test it in your browser.
         *
         * This should be called on mouse / keyboard press event, not the "release" event, or the actual transition will happen on the next mouse/keyboard interaction. For example, this will work:
         *
         * ```js
         * if (ct.mouse.pressed) {
         *   if (ct.u.prect(ct.mouse.x, ct.mouse.y, this)) {
         *     ct.fittoscreen.toggleFullscreen();
         *   }
         * }
         * ```
         */
        function toggleFullscreen(): void;

        /**
         * Returns whether the game is in the fullscreen mode (`true`) or not (`false`).
         */
        function getIsFullscreen(): boolean;

        /**
         * A string that indicates the current scaling approach (can be changed).
         */
        var mode: 'fastScale' | 'expand' | 'expandViewport' | 'scaleFit' | 'scaleFill';
    }
}

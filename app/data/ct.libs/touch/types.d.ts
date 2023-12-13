interface ITouch {
    /** A unique number that identifies a touch; */
    id: number;

    /** The horizontal position at which a touch occures. */
    x: number;

    /** The vertical position at which a touch occures. */
    y: number;

    /** The horizontal position at which a touch occures, in UI space.*/
    xui: number;

    /** The vertical position at which a touch occures, in UI space.*/
    yui: number;

    /** The size of a touch, in game pixels. Sometimes this variable is not available and is equal to `0`. */
    r: number;

    /** The horizontal position at which a touch occured in the previous frame. */
    xprev: number;

    /** The vertical position at which a touch occured in the previous frame. */
    yprev: number;

    /** The horizontal position at which a touch occured in the previous frame, in UI coordinates. */
    xuiprev: number;

    /** The vertical position at which a touch occured in the previous frame, in UI coordinates. */
    yuiprev: number;
}

declare namespace ct {
    /**
     * This module provides support for touch events, capable of registering multiple touches.
     * Its API is similar to `ct.mouse`, and it provides input methods
     * for the Actions system that supports panning, rotation and scaling.
     */
    namespace touch {
        /** The position at which a surface was pressed lastly. */
        var x: number;

        /** The position at which a surface was pressed lastly. */
        var y: number;

        /** The position at which a surface was pressed lastly, but in UI coordinates. */
        var xui: number;

        /** The position at which a surface was pressed lastly, but in UI coordinates. */
        var yui: number;

        /** The previous position at which a surface was pressed lastly. */
        var xprev: number;

        /** The previous position at which a surface was pressed lastly. */
        var yprev: number;

        /** The previous position at which a surface was pressed lastly, but in UI coordinates. */
        var xuiprev: number;

        /** The previous position at which a surface was pressed lastly, but in UI coordinates. */
        var yuiprev: number;

        var events: ITouch[];

        /**
         * Temporarily suspend e.preventDefault() calls. For example, to allow for a HTML text
         * box to be used.
         */
        var permitDefault: boolean;

        function getById(id: number): ITouch | false;

        /**
         * Checks whether there is a collision between a copy and a touch event
         * of a particular id. You can also omit `id` to check
         * against all possible touch events.
         *
         * This is a version that checks for collisions in game coordinates.
         *
         * If `includeReleased` is set to `true`, will check against
         * not active but just released touch events.
         */
        function collide(copy: Copy, id?: number, includeReleased?: boolean): boolean;

        /**
         * Checks whether there is a collision between a copy and a touch event
         * of a particular id. You can also omit `id` to check
         * against all possible touch events.
         *
         * This is a version that checks for collisions in UI space.
         *
         * If `includeReleased` is set to `true`, will check against
         * not active but just released touch events.
         */
        function collideUi(copy: Copy, id?: number, includeReleased?: boolean): boolean;

        /**
         * Checks whether there is a collision between a copy and a touch event
         * of a particular id or a mouse cursor. You can also omit `id` to check
         * against all possible touch events.
         *
         * This is a version that checks for collisions in game coordinates.
         *
         * If `includeReleased` is set to `true`, will check against
         * not active but just released touch events.
         */
        function hovers(copy: Copy, id?: number, includeReleased?: boolean): boolean;

        /**
         * Checks whether there is a collision between a copy and a touch event
         * of a particular id or a mouse cursor. You can also omit `id` to check
         * against all possible touch events.
         *
         * This is a version that checks for collisions in UI space.
         *
         * If `includeReleased` is set to `true`, will check against
         * not active but just released touch events.
         */
        function hoversUi(copy: Copy, id?: number, includeReleased?: boolean): boolean;

        /**
         * Returns whether touch events are supported on the current machine.
         *
         * **Beware:** because of tons of hybrid devices like laptops with touchscreens
         * and some subsequent technical limitations, `ct.touch` can only determine
         * this **after a user touches the screen**. That means that `ct.touch.enabled`
         * will be `false` at startup till the first interaction, even on smartphones,
         * so please design you UI and gameplay stuff around this limitation.
         */
        var enabled: boolean;
    }
}
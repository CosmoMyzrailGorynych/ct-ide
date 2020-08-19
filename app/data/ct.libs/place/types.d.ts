declare namespace ct {
    /**
     * A module for handling collisions.
     */
    namespace place {

        /**
         * Checks a collision between two copies
         * @param {Copy} c1 The first copy to check collision with
         * @param {Copy} c2 The second copy to check collision against
         *
         * @returns {boolean} `true` if there was a collision, `false` otherwise
         */
        function collide(c1: Copy, c2: Copy): boolean;

        /**
         * Checks whether there is a free place at (x;y) for a copy `me`.
         * `ctype` is optional and filters by using collision groups.
         * If `x` and `y` are skipped, the current coordinates of `me` will be used.
         *
         * Returns `true` if a place is free, and `false` otherwise.
         *
         * @param {Copy} me The object to check collisions on
         * @param {number} x The x coordinate to check, as if `me` was placed there.
         * @param {number} y The y coordinate to check, as if `me` was placed there.
         * @param {String} [ctype] The collision group to check against
         */
        function free(me: Copy, x: number, y: number, ctype?: string): boolean;

        /**
         * Checks whether a copy `me` is in a free spot.
         * `ctype` is optional and filters by using collision groups.
         *
         * Returns `true` if a place is free, and `false` otherwise.
         *
         * @param {Copy} me The object to check collisions on
         * @param {String} [ctype] The collision group to check against
         */
        function free(me: Copy, ctype?: string): boolean;

        function occupied(me: Copy, x: number, y: number, ctype?: string, multiple: true): Copy[];
        /**
         * Determines if the place in (x,y) is occupied.
         * Optionally can take 'ctype' as a filter for obstacles' collision group (not shape type)
         *
         * @param {Copy} me The object to check collisions on
         * @param {number} x The x coordinate to check, as if `me` was placed there
         * @param {number} y The y coordinate to check, as if `me` was placed there
         * @param {String} [ctype] The collision group to check against
         * @param {Boolean} [multiple=false] If it is true, the function will return an array of all the collided objects.
         *                                   If it is false (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function occupied(me: Copy, x: number, y: number, ctype?: string, multiple?: false|void): Copy | false;

        function occupied(me: Copy, ctype?: string, multiple: true): Copy[];
        /**
         * Determines if the copy is in an occupied place.
         * Optionally can take 'ctype' as a filter for obstacles' collision group (not shape type)
         *
         * @param {Copy} me The object to check collisions on
         * @param {String} [ctype] The collision group to check against
         * @param {Boolean} [multiple=false] If it is true, the function will return an array of all the collided objects.
         *                                   If it is false (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function occupied(me: Copy, ctype?: string, multiple?: false|void): Copy | false;

        function meet(me: Copy, type: string, multiple: true): Array<Copy>;
        function meet(me: Copy, x: number, y: number, type: string, multiple: true): Array<Copy>;
        /**
         * Checks whether there is a collision between a Copy `me` and any of the Copies
         * of a given `type`. If `x` and `y` are skipped, the current coordinates of `me` will be used.
         *
         * If `multiple` is `true`, the function will find all the possible collisions,
         * and will always return an array, which is either empty or filled with collided copies.
         * Otherwise, it returns `false` or the first Copy which blocked `me`.
         *
         * @param {Copy} me The object to check collisions on
         * @param {number} x The x coordinate to check, as if `me` was placed there
         * @param {number} y The y coordinate to check, as if `me` was placed there
         * @param {String} [type] The name of the type to check against
         * @param {Boolean} [multiple=false] If it is `true`, the function will return an array of all the collided objects.
         *                                   If it is `false` (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function meet(me: Copy, x: number, y: number, type: string, multiple?: false|void): Copy | false;

        /**
         * Checks whether there is a collision between a Copy `me` and any of the Copies
         * of a given `type`.
         *
         * If `multiple` is `true`, the function will find all the possible collisions,
         * and will always return an array, which is either empty or filled with collided copies.
         * Otherwise, it returns `false` or the first Copy which blocked `me`.
         *
         * @param {Copy} me The object to check collisions on
         * @param {String} [type] The name of the type to check against
         * @param {Boolean} [multiple=false] If it is `true`, the function will return an array of all the collided objects.
         *                                   If it is `false` (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function meet(me: Copy, type: string, multiple?: false|void): Copy | false;

        /**
         * Checks for a collision between a copy `me` and a tile layer of a given collision group (`ctype`).
         * If `ctype` is not set for a tile layer, then ct.place will compare against a tile layer's depth.
         *
         * If `x` and `y` are skipped, the current coordinates of `me` will be used.
         *
         * Each tile is considered a rectangle, and a possible collision mask defined in the graphics asset
         * (in the tileset) is ignored. If `x` and `y` are skipped, the current coordinates of `me` will be used.
         *
         * This method returns either `true` (a copy collides with a tile layer) or `false` (no collision).
         *
         * @param {Copy} me The copy to calculate collisions for
         * @param {number} [x] The x coordinate to check, as if `me` was placed there.
         * @param {number} [y] The y coordinate to check, as if `me` was placed there.
         * @param {number} ctype The collision group of tile layers to test against.
         */
        function tile(me: Copy, x: number, y: number, ctype: string): boolean;
        function tile(me: Copy, ctype: string): boolean;

        /**
         * Returns the latest distance after calling `ct.place.furthest` or `ct.place.nearest`.
         */
        var lastdist: number;

        /**
         * Gets the nearest Copy of a given `type`.
         * @param {number} x The horizontal position of the starting point
         * @param {number} y The vertical position of the starting point
         * @param {string} type The name of the type against which copies the distance will be measured
         */
        function nearest(x: number, y: number, type: string): Copy | false;

        /**
         * Gets the furthest Copy of a given `type`.
         * @param {number} x The horizontal position of the starting point
         * @param {number} y The vertical position of the starting point
         * @param {string} type The name of the type against which copies the distance will be measured
         */
        function furthest(x: number, y: number, type: string): Copy | false;

        /**
         * Moves a copy by `stepSize` in a given `direction` untill a `maxLength` is reached
         * or a copy is next to an obstacle. You can filter collided copies and tiles with `ctype`,
         * and set precision with `stepSize` (default is `1`, which means pixel-by-pixel movement).
         * This function is especially useful for side-view games and any fast-moving copies,
         * as it allows precise movement without clipping or passing through surfaces.
         *
         * @remarks
         * You will usually need to premultiply `maxLength` with `ct.delta` so that the speed is consistent
         * under different FPS rates.
         *
         * @param {Copy} me The copy that needs to be moved
         * @param {number} direction The direction in which to perform a movement
         * @param {number} maxLength The maximum distance a copy can traverse
         * @param {string} [ctype] A collision group to test against. Tests against every copy if no collision group was specified
         * @param {number} [stepSize=1] Precision of movement
         * @returns {Copy|boolean} If there was no collision and a copy reached its target, returns `false`.
         * If a copy met an obstacle as another copy, returns this copy. If there was a tile, returns `true`.
         */
        function moveAlong(me: Copy, direction: number, maxLength: number, ctype?: string, stepSize?: number): Copy | boolean;

        /**
         * Similar to ct.place.moveAlong, this method moves a copy by X and Y axes until dx and dy are reached
         * or a copy meets an obstacle on both axes. If an obstacle was met on one axis, a copy may continue
         * moving by another axis. You can filter collided copies with `ctype`,
         * and set precision with `stepSize` (default is `1`, which means pixel-by-pixel movement).
         * This movement suits characters in top-down and side-view worlds.
         *
         * @remarks
         * You will usually need to premultiply `dx` and `dy` with `ct.delta` so that the speed is consistent
         * under different FPS rates.
         *
         * @param {Copy} me The copy that needs to be moved
         * @param {number} dx Amount of pixels to move by X axis
         * @param {number} dy Amount of pixels to move by Y axis
         * @param {string} [ctype] A collision group to test against. Tests against every copy if no collision group was specified
         * @param {number} [stepSize=1] Precision of movement
         * @returns {false|ISeparateMovementResult} `false` if it reached its target, an object with each axis specified otherwise.
         */
        function moveByAxes(me: Copy, dx: number, dy: number, ctype?: string, stepSize?: number): false | ISeparateMovementResult;

        /**
         * Tries to reach the target with a simple obstacle avoidance algorithm.
         *
         * `me` is a copy to move around, `x` and `y` is a target point;
         * `length` is the maximum amount of pixels to move in one step.
         * `ctype` is an option parameter that tells to test collisions against
         * a certain collision group.
         *
         * This function doesn't require the `ct.types.move(this);` call.
         *
         * @param {Copy} me The copy to move
         * @param {number} x The target x coordinate to reach
         * @param {number} y The target y coordinate to reach
         * @param {number} length The maximum number to move to in one step (usually the speed of a copy)
         * @param {string} ctype The collision group to test against. If not defined, will test against all the copies
         */
        function go(me: Copy, x: number, y: number, length: number, ctype?: string): void;

        /**
         * Throws a ray from point (x1, y1) to (x2, y2), returning all the instances that touched the ray.
         * The first copy in the returned array is the closest copy, the last one is the furthest.
         *
         * @param {number} x1 A horizontal coordinate of the starting point of the ray.
         * @param {number} y1 A vertical coordinate of the starting point of the ray.
         * @param {number} x2 A horizontal coordinate of the ending point of the ray.
         * @param {number} y2 A vertical coordinate of the ending point of the ray.
         * @param {String} [ctype] An optional collision group to trace against. If omitted, will trace through all the copies in the current room.
         *
         * @returns {Array<Copy>} Array of all the copies that touched the ray
         */
        function trace(x1: number, y1: number, x2: number, y2: number, ctype?: string): Copy[];
    }
}

interface ISeparateMovementResult {
    x: boolean;
    y: boolean;
}

interface Copy {
    /** The current collision group of a copy */
    ctype: string;
    /**
     * Call to perform precise movement with collision checks. It takes gravity
     * and `ct.delta` into account, too, and uses the `ct.place.moveAlong` method.
     */
    moveContinuous(ctype: string, precision?: number): void;
    /**
     * Call to perform precise movement with collision checks. It takes gravity
     * and `ct.delta` into account, too, and uses the `ct.place.moveByAxes` method.
     */
    moveContinuousByAxes(ctype: string, precision?: number): void;
}
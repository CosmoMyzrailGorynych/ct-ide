interface ICtPlaceLineSegment {
    /** The horizontal coordinate of the starting point of the ray. */
    x1: number,
    /** The vertical coordinate of the starting point of the ray. */
    y1: number,
    /** The horizontal coordinate of the ending point of the ray. */
    x2: number,
    /** The vertical coordinate of the ending point of the ray. */
    y2: number
}
interface ICtPlaceRectangle {
    /** The left side of the rectangle. */
    x1?: number,
    /** The upper side of the rectangle. */
    y1?: number,
    /** The right side of the rectangle. */
    x2?: number,
    /** The bottom side of the rectangle. */
    y2?: number,
    /** The left side of the rectangle. */
    x?: number,
    /** The upper side of the rectangle. */
    y?: number,
    /** The right side of the rectangle. */
    width?: number,
    /** The bottom side of the rectangle. */
    height?: number
}
interface ICtPlaceCircle {
    /** The horizontal coordinate of the circle's center. */
    x: number,
    /** The vertical coordinate of the circle's center. */
    y: number,
    /** The radius of the circle. */
    radius: number
}

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
         * `cgroup` is optional and filters by using collision groups.
         * If `x` and `y` are skipped, the current coordinates of `me` will be used.
         *
         * Returns `true` if a place is free, and `false` otherwise.
         *
         * @param {Copy} me The object to check collisions on
         * @param {number} x The x coordinate to check, as if `me` was placed there.
         * @param {number} y The y coordinate to check, as if `me` was placed there.
         * @param {String} [cgroup] The collision group to check against
         */
        function free(me: Copy, x: number, y: number, cgroup?: string): boolean;

        /**
         * Checks whether a copy `me` is in a free spot.
         * `cgroup` is optional and filters by using collision groups.
         *
         * Returns `true` if a place is free, and `false` otherwise.
         *
         * @param {Copy} me The object to check collisions on
         * @param {String} [cgroup] The collision group to check against
         */
        function free(me: Copy, cgroup?: string): boolean;

        function occupied(me: Copy, x: number, y: number, cgroup: string|false, multiple: true): Copy[];
        /**
         * Determines if the place in (x,y) is occupied.
         * Optionally can take 'cgroup' as a filter for obstacles' collision group (not shape type)
         *
         * @param {Copy} me The object to check collisions on
         * @param {number} x The x coordinate to check, as if `me` was placed there
         * @param {number} y The y coordinate to check, as if `me` was placed there
         * @param {String} [cgroup] The collision group to check against
         * @param {Boolean} [multiple=false] If it is true, the function will return an array of all the collided objects.
         *                                   If it is false (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function occupied(me: Copy, x: number, y: number, cgroup?: string): Copy | false;

        function occupied(me: Copy, cgroup?: string, multiple?: true): Copy[];
        /**
         * Determines if the copy is in an occupied place.
         * Optionally can take 'cgroup' as a filter for obstacles' collision group (not shape type)
         *
         * @param {Copy} me The object to check collisions on
         * @param {String} [cgroup] The collision group to check against
         * @param {Boolean} [multiple=false] If it is true, the function will return an array of all the collided objects.
         *                                   If it is false (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function occupied(me: Copy, cgroup?: string, multiple?: false|void): Copy | false;

        function meet(me: Copy, template: string, multiple: true): Array<Copy>;
        function meet(me: Copy, x: number, y: number, template: string, multiple: true): Array<Copy>;
        /**
         * Checks whether there is a collision between a Copy `me` and any of the Copies
         * of a given `template`. If `x` and `y` are skipped, the current coordinates of `me` will be used.
         *
         * If `multiple` is `true`, the function will find all the possible collisions,
         * and will always return an array, which is either empty or filled with collided copies.
         * Otherwise, it returns `false` or the first Copy which blocked `me`.
         *
         * @param {Copy} me The object to check collisions on
         * @param {number} x The x coordinate to check, as if `me` was placed there
         * @param {number} y The y coordinate to check, as if `me` was placed there
         * @param {String} [template] The name of the template to check against
         * @param {Boolean} [multiple=false] If it is `true`, the function will return an array of all the collided objects.
         *                                   If it is `false` (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function meet(me: Copy, x: number, y: number, template: string, multiple?: false|void): Copy | false;

        /**
         * Checks whether there is a collision between a Copy `me` and any of the Copies
         * of a given `template`.
         *
         * If `multiple` is `true`, the function will find all the possible collisions,
         * and will always return an array, which is either empty or filled with collided copies.
         * Otherwise, it returns `false` or the first Copy which blocked `me`.
         *
         * @param {Copy} me The object to check collisions on
         * @param {String} [template] The name of the template to check against
         * @param {Boolean} [multiple=false] If it is `true`, the function will return an array of all the collided objects.
         *                                   If it is `false` (default), it will return a copy with the first collision
         * @returns {Copy|Array<Copy>} The collided copy, or an array of all the detected collisions (if `multiple` is `true`)
         */
        function meet(me: Copy, template: string, multiple?: false|void): Copy | false;

        /**
         * Checks for a collision between a copy `me` and a tile layer of a given collision group (`cgroup`).
         * If `cgroup` is not set for a tile layer, then ct.place will compare against a tile layer's depth.
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
         * @param {number} cgroup The collision group of tile layers to test against.
         */
        function tile(me: Copy, x: number, y: number, cgroup: string): boolean;
        function tile(me: Copy, cgroup: string): boolean;

        /**
         * Returns the latest distance after calling `ct.place.furthest` or `ct.place.nearest`.
         */
        var lastdist: number;

        /**
         * Gets the nearest Copy of a given `template`.
         * @param {number} x The horizontal position of the starting point
         * @param {number} y The vertical position of the starting point
         * @param {string} template The name of the template against which copies the distance will be measured
         */
        function nearest(x: number, y: number, template: string): Copy | false;

        /**
         * Gets the furthest Copy of a given `template`.
         * @param {number} x The horizontal position of the starting point
         * @param {number} y The vertical position of the starting point
         * @param {string} template The name of the template against which copies the distance will be measured
         */
        function furthest(x: number, y: number, template: string): Copy | false;

        /**
         * Moves a copy by `stepSize` in a given `direction` untill a `maxLength` is reached
         * or a copy is next to an obstacle. You can filter collided copies and tiles with `cgroup`,
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
         * @param {string} [cgroup] A collision group to test against. Tests against every copy if no collision group was specified
         * @param {number} [stepSize=1] Precision of movement
         * @returns {Copy|boolean} If there was no collision and a copy reached its target, returns `false`.
         * If a copy met an obstacle as another copy, returns this copy. If there was a tile, returns `true`.
         */
        function moveAlong(me: Copy, direction: number, maxLength: number, cgroup?: string, stepSize?: number): Copy | boolean;

        /**
         * Similar to ct.place.moveAlong, this method moves a copy by X and Y axes until dx and dy are reached
         * or a copy meets an obstacle on both axes. If an obstacle was met on one axis, a copy may continue
         * moving by another axis. You can filter collided copies with `cgroup`,
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
         * @param {string} [cgroup] A collision group to test against. Tests against every copy if no collision group was specified
         * @param {number} [stepSize=1] Precision of movement
         * @returns {false|ISeparateMovementResult} `false` if it reached its target, an object with each axis specified otherwise.
         */
        function moveByAxes(me: Copy, dx: number, dy: number, cgroup?: string, stepSize?: number): false | ISeparateMovementResult;

        /**
         * Tries to reach the target with a simple obstacle avoidance algorithm.
         *
         * `me` is a copy to move around, `x` and `y` is a target point;
         * `length` is the maximum amount of pixels to move in one step.
         * `cgroup` is an option parameter that tells to test collisions against
         * a certain collision group.
         *
         * This function doesn't require the `ct.templates.move(this);` call.
         *
         * @param {Copy} me The copy to move
         * @param {number} x The target x coordinate to reach
         * @param {number} y The target y coordinate to reach
         * @param {number} length The maximum number to move to in one step (usually the speed of a copy)
         * @param {string} cgroup The collision group to test against. If not defined, will test against all the copies
         */
        function go(me: Copy, x: number, y: number, length: number, cgroup?: string): void;


        /**
         * Tests for intersections with a line segment.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the line segment; otherwise, returns the first one that fits the conditions.
         *
         * @param {ICtPlaceLineSegment} line An object that describes the line segment.
         * @param {string} [cgroup] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         */
        function traceLine(line: ICtPlaceLineSegment, cgroup: string|false, getAll: true): Array<Copy>;
        function traceLine(line: ICtPlaceLineSegment, cgroup: string|false, getAll: false): Copy|false;
        function traceLine(line: ICtPlaceLineSegment, cgroup?: string): Copy|false;

        /**
         * Tests for intersections with a filled rectangle.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the rectangle; otherwise, returns the first one that fits the conditions.
         *
         * @param {ICtPlaceRectangle} rect An object that describes the line segment.
         * @param {string} [cgroup] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         */
        function traceRect(rect: ICtPlaceRectangle, cgroup: string, getAll: true): Array<Copy>;
        function traceRect(rect: ICtPlaceRectangle, cgroup: string, getAll: false): Copy|false;
        function traceRect(rect: ICtPlaceRectangle, cgroup?: string): Copy|false;

        /**
         * Tests for intersections with a filled circle.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the circle; otherwise, returns the first one that fits the conditions.
         *
         * @param {ICtPlaceCircle} rect An object that describes the line segment.
         * @param {string} [cgroup] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         */
        function traceCircle(circle: ICtPlaceCircle, cgroup: string|false, getAll: true): Array<Copy>;
        function traceCircle(circle: ICtPlaceCircle, cgroup: string|false, getAll: false): Copy|false;
        function traceCircle(circle: ICtPlaceCircle, cgroup?: string): Copy|false;

        /**
         * Tests for intersections with a polyline. It is a hollow shape made
         * of connected line segments. The shape is not closed unless you add
         * the closing point by yourself.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the polyline; otherwise, returns the first one that fits the conditions.
         *
         * @param {Array<IPoint>} polyline An array of objects with `x` and `y` properties.
         * @param {string} [cgroup] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         */
        function tracePolyline(polyline: Array<IPoint>, cgroup: string|false, getAll: true): Array<Copy>;
        function tracePolyline(polyline: Array<IPoint>, cgroup: string|false, getAll: false): Copy|false;
        function tracePolyline(polyline: Array<IPoint>, cgroup?: string): Copy|false;

        /**
         * Tests for intersections with a point.
         * If `getAll` is set to `true`, returns all the copies that intersect
         * the point; otherwise, returns the first one that fits the conditions.
         *
         * @param {object} point An object with `x` and `y` properties.
         * @param {string} [cgroup] An optional collision group to trace against.
         * If omitted, will trace through all the copies in the current room.
         * @param {boolean} [getAll] Whether to return all the intersections (true),
         * or return the first one.
         */
        function tracePoint(point: IPoint, cgroup: string|false, getAll: true): Array<Copy>;
        function tracePoint(point: IPoint, cgroup: string|false, getAll: false): Copy|false;
        function tracePoint(point: IPoint, cgroup?: string): Copy|false;

        /**
         * Throws a ray from point (x1, y1) to (x2, y2), returning all the instances that touched the ray.
         * The first copy in the returned array is the closest copy, the last one is the furthest.
         *
         * @param {number} x1 A horizontal coordinate of the starting point of the ray.
         * @param {number} y1 A vertical coordinate of the starting point of the ray.
         * @param {number} x2 A horizontal coordinate of the ending point of the ray.
         * @param {number} y2 A vertical coordinate of the ending point of the ray.
         * @param {String} [cgroup] An optional collision group to trace against. If omitted, will trace through all the copies in the current room.
         *
         * @deprecated Since v1.4.3. Use ct.place.traceLine instead.
         * @returns {Array<Copy>} Array of all the copies that touched the ray
         */
        function trace(x1: number, y1: number, x2: number, y2: number, cgroup?: string): Copy[];

        /**
         * Enables collision checks on the specified tilemap, with an optional collision group.
         * @param {Tilemap} tilemap The tilemap on which to enable collisions.
         * @param {string} cgroup Collision group.
         */
        function enableTilemapCollisions(tilemap: Tilemap, cgroup?: string): void;
    }
}

interface IPoint {
    x: number;
    y: number;
}
interface ISeparateMovementResult {
    x: boolean | Copy;
    y: boolean | Copy;
}

interface Copy {
    /** The current collision group of a copy */
    cgroup: string;
    /**
     * Call to perform precise movement with collision checks. It takes gravity
     * and `ct.delta` into account, too, and uses the `ct.place.moveAlong` method.
     */
    moveContinuous(cgroup: string, precision?: number): false|Copy;
    /**
     * Call to perform precise movement with collision checks. It takes gravity
     * and `ct.delta` into account, too, and uses the `ct.place.moveByAxes` method.
     */
    moveContinuousByAxes(cgroup: string, precision?: number): false|ISeparateMovementResult;
}

interface Tilemap {
    /**
     * Enables collision checks on the specified tilemap, with an optional collision group.
     * @param {string} cgroup Collision group.
     */
    enableCollisions(cgroup?: string): void;
}

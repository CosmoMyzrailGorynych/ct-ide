declare namespace ct {
    namespace u {
        /**
         * Returns the length of a vector projection onto an X axis.
         * @param {number} l The length of the vector
         * @param {number} d The direction of the vector
         * @returns {number} The length of the projection
         */
        function lengthDirX(l: number, d: number): number;
        /**
         * Returns the length of a vector projection onto an Y axis.
         * @param {number} l The length of the vector
         * @param {number} d The direction of the vector
         * @returns {number} The length of the projection
         */
        function lengthDirY(l: number, d: number): number;
        /**
         * Returns the direction of a vector that points from the first point to the second one.
         * @param {number} x1 The x location of the first point
         * @param {number} y1 The y location of the first point
         * @param {number} x2 The x location of the second point
         * @param {number} y2 The y location of the second point
         * @returns {number} The angle of the resulting vector, in degrees
         */
        function pointDirection(x1: number, y1: number, x2: number, y2: number): number;
        /**
         * Returns the distance between two points
         * @param {number} x1 The x location of the first point
         * @param {number} y1 The y location of the first point
         * @param {number} x2 The x location of the second point
         * @param {number} y2 The y location of the second point
         * @returns {number} The distance between the two points
         */
        function pointDistance(x1: number, y1: number, x2: number, y2: number): number;
        /**
         * Tests whether a given point is inside the given rectangle (it can be either a copy or an array)
         * @param {number} x The x coordinate of the point
         * @param {number} y The y coordinate of the point
         * @param {(Copy|Array<Number>)} arg Either a copy (it must have a rectangular shape) or an array in a form of [x1, y1, x2, y2], where (x1;y1) and (x2;y2) specify the two opposite corners of the rectangle
         * @returns {boolean} `true` if the point is inside the rectangle, `false` otherwise
         */
        function pointRectangle(x: number, y: number, arg: Copy | Number[]): boolean;
        /**
         * Tests whether a given point is inside the given circle (it can be either a copy or an array)
         * @param {number} x The x coordinate of the point
         * @param {number} y The y coordinate of the point
         * @param {(Copy|Array<Number>)} arg Either a copy (it must have a circular shape) or an array in a form of [x1, y1, r], where (x1;y1) define the center of the circle and `r` defines the radius of it
         * @returns {boolean} `true` if the point is inside the circle, `false` otherwise
         */
        function pointCircle(x: number, y: number, arg: Copy | Number[]): boolean;
        /**
         * Copies all the properties of the source object to the destination object. This is **not** a deep copy. Useful for extending some settings with default values, or for combining data.
         * @param {object} o1 The destination object
         * @param {object} o2 The source object
         * @param {any} [arr] An optional array of properties to copy. If not specified, all the properties will be copied.
         * @returns {object} The modified destination object
         */
        function extend(o1: any, o2: any, arr?: any): any;
        /**
         * Get the current operating system the game runs on.
         * @returns {string} One of 'windows', 'darwin' (which is MacOS), 'linux', or 'unknown'.
         */
        function getOs(): string;
    }
}
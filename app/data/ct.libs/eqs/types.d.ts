interface IEQSOptions {
    /** The horizontal center of a query */
    x: number;
    /** The vertical center of a query */
    y: number;
    /** One of: `'grid'`, `'ring'`, `'circle'`, `'copies'` */
    type?: 'grid' | 'ring' | 'circle' | 'copies';

    /** The number of columns in your grid */
    w?: number;
    /** The number of rows in your grid */
    h?: number;
    /** The horizontal gap between two points */
    sizeX?: number;
    /** The vertical gap between two poins */
    sizeY?: number;
    /** Whether to shift each second row in the grid, thus forming a triangle grid */
    triangle?: boolean;
    /** The radius of the circle or of the ring */
    r?: number;
    /** The number of points to create in a ring */
    n?: number;

    /** A type's name from which copies to take coordinates */
    copyType?: string;
    /** *Optional.* The maximum radius from the center of your query at which your copies are included. */
    limit?: number;
}

interface IEQSPoint extends IPoint {
    score: number;
    column?: number;
    row?: number;
}

class EQSQuery {
    /**
     * Creates a new query from an array of points. Each point
     * should be an object with `x`, `y` and `score` fields.
     */
    constructor(points: Array<IEQSPoint>): EQSQuery;
    /**
     * Creates a new separate query by copying points from another query.
     */
    constructor(query: EQSQuery): EQSQuery;
    /**
     * Constructs a new query with the given options and returns it.
     */
    constructor(options: IEQSOptions): EQSQuery;

    points: IEQSPoint[];

    /**
     * Execute a function for each point in the query.
     * Function is passed the only argument, the current `point`.
     * Modify its `score` value to rank it.
     */
    score(func): EQSQuery;
    /**
     * Works only with queries of `'grid'` type. Execute a function
     * for each point in the query. Function is passed four arguments:
     *
     * 0. the current point;
     * 1. its column index (the `x` position);
     * 2. its row index (the `y` position);
     * 3. the whole map of points (a two-dimentional array of points).
     */
    scoreSpaced(func): EQSQuery;

    /** Sorts all the points in a query based on their `score`, descending. */
    sort(): EQSQuery;

    /** Normalizes points' `score` values to a `[0;1]` range. */
    normalize(): EQSQuery;

    /** Inverts points' `score` value. */
    invert(): EQSQuery;

    /** Reverses the current points array. */
    reverse(): EQSQuery;

    /**
     * Removes a portion of points, e.g. if `rate` is `0.25`,
     * then only the first 25% of points are leaved as is,
     * and other are removed.
     */
    portion(rate: number): EQSQuery;

    /** Returns a new query combined from two other queries. */
    concat(eq: EQSQuery): EQSQuery;

    /** Gets the first `n` points from a query, or the first one, if `n` is not defined. */
    getFirst(n: number): EQSQuery;

    /** Gets the last `n` points from a query, or the last one, if `n` is not defined. */
    getLast(n: number): EQSQuery;

    /** Gets a portion of points, e.g. if `rate` is `0.15`, then the first 15% of points will be returned in an array. */
    getPortion(rate: number): EQSQuery;

    /** Gets a random point from a query. */
    getRandom(): IEQSPoint;

    /** Gets a random point from a query, but the first ones have the highest chance to be picked. */
    getBetterRandom(): IEQSPoint;
}

declare namespace ct {
    namespace eqs {
        /**
         * Constructs a new query with the given options and returns it.
         * There are three required fields in the options:
         *
         * Parameter | Explanation | Default
         * --        | -           |-
         * `x`       | The horizontal center of a query | —
         * `y`       | The vertical center of a query | —
         * `type`    | One of: `'grid'`, `'ring'`, `'circle'`, `'copies'` | `'grid'`
         *
         * If `type` equals `grid`, then you must provide additional parameters:
         *
         * Parameter | Explanation | Default
         * --        | -           | -
         * `w`       | The number of columns in your grid | —
         * `h`       | The number of rows in your grid    | —
         * `sizeX`   | The horizontal gap between two points | —
         * `sizeY`   | The vertical gap between two poins | —
         * `triangle`| Whether to shift each second row in the grid, thus forming a triangle grid | `false`
         *
         * If `type` equals `circle`, then you must provide these parameters:
         *
         * Parameter | Explanation | Default
         * --        | -           | -
         * `r`       | The radius of the circle | —
         * `sizeX`   | The horizontal gap between two points | —
         * `sizeY`   | The vertical gap between two poins | —
         * `triangle`| Whether to shift each second row in the grid, thus forming a triangle grid | `false`
         *
         * If `type` equals `ring`, then you must provide additional parameters:
         *
         * Parameter | Explanation | Default
         * --        | -           | -
         * `n`       | The number of points to create | —
         * `r`       | The radius of the ring | —
         *
         * If `type` equals `copies`, then you must provide additional parameters:
         *
         * Parameter | Explanation | Default
         * --        | -           | -
         * `copyType`| A type's name from which copies to take coordinates | —
         * `limit`   | *Optional.* The maximum radius from the center of your query at which your copies are included. | —
         */
        function query(options: EQSQuery): EQSQuery;

        /**
         * Creates a new query from an array of points. Each point
         * should be an object with `x`, `y` and `score` fields.
         */
        function query(points: Array<IEQSPoint>): EQSQuery;

        /**
         * Creates a new separate query by copying points from another query.
         */
        function query(query: EQSQuery): EQSQuery;

        query(params)
        scoreFree(ctype, multiplier)
        scoreOccupied(ctype, multiplier)
        scoreTile(layer, multiplier)
        scoreDirection(direction, fromx, fromy, weight)
    }
}

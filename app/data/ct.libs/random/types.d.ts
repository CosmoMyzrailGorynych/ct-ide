interface IPoint {
    x: number;
    y: number;
}

/** Returns a random float value between 0 and x, exclusive. */
declare function random(x: number): number;
declare namespace random {
    /**
     * Returns random argument from comma separated arguments (without spaces):
	 * Numbers will return float. Words will return string. These can be mixed.
     */
    function dice<T>(...dices: T[]): T;
    function dice(...dices: any): any;

    /**
     * Returns a weighted random number from 0 to 1 according to a given histogram.
     * Each argument defines the probability of a random value to appear in a bucket.
     * Example:
	 * If you call `random.histogram(1, 10, 2)`, the method will return values
     * in a range [0.333;0.667) ten times more often than in a range [0;0.333)
     * and five times more often than in a range [0.667;1).
     */
    function histogram(...coeffs: number[]): number;

    /**
     * Returns a random value from 0 to 1 that tends to be close to 0.
     * @param {number} [exp] An optional value that sets the power of the effect.
     * This value should be larger than 1, and equals to 2 by default.
     */
    function pessimistic(exp?: number): number;

    /**
     * Returns a random value from 0 to 1 that tends to be close to 1.
     * @param {number} [exp] An optional value that sets the power of the effect.
     * This value should be larger than 1, and equals to 2 by default.
     */
    function optimistic(exp?: number): number;

    /** Returns a random float value between `x1` and `x2`, exclusive. */
    function range(x1: number, x2: number): number

    /**
     * Returns a random float value between 0 and 360, exclusive.
     * @catnipName random angle
     */
    function deg(): number;

    /** Returns a pair of random coordinates from 0 to a corresponding room side. */
    function coord(): IPoint;

    /**
     * Returns a random element from the passed array
     * @catnipName random from array
     */
    function from<T>(a: T[]): T;
    function from(a: any[]): any;

    /**
     * This function randomizes text inside { } curly braces,
     * with tokens inside { } separated by a | symbol.
     *
     * Example: randomText('a very {very |}tasty {{beef |chicken |}sausage|carrot}'));
     */
    function text(text: string): string;

    /**
     * When given both `x` and `y`, randomly returns `true` approximately `x` times
     * out of `y`. When given only a value between 0…100, returns `true`
     * approximately `x` times out of 100. E.g. `random.chance(30)` means
     * a 30% success rate.
     */
    function chance(x: number, y?: number): boolean;

    /**
     * Returns next seeded random number.
     */
    function seeded(): number;

    /**
     * Sets the seed of the `random.seeded()` method.
     * @catnipName Set the seed for the "random seeded" block
     */
    function setSeed(seed: number): void;

    /**
     * Creates a new seeded random number generator. It is a function that you can store
     * and use in the same way as `random.seeded()`.
     * @catnipName Create a seeded randomizer function with seed
     * @catnipSaveReturn
     */
    function createSeededRandomizer(seed: number): () => number;
}

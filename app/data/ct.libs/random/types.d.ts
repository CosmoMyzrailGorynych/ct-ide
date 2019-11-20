declare namespace ct {
    /** Returns a random float value between 0 and x, exclusive. */
    function random(x: number): number;
    /** This module contains handy functions for generating something random. */
    namespace random {
        /** Returns a random given argument. */
        function dice(...dices: any): any;

        /** Returns a random float value between `x1` and `x2`, exclusive. */
        function range(x1: number, x2: number): number

        /** Returns a random float value between 0 and 360, exclusive. */
        function deg(): number;

        /** Returns a pair of random coordinates from 0 to a corresponding room side. */
        function coord(): PIXI.IPoint;

        /** When given both `x` and `y`, randomly returns `true` approximately `x` times out of `y`. When given only a value between 0…100, returns `true` approximately `x` times out of 100. E.g. `ct.random.chance(30)` means a 30% success rate. */
        function chance(x: number, y?: number)
    }
}
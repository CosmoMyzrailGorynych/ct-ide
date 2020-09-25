declare namespace ct {
    /** A module with methods to generate 2d/3d perlin noise  */
    namespace noise {
        /**
         * 2D Simplex noise function.
         * @returns A value between `-1` and `1`.
         */
        function simplex2d(x: number, y: number): number;
        /**
         * 3D Simplex noise function.
         * @returns A value between `-1` and `1`.
         */
        function simplex3d(x: number, y: number, z: number): number;
        /**
         * 2D Perlin noise function.
         * @returns A value between `-1` and `1`.
         */
        function perlin2d(x: number, y: number): number;
        /**
         * 3D Perlin noise function.
         * @returns A value between `-1` and `1`.
         */
        function perlin3d(x: number, y: number, z: number): number;
        /**
         * Seed the noise functions. Only 65536 different seeds are supported.
         * Use a float between 0 and 1 or an integer from 1 to 65536,
         * or leave the parenthesis empty to pick a random seed.
         */
        function setSeed(val?: number): void;
    }
}
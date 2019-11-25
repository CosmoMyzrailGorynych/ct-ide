declare namespace ct {
    namespace res {
        /**
         * Gets a pixi.js texture from a ct.js' texture name, so that it can be used in pixi.js objects.
         * @param {string} name The name of the ct.js texture
         * @returns {Array<PIXI.Texture>} Returns an array with all the frames of this ct.js' texture.
         */
        function getTexture(name: string): PIXI.Texture[];
        /**
         * Gets a pixi.js texture from a ct.js' texture name, so that it can be used in pixi.js objects.
         * @param {string} name The name of the ct.js texture
         * @param {number} frame The frame to extract
         * @returns {PIXI.Texture} Returns a single PIXI.Texture.
         */
        function getTexture(name: string, frame: number): PIXI.Texture;
    }
}

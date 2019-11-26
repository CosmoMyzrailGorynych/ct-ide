declare namespace ct {
    /**
     * Creates a new texture, usable by ct.js copies, from a source texture by combining its frames.
     *
     * @param {string} sourceTexName The name of the source texture
     * @param {string} texName The name of the new texture
     * @param {Array<number>} frames A sequential list of frames to include. One frame can be used more than once.
     */
    function sprite(sourceTexName: string, texName: string, frames: number[]): void;
}
import type * as pixiMod from 'pixi.js';
declare var PIXI: typeof pixiMod;

export default class PixiContainer extends PIXI.Container {
    shape: textureShape;
    constructor() {
        super();
        this.shape = {
            type: 'point'
        };
        return this;
    }
}

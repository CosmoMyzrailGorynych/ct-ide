import {ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import resLib from '../res';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

export default class PixiSpritedCounter extends PIXI.TilingSprite {
    #count: number;
    #baseWidth: number;
    #baseHeight: number;
    shape: textureShape;
    /**
     * Amount of sprites to show.
     */
    get count(): number {
        return this.#count;
    }
    set count(val: number) {
        this.#count = val;
        this.width = this.#count * this.#baseWidth * this.scale.x;
        this.height = this.#baseHeight * this.scale.y;
        this.tileScale.set(this.scale.x, this.scale.y);
        this.shape = {
            type: 'rect',
            left: 0,
            top: 0,
            right: this.#baseWidth * this.#count,
            bottom: this.#baseHeight
        };
    }
    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t.baseClass !== 'SpritedCounter') {
            throw new Error('Don\'t call PixiScrollingTexture class directly! Use templates.copy to create an instance instead.');
        }
        const tex = resLib.getTexture(t.texture, 0);
        super(tex, tex.width, tex.height);
        this.#baseWidth = this.width;
        this.#baseHeight = this.height;
        this.anchor.set(0);
        if ('scaleX' in exts) {
            this.scale.x = exts.scaleX as number ?? 1;
        }
        if ('scaleY' in exts) {
            this.scale.y = exts.scaleY as number ?? 1;
        }
        this.count = t.spriteCount;
    }
}

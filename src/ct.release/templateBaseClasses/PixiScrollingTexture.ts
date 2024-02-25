import {ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import resLib from '../res';
import uLib from '../u';
import roomsLib from '../rooms';
import {BasicCopy} from '../templates';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

export default class PixiScrollingTexture extends PIXI.TilingSprite {
    /** Horizontal speed with which this texture scrolls, measured in pixels per second. */
    scrollSpeedX: number;
    /** Vertical speed with which this texture scrolls, measured in pixels per second. */
    scrollSpeedY: number;
    /**
     * If set to true, this texture's scroll speed will not depend on u.time,
     * meaning that it will ignore game pause or game speed changes.
     */
    isUi: boolean;
    #baseWidth: number;
    #baseHeight: number;
    shape: textureShape;
    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t.baseClass !== 'RepeatingTexture') {
            throw new Error('Don\'t call PixiScrollingTexture class directly! Use templates.copy to create an instance instead.');
        }
        const tex = resLib.getTexture(t.texture, 0);
        super(tex, tex.width, tex.height);
        this.#baseWidth = this.width;
        this.#baseHeight = this.height;
        this.anchor.set(0);
        this.scrollSpeedX = t.scrollX;
        this.scrollSpeedY = t.scrollY;
        if ('scaleX' in exts) {
            this.width = this.#baseWidth * (exts.scaleX as number ?? 1);
        }
        if ('scaleY' in exts) {
            this.height = this.#baseHeight * (exts.scaleY as number ?? 1);
        }
        this.on('added', () => {
            roomsLib.current.tickerSet.add(this as typeof this & BasicCopy);
        });
        this.on('removed', () => {
            roomsLib.current.tickerSet.delete(this as typeof this & BasicCopy);
        });
        this.shape = {
            type: 'rect',
            left: 0,
            top: 0,
            right: this.width,
            bottom: this.height
        };
    }
    tick(): void {
        if (this.isUi) {
            this.tilePosition.x += this.scrollSpeedX * uLib.timeUi;
            this.tilePosition.y += this.scrollSpeedY * uLib.timeUi;
        } else {
            this.tilePosition.x += this.scrollSpeedX * uLib.time;
            this.tilePosition.y += this.scrollSpeedY * uLib.time;
        }
    }
}

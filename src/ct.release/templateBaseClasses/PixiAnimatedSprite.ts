import res from '../res';
import {ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

export default class PixiAnimateSprite extends PIXI.AnimatedSprite {
    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'AnimatedSprite') {
            throw new Error('Don\'t call PixiButton class directly! Use templates.copy to create an instance instead.');
        }
        const textures = res.getTexture(t.texture);
        super(textures);
        this.anchor.x = t.anchorX ?? textures[0].defaultAnchor.x ?? 0;
        this.anchor.y = t.anchorY ?? textures[0].defaultAnchor.y ?? 0;
        this.scale.set(
            (exts.scaleX as number) ?? 1,
            (exts.scaleY as number) ?? 1
        );
        return this;
    }
}

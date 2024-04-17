import {ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import resLib from '../res';
import uLib from '../u';
import {CopyPanel} from '../templateBaseClasses';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

export default class PixiPanel extends PIXI.NineSlicePlane {
    /**
     * Whether to automatically update the collision shape of this panel
     * when it changes its size.
     */
    updateNineSliceShape: boolean;
    baseClass = 'NineSlicePlane';
    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'NineSlicePlane') {
            throw new Error('Don\'t call PixiPanel class directly! Use templates.copy to create an instance instead.');
        }
        const tex = resLib.getTexture(t.texture, 0);
        super(
            tex,
            t.nineSliceSettings?.left ?? 16,
            t.nineSliceSettings?.top ?? 16,
            t.nineSliceSettings?.right ?? 16,
            t.nineSliceSettings?.bottom ?? 16
        );
        this.updateNineSliceShape = t.nineSliceSettings!.autoUpdate;
        const baseWidth = this.width,
              baseHeight = this.height;
        if ('scaleX' in exts) {
            this.width = baseWidth * (exts.scaleX as number);
        }
        if ('scaleY' in exts) {
            this.height = baseHeight * (exts.scaleY as number);
        }
        uLib.reshapeNinePatch(this as CopyPanel);
        this.blendMode = t.blendMode || PIXI.BLEND_MODES.NORMAL;
    }
}

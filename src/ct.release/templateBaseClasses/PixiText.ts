import {ExportedStyle, ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import uLib from '../u';
import {CopyText} from '.';

import type * as pixiMod from 'node_modules/pixi.js';
import stylesLib from '../styles';
declare var PIXI: typeof pixiMod;

export default class PixiText extends PIXI.Text {
    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'Text') {
            throw new Error('Don\'t call PixiPanel class directly! Use templates.copy to create an instance instead.');
        }
        let style: ExportedStyle;
        if (t.textStyle && t.textStyle !== -1) {
            style = stylesLib.get(t.textStyle, true);
        } else {
            style = {} as ExportedStyle;
        }
        if (exts.customWordWrap) {
            style.wordWrap = true;
            style.wordWrapWidth = Number(exts.customWordWrap);
        }
        if (exts.customSize) {
            style.fontSize = Number(exts.customSize);
        }
        super(
            (exts.customText as string) || t.defaultText || '',
            style as unknown as Partial<pixiMod.ITextStyle>
        );
        if (exts.customAnchor) {
            const anchor = exts.customAnchor as {
                x?: number,
                y?: number
            };
            (this as CopyText).anchor.set(anchor?.x ?? 0, anchor?.y ?? 0);
        }
        (this as CopyText).shape = uLib.getRectShape(this);
        (this as CopyText).scale.set(
            (exts.scaleX as number) ?? 1,
            (exts.scaleY as number) ?? 1
        );
        return this;
    }
}

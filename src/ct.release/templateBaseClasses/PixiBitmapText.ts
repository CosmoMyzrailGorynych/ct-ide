import {ExportedStyle, ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import uLib from '../u';
import {CopyText} from '.';

import type * as pixiMod from 'pixi.js';
import stylesLib from '../styles';
declare var PIXI: typeof pixiMod;

// PIXI.BitmapText accepts ITextStyle but ofc doesn't support outlines and shadows.
// With that, PixiBitmapText class accepts exported ct.js styles,
// and IDE warns about shadows and outlines.
export default class PixiBitmapText extends PIXI.BitmapText {
    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'BitmapText') {
            throw new Error('Don\'t call PixiBitmapText class directly! Use templates.copy to create an instance instead.');
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
            {
                ...style,
                fontName: style.fontFamily.split(',')[0].trim(),
                tint: new PIXI.Color(style.fill as string)
            }
        );
        this.tint = new PIXI.Color(style.fill as string);
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

import stylesLib from '../styles';
import {ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import resLib from '../res';
import uLib from '../u';
import {CopyButton} from '../templateBaseClasses';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

export default class PixiButton extends PIXI.Container {
    panel: pixiMod.NineSlicePlane;
    textLabel: pixiMod.Text;
    normalTexture: pixiMod.Texture;
    hoverTexture: pixiMod.Texture;
    pressedTexture: pixiMod.Texture;
    disabledTexture: pixiMod.Texture;
    updateNineSliceShape: boolean;

    #disabled: boolean;
    get disabled(): boolean {
        return this.#disabled;
    }
    set disabled(val: boolean) {
        this.#disabled = val;
        if (val) {
            this.panel.texture = this.disabledTexture;
            this.eventMode = 'none';
        } else {
            this.panel.texture = this.normalTexture;
            this.eventMode = 'dynamic';
        }
    }

    get text(): string {
        return this.textLabel.text;
    }
    set text(val: string) {
        this.textLabel.text = val;
    }

    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'Button') {
            throw new Error('Don\'t call PixiButton class directly! Use templates.copy to create an instance instead.');
        }
        super();
        this.normalTexture = resLib.getTexture(t.texture, 0);
        this.hoverTexture = t.hoverTexture ?
            resLib.getTexture(t.hoverTexture, 0) :
            this.normalTexture;
        this.pressedTexture = t.pressedTexture ?
            resLib.getTexture(t.pressedTexture, 0) :
            this.normalTexture;
        this.disabledTexture = t.disabledTexture ?
            resLib.getTexture(t.disabledTexture, 0) :
            this.normalTexture;
        this.panel = new PIXI.NineSlicePlane(
            this.normalTexture,
            t.nineSliceSettings?.left ?? 16,
            t.nineSliceSettings?.top ?? 16,
            t.nineSliceSettings?.right ?? 16,
            t.nineSliceSettings?.bottom ?? 16
        );
        const style = t.textStyle === -1 ?
            PIXI.TextStyle.defaultStyle :
            stylesLib.get(t.textStyle, true) as Partial<pixiMod.ITextStyle>;
        if (exts.customSize) {
            style.fontSize = Number(exts.customSize);
        }
        this.textLabel = new PIXI.Text((exts.customText as string) || t.defaultText || '', style);
        this.textLabel.anchor.set(0.5);
        this.addChild(this.panel, this.textLabel);

        this.eventMode = 'dynamic';
        this.cursor = 'pointer';
        this.on('pointerenter', this.hover);
        this.on('pointerentercapture', this.hover);
        this.on('pointerleave', this.blur);
        this.on('pointerleavecapture', this.blur);
        this.on('pointerdown', this.press);
        this.on('pointerdowncapture', this.press);
        this.on('pointerup', this.hover);
        this.on('pointerupcapture', this.hover);
        this.on('pointerupoutside', this.blur);
        this.on('pointerupoutsidecapture', this.blur);

        this.updateNineSliceShape = t.nineSliceSettings.autoUpdate;
        let baseWidth = this.panel.width,
            baseHeight = this.panel.height;
        if ('scaleX' in exts) {
            baseWidth *= (exts.scaleX as number);
        }
        if ('scaleY' in exts) {
            baseHeight *= (exts.scaleY as number);
        }
        this.resize(baseWidth, baseHeight);
        uLib.reshapeNinePatch(this as CopyButton);
    }

    unsize(): void {
        const {x, y} = this.scale;
        this.panel.scale.x *= x;
        this.panel.scale.y *= y;
        this.scale.set(1);
        this.textLabel.x = this.panel.width / 2;
        this.textLabel.y = this.panel.height / 2;
    }
    resize(newWidth: number, newHeight: number): void {
        this.panel.width = newWidth;
        this.panel.height = newHeight;
        this.textLabel.x = newWidth / 2;
        this.textLabel.y = newHeight / 2;
    }

    hover(): void {
        if (this.disabled) {
            return;
        }
        this.panel.texture = this.hoverTexture;
    }
    blur(): void {
        if (this.disabled) {
            return;
        }
        this.panel.texture = this.normalTexture;
    }
    press(): void {
        if (this.disabled) {
            return;
        }
        this.panel.texture = this.pressedTexture;
    }
}

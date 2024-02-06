import stylesLib from '../styles';
import {ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import resLib from '../res';
import uLib from '../u';
import {BasicCopy, CopyTextBox} from 'templates';
import {getFocusedElement, blurFocusedElement} from '../templates';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

export default class PixiTextBox extends PIXI.Container {
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
            this.eventMode = 'auto';
        }
    }

    #focused: boolean;
    #cachedPermitDefault: boolean;
    get isFocused(): boolean {
        return this.#focused;
    }
    #setFocused(val: boolean): void {
        if (getFocusedElement() && getFocusedElement() !== this) {
            blurFocusedElement();
        }
        this.#focused = val;
        if (val) {
            const {isUi} = (this as BasicCopy).getRoom();
            this.panel.texture = this.pressedTexture ?? this.hoverTexture ?? this.normalTexture;
            const x1 = this.x,
                  y1 = this.y,
                  x2 = this.x + this.width,
                  y2 = this.y + this.height;
            const scalar = isUi ? uLib.uiToCssScalar : uLib.gameToCssScalar,
                  coord = isUi ? uLib.uiToCssCoord : uLib.gameToCssCoord;
            const lt = coord(x1, y1),
                  br = coord(x2, y2);
            const textStyle = this.textLabel.style;
            Object.assign(this.#htmlInput.style, {
                fontSize: scalar(parseFloat(textStyle.fontSize as string)) + 'px',
                left: lt.x + 'px',
                top: lt.y + 'px',
                width: br.x - lt.x + 'px',
                height: br.y - lt.y + 'px',
                lineHeight: br.y - lt.y + 'px',
                color: Array.isArray(textStyle.fill) ? textStyle.fill[0] : textStyle.fill
            });
            if (textStyle.strokeThickness) {
                (this.#htmlInput.style as any).textStroke = `${scalar(textStyle.strokeThickness)}px ${textStyle.stroke}`;
                this.#htmlInput.style.webkitTextStroke = (this.#htmlInput.style as any).textStroke;
            } else {
                (this.#htmlInput.style as any).textStroke = this.#htmlInput.style.webkitTextStroke = 'unset';
            }
            if (textStyle.dropShadow) {
                let x = uLib.ldx(textStyle.dropShadowDistance ?? 0, textStyle.dropShadowAngle ?? 0),
                    y = uLib.ldy(textStyle.dropShadowDistance ?? 0, textStyle.dropShadowAngle ?? 0);
                x = scalar(x);
                y = scalar(y);
                this.#htmlInput.style.textShadow = `${textStyle.dropShadowColor} ${x}px ${y}px ${scalar(textStyle.dropShadowBlur ?? 0)}px`;
            }
            this.#htmlInput.value = this.text;
            document.body.appendChild(this.#htmlInput);
            this.#htmlInput.focus();
            this.textLabel.alpha = 0;
            try {
                (window as any).keyboard.permitDefault = this.#cachedPermitDefault;
            } catch (oO) {
                void oO;
            }
        } else {
            this.panel.texture = this.normalTexture;
            this.text = this.#htmlInput.value;
            document.body.removeChild(this.#htmlInput);
            this.textLabel.alpha = 1;
            try {
                this.#cachedPermitDefault = (window as any).keyboard.permitDefault;
                (window as any).keyboard.permitDefault = false;
            } catch (oO) {
                void oO;
            }
        }
    }
    blur(): void {
        this.#setFocused(false);
    }
    focus(): void {
        this.#setFocused(true);
    }

    #htmlInput: HTMLInputElement;

    get text(): string {
        return this.textLabel.text;
    }
    set text(val: string) {
        this.textLabel.text = val;
    }

    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'TextBox') {
            throw new Error('Don\'t call PixiTextBox class directly! Use templates.copy to create an instance instead.');
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
        this.on('pointerleave', this.unhover);
        this.on('pointerleavecapture', this.unhover);
        this.on('pointerdown', this.press);
        this.on('pointerdowncapture', this.press);
        this.on('pointerup', this.hover);
        this.on('pointerupcapture', this.hover);
        this.on('pointerupoutside', this.unhover);
        this.on('pointerupoutsidecapture', this.unhover);

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
        uLib.reshapeNinePatch(this as CopyTextBox);

        this.#disabled = false;
        this.#focused = false;
        this.#htmlInput = document.createElement('input');
        this.#htmlInput.type = 'text';
        this.#htmlInput.className = 'aCtJsTextboxInput';
        this.#htmlInput.addEventListener('click', e => {
            e.stopPropagation();
        });
        this.#htmlInput.addEventListener('pointerup', e => {
            e.stopPropagation();
        });

        const submitHandler = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && this.#focused) {
                this.#setFocused(false);
                e.preventDefault();
            }
        };
        this.on('click', () => {
            this.#setFocused(true);
            document.addEventListener('keydown', submitHandler);
        });
        this.on('pointerupoutside', () => {
            this.#setFocused(false);
            document.removeEventListener('keydown', submitHandler);
        });
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
    unhover(): void {
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

import stylesLib from '../styles';
import {ExportedTemplate} from '../../node_requires/exporter/_exporterContracts';
import resLib from '../res';
import uLib from '../u';
import {BasicCopy} from 'templates';
import {CopyTextBox} from 'templateBaseClasses';
import {setFocusedElement} from '../templates';
import {pixiApp, settings as settingsLib, forceDestroy} from 'index';

import type * as pixiMod from 'pixi.js';
declare var PIXI: typeof pixiMod;

const cssStyle = document.createElement('style');
document.head.appendChild(cssStyle);

export default class PixiTextBox extends PIXI.Container {
    panel: pixiMod.NineSlicePlane;
    textLabel: pixiMod.Text | pixiMod.BitmapText;
    style: Partial<pixiMod.ITextStyle> & {
        fontName: string;
        fontSize: number;
    };
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
    #prevPreventDefault: boolean;
    get isFocused(): boolean {
        return this.#focused;
    }
    #setFocused(val: boolean): void {
        if (val === this.#focused) {
            return;
        }
        this.#focused = val;
        if (val) {
            if (this.#disabled) {
                this.#focused = false;
                return;
            }
            setFocusedElement(this);
            this.panel.texture = this.pressedTexture ?? this.hoverTexture ?? this.normalTexture;
            this.#repositionRestyleInput();
            if (this.maxLength > 0) {
                this.#htmlInput.maxLength = this.maxLength;
            } else {
                this.#htmlInput.maxLength = 524288;
            }
            this.#htmlInput.type = this.fieldType || 'text';
            this.#htmlInput.value = this.text;
            document.body.appendChild(this.#htmlInput);
            this.#htmlInput.focus();
            this.textLabel.alpha = 0;
            try {
                this.#prevPreventDefault = settingsLib.preventDefault;
                settingsLib.preventDefault = false;
            } catch (oO) {
                void oO;
            }
            document.addEventListener('keydown', this.#submitHandler);
            window.addEventListener('resize', this.#repositionRestyleInput);
            pixiApp.stage.off('pointerup', this.#pointerUp);
        } else {
            this.panel.texture = this.normalTexture;
            this.text = this.#htmlInput.value;
            document.body.removeChild(this.#htmlInput);
            this.textLabel.alpha = 1;
            try {
                settingsLib.preventDefault = this.#prevPreventDefault;
            } catch (oO) {
                void oO;
            }
            this.onchange(this.text);
            document.removeEventListener('keydown', this.#submitHandler);
            window.removeEventListener('resize', this.#repositionRestyleInput);
            pixiApp.stage.on('pointerup', this.#pointerUp);
        }
    }
    blur(): void {
        this.#setFocused(false);
    }
    focus(): void {
        this.#setFocused(true);
    }

    #htmlInput: HTMLInputElement;
    // eslint-disable-next-line no-empty-function, class-methods-use-this
    onchange: (value: string) => void = () => {};
    // eslint-disable-next-line no-empty-function, class-methods-use-this
    oninput: (value: string) => void = () => {};

    #pointerUp = (e: pixiMod.FederatedPointerEvent) => {
        if (e.target !== this) {
            this.blur();
        }
    };
    #submitHandler = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && this.#focused) {
            this.#setFocused(false);
            e.preventDefault();
        }
    };
    #repositionRestyleInput = (): void => {
        const {isUi} = (this as BasicCopy).getRoom();
        const x1 = this.x,
              y1 = this.y,
              x2 = this.x + this.width,
              y2 = this.y + this.height;
        const scalar = isUi ? uLib.uiToCssScalar : uLib.gameToCssScalar,
              coord = isUi ? uLib.uiToCssCoord : uLib.gameToCssCoord;
        const lt = coord(x1, y1),
              br = coord(x2, y2);
        const textStyle = this.style;
        // Mimic font style used in pixi.js
        Object.assign(this.#htmlInput.style, {
            fontFamily: textStyle.fontFamily,
            fontSize: scalar(textStyle.fontSize) + 'px',
            left: lt.x + 'px',
            top: lt.y + 'px',
            width: br.x - lt.x + 'px',
            height: br.y - lt.y + 'px',
            lineHeight: br.y - lt.y + 'px',
            color: Array.isArray(textStyle.fill) ? textStyle.fill[0] : textStyle.fill
        });
        if (textStyle.strokeThickness) {
            (this.#htmlInput.style as any).textStroke = `${scalar(textStyle.strokeThickness / 2)}px ${textStyle.stroke}`;
            this.#htmlInput.style.webkitTextStroke = (this.#htmlInput.style as any).textStroke;
        } else {
            (this.#htmlInput.style as any).textStroke = this.#htmlInput.style.webkitTextStroke = 'unset';
        }
        if ('dropShadow' in textStyle) {
            const angle = uLib.radToDeg(textStyle.dropShadowAngle ?? 0);
            let x = uLib.ldx(textStyle.dropShadowDistance ?? 0, angle),
                y = uLib.ldy(textStyle.dropShadowDistance ?? 0, angle);
            x = scalar(x);
            y = scalar(y);
            const css = `${x}px ${y}px ${scalar(textStyle.dropShadowBlur ?? 0)}px ${textStyle.dropShadowColor}`;
            this.#htmlInput.style.textShadow = `${css}, ${css}`; // Make it thicc to match Canvas2D look
        }
        if (this.selectionColor) {
            cssStyle.innerHTML = `
                ::selection {
                    background: ${this.selectionColor};
                }
            `;
        } else {
            cssStyle.innerHTML = '';
        }
    };

    maxLength: number;
    fieldType: ITemplate['fieldType'];
    selectionColor?: string;
    #text: string;
    get text(): string {
        return this.#text;
    }
    set text(val: string) {
        this.#text = val;
        if (this.fieldType === 'password') {
            this.textLabel.text = '•'.repeat(val.length);
        } else {
            this.textLabel.text = val;
        }
    }

    // eslint-disable-next-line max-lines-per-function, complexity
    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'TextBox') {
            throw new Error('Don\'t call PixiTextBox class directly! Use templates.copy to create an instance instead.');
        }
        super();
        forceDestroy.add(this as BasicCopy);
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
        this.maxLength = t.maxTextLength ?? 0;
        this.fieldType = t.fieldType ?? 'text';
        const style = t.textStyle === -1 ?
            PIXI.TextStyle.defaultStyle :
            stylesLib.get(t.textStyle, true) as Partial<pixiMod.ITextStyle>;
        if (exts.customSize) {
            style.fontSize = Number(exts.customSize);
        }
        let text = (exts.customText as string) || t.defaultText || '';
        this.#text = text;
        if (this.fieldType === 'password') {
            text = '•'.repeat(text.length);
        }
        this.style = {
            ...style,
            fontSize: Number(style.fontSize),
            fontName: (style.fontFamily as string).split(',')[0].trim()
        };
        if (t.useBitmapText) {
            this.textLabel = new PIXI.BitmapText((exts.customText as string) || t.defaultText || '', this.style);
            this.textLabel.tint = new PIXI.Color(style.fill as string);
        } else {
            this.textLabel = new PIXI.Text((exts.customText as string) || t.defaultText || '', this.style);
        }
        this.textLabel.anchor.set(0.5);
        this.addChild(this.panel, this.textLabel);

        if (t.selectionColor) {
            this.selectionColor = t.selectionColor;
        }

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

        this.updateNineSliceShape = t.nineSliceSettings!.autoUpdate;
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
        this.#htmlInput.addEventListener('input', () => {
            this.oninput(this.#htmlInput.value);
        });
        this.#htmlInput.addEventListener('blur', () => {
            this.#setFocused(false);
        });

        this.on('pointerup', () => {
            this.#setFocused(true);
        });
    }
    destroy(options?: boolean | pixiMod.IDestroyOptions | undefined): void {
        forceDestroy.delete(this as BasicCopy);
        if (this.#focused) {
            this.#setFocused(false);
        }
        super.destroy(options);
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

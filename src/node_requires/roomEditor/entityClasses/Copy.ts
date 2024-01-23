import {RoomEditor} from '..';
import {RoomEditorPreview} from '../previewer';
import {getById} from '../../resources';
import {getPixiTexture} from '../../resources/templates';
import {getTexturePivot, getPixiTexture as getPixiTextureITexture} from '../../resources/textures';
import {styleToTextStyle} from '../../styleUtils';
import {getByPath} from '../../i18n';

import * as PIXI from 'node_modules/pixi.js';
// import 'node_modules/@pixi/events';

/**
 * @extends PIXI.Container
 * @notice This class automatically adds and removes itself from editor's copy list
 */
class Copy extends PIXI.Container {
    templateId: string;
    copyExts: Record<string, unknown>;
    copyCustomProps: Record<string, unknown>;
    cachedTemplate: ITemplate;
    isGhost: boolean;
    editor: RoomEditor | RoomEditorPreview;

    sprite?: PIXI.AnimatedSprite;
    text?: PIXI.Text;
    nineSlicePlane?: PIXI.NineSlicePlane & {
        initialWidth: number;
        initialHeight: number;
    };
    tilingSprite?: PIXI.TilingSprite & {
        initialWidth: number;
        initialHeight: number;
        scrollSpeedX: number;
        scrollSpeedY: number;
    };

    customTextSettings?: {
        fontSize?: string,
        wordWrapWidth?: string,
        customText?: string;
        anchor?: {
            x: number,
            y: number
        }
    };

    bindings: Partial<Record<CopyBinding, string>> = {};

    align?: IRoomCopy['align'];

    constructor(copyInfo: IRoomCopy, editor: RoomEditor | RoomEditorPreview, isGhost?: boolean) {
        super();
        this.editor = editor;
        this.deserialize(copyInfo);
        this.isGhost = Boolean(isGhost);
        if (this.editor instanceof RoomEditor) {
            this.eventMode = this.isGhost ? 'none' : 'static';
            if (this.eventMode === 'static') {
                this.on('pointerover', () => {
                    const {name} = getById('template', copyInfo.uid);
                    (this.editor as RoomEditor).updateMouseoverHint(name, this);
                });
                this.on('pointerout', () => {
                    (this.editor as RoomEditor).mouseoverOut(this);
                });
            }
        }
        if (!this.isGhost) {
            editor.copies.add(this);
        }
    }
    destroy(): void {
        if (!this.isGhost) {
            this.editor.copies.delete(this);
        }
        super.destroy();
    }
    detach(): this {
        this.editor.copies.delete(this);
        this.editor.room.removeChild(this);
        return this;
    }
    restore(): this {
        this.editor.copies.add(this);
        this.editor.room.addChild(this);
        return this;
    }

    get animated(): boolean {
        return getById('template', this.templateId as string).playAnimationOnStart;
    }

    tick(delta: number, time: number): void {
        if (this.animated && this.sprite) {
            this.sprite?.update(delta);
        }
        if (this.tilingSprite) {
            this.tilingSprite.tilePosition.x += this.tilingSprite.scrollSpeedX * time;
            this.tilingSprite.tilePosition.y += this.tilingSprite.scrollSpeedY * time;
        }
    }

    /**
     * Resizes the 9-slice plane to undo the scaling of the container
     * and redraw the plane to fill its frame.
     */
    updateNinePatch(): void {
        if (!this.nineSlicePlane) {
            return;
        }
        const n9 = this.nineSlicePlane;
        n9.scale.set(
            1 / this.scale.x,
            1 / this.scale.y
        );
        n9.width = n9.initialWidth * this.scale.x;
        n9.height = n9.initialHeight * this.scale.y;
        if (this.text) {
            this.text.scale.set(
                1 / this.scale.x,
                1 / this.scale.y
            );
            this.text.x = n9.initialWidth / 2;
            this.text.y = n9.initialHeight / 2;
        }
    }
    updateTilingSprite(): void {
        const tiling = this.tilingSprite,
              template = this.cachedTemplate;
        if (template.baseClass === 'RepeatingTexture') {
            tiling.scale.set(
                1 / this.scale.x,
                1 / this.scale.y
            );
            tiling.width = tiling.initialWidth * this.scale.x;
            tiling.height = tiling.initialHeight * this.scale.y;
        } else if (template.baseClass === 'SpritedCounter') {
            tiling.width = template.repeaterSettings.defaultCount * tiling.initialWidth;
            tiling.height = tiling.initialHeight;
        }
    }

    rescale(): void {
        if (this.nineSlicePlane) {
            this.updateNinePatch();
        }
        if (this.tilingSprite) {
            this.updateTilingSprite();
        }
    }

    #tint: PIXI.ColorSource;
    set tint(val: PIXI.ColorSource) {
        (this.sprite || this.nineSlicePlane || this.text || this.tilingSprite || this).tint = val;
    }
    get tint(): PIXI.ColorSource {
        return this.sprite?.tint ||
            this.text?.tint ||
            this.nineSlicePlane?.tint ||
            this.tilingSprite?.tint ||
            this.#tint;
    }

    serialize(deepCopy = false): IRoomCopy {
        const copy: IRoomCopy = {
            x: this.x,
            y: this.y,
            opacity: this.alpha,
            tint: this.tint as number,
            scale: {
                x: this.scale.x,
                y: this.scale.y
            },
            rotation: this.rotation,
            uid: this.templateId,
            exts: deepCopy ? JSON.parse(JSON.stringify(this.copyExts)) : this.copyExts,
            customProperties: deepCopy ?
                JSON.parse(JSON.stringify(this.copyCustomProps)) :
                this.copyCustomProps,
            bindings: {
                ...this.bindings
            }
        };
        if (this.align) {
            copy.align = this.align;
        }
        if (this.text) {
            if (this.customTextSettings.anchor) {
                copy.customAnchor = this.customTextSettings.anchor;
            }
            if (this.customTextSettings.wordWrapWidth) {
                copy.customWordWrap = this.customTextSettings.wordWrapWidth;
            }
            if (this.customTextSettings.fontSize) {
                copy.customSize = this.customTextSettings.fontSize;
            }
            if (this.customTextSettings.customText) {
                copy.customText = this.customTextSettings.customText;
            }
        }
        return copy;
    }
    // eslint-disable-next-line complexity, max-lines-per-function
    deserialize(copy: IRoomCopy): void {
        this.templateId = copy.uid;
        const t = getById('template', this.templateId as string);
        this.cachedTemplate = t;
        this.x = copy.x;
        this.y = copy.y;
        this.zIndex = this.cachedTemplate.depth;
        this.alpha = copy.opacity ?? 1;
        this.scale.x = copy.scale?.x ?? 1;
        this.scale.y = copy.scale?.y ?? 1;
        this.rotation = copy.rotation ?? 0;
        this.templateId = copy.uid;
        this.copyExts = copy.exts ?? {};
        this.copyCustomProps = copy.customProperties ?
            {
                ...copy.customProperties
            } :
            {};
        this.bindings = copy.bindings ?
            {
                ...copy.bindings
            } :
            {};
        this.align = copy.align;
        if (this.cachedTemplate.baseClass === 'AnimatedSprite') {
            this.sprite = new PIXI.AnimatedSprite(getPixiTexture(copy.uid));
            this.sprite.autoUpdate = false;
            this.sprite.animationSpeed = (t.animationFPS ?? 60) / 60;
            this.sprite.loop = t.loopAnimation ?? true;
            if (t.playAnimationOnStart) {
                this.sprite.play();
            }
            if (t.texture !== -1) {
                [this.sprite.anchor.x, this.sprite.anchor.y] = getTexturePivot(t.texture);
            } else {
                this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
            }
            this.addChild(this.sprite);
        } else if (this.cachedTemplate.baseClass === 'Container') {
            this.sprite = new PIXI.AnimatedSprite(getPixiTextureITexture(-1, void 0, true));
            this.sprite.autoUpdate = false;
            this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
            this.addChild(this.sprite);
        }
        if (['Button', 'Text'].includes(this.cachedTemplate.baseClass)) {
            this.customTextSettings = {};
            const blends: Partial<PIXI.ITextStyle> = {};
            if (copy.customSize) {
                this.customTextSettings.fontSize = copy.customSize;
                blends.fontSize = Number(this.customTextSettings.fontSize);
            }
            if (copy.customWordWrap) {
                blends.wordWrap = true;
                blends.wordWrapWidth = Number(copy.customWordWrap);
                this.customTextSettings.wordWrapWidth = copy.customWordWrap;
            }
            if (copy.customText) {
                this.customTextSettings.customText = copy.customText;
            }
            const style: Partial<PIXI.ITextStyle> | false = t.textStyle && (t.textStyle !== -1) &&
                (Object.assign(
                    {},
                    styleToTextStyle(getById('style', t.textStyle)),
                    blends
                ) as unknown as Partial<PIXI.ITextStyle>);
            const text = copy.customText ||
                this.cachedTemplate.defaultText ||
                getByPath('roomView.emptyTextFiller') as string;
            this.text = new PIXI.Text(text, style);
            this.addChild(this.text);
            if (copy.customAnchor) {
                this.customTextSettings.anchor = {
                    ...copy.customAnchor
                };
                this.text.anchor.set(copy.customAnchor.x, copy.customAnchor.y);
            }
        }
        if (['Button', 'NineSlicePlane'].includes(this.cachedTemplate.baseClass)) {
            this.nineSlicePlane =
                new PIXI.NineSlicePlane(getPixiTexture(copy.uid)[0]) as Copy['nineSlicePlane'];
            this.nineSlicePlane.initialWidth = this.nineSlicePlane.width;
            this.nineSlicePlane.initialHeight = this.nineSlicePlane.height;
            this.nineSlicePlane.topHeight = t.nineSliceSettings.top;
            this.nineSlicePlane.bottomHeight = t.nineSliceSettings.bottom;
            this.nineSlicePlane.leftWidth = t.nineSliceSettings.left;
            this.nineSlicePlane.rightWidth = t.nineSliceSettings.right;
            this.addChildAt(this.nineSlicePlane, 0);
            this.updateNinePatch();
            if (this.text) {
                this.text.anchor.set(0.5);
                this.text.x = this.nineSlicePlane.initialWidth / 2;
                this.text.y = this.nineSlicePlane.initialHeight / 2;
            }
        }
        if (['SpritedCounter', 'RepeatingTexture'].includes(this.cachedTemplate.baseClass)) {
            const [tex] = getPixiTexture(copy.uid);
            this.tilingSprite = new PIXI.TilingSprite(
                tex,
                tex.width,
                tex.height
            ) as Copy['tilingSprite'];
            this.tilingSprite.initialWidth = this.tilingSprite.width;
            this.tilingSprite.initialHeight = this.tilingSprite.height;
            this.tilingSprite.anchor.set(0);
            if (this.cachedTemplate.baseClass === 'RepeatingTexture') {
                this.tilingSprite.scrollSpeedX = t.tilingSettings.scrollSpeedX;
                this.tilingSprite.scrollSpeedY = t.tilingSettings.scrollSpeedY;
            } else {
                this.tilingSprite.scrollSpeedX = 0;
                this.tilingSprite.scrollSpeedY = 0;
            }
            this.addChildAt(this.tilingSprite, 0);
            this.updateTilingSprite();
        }
        this.tint = copy.tint ?? 0xffffff;
    }
    recreate(): void {
        this.text?.destroy();
        this.nineSlicePlane?.destroy();
        this.sprite?.destroy();
        this.tilingSprite?.destroy();
        this.text = this.nineSlicePlane = this.sprite = this.tilingSprite = void 0;
        this.deserialize(this.serialize(false));
    }
    refreshTexture(): void {
        const t = this.cachedTemplate;
        if (this.sprite) {
            this.sprite.textures = getPixiTexture(t);
            if (t.texture !== -1) {
                [this.sprite.anchor.x, this.sprite.anchor.y] = getTexturePivot(t.texture);
            } else {
                this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
            }
        } else if (this.nineSlicePlane) {
            [this.nineSlicePlane.texture] = getPixiTexture(t);
        } else if (this.tilingSprite) {
            [this.tilingSprite.texture] = getPixiTexture(t);
        }
    }
    updateText(): void {
        const cts = this.customTextSettings;
        this.text.text = cts.customText ||
            this.cachedTemplate.defaultText ||
            getByPath('roomView.emptyTextFiller') as string;
        if (cts.anchor) {
            this.text.anchor.set(cts.anchor.x, cts.anchor.y);
        }
        if (cts.wordWrapWidth) {
            this.text.style.wordWrapWidth = Number(cts.wordWrapWidth);
            this.text.style.wordWrap = true;
        } else {
            this.text.style.wordWrap = this.cachedTemplate.textStyle &&
                this.cachedTemplate.textStyle !== -1 &&
                getById('style', this.cachedTemplate.textStyle).font.wrap;
        }
        if (cts.fontSize) {
            this.text.style.fontSize = Number(cts.fontSize);
        }
    }
}

export {Copy};

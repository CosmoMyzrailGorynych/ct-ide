import {RoomEditor} from '..';
import {getPixiTexture, getTemplateFromId} from '../../resources/templates';
import {getTexturePivot} from '../../resources/textures';

/**
 * @notice This class automatically adds and removes itself from editor's copy list
 */
class Copy extends PIXI.AnimatedSprite {
    templateId: string;
    copyExts: Record<string, unknown>;
    copyCustomProps: Record<string, unknown>;
    cachedTemplate: ITemplate;
    isGhost: boolean;
    editor: RoomEditor;
    autoUpdate: boolean;
    update: (deltaTime: number) => void;

    constructor(copyInfo: IRoomCopy, editor: RoomEditor, isGhost?: boolean) {
        super(getPixiTexture(copyInfo.uid));
        this.editor = editor;
        this.templateId = copyInfo.uid;
        this.autoUpdate = false;
        const t = getTemplateFromId(this.templateId as string);
        this.cachedTemplate = t;
        this.deserialize(copyInfo);
        this.isGhost = Boolean(isGhost);
        this.interactive = !this.isGhost;
        if (this.interactive) {
            this.on('pointerover', () => {
                this.editor.updateMouseoverHint(t.name, this);
            });
            this.on('pointerout', () => {
                this.editor.mouseoverOut(this);
            });
        }
        if (t.playAnimationOnStart) {
            this.play();
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
        return getTemplateFromId(this.templateId as string).playAnimationOnStart;
    }

    serialize(deepCopy = false): IRoomCopy {
        return {
            x: this.x,
            y: this.y,
            opacity: this.alpha,
            tint: this.tint,
            scale: {
                x: this.scale.x,
                y: this.scale.y
            },
            rotation: this.rotation,
            uid: this.templateId,
            exts: deepCopy ? JSON.parse(JSON.stringify(this.copyExts)) : this.copyExts,
            customProperties: deepCopy ?
                JSON.parse(JSON.stringify(this.copyCustomProps)) :
                this.copyCustomProps
        };
    }
    deserialize(copy: IRoomCopy): void {
        this.x = copy.x;
        this.y = copy.y;
        this.zIndex = this.cachedTemplate.depth;
        this.alpha = copy.opacity ?? 1;
        this.tint = copy.tint ?? 0xffffff;
        this.scale.x = copy.scale?.x ?? 1;
        this.scale.y = copy.scale?.y ?? 1;
        this.rotation = copy.rotation ?? 0;
        this.templateId = copy.uid;
        this.copyExts = copy.exts ?? {};
        this.copyCustomProps = copy.customProperties ?? {};
        const t = getTemplateFromId(this.templateId as string);
        this.animationSpeed = (t.animationFPS ?? 60) / 60;
        this.loop = t.loopAnimation ?? true;
        if (t.texture !== -1) {
            [this.anchor.x, this.anchor.y] = getTexturePivot(t.texture);
        } else {
            this.anchor.x = this.anchor.y = 0.5;
        }
    }
    refreshTexture(): void {
        const t = this.cachedTemplate;
        this.textures = getPixiTexture(t);
        if (t.texture !== -1) {
            [this.anchor.x, this.anchor.y] = getTexturePivot(t.texture);
        } else {
            this.anchor.x = this.anchor.y = 0.5;
        }
    }
}

export {Copy};

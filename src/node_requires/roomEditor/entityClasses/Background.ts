import {getPixiTexture} from '../../resources/textures';
import {RoomEditor} from '..';

class Background extends PIXI.TilingSprite {
    bgTexture: assetRef;
    editor: RoomEditor;
    shiftX = 0;
    shiftY = 0;
    parallaxX = 1;
    parallaxY = 1;
    movementX = 0;
    movementY = 0;
    simulatedMovedX = 0;
    simulatedMovedY = 0;
    repeat: canvasPatternRepeat = 'repeat';

    constructor(bgInfo: IRoomBackground, editor: RoomEditor) {
        super(getPixiTexture(bgInfo.texture, 0, true));
        this.anchor.x = this.anchor.y = 0;
        this.editor = editor;
        this.deserialize(bgInfo);
        this.tick(0);
    }
    destroy(): void {
        const ind = this.editor.backgrounds.indexOf(this);
        if (ind !== -1) {
            this.editor.backgrounds.splice(ind, 1);
            this.editor.riotEditor.refs.backgroundsEditor?.update();
        }
        super.destroy();
    }
    detach(): this {
        const ind = this.editor.backgrounds.indexOf(this);
        if (ind === -1) {
            throw new Error('Attempt to detach an off-screen background');
        }
        this.editor.backgrounds.splice(ind, 1);
        this.parent.removeChild(this);
        this.editor.riotEditor.refs.backgroundsEditor.update();
        return this;
    }
    restore(): this {
        this.editor.backgrounds.push(this);
        this.editor.room.addChild(this);
        this.editor.riotEditor.refs.backgroundsEditor.update();
        return this;
    }

    changeTexture(id: assetRef): void {
        this.texture = getPixiTexture(id, 0, true);
        this.anchor.x = this.anchor.y = 0;
        this.bgTexture = id;
    }

    serialize(): IRoomBackground {
        return {
            depth: this.zIndex,
            texture: this.bgTexture as string,
            shiftX: this.shiftX,
            shiftY: this.shiftY,
            parallaxX: this.parallaxX,
            parallaxY: this.parallaxY,
            movementX: this.movementX,
            movementY: this.movementY,
            scaleX: this.tileScale.x,
            scaleY: this.tileScale.y,
            repeat: this.repeat
        };
    }
    deserialize(bg: IRoomBackground): void {
        this.zIndex = bg.depth;
        this.bgTexture = bg.texture;
        this.shiftX = bg.shiftX;
        this.shiftY = bg.shiftY;
        this.parallaxX = bg.parallaxX;
        this.parallaxY = bg.parallaxY;
        this.movementX = bg.movementX;
        this.movementY = bg.movementY;
        this.tileScale.set(bg.scaleX, bg.scaleY);
        this.repeat = bg.repeat;
    }
    refreshTexture(): void {
        this.texture = getPixiTexture(this.bgTexture, 0);
        this.anchor.x = this.anchor.y = 0;
    }
    tick(deltaTime: number): void {
        const {camera, screen} = this.editor;
        const cameraBounds = {
            x: camera.x - screen.width / 2 * camera.scale.x,
            y: camera.y - screen.height / 2 * camera.scale.y,
            width: screen.width * camera.scale.x,
            height: screen.height * camera.scale.y
        };
        if (this.movementX === 0) {
            this.simulatedMovedX = 0;
        }
        if (this.movementY === 0) {
            this.simulatedMovedY = 0;
        }
        if (deltaTime > 0) {
            this.simulatedMovedX += deltaTime * this.movementX;
            this.simulatedMovedY += deltaTime * this.movementY;
        }
        if (this.repeat !== 'repeat-x' && this.repeat !== 'no-repeat') {
            this.y = cameraBounds.y;
            this.tilePosition.y = -this.y * this.parallaxY + this.shiftY + this.simulatedMovedY;
            this.height = cameraBounds.height + 1;
        } else {
            this.y = this.shiftY + this.simulatedMovedY + cameraBounds.y * (this.parallaxY - 1);
            this.height = this.texture.height * this.tileScale.y;
            this.tilePosition.y = 0;
        }
        if (this.repeat !== 'repeat-y' && this.repeat !== 'no-repeat') {
            this.x = cameraBounds.x;
            this.tilePosition.x = -this.x * this.parallaxX + this.shiftX + this.simulatedMovedX;
            this.width = cameraBounds.width + 1;
        } else {
            this.x = this.shiftX + this.simulatedMovedX + cameraBounds.x * (this.parallaxX - 1);
            this.width = this.texture.width * this.tileScale.x;
            this.tilePosition.x = 0;
        }
    }
}

export {Background};

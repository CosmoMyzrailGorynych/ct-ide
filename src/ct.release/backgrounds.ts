import * as PIXI from 'node_modules/pixi.js';
import {Room} from './rooms';
import {ctjsGame} from '.';
import {res} from './res';
import {templates} from './templates';

import {ExportedBg} from './../node_requires/exporter/_exporterContracts';

const bgList: Record<string, Background[]> = {};

/**
 * @extends {PIXI.TilingSprite}
 */
export class Background extends PIXI.TilingSprite {
    /**
     * A value that makes background move faster
     * or slower relative to other objects. It is often used to create an effect of depth.
     * `1` means regular movement, values smaller than 1
     * will make it move slower and make an effect that a background is placed farther
     * away from camera; values larger than 1 will do the opposite, making the background
     * appear closer than the rest of the object.
     * This property is for horizontal movement.
     */
    parallaxX = 1;
    /**
     * A value that makes background move faster
     * or slower relative to other objects. It is often used to create an effect of depth.
     * `1` means regular movement, values smaller than 1
     * will make it move slower and make an effect that a background is placed farther
     * away from camera; values larger than 1 will do the opposite, making the background
     * appear closer than the rest of the object.
     * This property is for vertical movement.
     */
    parallaxY = 1;
    /**
     * How much to shift the texture horizontally, in pixels.
     */
    shiftX = 0;
    /**
     * How much to shift the texture vertically, in pixels.
     */
    shiftY = 0;
    /**
     * The speed at which the background's texture moves by X axis,
     * wrapping around its area. The value is measured in pixels per frame, and takes
     * `ct.delta` into account.
     */
    movementX = 0;
    /**
     * The speed at which the background's texture moves by Y axis,
     * wrapping around its area. The value is measured in pixels per frame, and takes
     * `ct.delta` into account.
     */
    movementY = 0;
    /**
     * Sets in which directions the background should repeat (if at all).
     */
    repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
    /**
     * The stretch to apply to the repeated texture.
     */
    scaleX: number;
    /**
     * The stretch to apply to the repeated texture.
     */
    scaleY: number;
    xprev: number;
    yprev: number;
    kill: boolean;
    _destroyed: boolean;
    parent: Room;
    constructor(
        texName: string | PIXI.Texture,
        frame = 0,
        depth = 0,
        exts: ExportedBg['exts'] = {
            movementX: 0,
            movementY: 0,
            parallaxX: 0,
            parallaxY: 0,
            repeat: 'repeat',
            scaleX: 0,
            scaleY: 0,
            shiftX: 0,
            shiftY: 0
        }
    ) {
        let {width, height} = ctjsGame.camera;
        const texture = texName instanceof PIXI.Texture ?
            texName :
            res.getTexture(texName, frame || 0);
        if (exts.repeat === 'no-repeat' || exts.repeat === 'repeat-x') {
            height = texture.height * (exts.scaleY || 1);
        }
        if (exts.repeat === 'no-repeat' || exts.repeat === 'repeat-y') {
            width = texture.width * (exts.scaleX || 1);
        }
        super(texture, width, height);
        if (typeof texName === 'string') {
            if (!bgList[texName]) {
                bgList[texName] = [];
            }
            bgList[texName].push(this);
        } else {
            if (!bgList.OTHER) {
                bgList.OTHER = [];
            }
            bgList.OTHER.push(this);
        }
        templates.list.BACKGROUND.push(this);
        ctjsGame.stack.push(this);
        this.zIndex = depth;
        this.anchor.set(0, 0);
        if (exts) {
            Object.assign(this, exts);
        }
        if (this.scaleX) {
            this.tileScale.x = Number(this.scaleX);
        }
        if (this.scaleY) {
            this.tileScale.y = Number(this.scaleY);
        }
        this.reposition();
    }
    onStep(): void {
        this.shiftX += ctjsGame.delta * this.movementX;
        this.shiftY += ctjsGame.delta * this.movementY;
    }
    /**
     * Updates the position of this background.
     */
    reposition(): void {
        const cameraBounds = this.isUi ?
            {
                x: 0, y: 0, width: ctjsGame.camera.width, height: ctjsGame.camera.height
            } :
            ctjsGame.camera.getBoundingBox();
        const dx = ctjsGame.camera.x - ctjsGame.camera.width / 2,
              dy = ctjsGame.camera.y - ctjsGame.camera.height / 2;
        if (this.repeat !== 'repeat-x' && this.repeat !== 'no-repeat') {
            this.y = cameraBounds.y;
            this.tilePosition.y = -this.y - dy * (this.parallaxY - 1) + this.shiftY;
            this.height = cameraBounds.height + 1;
        } else {
            this.y = this.shiftY + cameraBounds.y * (this.parallaxY - 1);
        }
        if (this.repeat !== 'repeat-y' && this.repeat !== 'no-repeat') {
            this.x = cameraBounds.x;
            this.tilePosition.x = -this.x - dx * (this.parallaxX - 1) + this.shiftX;
            this.width = cameraBounds.width + 1;
        } else {
            this.x = this.shiftX + cameraBounds.x * (this.parallaxX - 1);
        }
    }
    onDraw(): void {
        this.reposition();
    }
    static onCreate(): void {
        void 0;
    }
    static onDestroy(): void {
        void 0;
    }
    get isUi(): boolean {
        return this.parent ? Boolean(this.parent.isUi) : false;
    }
}

const backgroundsLib = {
    list: bgList,
    /**
     * @returns The created background
     */
    add(texName: string, frame = 0, depth = 0, container: PIXI.Container): Background {
        if (!container) {
            container = ctjsGame.room;
        }
        if (!texName) {
            throw new Error('[backgrounds] The texName argument is required.');
        }
        const bg = new Background(texName, frame, depth);
        container.addChild(bg);
        return bg;
    }
};

export const backgrounds = backgroundsLib;

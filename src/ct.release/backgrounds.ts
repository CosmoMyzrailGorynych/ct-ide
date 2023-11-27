import roomsLib, {Room} from './rooms';
import res from './res';
import templatesLib from './templates';

import {ExportedBg} from './../node_requires/exporter/_exporterContracts';
import mainCamera from 'camera';
import {stack} from 'index';
import uLib from 'u';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

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
    parallaxX: number;
    /**
     * A value that makes background move faster
     * or slower relative to other objects. It is often used to create an effect of depth.
     * `1` means regular movement, values smaller than 1
     * will make it move slower and make an effect that a background is placed farther
     * away from camera; values larger than 1 will do the opposite, making the background
     * appear closer than the rest of the object.
     * This property is for vertical movement.
     */
    parallaxY: number;
    /**
     * How much to shift the texture horizontally, in pixels.
     */
    shiftX: number;
    /**
     * How much to shift the texture vertically, in pixels.
     */
    shiftY: number;
    /**
     * The speed at which the background's texture moves by X axis,
     * wrapping around its area. The value is measured in pixels per frame, and takes
     * `ct.delta` into account.
     */
    movementX: number;
    /**
     * The speed at which the background's texture moves by Y axis,
     * wrapping around its area. The value is measured in pixels per frame, and takes
     * `ct.delta` into account.
     */
    movementY: number;
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
        texName: string | pixiMod.Texture,
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
        let {width, height} = mainCamera;
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
        this.parallaxX = 1;
        this.parallaxY = 1;
        this.shiftX = 0;
        this.shiftY = 0;
        this.movementX = 0;
        this.movementY = 0;
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
        templatesLib.list.BACKGROUND.push(this);
        stack.push(this);
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
        this.shiftX += uLib.time * this.movementX;
        this.shiftY += uLib.time * this.movementY;
    }
    /**
     * Updates the position of this background.
     */
    reposition(): void {
        const cameraBounds = this.isUi ?
            {
                x: 0, y: 0, width: mainCamera.width, height: mainCamera.height
            } :
            mainCamera.getBoundingBox();
        const dx = mainCamera.x - mainCamera.width / 2,
              dy = mainCamera.y - mainCamera.height / 2;
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
    /**
     * An object that contains all the backgrounds of the current room.
     * @type {Record<string, Background[]>}
     */
    list: bgList,
    /**
     * @param texName - Name of a texture to use as a background
     * @param [frame] - The index of a frame to use. Defaults to 0
     * @param [depth] - The depth to place the background at. Defaults to 0
     * @param [container] - Where to put the background. Defaults to current room,
     * can be a room or other pixi container.
     * @returns {Background} The created background
     */
    add(texName: string, frame = 0, depth = 0, container: pixiMod.Container): Background {
        if (!container) {
            container = roomsLib.current;
        }
        if (!texName) {
            throw new Error('[backgrounds] The texName argument is required.');
        }
        const bg = new Background(texName, frame, depth);
        if (container instanceof Room) {
            container.backgrounds.push(bg);
        }
        container.addChild(bg);
        return bg;
    }
};
export default backgroundsLib;

import templatesLib, {BasicCopy} from './templates';
import roomsLib, {Room} from './rooms';
import uLib from './u';
import {copyTypeSymbol, pixiApp} from 'index';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

/**
 * This class represents a camera that is used by ct.js' cameras.
 * Usually you won't create new instances of it, but if you need, you can substitute
 * ct.camera with a new one.
 *
 * @extends {PIXI.DisplayObject}
 * @class
 *
 * @property {number} x The real x-coordinate of the camera.
 * It does not have a screen shake effect applied, as well as may differ from `targetX`
 * if the camera is in transition.
 * @property {number} y The real y-coordinate of the camera.
 * It does not have a screen shake effect applied, as well as may differ from `targetY`
 * if the camera is in transition.
 * @property {number} width The width of the unscaled shown region.
 * This is the base, unscaled value. Use ct.camera.scale.x to get a scaled version.
 * To change this value, see `ct.width` property.
 * @property {number} height The width of the unscaled shown region.
 * This is the base, unscaled value. Use ct.camera.scale.y to get a scaled version.
 * To change this value, see `ct.height` property.
 * @property {number} targetX The x-coordinate of the target location.
 * Moving it instead of just using the `x` parameter will trigger the drift effect.
 * @property {number} targetY The y-coordinate of the target location.
 * Moving it instead of just using the `y` parameter will trigger the drift effect.
 *
 * @property {BasicCopy|false} follow If set, the camera will follow the given copy.
 * @property {boolean} followX Works if `follow` is set to a copy.
 * Enables following in X axis. Set it to `false` and followY to `true`
 * to limit automatic camera movement to vertical axis.
 * @property {boolean} followY Works if `follow` is set to a copy.
 * Enables following in Y axis. Set it to `false` and followX to `true`
 * to limit automatic camera movement to horizontal axis.
 * @property {number|null} borderX Works if `follow` is set to a copy.
 * Sets the frame inside which the copy will be kept, in game pixels.
 * Can be set to `null` so the copy is set to the center of the screen.
 * @property {number|null} borderY Works if `follow` is set to a copy.
 * Sets the frame inside which the copy will be kept, in game pixels.
 * Can be set to `null` so the copy is set to the center of the screen.
 * @property {number} shiftX Displaces the camera horizontally
 * but does not change x and y parameters.
 * @property {number} shiftY Displaces the camera vertically
 * but does not change x and y parameters.
 * @property {number} drift Works if `follow` is set to a copy.
 * If set to a value between 0 and 1, it will make camera movement smoother
 *
 * @property {number} shake The current power of a screen shake effect,
 * relative to the screen's max side (100 is 100% of screen shake).
 * If set to 0 or less, it, disables the effect.
 * @property {number} shakePhase The current phase of screen shake oscillation.
 * @property {number} shakeDecay The amount of `shake` units substracted in a second.
 * Default is 5.
 * @property {number} shakeFrequency The base frequency of the screen shake effect.
 * Default is 50.
 * @property {number} shakeX A multiplier applied to the horizontal screen shake effect.
 * Default is 1.
 * @property {number} shakeY A multiplier applied to the vertical screen shake effect.
 * Default is 1.
 * @property {number} shakeMax The maximum possible value for the `shake` property
 * to protect players from losing their monitor, in `shake` units. Default is 10.
 */
const shakeCamera = function shakeCamera(camera: Camera, delta: number) {
    const sec = delta / (PIXI.Ticker.shared.maxFPS || 60);
    camera.shake -= sec * camera.shakeDecay;
    camera.shake = Math.max(0, camera.shake);
    if (camera.shakeMax) {
        camera.shake = Math.min(camera.shake, camera.shakeMax);
    }
    const phaseDelta = sec * camera.shakeFrequency;
    camera.shakePhase += phaseDelta;
    // no logic in these constants
    // They are used to desync fluctuations and remove repetitive circular movements
    camera.shakePhaseX += phaseDelta * (1 + Math.sin(camera.shakePhase * 0.1489) * 0.25);
    camera.shakePhaseY += phaseDelta * (1 + Math.sin(camera.shakePhase * 0.1734) * 0.25);
};
const followCamera = function followCamera(camera: Camera) {
    // eslint-disable-next-line max-len
    const bx = camera.borderX === null ? camera.width / 2 : Math.min(camera.borderX, camera.width / 2),
          // eslint-disable-next-line max-len
          by = camera.borderY === null ? camera.height / 2 : Math.min(camera.borderY, camera.height / 2);
    const tl = camera.uiToGameCoord(bx, by),
          br = camera.uiToGameCoord(camera.width - bx, camera.height - by);
    if (!camera.follow) {
        return;
    }
    if (camera.followX) {
        if (camera.follow.x < tl.x - camera.interpolatedShiftX) {
            camera.targetX = camera.follow.x - bx + camera.width / 2;
        } else if (camera.follow.x > br.x - camera.interpolatedShiftX) {
            camera.targetX = camera.follow.x + bx - camera.width / 2;
        }
    }
    if (camera.followY) {
        if (camera.follow.y < tl.y - camera.interpolatedShiftY) {
            camera.targetY = camera.follow.y - by + camera.height / 2;
        } else if (camera.follow.y > br.y - camera.interpolatedShiftY) {
            camera.targetY = camera.follow.y + by - camera.height / 2;
        }
    }
};
const restrictInRect = function restrictInRect(camera: Camera) {
    if (camera.minX !== void 0) {
        const boundary = camera.minX + camera.width * camera.scale.x * 0.5;
        camera.x = Math.max(boundary, camera.x);
        camera.targetX = Math.max(boundary, camera.targetX);
    }
    if (camera.maxX !== void 0) {
        const boundary = camera.maxX - camera.width * camera.scale.x * 0.5;
        camera.x = Math.min(boundary, camera.x);
        camera.targetX = Math.min(boundary, camera.targetX);
    }
    if (camera.minY !== void 0) {
        const boundary = camera.minY + camera.height * camera.scale.y * 0.5;
        camera.y = Math.max(boundary, camera.y);
        camera.targetY = Math.max(boundary, camera.targetY);
    }
    if (camera.maxY !== void 0) {
        const boundary = camera.maxY - camera.height * camera.scale.y * 0.5;
        camera.y = Math.min(boundary, camera.y);
        camera.targetY = Math.min(boundary, camera.targetY);
    }
};
export class Camera extends PIXI.DisplayObject {
    follow: pixiMod.DisplayObject | BasicCopy | undefined | false;
    followX: boolean;
    followY: boolean;
    targetX: number;
    targetY: number;
    #width: number;
    #height: number;
    z: number;
    shiftX: number;
    shiftY: number;
    interpolatedShiftX: number;
    interpolatedShiftY: number;
    borderX: number;
    borderY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    drift: number;
    shake: number;
    shakeDecay: number;
    shakeX: number;
    shakeY: number;
    shakeFrequency: number;
    shakePhase: number;
    shakePhaseX: number;
    shakePhaseY: number;
    shakeMax: number;
    constructor(x: number, y: number, w: number, h: number) {
        super();
        this.reset(x, y, w, h);
        this.getBounds = this.getBoundingBox;
    }
    reset(x: number, y: number, w: number, h: number): void {
        this.followX = this.followY = true;
        this.targetX = this.x = x;
        this.targetY = this.y = y;
        this.z = 500;
        this.#width = w || 1920;
        this.#height = h || 1080;
        this.shiftX = this.shiftY = this.interpolatedShiftX = this.interpolatedShiftY = 0;
        this.borderX = this.borderY = null;
        this.drift = 0;

        this.shake = 0;
        this.shakeDecay = 5;
        this.shakeX = this.shakeY = 1;
        this.shakeFrequency = 50;
        this.shakePhase = this.shakePhaseX = this.shakePhaseY = 0;
        this.shakeMax = 10;
    }

    get width(): number {
        return this.#width;
    }
    set width(value: number) {
        this.#width = value;
    }
    get height(): number {
        return this.#height;
    }
    set height(value: number) {
        this.#height = value;
    }

    get scale(): pixiMod.ObservablePoint {
        return this.transform.scale;
    }
    set scale(value: number | pixiMod.Point) {
        if (typeof value === 'number') {
            this.transform.scale.x = this.transform.scale.y = value;
        } else {
            this.transform.scale.copyFrom(value);
        }
    }

    // Dummying unneeded methods that need implementation in non-abstract classes of DisplayObject
    render(): void {
        void this;
    }
    // Can't have children as it is not a container
    removeChild(): void {
        void this;
    }
    // Same story
    sortDirty = false;
    calculateBounds(): void {
        void this;
    }

    /**
     * Moves the camera to a new position. It will have a smooth transition
     * if a `drift` parameter is set.
     * @param x New x coordinate
     * @param y New y coordinate
     */
    moveTo(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;
    }

    /**
     * Moves the camera to a new position. Ignores the `drift` value.
     * @param x New x coordinate
     * @param y New y coordinate
     */
    teleportTo(x: number, y: number): void {
        this.targetX = this.x = x;
        this.targetY = this.y = y;
        this.shakePhase = this.shakePhaseX = this.shakePhaseY = 0;
        this.interpolatedShiftX = this.shiftX;
        this.interpolatedShiftY = this.shiftY;
    }

    /**
     * Updates the position of the camera
     * @param delta A delta value between the last two frames.
     * This is usually ct.delta.
     */
    update(delta: number): void {
        shakeCamera(this, delta);
        // Check if we've been following a copy that is now killed
        if (this.follow && (copyTypeSymbol in this.follow) && (this.follow as BasicCopy).kill) {
            this.follow = false;
        }
        // Autofollow the first copy of the followed template, set in the room's settings
        if (!this.follow && roomsLib.current.follow) {
            [this.follow] = templatesLib.list[roomsLib.current.follow];
        }
        // Follow copies around
        if (this.follow && ('x' in this.follow) && ('y' in this.follow)) {
            followCamera(this);
        }

        // The speed of drift movement
        const speed = this.drift ? Math.min(1, (1 - this.drift) * delta) : 1;
        // Perform drift motion
        this.x = this.targetX * speed + this.x * (1 - speed);
        this.y = this.targetY * speed + this.y * (1 - speed);

        // Off-center shifts drift, too
        this.interpolatedShiftX = this.shiftX * speed + this.interpolatedShiftX * (1 - speed);
        this.interpolatedShiftY = this.shiftY * speed + this.interpolatedShiftY * (1 - speed);

        restrictInRect(this);

        // Recover from possible calculation errors
        this.x = this.x || 0;
        this.y = this.y || 0;
    }

    /**
     * Returns the current camera position plus the screen shake effect.
     * @readonly
     */
    get computedX(): number {
        // eslint-disable-next-line max-len
        const dx = (Math.sin(this.shakePhaseX) + Math.sin(this.shakePhaseX * 3.1846) * 0.25) / 1.25;
        // eslint-disable-next-line max-len
        const x = this.x + dx * this.shake * Math.max(this.width, this.height) / 100 * this.shakeX;
        return x + this.interpolatedShiftX;
    }
    /**
     * Returns the current camera position plus the screen shake effect.
     * @readonly
     */
    get computedY(): number {
        // eslint-disable-next-line max-len
        const dy = (Math.sin(this.shakePhaseY) + Math.sin(this.shakePhaseY * 2.8948) * 0.25) / 1.25;
        // eslint-disable-next-line max-len
        const y = this.y + dy * this.shake * Math.max(this.width, this.height) / 100 * this.shakeY;
        return y + this.interpolatedShiftY;
    }

    /**
     * Returns the position of the left edge where the visible rectangle ends,
     * in game coordinates.
     * This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getTopLeftCorner`
     * and `getBottomLeftCorner` methods.
     * @returns The location of the left edge.
     * @readonly
     */
    get left(): number {
        return this.computedX - (this.width / 2) * this.scale.x;
    }
    /**
     * Returns the position of the top edge where the visible rectangle ends,
     * in game coordinates.
     * This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getTopLeftCorner`
     * and `getTopRightCorner` methods.
     * @returns The location of the top edge.
     * @readonly
     */
    get top(): number {
        return this.computedY - (this.height / 2) * this.scale.y;
    }
    /**
     * Returns the position of the right edge where the visible rectangle ends,
     * in game coordinates.
     * This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getTopRightCorner`
     * and `getBottomRightCorner` methods.
     * @returns The location of the right edge.
     * @readonly
     */
    get right(): number {
        return this.computedX + (this.width / 2) * this.scale.x;
    }
    /**
     * Returns the position of the bottom edge where the visible rectangle ends,
     * in game coordinates. This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getBottomLeftCorner`
     * and `getBottomRightCorner` methods.
     * @returns The location of the bottom edge.
     * @readonly
     */
    get bottom(): number {
        return this.computedY + (this.height / 2) * this.scale.y;
    }

    /**
     * Translates a point from UI space to game space.
     * @param x The x coordinate in UI space.
     * @param y The y coordinate in UI space.
     * @returns A pair of new `x` and `y` coordinates.
     */
    uiToGameCoord(x: number, y: number): pixiMod.Point {
        const modx = (x - this.width / 2) * this.scale.x,
              mody = (y - this.height / 2) * this.scale.y;
        const result = uLib.rotate(modx, mody, this.angle);
        return new PIXI.Point(
            result.x + this.computedX,
            result.y + this.computedY
        );
    }

    /**
     * Translates a point from game space to UI space.
     * @param {number} x The x coordinate in game space.
     * @param {number} y The y coordinate in game space.
     * @returns {PIXI.Point} A pair of new `x` and `y` coordinates.
     */
    gameToUiCoord(x: number, y: number): pixiMod.Point {
        const relx = x - this.computedX,
              rely = y - this.computedY;
        const unrotated = uLib.rotate(relx, rely, -this.angle);
        return new PIXI.Point(
            unrotated.x / this.scale.x + this.width / 2,
            unrotated.y / this.scale.y + this.height / 2
        );
    }
    /**
     * Gets the position of the top-left corner of the viewport in game coordinates.
     * This is useful for positioning UI elements in game coordinates,
     * especially with rotated viewports.
     * @returns {PIXI.Point} A pair of `x` and `y` coordinates.
     */
    getTopLeftCorner(): pixiMod.Point {
        return this.uiToGameCoord(0, 0);
    }

    /**
     * Gets the position of the top-right corner of the viewport in game coordinates.
     * This is useful for positioning UI elements in game coordinates,
     * especially with rotated viewports.
     * @returns {PIXI.Point} A pair of `x` and `y` coordinates.
     */
    getTopRightCorner(): pixiMod.Point {
        return this.uiToGameCoord(this.width, 0);
    }

    /**
     * Gets the position of the bottom-left corner of the viewport in game coordinates.
     * This is useful for positioning UI elements in game coordinates,
     * especially with rotated viewports.
     * @returns {PIXI.Point} A pair of `x` and `y` coordinates.
     */
    getBottomLeftCorner(): pixiMod.Point {
        return this.uiToGameCoord(0, this.height);
    }

    /**
     * Gets the position of the bottom-right corner of the viewport in game coordinates.
     * This is useful for positioning UI elements in game coordinates,
     * especially with rotated viewports.
     * @returns {PIXI.Point} A pair of `x` and `y` coordinates.
     */
    getBottomRightCorner(): pixiMod.Point {
        return this.uiToGameCoord(this.width, this.height);
    }

    /**
     * Returns the bounding box of the camera.
     * Useful for rotated viewports when something needs to be reliably covered by a rectangle.
     * @returns {PIXI.Rectangle} The bounding box of the camera.
     */
    getBoundingBox(): pixiMod.Rectangle {
        const bb = new PIXI.Bounds();
        const tl = this.getTopLeftCorner(),
              tr = this.getTopRightCorner(),
              bl = this.getBottomLeftCorner(),
              br = this.getBottomRightCorner();
        bb.addPoint(new PIXI.Point(tl.x, tl.y));
        bb.addPoint(new PIXI.Point(tr.x, tr.y));
        bb.addPoint(new PIXI.Point(bl.x, bl.y));
        bb.addPoint(new PIXI.Point(br.x, br.y));
        return bb.getRectangle();
    }

    /**
     * Checks whether a given object (or any Pixi's DisplayObject)
     * is potentially visible, meaning that its bounding box intersects
     * the camera's bounding box.
     * @param {PIXI.DisplayObject} copy An object to check for.
     * @returns {boolean} `true` if an object is visible, `false` otherwise.
     */
    contains(copy: pixiMod.DisplayObject): boolean {
        // `true` skips transforms recalculations, boosting performance
        const bounds = copy.getBounds(true);
        return bounds.right > 0 &&
            bounds.left < this.width * this.scale.x &&
            bounds.bottom > 0 &&
            bounds.top < this.width * this.scale.y;
    }

    /**
     * Realigns all the copies in a room so that they distribute proportionally
     * to a new camera size based on their `xstart` and `ystart` coordinates.
     * Will throw an error if the given room is not in UI space (if `room.isUi` is not `true`).
     * You can skip the realignment for some copies
     * if you set their `skipRealign` parameter to `true`.
     * @param {Room} room The room which copies will be realigned.
     * @returns {void}
     */
    realign(room: Room): void {
        if (!room.isUi) {
            console.error('[ct.camera] An attempt to realing a room that is not in UI space. The room in question is', room);
            throw new Error('[ct.camera] An attempt to realing a room that is not in UI space.');
        }
        const w = (roomsLib.templates[room.name].width || 1),
              h = (roomsLib.templates[room.name].height || 1);
        for (const copy of room.children) {
            if (!(copyTypeSymbol in copy)) {
                continue;
            }
            if ((copy as BasicCopy).skipRealign) {
                continue;
            }
            copy.x = (copy as BasicCopy).xstart / w * this.width;
            copy.y = (copy as BasicCopy).ystart / h * this.height;
        }
    }
    /**
     * This will align all non-UI layers in the game according to the camera's transforms.
     * This is automatically called internally, and you will hardly ever use it.
     */
    manageStage(): void {
        const px = this.computedX,
              py = this.computedY,
              sx = 1 / (isNaN(this.scale.x) ? 1 : this.scale.x),
              sy = 1 / (isNaN(this.scale.y) ? 1 : this.scale.y);
        for (const item of pixiApp.stage.children) {
            if (!('isUi' in item &&
                (item as pixiMod.DisplayObject & {isUi: boolean}).isUi) &&
                item.pivot
            ) {
                item.x = -this.width / 2;
                item.y = -this.height / 2;
                item.pivot.x = px;
                item.pivot.y = py;
                item.scale.x = sx;
                item.scale.y = sy;
                item.angle = -this.angle;
            }
        }
    }
}

const mainCamera = new Camera(
    0,
    0,
    [/*!@startwidth@*/][0] as number,
    [/*!@startheight@*/][0] as number
);

export default mainCamera;

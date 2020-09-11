/* eslint-disable no-unused-vars */
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
 * @property {Copy|false} follow If set, the camera will follow the given copy.
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
 * @property {number} shakeDecay The amount of `shake` units substracted in a second. Default is 5.
 * @property {number} shakeFrequency The base frequency of the screen shake effect. Default is 50.
 * @property {number} shakeX A multiplier applied to the horizontal screen shake effect.
 * Default is 1.
 * @property {number} shakeY A multiplier applied to the vertical screen shake effect.
 * Default is 1.
 * @property {number} shakeMax The maximum possible value for the `shake` property
 * to protect players from losing their monitor, in `shake` units. Default is 10.
 */
class Camera extends PIXI.DisplayObject {
    constructor(x, y, w, h) {
        super();
        this.follow = this.rotate = false;
        this.followX = this.followY = true;
        this.targetX = this.x = x;
        this.targetY = this.y = y;
        this.z = 500;
        this.width = w || 1920;
        this.height = h || 1080;
        this.shiftX = this.shiftY = this.interpolatedShiftX = this.interpolatedShiftY = 0;
        this.borderX = this.borderY = null;
        this.drift = 0;

        this.shake = 0;
        this.shakeDecay = 5;
        this.shakeX = this.shakeY = 1;
        this.shakeFrequency = 50;
        this.shakePhase = this.shakePhaseX = this.shakePhaseY = 0;
        this.shakeMax = 10;

        this.getBounds = this.getBoundingBox;
    }

    get scale() {
        return this.transform.scale;
    }
    set scale(value) {
        if (typeof value === 'number') {
            value = {
                x: value,
                y: value
            };
        }
        this.transform.scale.copyFrom(value);
    }

    /**
     * Moves the camera to a new position. It will have a smooth transition
     * if a `drift` parameter is set.
     * @param {number} x New x coordinate
     * @param {number} y New y coordinate
     * @returns {void}
     */
    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    /**
     * Moves the camera to a new position. Ignores the `drift` value.
     * @param {number} x New x coordinate
     * @param {number} y New y coordinate
     * @returns {void}
     */
    teleportTo(x, y) {
        this.targetX = this.x = x;
        this.targetY = this.y = y;
        this.shakePhase = this.shakePhaseX = this.shakePhaseY = 0;
        this.interpolatedShiftX = this.shiftX;
        this.interpolatedShiftY = this.shiftY;
    }

    /**
     * Updates the position of the camera
     * @param {number} delta A delta value between the last two frames. This is usually ct.delta.
     * @returns {void}
     */
    update(delta) {
        if (this.follow && this.follow.kill) {
            this.follow = false;
        }

        const sec = delta / (PIXI.Ticker.shared.maxFPS || 60);
        this.shake -= sec * this.shakeDecay;
        this.shake = Math.max(0, this.shake);
        if (this.shakeMax) {
            this.shake = Math.min(this.shake, this.shakeMax);
        }
        const phaseDelta = sec * this.shakeFrequency;
        this.shakePhase += phaseDelta;
        // no logic in these constants
        // They are used to desync fluctuations and remove repetitive circular movements
        this.shakePhaseX += phaseDelta * (1 + Math.sin(this.shakePhase * 0.1489) * 0.25);
        this.shakePhaseY += phaseDelta * (1 + Math.sin(this.shakePhase * 0.1734) * 0.25);

        // The speed of drift movement
        const speed = this.drift ? Math.min(1, (1 - this.drift) * delta) : 1;

        if (this.follow && ('x' in this.follow) && ('y' in this.follow)) {
            // eslint-disable-next-line max-len
            const bx = this.borderX === null ? this.width / 2 : Math.min(this.borderX, this.width / 2),
                  // eslint-disable-next-line max-len
                  by = this.borderY === null ? this.height / 2 : Math.min(this.borderY, this.height / 2);
            const tl = this.uiToGameCoord(bx, by),
                  br = this.uiToGameCoord(this.width - bx, this.height - by);

            if (this.followX) {
                if (this.follow.x < tl.x - this.interpolatedShiftX) {
                    this.targetX = this.follow.x - bx + this.width / 2;
                } else if (this.follow.x > br.x - this.interpolatedShiftX) {
                    this.targetX = this.follow.x + bx - this.width / 2;
                }
            }
            if (this.followY) {
                if (this.follow.y < tl.y - this.interpolatedShiftY) {
                    this.targetY = this.follow.y - by + this.height / 2;
                } else if (this.follow.y > br.y - this.interpolatedShiftY) {
                    this.targetY = this.follow.y + by - this.height / 2;
                }
            }
        }

        this.x = this.targetX * speed + this.x * (1 - speed);
        this.y = this.targetY * speed + this.y * (1 - speed);
        this.interpolatedShiftX = this.shiftX * speed + this.interpolatedShiftX * (1 - speed);
        this.interpolatedShiftY = this.shiftY * speed + this.interpolatedShiftY * (1 - speed);

        this.x = this.x || 0;
        this.y = this.y || 0;
    }

    /**
     * Returns the current camera position plus the screen shake effect.
     * @type {number}
     */
    get computedX() {
        const dx = (Math.sin(this.shakePhaseX) + Math.sin(this.shakePhaseX * 3.1846) * 0.25) / 1.25;
        const x = this.x + dx * this.shake * Math.max(this.width, this.height) / 100 * this.shakeX;
        return x + this.interpolatedShiftX;
    }
    /**
     * Returns the current camera position plus the screen shake effect.
     * @type {number}
     */
    get computedY() {
        const dy = (Math.sin(this.shakePhaseY) + Math.sin(this.shakePhaseY * 2.8948) * 0.25) / 1.25;
        const y = this.y + dy * this.shake * Math.max(this.width, this.height) / 100 * this.shakeY;
        return y + this.interpolatedShiftY;
    }

    /**
     * Returns the position of the left edge where the visible rectangle ends, in game coordinates.
     * This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getTopLeftCorner`
     * and `getBottomLeftCorner` methods.
     * @returns {number} The location of the left edge.
     * @type {number}
     * @readonly
     */
    get left() {
        return this.computedX - (this.width / 2) * this.scale.x;
    }
    /**
     * Returns the position of the top edge where the visible rectangle ends, in game coordinates.
     * This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getTopLeftCorner` and `getTopRightCorner` methods.
     * @returns {number} The location of the top edge.
     * @type {number}
     * @readonly
     */
    get top() {
        return this.computedY - (this.height / 2) * this.scale.y;
    }
    /**
     * Returns the position of the right edge where the visible rectangle ends, in game coordinates.
     * This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getTopRightCorner`
     * and `getBottomRightCorner` methods.
     * @returns {number} The location of the right edge.
     * @type {number}
     * @readonly
     */
    get right() {
        return this.computedX + (this.width / 2) * this.scale.x;
    }
    /**
     * Returns the position of the bottom edge where the visible rectangle ends,
     * in game coordinates. This can be used for UI positioning in game coordinates.
     * This does not count for rotations, though.
     * For rotated and/or scaled viewports, see `getBottomLeftCorner`
     * and `getBottomRightCorner` methods.
     * @returns {number} The location of the bottom edge.
     * @type {number}
     * @readonly
     */
    get bottom() {
        return this.computedY + (this.height / 2) * this.scale.y;
    }

    /**
     * Translates a point from UI space to game space.
     * @param {number} x The x coordinate in UI space.
     * @param {number} y The y coordinate in UI space.
     * @returns {PIXI.Point} A pair of new `x` and `y` coordinates.
     */
    uiToGameCoord(x, y) {
        const modx = (x - this.width / 2) * this.scale.x,
              mody = (y - this.height / 2) * this.scale.y;
        const result = ct.u.rotate(modx, mody, this.angle);
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
    gameToUiCoord(x, y) {
        const relx = x - this.computedX,
              rely = y - this.computedY;
        const unrotated = ct.u.rotate(relx, rely, -this.angle);
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
    getTopLeftCorner() {
        return this.uiToGameCoord(0, 0);
    }

    /**
     * Gets the position of the top-right corner of the viewport in game coordinates.
     * This is useful for positioning UI elements in game coordinates,
     * especially with rotated viewports.
     * @returns {PIXI.Point} A pair of `x` and `y` coordinates.
     */
    getTopRightCorner() {
        return this.uiToGameCoord(this.width, 0);
    }

    /**
     * Gets the position of the bottom-left corner of the viewport in game coordinates.
     * This is useful for positioning UI elements in game coordinates,
     * especially with rotated viewports.
     * @returns {PIXI.Point} A pair of `x` and `y` coordinates.
     */
    getBottomLeftCorner() {
        return this.uiToGameCoord(0, this.height);
    }

    /**
     * Gets the position of the bottom-right corner of the viewport in game coordinates.
     * This is useful for positioning UI elements in game coordinates,
     * especially with rotated viewports.
     * @returns {PIXI.Point} A pair of `x` and `y` coordinates.
     */
    getBottomRightCorner() {
        return this.uiToGameCoord(this.width, this.height);
    }

    /**
     * Returns the bounding box of the camera.
     * Useful for rotated viewports when something needs to be reliably covered by a rectangle.
     * @returns {PIXI.Rectangle} The bounding box of the camera.
     */
    getBoundingBox() {
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
     * Realigns all the copies in a room so that they distribute proportionally
     * to a new camera size based on their `xstart` and `ystart` coordinates.
     * Will throw an error if the given room is not in UI space (if `room.isUi` is not `true`).
     * You can skip the realignment for some copies
     * if you set their `skipRealign` parameter to `true`.
     * @param {Room} room The room which copies will be realigned.
     * @returns {void}
     */
    realign(room) {
        if (!room.isUi) {
            throw new Error('[ct.camera] An attempt to realing a room that is not in UI space. The room in question is', room);
        }
        const w = (ct.rooms.templates[room.name].width || 1),
              h = (ct.rooms.templates[room.name].height || 1);
        for (const copy of room.children) {
            if (!('xstart' in copy) || copy.skipRealign) {
                continue;
            }
            copy.x = copy.xstart / w * this.width;
            copy.y = copy.ystart / h * this.height;
        }
    }
    /**
     * This will align all non-UI layers in the game according to the camera's transforms.
     * This is automatically called internally, and you will hardly ever use it.
     * @returns {void}
     */
    manageStage() {
        const px = this.computedX,
              py = this.computedY,
              sx = 1 / (isNaN(this.scale.x) ? 1 : this.scale.x),
              sy = 1 / (isNaN(this.scale.y) ? 1 : this.scale.y);
        for (const item of ct.stage.children) {
            if (!item.isUi && item.pivot) {
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

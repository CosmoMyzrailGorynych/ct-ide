import type {CtjsTexture} from 'res';
import type {TextureShape} from '../node_requires/exporter/_exporterContracts';
import type {BasicCopy, CopyButton, CopyPanel} from './templates';
import timerLib, {CtTimer} from './timer';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

/**
 * An utility function to throw errors by using them
 * as default values for mandatory arguments in public API.
 */
export const required = function required(paramName: string, method: string): never {
    let str = 'The parameter ';
    if (paramName) {
        str += `${paramName} `;
    }
    if (method) {
        str += `of ${method} `;
    }
    str += 'is required.';
    throw new Error(str);
};

/**
 * A library of different utility functions, mainly Math-related, but not limited to them.
 */
const uLib = {
    /**
     * A measure of how long the previous frame took time to draw,
     * usually equal to 1 and larger on lags.
     * For example, if it is equal to 2, it means that the previous frame took twice as much time
     * compared to expected FPS rate.
     *
     * Note that `this.move()` already uses it, so there is no need to premultiply
     * `this.speed` with it.
     *
     * **A minimal example:**
     * ```js
     * this.x += this.windSpeed * u.delta;
     * ```
     *
     * @deprecated Use `u.time` instead.
     */
    delta: 1,
    /**
     * A measure of how long the previous frame took time to draw, usually equal to 1
     * and larger on lags.
     * For example, if it is equal to 2, it means that the previous frame took twice as much time
     * compared to expected FPS rate.
     *
     * This is a version for UI elements, as it is not affected by time scaling, and thus works well
     * both with slow-mo effects and game pause.
     *
     * @deprecated Use `u.timeUi` instead.
     */
    deltaUi: 1,
    /**
     * A measure of how long the previous frame took time to draw, in seconds.
     * You can use it by multiplying it with your copies' speed and other values with velocity
     * to get the same speed with different framerate, regardless of lags or max framerate cap.
     *
     * If you plan on changing your game's target framerate,
     * you should use `u.time` instead of `u.delta`.
     *
     * **A minimal example:**
     * ```js
     * this.x += this.windSpeed * u.time;
     * ```
     */
    time: 1 / 60,
    /**
     * A measure of how long the previous frame took time to draw, in seconds.
     * You can use it by multiplying it with your copies' speed and other values with velocity
     * to get the same speed with different framerate, regardless of lags or max framerate cap.
     *
     * This version ignores the effects of slow-mo effects and game pause,
     * and thus is perfect for UI element.
     *
     * If you plan on changing your game's target framerate,
     * you should use `u.timeUi` instead of `u.deltaUi`.
     */
    timeUi: 1 / 60,
    /**
     * A measure of how long the previous frame took time to draw, in seconds.
     * You can use it by multiplying it with your copies' speed and other values with velocity
     * to get the same speed with different framerate, regardless of lags or max framerate cap.
     *
     * This version ignores the effects of slow-mo effects and game pause,
     * and thus is perfect for UI element.
     *
     * If you plan on changing your game's target framerate,
     * you should use `u.timeUi` instead of `u.deltaUi`.
     */
    timeUI: 1 / 60,
    /**
     * Get the environment the game runs on.
     * @returns {string} Either 'ct.ide', or 'nw', or 'electron', or 'browser'.
     */
    getEnvironment(): string {
        if (window.name === 'ct.js debugger') {
            return 'ct.ide';
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (('nw' in window) && ('require' in ((window as any).nw as Record<string, unknown>))) {
                return 'nw';
            }
        } catch (oO) {
            void 0;
        }
        try {
            require('electron');
            return 'electron';
        } catch (Oo) {
            void 0;
        }
        return 'browser';
    },
    /**
     * Get the current operating system the game runs on.
     * @returns {string} One of 'windows', 'darwin' (which is MacOS), 'linux', or 'unknown'.
     */
    getOS(): string {
        const ua = window.navigator.userAgent;
        if (ua.indexOf('Windows') !== -1) {
            return 'windows';
        }
        if (ua.indexOf('Linux') !== -1) {
            return 'linux';
        }
        if (ua.indexOf('Mac') !== -1) {
            return 'darwin';
        }
        return 'unknown';
    },
    /**
     * Returns the length of a vector projection onto an X axis.
     * @param {number} l The length of the vector
     * @param {number} d The direction of the vector
     * @returns {number} The length of the projection
     */
    ldx(l: number, d: number): number {
        return l * Math.cos(d * Math.PI / 180);
    },
    /**
     * Returns the length of a vector projection onto an Y axis.
     * @param {number} l The length of the vector
     * @param {number} d The direction of the vector
     * @returns {number} The length of the projection
     */
    ldy(l: number, d: number): number {
        return l * Math.sin(d * Math.PI / 180);
    },
    /**
     * Returns the direction of a vector that points from the first point to the second one.
     * @param {number} x1 The x location of the first point
     * @param {number} y1 The y location of the first point
     * @param {number} x2 The x location of the second point
     * @param {number} y2 The y location of the second point
     * @returns {number} The angle of the resulting vector, in degrees
     */
    pdn(x1: number, y1: number, x2: number, y2: number): number {
        return (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 360) % 360;
    },
    // Point-point DistanCe
    /**
     * Returns the distance between two points
     * @param {number} x1 The x location of the first point
     * @param {number} y1 The y location of the first point
     * @param {number} x2 The x location of the second point
     * @param {number} y2 The y location of the second point
     * @returns {number} The distance between the two points
     */
    pdc(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },
    /**
     * Convers degrees to radians
     * @param {number} deg The degrees to convert
     * @returns {number} The resulting radian value
     */
    degToRad(deg: number): number {
        return deg * Math.PI / 180;
    },
    /**
     * Convers radians to degrees
     * @param {number} rad The radian value to convert
     * @returns {number} The resulting degree
     */
    radToDeg(rad: number): number {
        return rad / Math.PI * 180;
    },
    /**
     * Rotates a vector (x; y) by `deg` around (0; 0)
     * @param {number} x The x component
     * @param {number} y The y component
     * @param {number} deg The degree to rotate by
     * @returns {PIXI.Point} A pair of new `x` and `y` parameters.
     */
    rotate(x: number, y: number, deg: number): pixiMod.Point {
        return uLib.rotateRad(x, y, uLib.degToRad(deg));
    },
    /**
     * Rotates a vector (x; y) by `rad` around (0; 0)
     * @param {number} x The x component
     * @param {number} y The y component
     * @param {number} rad The radian value to rotate around
     * @returns {PIXI.Point} A pair of new `x` and `y` parameters.
     */
    rotateRad(x: number, y: number, rad: number): pixiMod.Point {
        const sin = Math.sin(rad),
              cos = Math.cos(rad);
        return new PIXI.Point(
            cos * x - sin * y,
            cos * y + sin * x
        );
    },
    /**
     * Gets the most narrow angle between two vectors of given directions
     * @param {number} dir1 The direction of the first vector
     * @param {number} dir2 The direction of the second vector
     * @returns {number} The resulting angle
     */
    deltaDir(dir1: number, dir2: number): number {
        dir1 = ((dir1 % 360) + 360) % 360;
        dir2 = ((dir2 % 360) + 360) % 360;
        var t = dir1,
            h = dir2,
            ta = h - t;
        if (ta > 180) {
            ta -= 360;
        }
        if (ta < -180) {
            ta += 360;
        }
        return ta;
    },
    /**
     * Returns a number in between the given range (clamps it).
     * @param {number} min The minimum value of the given number
     * @param {number} val The value to fit in the range
     * @param {number} max The maximum value of the given number
     * @returns {number} The clamped value
     */
    clamp(min: number, val: number, max: number): number {
        return Math.max(min, Math.min(max, val));
    },
    /**
     * Linearly interpolates between two values by the apha value.
     * Can also be describing as mixing between two values with a given proportion `alpha`.
     * @param {number} a The first value to interpolate from
     * @param {number} b The second value to interpolate to
     * @param {number} alpha The mixing value
     * @returns {number} The result of the interpolation
     */
    lerp(a: number, b: number, alpha: number): number {
        return a + (b - a) * alpha;
    },
    /**
     * Returns the position of a given value in a given range. Opposite to linear interpolation.
     * @param  {number} a The first value to interpolate from
     * @param  {number} b The second value to interpolate top
     * @param  {number} val The interpolated values
     * @return {number} The position of the value in the specified range.
     * When a <= val <= b, the result will be inside the [0;1] range.
     */
    unlerp(a: number, b: number, val: number): number {
        return (val - a) / (b - a);
    },
    /**
     * Re-maps the given value from one number range to another.
     * @param  {number} val The value to be mapped
     * @param  {number} inMin Lower bound of the value's current range
     * @param  {number} inMax Upper bound of the value's current range
     * @param  {number} outMin Lower bound of the value's target range
     * @param  {number} outMax Upper bound of the value's target range
     * @returns {number} The mapped value.
     */
    map(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
    hexToPixi(hex: string): number {
        return Number('0x' + hex.slice(1));
    },
    pixiToHex(pixi: number): string {
        return '#' + (pixi).toString(16).padStart(6, '0');
    },
    /**
     * Returns a shape object based on the dimensions of the given sprite.
     */
    getRectShape(sprite: pixiMod.Sprite): TextureShape {
        return {
            type: 'rect',
            left: sprite.width * sprite.anchor.x,
            top: sprite.height * sprite.anchor.y,
            right: sprite.width * (1 - sprite.anchor.x),
            bottom: sprite.height * (1 - sprite.anchor.y)
        };
    },
    /**
     * Takes a CopyPanel instance and changes its shape to accommodate its new dimensions.
     * Doesn't work with circular collision shapes.
     */
    reshapeNinePatch(copy: CopyPanel | CopyButton): void {
        const target = (copy.baseClass === 'NineSlicePlane' ?
            copy :
            copy.panel
        ) as pixiMod.NineSlicePlane;
        const origTex = (target.texture as CtjsTexture);
        const origShape = origTex.shape;
        const origWidth = origTex.width,
              origHeight = origTex.height;
        // how much the new box is larger than the original one
        const dwx = target.width - origWidth,
              dhy = target.height - origHeight;
        // the size of the inner part of the original frame
        const bw = origWidth - target.leftWidth - target.rightWidth,
              bh = origHeight - target.topHeight - target.bottomHeight;
        if (origShape.type === 'circle') {
            throw new Error(`[u.reshapeNinePatch] Cannot reshape a circular collision mask for ${copy.template}. Please use a different collision type for its texture.`);
        }
        if (origShape.type === 'rect') {
            const shape: TextureShape = {
                type: 'rect',
                left: origShape.left,
                top: origShape.top,
                right: origShape.right + dwx,
                bottom: origShape.bottom + dhy
            };
            if (origShape.left > target.leftWidth) {
                shape.left = (origShape.left - target.leftWidth) * (1 + dwx) / bw;
            }
            if (origShape.right < target.rightWidth) {
                shape.right = (origShape.right - target.rightWidth) * (1 + dwx) / bw;
            }
            if (origShape.top > target.topHeight) {
                shape.top = (origShape.top - target.topHeight) * (1 + dhy) / bh;
            }
            if (origShape.bottom < target.bottomHeight) {
                shape.bottom = (origShape.bottom - target.bottomHeight) * (1 + dhy) / bh;
            }
            copy.shape = shape;
            return;
        }
        if (origShape.type === 'strip') {
            const shape: TextureShape = {
                type: 'strip',
                points: [] as {
                    x: number,
                    y: number
                }[],
                closedStrip: origShape.closedStrip
            };
            shape.points = origShape.points.map((point) => {
                let {x, y} = point;
                if (point.x >= origWidth - target.rightWidth) {
                    x += dwx;
                } else if (point.x > target.leftWidth) {
                    x = target.leftWidth + (point.x - target.leftWidth) * (1 + dwx / bw);
                }
                if (point.y >= origHeight - target.bottomHeight) {
                    y += dhy;
                } else if (point.y > target.topHeight) {
                    y = target.topHeight + (point.y - target.topHeight) * (1 + dhy / bh);
                }
                return {
                    x,
                    y
                };
            });
            copy.shape = shape;
        }
    },
    /**
     * Tests whether a given point is inside the given rectangle
     * (it can be either a copy or an array).
     * @param {number} x The x coordinate of the point.
     * @param {number} y The y coordinate of the point.
     * @param {(Copy|Array<Number>)} arg Either a copy (it must have a rectangular shape)
     * or an array in a form of [x1, y1, x2, y2], where (x1;y1) and (x2;y2) specify
     * the two opposite corners of the rectangle.
     * @returns {boolean} `true` if the point is inside the rectangle, `false` otherwise.
     */
    prect(x: number, y: number, arg: (BasicCopy | Array<number>)): boolean {
        var xmin, xmax, ymin, ymax;
        if (arg instanceof Array) {
            xmin = Math.min(arg[0], arg[2]);
            xmax = Math.max(arg[0], arg[2]);
            ymin = Math.min(arg[1], arg[3]);
            ymax = Math.max(arg[1], arg[3]);
        } else {
            if (arg.shape.type !== 'rect') {
                throw new Error('[ct.u.prect] The specified copy doesn\'t have a rectangular collision shape.');
            }
            xmin = arg.x - arg.shape.left * arg.scale.x;
            xmax = arg.x + arg.shape.right * arg.scale.x;
            ymin = arg.y - arg.shape.top * arg.scale.y;
            ymax = arg.y + arg.shape.bottom * arg.scale.y;
        }
        return x >= xmin && y >= ymin && x <= xmax && y <= ymax;
    },
    /**
     * Tests whether a given point is inside the given circle (it can be either a copy or an array)
     * @param {number} x The x coordinate of the point
     * @param {number} y The y coordinate of the point
     * @param {(Copy|Array<Number>)} arg Either a copy (it must have a circular shape)
     * or an array in a form of [x1, y1, r], where (x1;y1) define the center of the circle
     * and `r` defines the radius of it.
     * @returns {boolean} `true` if the point is inside the circle, `false` otherwise
     */
    pcircle(x: number, y: number, arg: (BasicCopy | Array<number>)): boolean {
        if (arg instanceof Array) {
            return uLib.pdc(x, y, arg[0], arg[1]) < arg[2];
        }
        if (arg.shape.type !== 'circle') {
            throw new Error('[ct.u.pcircle] The specified copy doesn\'t have a circular shape');
        }
        return uLib.pdc(0, 0, (arg.x - x) / arg.scale.x, (arg.y - y) / arg.scale.y) < arg.shape.r;
    },
    /**
     * Returns a Promise that resolves after the given time.
     * This timer is run in gameplay time scale, meaning that it is affected by time stretching.
     * @param {number} time Time to wait, in milliseconds
     * @returns {CtTimer} The timer, which you can call `.then()` to
     */
    wait(time: number): CtTimer {
        return timerLib.add(time);
    },
    /**
     * Returns a Promise that resolves after the given time.
     * This timer runs in UI time scale and is not sensitive to time stretching.
     * @param {number} time Time to wait, in milliseconds
     * @returns {CtTimer} The timer, which you can call `.then()` to
     */
    waitUi(time: number): CtTimer {
        return timerLib.addUi(time);
    },
    /**
     * Creates a new function that returns a promise, based
     * on a function with a regular (err, result) => {...} callback.
     * @param {Function} f The function that needs to be promisified
     * @see https://javascript.info/promisify
     */
    promisify<T1, T2, T3 extends unknown[], E>(f: (
        ...args: [...T3, () => (err: E, result: T2) => T1]) => void) {
        // eslint-disable-next-line func-names
        return function (...args2: T3): Promise<T2> {
            return new Promise((resolve, reject) => {
                const callback = function callback(err: E, result: T2) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                };
                args2.push(callback);
                f.call(this, ...args2);
            });
        };
    },
    required,
    /**
     * Takes a prefix and a number to make a string in format Prefix_XX,
     * mainly used to get nice names for assets.
     */
    numberedString(prefix: string, input: number): string {
        return prefix + '_' + input.toString().padStart(2, '0');
    },
    /**
     * Gets the number of a string with pattern Prefix_XX,
     * generally used to work with asset names.
     */
    getStringNumber(str: string): number {
        return Number(str.split('_').pop());
    }
};

Object.assign(uLib, {// make aliases
    getOs: uLib.getOS,
    lengthDirX: uLib.ldx,
    lengthDirY: uLib.ldy,
    pointDirection: uLib.pdn,
    pointDistance: uLib.pdc,
    pointRectangle: uLib.prect,
    pointCircle: uLib.pcircle
});

export default uLib as typeof uLib & {
    getOs: typeof uLib.getOS,
    lengthDirX: typeof uLib.ldx,
    lengthDirY: typeof uLib.ldy,
    pointDirection: typeof uLib.pdn,
    pointDistance: typeof uLib.pdc,
    pointRectangle: typeof uLib.prect,
    pointCircle: typeof uLib.pcircle
};

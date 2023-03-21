/*! Made with ct.js http://ctjs.rocks/ */

import * as PIXI from 'node_modules/pixi.js';
import {actions, inputs, CtAction} from './inputs';
import {backgrounds, Background} from './backgrounds';
import {Camera} from './camera';
import {content} from './content';
import {emitters, EmitterTandem} from './emitters';
import {res} from './res';
import {rooms, Room} from './rooms';
import {sounds} from 'sounds';
import {styles} from 'styles';
import {Copy, templates} from './templates';
import {tilemaps, Tilemap} from './tilemaps';
import {timer} from './timer';
import {u} from './u';

import {ExportedMeta} from '../node_requires/exporter/_exporterContracts';

try {
    require('electron');
} catch {
    if (location.protocol === 'file:') {
        // eslint-disable-next-line no-alert
        alert('Your game won\'t work like this because\nWeb 👏 builds 👏 require 👏 a web 👏 server!\n\nConsider using a desktop build, or upload your web build to itch.io, GameJolt or your own website.\n\nIf you haven\'t created this game, please contact the developer about this issue.\n\n Also note that ct.js games do not work inside the itch app; you will need to open the game with your browser of choice.');
    }
}

/**
 * a pool of `kill`-ed copies for delaying frequent garbage collection
 */
export const deadPool: PIXI.DisplayObject[] = [];
export const copyTypeSymbol = Symbol('I am a ct.js copy');
setInterval(function cleanDeadPool() {
    deadPool.length = 0;
}, 1000 * 60);

type ctFittoscreen = (() => void) & {
    mode: string;
};

/**
 * The ct.js library
 */
const ct = {
    render: {
        /** If set to true, enables retina (high-pixel density) rendering. */
        highDensity: [/*@highDensity@*/][0] as boolean,
        /** A target number of frames per second. It can be interpreted as a second in timers. */
        speed: [/*@maxfps@*/][0] || 60,
        /** The actual number of frames per second the machine achieves. */
        fps: [/*@maxfps@*/][0] || 60
    },
    stack: [] as (Copy | Background)[],
    /**
     * Current root room.
     */
    room: null as Room,
    /**
     * A measure of how long a frame took time to draw, usually equal to 1 and larger on lags.
     * For example, if it is equal to 2, it means that the previous frame took twice as much time
     * compared to expected FPS rate.
     *
     * Use ct.delta to balance your movement and other calculations on different framerates by
     * multiplying it with your reference value.
     *
     * Note that `this.move()` already uses it, so there is no need to premultiply
     * `this.speed` with it.
     *
     * **A minimal example:**
     * ```js
     * this.x += this.windSpeed * ct.delta,
     * ```
     */
    delta: 1,
    /**
     * A measure of how long a frame took time to draw, usually equal to 1 and larger on lags.
     * For example, if it is equal to 2, it means that the previous frame took twice as much time
     * compared to expected FPS rate.
     *
     * This is a version for UI elements, as it is not affected by time scaling, and thus works well
     * both with slow-mo effects and game pause.
     */
    deltaUi: 1,
    /**
     * The camera that outputs its view to the renderer.
     */
    camera: null as Camera | null,
    /**
     * ct.js version in form of a string `X.X.X`.
     */
    version: '/*@ctversion@*/',
    meta: [/*@projectmeta@*/][0] as ExportedMeta,
    get width(): number {
        return ct.pixiApp.renderer.view.width;
    },
    /**
     * Resizes the drawing canvas and viewport to the given value in pixels.
     * When used with ct.fittoscreen, can be used to enlarge/shrink the viewport.
     * @param {number} value New width in pixels
     */
    set width(value: number) {
        ct.camera.width = value;
        if (!('fittoscreen' in ct)) {
            return;
        }
        const fittoscreen = ct.fittoscreen as ctFittoscreen;
        if (fittoscreen.mode === 'fastScale') {
            ct.pixiApp.renderer.resize(value, ct.height);
        }
        if (fittoscreen) {
            fittoscreen();
        }
    },
    get height(): number {
        return ct.pixiApp.renderer.view.height;
    },
    /**
     * Resizes the drawing canvas and viewport to the given value in pixels.
     * When used with ct.fittoscreen, can be used to enlarge/shrink the viewport.
     * @param {number} value New height in pixels
     */
    set height(value: number) {
        ct.camera.height = value;
        if (!('fittoscreen' in ct)) {
            return;
        }
        const fittoscreen = ct.fittoscreen as ctFittoscreen;
        if (fittoscreen.mode === 'fastScale') {
            ct.pixiApp.renderer.resize(ct.width, value);
        }
        if (fittoscreen) {
            fittoscreen();
        }
    },
    /** The width of the current room's initial viewport, as it was set in ct.IDE */
    roomWidth: [/*@startwidth@*/][0] as number,
    /** The height of the current room's initial viewport, as it was set in ct.IDE */
    roomHeight: [/*@startheight@*/][0] as number,

    // Core libraries
    actions,
    inputs,
    emitters,
    content,
    backgrounds,
    res,
    rooms,
    sounds,
    styles,
    templates,
    tilemaps,
    timer,
    u,

    // Base classes
    Action: CtAction,
    EmitterTandem,
    Background,
    Tilemap,

    // Uninicialized values that require additional startup logic in themselves
    // or their dependencies
    /** The PIXI.Application that runs ct.js game */
    pixiApp: null as PIXI.Application,
    /** The main ct.js/pixi.js container that holds all the rooms on stage and cameras. */
    stage: null as PIXI.Container,
    /** Main game loop function. Should not be used directly. */
    loop: null as () => void
};

// eslint-disable-next-line no-console
console.log(
    `%c 😺 %c ct.js game editor %c v${ct.version} %c https://ctjs.rocks/ `,
    'background: #446adb; color: #fff; padding: 0.5em 0;',
    'background: #5144db; color: #fff; padding: 0.5em 0;',
    'background: #446adb; color: #fff; padding: 0.5em 0;',
    'background: #5144db; color: #fff; padding: 0.5em 0;'
);
const pixiAppSettings = {
    width: [/*@startwidth@*/][0] as number,
    height: [/*@startheight@*/][0] as number,
    antialias: ![/*@pixelatedrender@*/][0],
    powerPreference: 'high-performance' as WebGLPowerPreference,
    sharedTicker: false
};
try {
    ct.pixiApp = new PIXI.Application(pixiAppSettings);
} catch (e) {
    console.error(e);
    // eslint-disable-next-line no-console
    console.warn('[ct.js] Something bad has just happened. This is usually due to hardware problems. I\'ll try to fix them now, but if the game still doesn\'t run, try including a legacy renderer in the project\'s settings.');
    PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
    ct.pixiApp = new PIXI.Application(pixiAppSettings);
}

// eslint-disable-next-line prefer-destructuring
PIXI.settings.ROUND_PIXELS = [/*@pixelatedrender@*/][0];
ct.pixiApp.ticker.maxFPS = [/*@maxfps@*/][0] || 0;
if (!ct.pixiApp.renderer.options.antialias) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
}
ct.stage = ct.pixiApp.stage;
// Incorrect pixi.js typings? autoDensity is writable
(ct.pixiApp.renderer as any).autoDensity = ct.render.highDensity;
document.getElementById('ct').appendChild(ct.pixiApp.view as HTMLCanvasElement);

// eslint-disable-next-line max-lines-per-function
(() => {
    const killRecursive = (copy: Copy | Background) => {
        copy.kill = true;
        if (copy instanceof Copy && copy.onDestroy) {
            templates.onDestroy.apply(copy);
            copy.onDestroy.apply(copy);
        }
        for (const child of copy.children) {
            if (templates.isCopy(child)) {
                killRecursive(child as Copy); // bruh
            }
        }
        const stackIndex = ct.stack.indexOf(copy);
        if (stackIndex !== -1) {
            ct.stack.splice(stackIndex, 1);
        }
        if (copy instanceof Copy && copy.template) {
            const templatelistIndex = templates.list[copy.template].indexOf(copy);
            if (templatelistIndex !== -1) {
                templates.list[copy.template].splice(templatelistIndex, 1);
            }
        }
        deadPool.push(copy);
    };
    const manageCamera = () => {
        if (ct.camera) {
            ct.camera.update(ct.delta);
            ct.camera.manageStage();
        }
    };

    ct.loop = function loop() {
        ct.delta = ct.pixiApp.ticker.deltaMS / (1000 / (ct.pixiApp.ticker.maxFPS || 60));
        ct.deltaUi = ct.pixiApp.ticker.elapsedMS / (1000 / (ct.pixiApp.ticker.maxFPS || 60));
        ct.inputs.updateActions();
        ct.timer.updateTimers();
        /*%beforeframe%*/
        rooms.rootRoomOnStep.apply(ct.room);
        for (let i = 0, li = ct.stack.length; i < li; i++) {
            templates.beforeStep.apply(ct.stack[i]);
            ct.stack[i].onStep.apply(ct.stack[i]);
            templates.afterStep.apply(ct.stack[i]);
        }
        // There may be a number of rooms stacked on top of each other.
        // Loop through them and filter out everything that is not a room.
        for (const item of ct.stage.children) {
            if (!(item instanceof Room)) {
                continue;
            }
            rooms.beforeStep.apply(item);
            item.onStep.apply(item);
            rooms.afterStep.apply(item);
        }
        // copies
        for (const copy of ct.stack) {
            // eslint-disable-next-line no-underscore-dangle
            if (copy.kill && !copy._destroyed) {
                killRecursive(copy); // This will also allow a parent to eject children
                                     // to a new container before they are destroyed as well
                copy.destroy({
                    children: true
                });
            }
        }

        manageCamera();

        for (let i = 0, li = ct.stack.length; i < li; i++) {
            templates.beforeDraw.apply(ct.stack[i]);
            ct.stack[i].onDraw.apply(ct.stack[i]);
            templates.afterDraw.apply(ct.stack[i]);
            ct.stack[i].xprev = ct.stack[i].x;
            ct.stack[i].yprev = ct.stack[i].y;
        }

        for (const item of ct.stage.children) {
            if (!(item instanceof Room)) {
                continue;
            }
            rooms.beforeDraw.apply(item);
            item.onDraw.apply(item);
            rooms.afterDraw.apply(item);
        }
        rooms.rootRoomOnDraw.apply(ct.room);
        /*%afterframe%*/
        if (rooms.switching) {
            rooms.forceSwitch();
        }
    };
    ct.res.loadGame();
})();
export const ctjsGame = ct;

(window as any).ct = ctjsGame;
(window as any).PIXI = PIXI;

/*%load%*/

/*@userScripts@*/

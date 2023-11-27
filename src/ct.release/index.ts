import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

/*! Made with ct.js http://ctjs.rocks/ */

import {updateViewport, toggleFullscreen, getIsFullscreen} from './fittoscreen';
import {actionsLib as actionsM, inputsLib as inputsM, CtAction} from './inputs';
import backgroundsM, {Background} from './backgrounds';
import behaviorsM from './behaviors';
import cameraM, {Camera} from './camera';
import contentM from './content';
import emittersM from './emitters';
import resM from 'res';
import roomsM, {Room} from './rooms';
import soundsM from 'sounds';
import stylesM from 'styles';
import templatesM, {BasicCopy} from './templates';
import tilemapsM, {Tilemap} from './tilemaps';
import timerM from './timer';
import uM from './u';

import type {ExportedMeta, viewMode} from '../node_requires/exporter/_exporterContracts';

// eslint-disable-next-line no-console
console.log(
    '%c 😺 %c ct.js game editor %c v/*!@ctversion@*/ %c https://ctjs.rocks/ ',
    'background: #446adb; color: #fff; padding: 0.5em 0;',
    'background: #5144db; color: #fff; padding: 0.5em 0;',
    'background: #446adb; color: #fff; padding: 0.5em 0;',
    'background: #5144db; color: #fff; padding: 0.5em 0;'
);

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
export const deadPool: pixiMod.DisplayObject[] = [];
export const copyTypeSymbol = Symbol('I am a ct.js copy');
setInterval(function cleanDeadPool() {
    deadPool.length = 0;
}, 1000 * 60);

// eslint-disable-next-line prefer-destructuring
export const meta: ExportedMeta = [/*!@projectmeta@*/][0];

let currentViewMode: viewMode = '/*@viewMode@*/' as viewMode;
let currentHighDPIMode = Boolean([/*!@highDensity@*/][0]);

/**
 * An object that houses render settings for the game.
 */
export const settings = {
    /** If set to true, enables retina (high-pixel density) rendering. */
    get highDensity(): boolean {
        return currentHighDPIMode;
    },
    set highDensity(value: boolean) {
        currentHighDPIMode = value;
        if (currentHighDPIMode) {
            PIXI.settings.RESOLUTION = window.devicePixelRatio;
        } else {
            PIXI.settings.RESOLUTION = 1;
        }
        if (roomsM.current) {
            updateViewport();
        }
    },
    /** A target number of frames per second. */
    get targetFps(): number {
        return pixiApp.ticker.maxFPS;
    },
    set targetFps(value: number) {
        pixiApp.ticker.maxFPS = value;
    },
    /**
     * A string that indicates the current scaling approach (can be changed).
     * Possible options:
     *
     * * `asIs` — disables any viewport management; the rendered canvas
     * will be placed as is in the top-left corner.
     * * `fastScale` — the viewport will proportionally fill the screen
     * without changing the resolution.
     * * `fastScaleInteger` — the viewport will be positioned at the middle
     * of the screen, and will be scaled by whole numbers (x2, x3, x4 and so on).
     * * `expand` — the viewport will fill the whole screen. The camera will
     * expand to accommodate the new area.
     * * `scaleFit` — the viewport will proportionally fill the screen, leaving letterboxes
     * around the base viewport. The resolution is changed to match the screen.
     * * `scaleFill` — the viewport fills the screen, expanding the camera to avoid letterboxing.
     * The resolution is changed to match the screen.
     */
    get viewMode(): viewMode {
        return currentViewMode;
    },
    set viewMode(value: viewMode) {
        currentViewMode = value;
        updateViewport();
    },

    /**
     * A boolean property that can be changed to exit or enter fullscreen mode.
     * In web builds, you can only change this value in pointer events of your templates.
     */
    get fullscreen(): boolean {
        return getIsFullscreen();
    },
    set fullscreen(value: boolean) {
        if (getIsFullscreen() !== value) {
            toggleFullscreen();
        }
    }
};

export const stack: (BasicCopy | Background)[] = [];

/** The PIXI.Application that runs ct.js game */
export let pixiApp: pixiMod.Application;
{
    const pixiAppSettings: Partial<pixiMod.IApplicationOptions> = {
        width: [/*!@startwidth@*/][0] as number,
        height: [/*!@startheight@*/][0] as number,
        antialias: ![/*!@pixelatedrender@*/][0],
        powerPreference: 'high-performance' as WebGLPowerPreference,
        autoDensity: true,
        sharedTicker: false,
        backgroundAlpha: [/*@transparent@*/][0] ? 0 : 1
    };
    PIXI.settings.RESOLUTION = currentHighDPIMode ? window.devicePixelRatio : 1;
    try {
        pixiApp = new PIXI.Application(pixiAppSettings);
    } catch (e) {
        console.error(e);
        // eslint-disable-next-line no-console
        console.warn('[ct.js] Something bad has just happened. This is usually due to hardware problems. I\'ll try to fix them now, but if the game still doesn\'t run, try including a legacy renderer in the project\'s settings.');
        PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
        pixiApp = new PIXI.Application(pixiAppSettings);
    }
    // eslint-disable-next-line prefer-destructuring
    PIXI.settings.ROUND_PIXELS = [/*!@pixelatedrender@*/][0];
    if (!pixiApp.renderer.options.antialias) {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    }
    settings.targetFps = [/*!@maxfps@*/][0] || 60;
    // eslint-disable-next-line prefer-destructuring
    document.getElementById('ct').appendChild(pixiApp.view as HTMLCanvasElement);
}

let loading: Promise<void>;
{
    const killRecursive = (copy: (BasicCopy & pixiMod.DisplayObject) | Background) => {
        copy.kill = true;
        if (templatesM.isCopy(copy) && (copy as BasicCopy).onDestroy) {
            templatesM.onDestroy.apply(copy);
            (copy as BasicCopy).onDestroy.apply(copy);
        }
        for (const child of copy.children) {
            if (templatesM.isCopy(child)) {
                killRecursive(child as (BasicCopy & pixiMod.DisplayObject)); // bruh
            }
        }
        const stackIndex = stack.indexOf(copy);
        if (stackIndex !== -1) {
            stack.splice(stackIndex, 1);
        }
        if (templatesM.isCopy(copy) && (copy as BasicCopy).template) {
            const templatelistIndex = templatesM
                .list[(copy as BasicCopy & pixiMod.DisplayObject).template]
                .indexOf((copy as BasicCopy & pixiMod.DisplayObject));
            if (templatelistIndex !== -1) {
                templatesM.list[(copy as BasicCopy & pixiMod.DisplayObject).template]
                    .splice(templatelistIndex, 1);
            }
        }
        deadPool.push(copy);
    };
    const manageCamera = () => {
        cameraM.update(uM.timeUi);
        cameraM.manageStage();
    };

    const loop = () => {
        const {ticker} = pixiApp;
        uM.delta = ticker.deltaMS / (1000 / (settings.targetFps || 60));
        uM.deltaUi = ticker.elapsedMS / (1000 / (settings.targetFps || 60));
        uM.time = ticker.deltaMS / 1000;
        uM.timeUi = uM.timeUI = ticker.elapsedMS / 1000;
        inputsM.updateActions();
        timerM.updateTimers();
        /*!%beforeframe%*/
        roomsM.rootRoomOnStep.apply(roomsM.current);
        for (let i = 0, li = stack.length; i < li; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            templatesM.isCopy(stack[i]) && templatesM.beforeStep.apply(stack[i]);
            stack[i].onStep.apply(stack[i]);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            templatesM.isCopy(stack[i]) && templatesM.afterStep.apply(stack[i]);
        }
        // There may be a number of rooms stacked on top of each other.
        // Loop through them and filter out everything that is not a room.
        for (const item of pixiApp.stage.children) {
            if (!(item instanceof Room)) {
                continue;
            }
            roomsM.beforeStep.apply(item);
            item.onStep.apply(item);
            roomsM.afterStep.apply(item);
        }
        // copies
        for (const copy of stack) {
            // eslint-disable-next-line no-underscore-dangle
            if (copy.kill && !copy._destroyed) {
                // This will also allow a parent to eject children
                // to a new container before they are destroyed as well
                killRecursive(copy as (BasicCopy & pixiMod.DisplayObject));
                copy.destroy({
                    children: true
                });
            }
        }

        manageCamera();

        for (let i = 0, li = stack.length; i < li; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            templatesM.isCopy(stack[i]) && templatesM.beforeDraw.apply(stack[i]);
            stack[i].onDraw.apply(stack[i]);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            templatesM.isCopy(stack[i]) && templatesM.afterDraw.apply(stack[i]);
            stack[i].xprev = stack[i].x;
            stack[i].yprev = stack[i].y;
        }

        for (const item of pixiApp.stage.children) {
            if (!(item instanceof Room)) {
                continue;
            }
            roomsM.beforeDraw.apply(item);
            item.onDraw.apply(item);
            roomsM.afterDraw.apply(item);
        }
        roomsM.rootRoomOnDraw.apply(roomsM.current);
        /*!%afterframe%*/
        if (roomsM.switching) {
            roomsM.forceSwitch();
        }
    };
    loading = resM.loadGame();
    loading.then(() => {
        setTimeout(() => {
            pixiApp.ticker.add(loop);
            roomsM.forceSwitch(roomsM.starting);
        }, 0);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PIXI = PIXI;

{
    const actions = actionsM;
    const backgrounds = backgroundsM;
    const behaviors = behaviorsM;
    const camera = cameraM;
    const content = contentM;
    const emitters = emittersM;
    const inputs = inputsM;
    const res = resM;
    const rooms = roomsM;
    const sounds = soundsM;
    const styles = stylesM;
    const templates = templatesM;
    const tilemaps = tilemapsM;
    const timer = timerM;
    const u = uM;
    Object.assign(window, {
        actions,
        backgrounds,
        behaviors,
        Camera,
        camera,
        CtAction,
        content,
        emitters,
        inputs,
        res,
        rooms,
        sounds,
        styles,
        templates,
        Tilemap,
        tilemaps,
        timer,
        u,
        meta,
        settings,
        pixiApp
    });
    loading.then(() => {
        /*!%start%*/
    });

    /*!@actions@*/
    /*!@styles@*/
    /*!%styles%*/

    /*!@templates@*/
    /*!%templates%*/

    /*!@rooms@*/
    /*!%rooms%*/
}

/*!@catmods@*/

/*!@userScripts@*/

/*!%load%*/

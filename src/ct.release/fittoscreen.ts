import type {viewMode} from '../node_requires/exporter/_exporterContracts';

import roomsLib, {Room} from 'rooms';
import {settings, pixiApp} from 'index';
import mainCamera from 'camera';

document.body.style.overflow = 'hidden';

const positionCanvas = function positionCanvas(mode: viewMode, scale: number): void {
    const canv = pixiApp.view as HTMLCanvasElement;
    if (mode === 'fastScale' || mode === 'fastScaleInteger') {
        canv.style.transform = `translate(-50%, -50%) scale(${scale})`;
        canv.style.position = 'absolute';
        canv.style.top = '50%';
        canv.style.left = '50%';
    } else if (mode === 'expand' || mode === 'scaleFill') {
        canv.style.transform = '';
        canv.style.position = 'static';
        canv.style.top = 'unset';
        canv.style.left = 'unset';
    } else if (mode === 'scaleFit') {
        canv.style.transform = 'translate(-50%, -50%)';
        canv.style.position = 'absolute';
        canv.style.top = '50%';
        canv.style.left = '50%';
    } else {
        canv.style.transform = canv.style.position = canv.style.top = canv.style.left = '';
    }
};
export const updateViewport = (): void => {
    const mode = settings.viewMode;
    const pixelScaleModifier = settings.highDensity ? (window.devicePixelRatio || 1) : 1;
    const kw = window.innerWidth / roomsLib.current.viewWidth,
          kh = window.innerHeight / roomsLib.current.viewHeight;
    let k = Math.min(kw, kh);
    if (mode === 'fastScaleInteger') {
        k = k < 1 ? k : Math.floor(k);
    }
    var canvasWidth: number,
        canvasHeight: number,
        cameraWidth: number,
        cameraHeight: number;
    if (mode === 'expand') {
        canvasWidth = Math.ceil(window.innerWidth * pixelScaleModifier);
        canvasHeight = Math.ceil(window.innerHeight * pixelScaleModifier);
        cameraWidth = window.innerWidth;
        cameraHeight = window.innerHeight;
    } else if (mode === 'fastScale' || mode === 'fastScaleInteger') {
        canvasWidth = Math.ceil(roomsLib.current.viewWidth * pixelScaleModifier);
        canvasHeight = Math.ceil(roomsLib.current.viewHeight * pixelScaleModifier);
        cameraWidth = roomsLib.current.viewWidth;
        cameraHeight = roomsLib.current.viewHeight;
    } else if (mode === 'scaleFit' || mode === 'scaleFill') {
        if (mode === 'scaleFill') {
            canvasWidth = Math.ceil(roomsLib.current.viewWidth * kw * pixelScaleModifier);
            canvasHeight = Math.ceil(roomsLib.current.viewHeight * kh * pixelScaleModifier);
            cameraWidth = window.innerWidth / k;
            cameraHeight = window.innerHeight / k;
        } else { // scaleFit
            canvasWidth = Math.ceil(roomsLib.current.viewWidth * k * pixelScaleModifier);
            canvasHeight = Math.ceil(roomsLib.current.viewHeight * k * pixelScaleModifier);
            cameraWidth = roomsLib.current.viewWidth;
            cameraHeight = roomsLib.current.viewHeight;
        }
    } else {
        canvasWidth = roomsLib.current.viewWidth;
        canvasHeight = roomsLib.current.viewHeight;
        cameraWidth = canvasWidth;
        cameraHeight = canvasHeight;
    }

    pixiApp.renderer.resize(canvasWidth, canvasHeight);
    if (mode !== 'scaleFill' && mode !== 'scaleFit') {
        pixiApp.stage.scale.x = pixiApp.stage.scale.y = pixelScaleModifier;
    } else {
        pixiApp.stage.scale.x = pixiApp.stage.scale.y = pixelScaleModifier * k;
    }
    pixiApp.view.style.width = Math.ceil(canvasWidth / pixelScaleModifier) + 'px';
    pixiApp.view.style.height = Math.ceil(canvasHeight / pixelScaleModifier) + 'px';

    if (mainCamera) {
        const oldWidth = mainCamera.width,
              oldHeight = mainCamera.height;
        mainCamera.width = cameraWidth;
        mainCamera.height = cameraHeight;
        for (const item of pixiApp.stage.children) {
            if (!(item instanceof Room)) {
                continue;
            }
            item.realignElements(oldWidth, oldHeight, cameraWidth, cameraHeight);
        }
    }
    positionCanvas(mode, k);
};
window.addEventListener('resize', updateViewport);

/**
 * Tries to toggle the fullscreen mode.
 * Errors, if any, will be logged to console.
 * Also, this won't work in the internal ct.js debugger.
 * Instead, test it in your browser.
 *
 * This should be called on mouse / keyboard press event,
 * not the "release" event, or the actual transition will happen
 * on the next mouse/keyboard interaction. For example, this will work:
 *
 * ```js
 * if (pointer.pressed) {
 *   if (u.prect(pointer.x, pointer.y, this)) {
 *     fittoscreen.toggleFullscreen();
 *   }
 * }
 * ```
 */
export const toggleFullscreen = function (): void {
    try {
        // Are we in Electron?
        const win = require('electron').remote.BrowserWindow.getFocusedWindow();
        win.setFullScreen(!win.isFullScreen());
        return;
    } catch (e) {
        void e; // Continue with web approach
    }
    const canvas = document.fullscreenElement as HTMLCanvasElement | null;
    const requester = document.getElementById('ct') as HTMLCanvasElement;
    if (!canvas) {
        var promise = requester.requestFullscreen();
        if (promise) {
            promise
            .catch(function fullscreenError(err) {
                console.error('[fittoscreen]', err);
            });
        }
    } else {
        document.exitFullscreen();
    }
};

export const getIsFullscreen = function getIsFullscreen(): boolean {
    try {
        // Are we in Electron?
        const win = require('electron').remote.BrowserWindow.getFocusedWindow;
        return win.isFullScreen;
    } catch (e) {
        void e; // Continue with web approach
    }
    return document.fullscreen;
};

///<reference path="./desktopPack/game/neutralino.d.ts" />
///<reference path="./index.ts" />

// This file gets prepended to `ct.js` file when a game is run through the built-in debugger.
// It provides a messaging channel so the game can communicate with IDE and custom debug toolbar.

import type pixiMod from 'pixi.js';
declare var PIXI: typeof pixiMod;
declare var pixiApp: pixiMod.Application;
declare var settings: typeof import('./index').settings;
declare var rooms: typeof import('./rooms').default;
declare var meta: typeof import('./index').meta;
declare var sounds: typeof import('./sounds').default;

import {init, getOptions, broadcastTo} from '../lib/multiwindow';

const hints = [{
    title: 'List copies of a template',
    code: 'templates.list[\'YourTemplateName\']'
}, {
    title: 'Switch to a different room',
    code: 'rooms.switch(\'YourRoomName\')'
}, {
    title: 'Destroy all copies of a template',
    code: 'templates.list[\'YourTemplateName\'].forEach(copy => copy.kill = true);'
}];

// eslint-disable-next-line no-console
console.log(
    '%cWelcome to the game debugger! Use the toolbar above and try these snippets ⤵️ at the bottom of this console to interact with the game. Errors will also be logged here.',
    'padding: 0.5em 1em; background: #446adb; color: white; font-weight: bold; border-radius: 0.35rem;'
);
// eslint-disable-next-line no-console
for (const hint of hints) {
    // eslint-disable-next-line no-console
    console.log(`%c ${hint.title} %c ${hint.code}`, 'padding: 0.25em 0.5em; margin-left: 1em; background: #5144db; color: white; border-radius: 0.35rem; font: sans-serif !important;', '');
}

// This file gets injected when a game is run through the built-in ct.js debugger.
// It implements custom debug commands and reports errors to the console.
(() => {
    const base64ToArrayBuffer = (base64: string) => {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    const opts = getOptions() as {
        p: number,
        t: string
    };
    if (!opts.p || !opts.t) {
        return;
    }
    (window as any).NL_TOKEN = sessionStorage.NL_TOKEN = opts.t;
    (window as any).NL_PORT = opts.p;
    Neutralino.init();
    init('game');
    const {app, os, events, filesystem} = Neutralino;
    Neutralino.window.show();

    events.on('reloadGame', () => {
        window.location.reload();
    });
    events.on('stopDebugging', () => {
        app.exit();
    });

    Neutralino.events.on('windowClose', () => {
        broadcastTo('ide', 'stopDebugging');
    });

    let lastGameSpeed: number;
    events.on('debugActions', async (event: CustomEvent) => {
        switch (event.detail) {
        case 'toggleFullscreen': {
            const newFullscreen = !(await Neutralino.window.isFullScreen());
            if (newFullscreen) {
                await Neutralino.window.setFullScreen();
            } else {
                await Neutralino.window.exitFullScreen();
            }
            broadcastTo('debugToolbar', 'gameEvents', newFullscreen ? 'fullscreen' : 'exitFullscreen');
        } break;
        case 'makeScreenshot': {
            const renderTexture = PIXI.RenderTexture.create({
                width: pixiApp.renderer.width,
                height: pixiApp.renderer.height
            });
            pixiApp.renderer.render(pixiApp.stage, {
                renderTexture
            });
            var canvas = pixiApp.renderer.extract.canvas(renderTexture);
            var dataURL = canvas.toDataURL!('image/png').replace(/^data:image\/\w+;base64,/, '');
            const dateTime = (new Date()).toLocaleString()
                .replace(/[.:]/g, '-')
                .replace(/,/g, '');
            const savePath = await os.showSaveDialog(void 0, {
                defaultPath: `${meta.name} ${dateTime}.png`,
                filters: [{
                    name: 'PNG Images',
                    extensions: ['png']
                }]
            });
            filesystem.writeBinaryFile(savePath, base64ToArrayBuffer(dataURL));
        } break;
        case 'togglePause':
            if (settings.gameSpeed === 0) {
                settings.gameSpeed = lastGameSpeed || 1;
            } else {
                lastGameSpeed = settings.gameSpeed;
                settings.gameSpeed = 0;
            }
            broadcastTo('debugToolbar', 'gameEvents', settings.gameSpeed === 0 ? 'paused' : 'unpaused');
            break;
        case 'restartRoom':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rooms.restart();
            break;
        case 'restartGame':
            sounds.stop();
            rooms.switch(rooms.starting);
            break;
        default:
        }
    });
})();

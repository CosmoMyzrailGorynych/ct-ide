import packageJson from '../../package.json' with {type: 'macros'};
import {color} from 'bun' with {type: 'macro'};

const teal = color('teal', 'ansi')!,
      yellow = color('yellow', 'ansi')!,
      reset = '\x1b[0m';

// eslint-disable-next-line no-console
console.log(`${teal}
_________   __          __
\\_   ___ \\_/  |_       |__| ______
/    \\  \\/\\   __\\      |  |/  ___/
\\     \\____|  |        |  |\\___ \\
 \\______  /|__| /\\ /\\__|  /____  >
        \\/      \\/ \\______|    \\/

     Ct.js game engine v${packageJson.version}
${yellow}
     Don't close this window!
${reset}`);

import * as buntralino from 'buntralino';

// Available commands:
import convertPngToIco from './lib/png2icons';
import fetchJson from './lib/fetchJson';
import fetchText from './lib/fetchText';
import serve, {stopServer} from './lib/serve';
import zip from './lib/zip';
import unzip from './lib/unzip';
import packForDesktop from './lib/packForDesktop';
import ttf2woff from './lib/ttf2woff';
import getNetInterfaces from './lib/getNetInterfaces';
import minifyCss from './lib/minifyCss';
import minifyHtml from './lib/minifyHtml';

let gamePort: number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functionMap = {
    convertPngToIco,
    fetchJson,
    fetchText,
    serve,
    stopServer,
    zip,
    unzip,
    packForDesktop,
    ttf2woff,
    getNetInterfaces,
    minifyCss,
    minifyHtml,

    debugBootstrap: async (opts: {
        link: string,
        port: number,
        dpr: number
    }) => {
        gamePort = opts.port;

        let gamePosition: Awaited<ReturnType<typeof buntralino.getPosition>>,
            gameSize: Awaited<ReturnType<typeof buntralino.getSize>>;
        await Promise.all([
            buntralino.create(opts.link, {
                name: 'game',
                injectClientLibrary: true
            })
            .then(() => Promise.all([
                buntralino.getPosition('game'),
                buntralino.getSize('game')
            ]))
            .then(([position, size]) => {
                [gamePosition, gameSize] = [position, size];
            }),

            buntralino.create('/gameTools.html', {
                name: 'debugToolbar',
                hidden: true,
                borderless: true,
                resizable: false,
                alwaysOnTop: true
            })
        ]);

        const toolbarWidth = 440 * opts.dpr,
              toolbarHeight = 50 * opts.dpr;
        const x = gamePosition!.x + gameSize!.width! / 2 - toolbarWidth / 2,
              y = gamePosition!.y + 8;
        buntralino.setSize('debugToolbar', {
            width: toolbarWidth,
            height: toolbarHeight,
            minWidth: toolbarWidth,
            minHeight: toolbarHeight,
            maxWidth: toolbarWidth,
            maxHeight: toolbarHeight
        });
        buntralino.move('debugToolbar', x, y);
        buntralino.show('debugToolbar');
    },
    debugReloadGame: () => buntralino.reload('game'),
    debugExit: () => {
        if (buntralino.isConnectionOpen('game')) {
            buntralino.exit('game');
        }
        if (buntralino.isConnectionOpen('debugToolbar')) {
            buntralino.exit('debugToolbar');
        }
        buntralino.sendEvent('ide', 'debugFinished');
        return Promise.resolve();
    },
    debugToggleQrs: async () => {
        if (buntralino.isConnectionOpen('qrs')) {
            await buntralino.exit('qrs');
        } else {
            const [pos, size] = await Promise.all([
                buntralino.getPosition('debugToolbar'),
                buntralino.getSize('debugToolbar')
            ]);
            await buntralino.create('/gameToolsQrs.html', {
                name: 'qrs',
                width: 600,
                height: 800,
                x: pos!.x + size.width! / 2 - 300,
                y: pos!.y + size.height! + 10,
                processArgs: '--gameport=' + gamePort
            });
        }
    },
    debugFocusGame: () => buntralino.focus('game')
};

buntralino.registerMethodMap(functionMap as Record<string, (payload: unknown) => Promise<unknown>>);


const inspectorKey: Partial<Parameters<typeof buntralino.create>[1]> = {};
if (process.argv.includes('--superDuperSecretDebugMode')) {
    inspectorKey.enableInspector = true;
}
await buntralino.create('/', {
    name: 'ide',
    ...inspectorKey
});

// Exit the app completely when the IDE window is closed without the `shutdown` command.
buntralino.events.on('close', windowName => {
    if (windowName === 'ide') {
        // eslint-disable-next-line no-process-exit
        process.exit();
    } else if (windowName === 'debugToolbar' || windowName === 'game') {
        functionMap.debugExit();
    }
});

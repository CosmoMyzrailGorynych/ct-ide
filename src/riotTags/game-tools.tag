game-tools.flexrow.aButtonGroup(class="{opts.class}")
    #theDragger
        svg.feather(onclick="{hello}")
            use(xlink:href="#dragger-vertical")
    .debugger-toolbar-aDivider
    .debugger-toolbar-aButton(onclick="{sendAction('toggleFullscreen')}" title="{gameFullscreen? voc.exitFullscreen : voc.enterFullscreen}")
        svg.feather
            use(xlink:href="#{gameFullscreen? 'minimize' : 'maximize'}-2")
    .debugger-toolbar-aButton(onclick="{sendAction('makeScreenshot')}" title="{voc.screenshot}")
        svg.feather
            use(xlink:href="#camera")
    .debugger-toolbar-aButton(onclick="{requestOpenExternal}" title="{voc.openExternal}")
        svg.feather
            use(xlink:href="#external-link")
    .debugger-toolbar-aButton(onclick="{!awaitingQr && toggleQrCodes}" title="{voc.openExternal}")
        svg.feather
            use(xlink:href="#qr-code")
    .debugger-toolbar-aDivider
    .debugger-toolbar-aButton(onclick="{sendAction('togglePause')}" title="{gamePaused? voc.resume : voc.pause}")
        svg.feather
            use(xlink:href="#{gamePaused? 'play' : 'pause'}")
    .debugger-toolbar-aButton(onclick="{sendAction('restartRoom')}" title="{voc.restartRoom}")
        svg.feather
            use(xlink:href="#room-reload")
    .debugger-toolbar-aButton(onclick="{sendAction('restartGame')}" title="{voc.restartGame}")
        svg.feather
            use(xlink:href="#rotate-cw")
    .debugger-toolbar-aDivider
    .debugger-toolbar-aButton.error(onclick="{requestStopDebugging}" title="{voc.stopGame}")
        svg.feather
            use(xlink:href="#x-octagon")
    script.
        this.namespace = 'debuggerToolbar';
        this.mixin(require('src/lib/riotMixins/voc').default);

        const {isDev} = require('src/lib/platformUtils');
        const {init, broadcastTo, focus, createWindow, isClosed, shareConnections, exit} = require('src/lib/multiwindow');
        init('debugToolbar');

        this.gameFullscreen = false;
        this.gamePaused = false;
        this.sendAction = action => () => {
            broadcastTo('game', 'debugActions', action);
            focus('game');
        };
        this.requestOpenExternal = () => {
            broadcastTo('ide', 'openDebugExternal');
            focus('game');
        };
        this.requestStopDebugging = () => {
            broadcastTo('ide', 'stopDebugging');
            focus('game');
        };

        // used to prevent double-clicking when async actions are still executing
        this.awaitingQr = false;

        let myWidth = 440;
        Neutralino.window.getSize()
        .then(size => {
            myWidth = size.width;
        });

        this.toggleQrCodes = async () => {
            if (isClosed('qrCodes')) {
                this.awaitingQr = true;
                const myPosition = await Neutralino.window.getPosition();
                console.log(myPosition);
                const qrWidth = 560,
                      qrHeight = 640;
                const gameport = Number(window.NL_ARGS
                    .find(arg => arg.includes('--gameport='))
                    .split('=')[1]);
                await createWindow('qrCodes', '/gameToolsQrs.html', {
                    processArgs: `${isDev() ? '--ctjs-devmode' : ''} --gameport=${gameport}`,
                    width: qrWidth,
                    height: qrHeight,
                    minWidth: qrWidth,
                    minHeight: qrHeight,
                    maxWidth: qrWidth,
                    maxHeight: qrHeight,
                    x: myPosition.x - (qrWidth - myWidth) / 2,
                    y: myPosition.y + (myPosition.y > 600 ? -(qrHeight - 50) : 50),
                    enableInspector: isDev(),
                    borderless: true,
                    hidden: true,
                    title: 'QR codes for debugging your game'
                });
                shareConnections('qrCodes', ['ide']);
                shareConnections('ide', ['qrCodes']);
                this.awaitingQr = false;
                this.update();
            } else {
                await exit('qrCodes');
                this.awaitingQr = false;
                this.update();
            }
        };

        Neutralino.events.on('gameEvents', e => {
            console.debug('Received gameEvents', e.detail);
            switch (e.detail) {
            case 'paused':
                this.gamePaused = true;
                break;
            case 'unpaused':
                this.gamePaused = false;
                break;
            case 'fullscreen':
                this.gameFullscreen = true;
                break;
            case 'exitFullscreen':
                this.gameFullscreen = false;
                break;
            }
            this.update();
        });
        Neutralino.events.on('ctjsDebugIde', e => {
            if (e.detail === 'closeToolbar') {
                Neutralino.app.exit();
            }
        });

        this.on('mount', () => {
            setTimeout(() => {
                Neutralino.window.setDraggableRegion('theDragger', {
                    alwaysCapture: true
                });
            }, 0);
        });

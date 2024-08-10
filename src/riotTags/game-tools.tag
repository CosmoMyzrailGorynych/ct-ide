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

        const {init, broadcastTo, focus} = require('src/lib/multiwindow');
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

        this.hello = () => {
            console.log('HELLO');
        };

        Neutralino.events.on('gameEvents', e => {
            console.log(e.detail);
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

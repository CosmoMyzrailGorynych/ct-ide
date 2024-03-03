//
    Exposes this.reloadGame
debugger-screen-multiwindow.flexcol(class="{opts.class}")
    webview.tall#thePreview(
        ref="gameView"
        partition="persist:trusted"
        allownw nwfaketop
    )
    .aDebuggerToolbar(class="horizontal {tight: window.innerWidth < 1000}")
        .debugger-toolbar-aButton(onclick="{togglePause}" title="{gamePaused? voc.resume : voc.pause}")
            svg.feather
                use(xlink:href="#{gamePaused? 'play' : 'pause'}")
            span  {gamePaused? voc.resume : voc.pause}
        .debugger-toolbar-aButton(onclick="{restartGame}" title="{voc.restartGame}")
            svg.feather
                use(xlink:href="#rotate-cw")
            span  {voc.restartGame}
        .debugger-toolbar-aButton(onclick="{restartRoom}" title="{voc.restartRoom}")
            svg.feather
                use(xlink:href="#room-reload")
            span  {voc.restartRoom}
        .debugger-toolbar-aButton(onclick="{displayRoomSelector}" title="{voc.switchRoom}")
            svg.feather
                use(xlink:href="#room-switch")
            span  {voc.switchRoom}

        .debugger-toolbar-aDivider.nogrow

        .debugger-toolbar-aButton.nogrow(onclick="{makeScreenshot}" title="{voc.screenshot}")
            svg.feather
                use(xlink:href="#camera")
        .debugger-toolbar-aButton.nogrow(onclick="{openQrCodes}" title="{voc.links}")
            svg.feather
                use(xlink:href="#smartphone")
        .debugger-toolbar-aButton.nogrow(onclick="{openExternal}" title="{voc.openExternal}")
            svg.feather
                use(xlink:href="#external-link")
    debugger-modal(if="{showNetworkingModal}" params="{opts.params}")
    script.
        this.namespace = 'debuggerToolbar';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.showNetworkingModal = false;

        const passedParams = this.opts.params;
        if (passedParams.title) {
            document.title = passedParams.title + ' — ct.js';
        }

        const refresh = () => this.update();
        /* Bootstrap preview and debug views */
        this.on('mount', () => {
            this.refs.gameView.addEventListener('permissionrequest', function permissionrequest(e) {
                if (['fullscreen', 'media', 'download', 'pointerLock'].indexOf(e.permission) !== -1) {
                    e.request.allow();
                }
            });
            this.refs.gameView.addEventListener('contentload', () => {
                this.refs.gameView.showDevTools(true);
                this.refs.gameView.focus();
            }, {
                once: true
            });
            this.refs.gameView.setAttribute('src', passedParams.link);
            window.addEventListener('resize', refresh);
        });
        this.on('unmount', () => {
            window.removeEventListener('resize', refresh);
        });

        /* Helper methods for buttons */
        this.switchRoom = room => {
            this.refs.gameView.executeScript({
                code: `rooms.switch('${room}')`,
                mainWorld: true
            });
        };
        this.displayRoomSelector = e => {
            const menu = new nw.Menu();
            // Query for in-game rooms
            this.refs.gameView.executeScript({
                code: 'JSON.stringify(Object.keys(rooms.templates));',
                mainWorld: true
            }, rooms => {
                JSON.parse(rooms).map(room => ({
                    label: room,
                    click: () => {
                        this.switchRoom(room);
                    }
                }))
                .forEach(entry => menu.append(new nw.MenuItem(entry)));
                menu.popup(e.clientX, e.clientY);
            });
        };

        /* Buttons' event listeners */
        this.togglePause = () => {
            this.refs.gameView.executeScript({
                code: `
                    if (pixiApp.ticker.started) {
                        pixiApp.ticker.stop();
                    } else {
                        pixiApp.ticker.start();
                    }
                    !pixiApp.ticker.started;
                `,
                mainWorld: true
            }, paused => {
                if (paused === 'false' || paused === false) {
                    this.gamePaused = false;
                } else {
                    this.gamePaused = true;
                }
                this.update();
            });
        };
        this.restartGame = () => {
            this.refs.gameView.reload();
        };
        this.restartRoom = () => {
            this.refs.gameView.executeScript({
                code: 'rooms.switch(rooms.current.name);',
                mainWorld: true
            });
        };
        this.makeScreenshot = () => {
            this.refs.gameView.executeScript({
                code: `
                    var renderTexture = PIXI.RenderTexture.create({
                        width: pixiApp.renderer.width,
                        height: pixiApp.renderer.height
                    });
                    pixiApp.renderer.render(pixiApp.stage, renderTexture);
                    var canvas = pixiApp.renderer.extract.canvas(renderTexture);
                    var dataURL = canvas.toDataURL('image/png');
                    dataURL;
                `,
                mainWorld: true
            }, dataURL => {
                [dataURL] = dataURL;
                window.showSaveDialog({
                    filter: 'image/png',
                    defaultName: `${passedParams.title || 'Screenshot'}.png`
                }).then(filename => {
                    const fs = require('fs');
                    if (!filename) {
                        return;
                    }
                    const screenshotBase64 = dataURL.replace(/^data:image\/\w+;base64,/, '');
                    const buf = Buffer.from(screenshotBase64, 'base64');
                    const stream = fs.createWriteStream(filename);
                    stream.end(buf);
                });
            });
        };
        this.toggleFullscreen = () => {
            this.gameFullscreen = !this.gameFullscreen;
            if (this.gameFullscreen) {
                this.previewWindow.enterFullscreen();
            } else {
                this.previewWindow.leaveFullscreen();
            }
        };
        this.openQrCodes = () => {
            this.showNetworkingModal = !this.showNetworkingModal;
        };
        this.openExternal = () => {
            if (passedParams.link) {
                nw.Shell.openExternal(passedParams.link);
            }
        };

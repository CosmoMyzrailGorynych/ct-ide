debugger-screen(class="{opts.class} {flexrow: verticalLayout, flexcol: !verticalLayout}")
    webview.tall#thePreview(
        partition="persist:trusted"
        ref="gameView" allownw
    )
    .aResizer(ref="gutter" onmousedown="{gutterMouseDown}" class="{vertical: verticalLayout, horizontal: !verticalLayout}")
    .flexfix(
        style="flex: 0 0 auto; {verticalLayout? 'width:'+width+'px' : 'height:'+height+'px'}"
    )
        webview.tall.flexfix-body(
            partition="persist:trusted" src="empty.html"
            ref="devtoolsView" allownw nwfaketop
            style="overflow: hidden;"
        )
        .flexfix-footer.aDebuggerToolbar.noshrink(
            class="{vertical: verticalLayout} {tight: (verticalLayout && width < 1000) || (!verticalLayout && window.innerWidth < 1000)}"
        )
            .debugger-toolbar-aButton(onclick="{togglePause}" title="{gamePaused? voc.resume : voc.pause}")
                svg.feather
                    use(xlink:href="data/icons.svg#{gamePaused? 'play' : 'pause'}")
                span  {gamePaused? voc.resume : voc.pause}
            .debugger-toolbar-aButton(onclick="{restartGame}" title="{voc.restartGame}")
                svg.feather
                    use(xlink:href="data/icons.svg#rotate-cw")
                span  {voc.restartGame}
            .debugger-toolbar-aButton(onclick="{restartRoom}" title="{voc.restartRoom}")
                svg.feather
                    use(xlink:href="data/icons.svg#room-reload")
                span  {voc.restartRoom}
            .debugger-toolbar-aButton(onclick="{displayRoomSelector}" title="{voc.switchRoom}")
                svg.feather
                    use(xlink:href="data/icons.svg#room-switch")
                span  {voc.switchRoom}

            .debugger-toolbar-aDivider

            .debugger-toolbar-aButton(onclick="{makeScreenshot}" title="{voc.screenshot}")
                svg.feather
                    use(xlink:href="data/icons.svg#camera")
            //.debugger-toolbar-aButton(onclick="{toggleFullscreen}" title="{gameFullscreen? voc.exitFullscreen : voc.enterFullscreen}")
            //    svg.feather
            //        use(xlink:href="data/icons.svg#{gameFullscreen? 'minimize' : 'maximize'}-2")
            .debugger-toolbar-aButton(onclick="{openQrCodes}" title="{voc.links}")
                svg.feather
                    use(xlink:href="data/icons.svg#smartphone")
            .debugger-toolbar-aButton(onclick="{openExternal}" title="{voc.openExternal}")
                svg.feather
                    use(xlink:href="data/icons.svg#external-link")

            .debugger-toolbar-aDivider

            .debugger-toolbar-aButton(onclick="{flipLayout}")
                svg.feather
                    use(xlink:href="data/icons.svg#layout-{verticalLayout? 'horizontal' : 'vertical'}")
    debugger-modal(if="{showNetworkingModal}")
    script.
        this.namespace = 'debuggerToolbar';
        this.mixin(window.riotVoc);

        this.showNetworkingModal = false;

        const passedParams = new URLSearchParams(window.location.search);
        if (passedParams.has('title')) {
            document.title = passedParams.get('title') + ' — ct.js';
        }

        /* Gutter logic */
        const minSizeW = 400;
        const minSizeH = 200; // This includes the height of all buttons
        const getMaxSizeW = () => window.innerWidth - 300;
        const getMaxSizeH = () => window.innerHeight - 300;

        this.verticalLayout = localStorage.debuggerLayour !== 'horizontal';
        this.width = Math.max(minSizeW, Math.min(getMaxSizeW(), localStorage.debuggerWidth || 500));
        this.height = Math.max(minSizeH, Math.min(getMaxSizeH(), localStorage.debuggerHeight || 300));

        // iframes and webviews capture mousemove events needed for resize gutter;
        // this overlay will prevent it
        const catcher = document.createElement('div');
        const s = catcher.style;
        s.position = 'fixed';
        s.left = s.right = s.top = s.bottom = '0';
        s.zIndex = 100;
        s.cursor = 'ew-resize';

        this.gutterMouseDown = () => {
            this.dragging = true;
            s.cursor = this.verticalLayout ? 'ew-resize' : 'ns-resize';
            document.body.appendChild(catcher);
        };
        document.addEventListener('mousemove', e => {
            if (!this.dragging) {
                return;
            }
            if (this.verticalLayout) {
                this.width = Math.max(minSizeW, Math.min(getMaxSizeW(), window.innerWidth - e.clientX));
                localStorage.debuggerWidth = this.width;
            } else {
                this.height = Math.max(minSizeH, Math.min(getMaxSizeH(), window.innerHeight - e.clientY));
                localStorage.debuggerHeight = this.height;
            }
            this.update();
        });
        document.addEventListener('mouseup', () => {
            if (this.dragging) {
                this.dragging = false;
                document.body.removeChild(catcher);
            }
        });
        this.flipLayout = () => {
            this.verticalLayout = !this.verticalLayout;
        };

        /* Bootstrap preview and debug views */
        this.on('mount', () => {
            this.refs.gameView.addEventListener('contentload', () => {
                this.refs.gameView.showDevTools(true, this.refs.devtoolsView);
                setTimeout(() => {
                    this.refs.devtoolsView.executeScript({
                        code: 'DevToolsAPI.showPanel(\'console\')',
                        mainWorld: true
                    });
                }, 1000);
                this.refs.gameView.focus();
            });
            this.refs.gameView.setAttribute('src', passedParams.get('link'));
        });

        /* Helper methods for buttons */
        this.switchRoom = room => {
            this.refs.gameView.executeScript({
                code: `ct.rooms.switch('${room}')`,
                mainWorld: true
            });
        };
        this.displayRoomSelector = e => {
            const menu = new nw.Menu();
            // Query for in-game rooms
            this.refs.gameView.executeScript({
                code: 'JSON.stringify(Object.keys(ct.rooms.templates));',
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
                    if (PIXI.Ticker.shared.started) {
                        PIXI.Ticker.shared.stop();
                    } else {
                        PIXI.Ticker.shared.start();
                    }
                    !PIXI.Ticker.shared.started;
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
                code: 'ct.rooms.switch(ct.room.name);',
                mainWorld: true
            });
        };
        this.makeScreenshot = () => {
            this.refs.gameView.executeScript({
                code: `
                    var renderTexture = PIXI.RenderTexture.create({
                        width: ct.pixiApp.renderer.width,
                        height: ct.pixiApp.renderer.height
                    });
                    ct.pixiApp.renderer.render(ct.pixiApp.stage, renderTexture);
                    var canvas = ct.pixiApp.renderer.extract.canvas(renderTexture);
                    var dataURL = canvas.toDataURL('image/png');
                    dataURL;
                `,
                mainWorld: true
            }, dataURL => {
                [dataURL] = dataURL;
                window.showSaveDialog({
                    filter: 'image/png',
                    defaultName: `${passedParams.get('title') || 'Screenshot'}.png`
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
            const passedParams = new URLSearchParams(window.location.search);
            if (passedParams.has('link')) {
                nw.Shell.openExternal(passedParams.get('link'));
            }
        };

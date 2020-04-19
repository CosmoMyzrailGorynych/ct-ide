debugger-toolbar
    .debugger-toolbar-aDragger.feather
        svg.feather
            use(xlink:href="data/icons.svg#dragger-vertical")

    .debugger-toolbar-aButton(onclick="{togglePause}" title="{gamePaused? voc.resume : voc.pause}")
        svg.feather
            use(xlink:href="data/icons.svg#{gamePaused? 'play' : 'pause'}")
    .debugger-toolbar-aButton(onclick="{restartGame}" title="{voc.restartGame}")
        svg.feather
            use(xlink:href="data/icons.svg#rotate-cw")
    .debugger-toolbar-aButton(onclick="{restartRoom}" title="{voc.restartRoom}")
        svg.feather
            use(xlink:href="data/icons.svg#room-reload")
    .debugger-toolbar-aButton(onclick="{displayRoomSelector}" title="{voc.switchRoom}")
        svg.feather
            use(xlink:href="data/icons.svg#room-switch")

    .debugger-toolbar-aDivider

    .debugger-toolbar-aButton(onclick="{toggleDevTools}" title="{voc.toggleDevTools}")
        svg.feather
            use(xlink:href="data/icons.svg#terminal")
    .debugger-toolbar-aButton(onclick="{makeScreenshot}" title="{voc.screenshot}")
        svg.feather
            use(xlink:href="data/icons.svg#camera")
    .debugger-toolbar-aButton(onclick="{toggleFullscreen}" title="{gameFullscreen? voc.exitFullscreen : voc.enterFullscreen}")
        svg.feather
            use(xlink:href="data/icons.svg#{gameFullscreen? 'minimize' : 'maximize'}-2")
    .debugger-toolbar-aButton(onclick="{openQrCodes}" title="{voc.links}")
        svg.feather
            use(xlink:href="data/icons.svg#smartphone")
    .debugger-toolbar-aButton(onclick="{openExternal}" title="{voc.openExternal}")
        svg.feather
            use(xlink:href="data/icons.svg#external-link")

    .debugger-toolbar-aDivider

    .debugger-toolbar-aButton(onclick="{closeItself}" title="{voc.close}")
        svg.feather
            use(xlink:href="data/icons.svg#x")
    script.
        this.namespace = 'debuggerToolbar';
        this.mixin(window.riotVoc);

        var isDevToolsOpen = true;

        setTimeout(() => {
            const win = nw.Window.get();
            // Make sure the window does not distort due to inconsistencies in title size on different OS
            win.resizeTo(Math.round(480 * window.devicePixelRatio), Math.round(40 * window.devicePixelRatio));
        }, 0);

        const menu = new nw.Menu();
        global.currentProject.rooms.map(room => ({
            label: room.name,
            click: () => {
                this.switchRoom(room.name);
            }
        })).forEach(entry => menu.append(new nw.MenuItem(entry)));

        // Get displays to position everything nicely
        // Firstly aim for the built-in monitor (usually a keyboard is near it), then try the second one, then try the first one
        // eslint-disable-next-line new-cap
        nw.Screen.Init();
        const {screens} = nw.Screen;
        const builtIn = screens.find(screen => screen.isBuiltIn);
        const targetScreen = builtIn || screens[1] || screens[0];
         nw.Window.open(window.gameLink, {
            title: 'ct.js',
            icon: 'ct_ide.png',
            x: targetScreen.work_area.x,
            y: targetScreen.work_area.y,
            width: targetScreen.work_area.width,
            height: targetScreen.work_area.height,
            resizable: true,
            id: 'ctjsPreview',
            focus: true
            // eslint-disable-next-line camelcase
            // new_instance: true
        }, newWindow => {
            this.previewWindow = newWindow;
            this.previewWindow.on('close', this.closeItself);
            this.previewWindow.maximize();
            this.previewWindow.focus();
            this.previewWindow.showDevTools();
            this.previewWindow.on('devtools-closed', () => {
                isDevToolsOpen = false;
            })
        });

        this.switchRoom = room => {
            this.previewWindow.eval(null, `ct.rooms.switch('${room}')`);
        };
        this.displayRoomSelector = e => {
            menu.popup(e.clientX, e.clientY);
        };

        this.togglePause = e => {
            // hidden negation is semantically hidden here
            this.gamePaused = this.previewWindow.window.PIXI.Ticker.shared.started;
            if (this.gamePaused) {
                this.previewWindow.window.PIXI.Ticker.shared.stop();
            } else {
                this.previewWindow.window.PIXI.Ticker.shared.start();
            }
        };
        this.restartGame = e => {
            this.previewWindow.eval(null, 'window.location.reload();');
        };
        this.restartRoom = e => {
            this.previewWindow.eval(null, 'ct.rooms.switch(ct.room.name);');
        };
        this.toggleDevTools = e => {
            if (isDevToolsOpen) {
                this.previewWindow.eval(null, 'nw.Window.get().closeDevTools()');
            } else {
                this.previewWindow.eval(null, 'nw.Window.get().showDevTools()');
                isDevToolsOpen = true;
            }
        };
        this.makeScreenshot = e => {
            // Ask for game canvas geometry
            const rect = this.previewWindow.window.document.querySelector('#ct canvas').getBoundingClientRect();
            this.previewWindow.captureScreenshot({
                clip: rect
            }, (err, base64) => {
                if (err) {
                    window.alertify.error(err);
                    throw err;
                }
                const fs = require('fs-extra'),
                      path = require('path');
                const now = new Date(),
                      timestring = `${now.getFullYear()}-${('0'+now.getMonth()+1).slice(-2)}-${('0'+now.getDate()).slice(-2)} ${(new Date()).getHours()}-${('0'+now.getMinutes()).slice(-2)}-${('0'+now.getSeconds()).slice(-2)}`,
                      name = `Screenshot of ${global.currentProject.settings.title || 'ct.js game'} at ${timestring}.png`,
                      fullPath = path.join(__dirname, name);
                const data = base64.replace(/^data:image\/\w+;base64,/, '');
                const buff = new Buffer(data, 'base64');
                const stream = fs.createWriteStream(fullPath);
                stream.on('finish', () => {
                    window.alertify.success(`Saved to ${fullPath}`);
                });
                stream.on('error', err => {
                    window.alertify.error(err);
                    throw err;
                });
                stream.end(buff);
            });
        };
        this.toggleFullscreen = e => {
            this.gameFullscreen = !this.gameFullscreen;
            if (this.gameFullscreen) {
                this.previewWindow.enterFullscreen()
            } else {
                this.previewWindow.leaveFullscreen();
            }
        };
        this.openQrCodes = e => {
            if (this.qrCodesWindow) {
                this.qrCodesWindow.focus();
            } else {
                const {port} = this.previewWindow.window.location;
                nw.Window.open('qrCodePanel.html', {
                    width: 700,
                    height: 440,
                    resizable: true,
                    position: 'center'
                }, newWindow => {
                    this.qrCodesWindow = newWindow;
                    this.qrCodesWindow.window.gamePort = port;
                    this.qrCodesWindow.on('closed', () => {
                        this.qrCodesWindow = null;
                    });
                });
            }
        };
        this.openExternal = e => {
            nw.Shell.openExternal(window.gameLink);
        };

        this.closeItself = e => {
            this.previewWindow.close(true);
            nw.Window.get().close();
        };
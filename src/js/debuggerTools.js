(function () {
    var toolbarWindow, previewWindow, qrCodesWindow;

    // a map from IPC messages to scripts sent to the ct.js game, to shorten the code
    const toolbarResponseScripts = {
        togglePause: `
            if (PIXI.Ticker.shared.started) {
                PIXI.Ticker.shared.stop();
            } else {
                PIXI.Ticker.shared.start();
            }`,
        restartGame: 'window.location.reload();',
        restartRoom: 'ct.rooms.switch(ct.room.name);'
    };
    // Listen for ct.js toolbar's events
    const {ipcRenderer} = require('electron');
    ipcRenderer.on('debuggerToolbar', (event, message) => {
        if (message in toolbarResponseScripts) {
            previewWindow.webContents.executeJavaScript(toolbarResponseScripts[message]);
        } else if (message === 'makeScreenshot') {
            // Ask for game canvas geometry
            previewWindow.webContents.executeJavaScript(`
                new Promise(resolve => {
                    const b = document.querySelector('#ct canvas').getBoundingClientRect();
                    // Needs to be copied manually, otherwise resolves into an empty object
                    resolve({x: b.x, y: b.y, width: b.width, height: b.height});
                });
            `)
            .then(rect => {
                previewWindow.capturePage(rect)
                .then(img => {
                    // @see https://www.electronjs.org/docs/api/native-image
                    const fs = require('fs-extra'),
                          path = require('path');
                    const buff = img.toPNG();
                    const now = new Date(),
                          timestring = `${now.getFullYear()}-${('0'+now.getMonth()+1).slice(-2)}-${('0'+now.getDate()).slice(-2)} ${(new Date()).getHours()}-${('0'+now.getMinutes()).slice(-2)}-${('0'+now.getSeconds()).slice(-2)}`,
                          name = `Screenshot of ${window.currentProject.settings.title || 'ct.js game'} at ${timestring}.png`,
                          fullPath = path.join(__dirname, name);
                    const stream = fs.createWriteStream(fullPath);
                    stream.on('finish', () => {
                        window.alertify.success(`Saved to ${fullPath}`);
                    });
                    stream.end(buff);
                })
                .catch(window.alertify.error);
            });
        } else if (message === 'openExternal') {
            const {shell} = require('electron');
            shell.openExternal(previewWindow.webContents.getURL());
        } else if (message === 'toggleFullscreen') {
            previewWindow.setFullScreen(!previewWindow.isFullScreen());
        } else if (message.indexOf('switchRoom:') === 0) {
            const room = message
                .split(':')
                .slice(1)
                .join('');
            previewWindow.webContents.executeJavaScript(`ct.rooms.switch('${room}')`);
        } else if (message === 'closeDebugger') {
            // close both windows
            if (previewWindow) {
                previewWindow.destroy();
            }
            if (toolbarWindow) {
                toolbarWindow.destroy();
            }
            previewWindow = toolbarWindow = null;
        } else if (message === 'toggleDevTools') {
            previewWindow.webContents.toggleDevTools();
        } else if (message === 'openQrCodes') {
            if (qrCodesWindow) {
                qrCodesWindow.focus();
            } else {
                previewWindow.webContents.executeJavaScript(`
                    new Promise(resolve => {
                        resolve(location.port);
                    });
                `)
                .then(port => {
                    const {BrowserWindow} = require('electron').remote;
                    qrCodesWindow = new BrowserWindow({
                        width: 700,
                        height: 440,
                        resizable: true,
                        webPreferences: {
                            nodeIntegration: true,
                            affinity: 'ct.IDE',
                            title: 'ct.js networking',
                            icon: 'ct_ide.png'
                        }
                    });
                    qrCodesWindow.setMenuBarVisibility(false);
                    qrCodesWindow.on('close', () => {
                        qrCodesWindow = null;
                    });
                    qrCodesWindow.loadFile('qrCodePanel.html', {
                        query: {
                            port
                        }
                    });
                });
            }
        }
    });

    window.openDebugger = function(link) {
        // Clean up previous instances of a toolbar and a debugger
        if (previewWindow) {
            previewWindow.destroy();
            previewWindow = null;
        }
        if (toolbarWindow) {
            toolbarWindow.destroy();
            toolbarWindow = null;
        }

        const {BrowserWindow} = require('electron').remote;

        // Get displays to position everything nicely
        // Eithe aim for the first external monitor, or to the main one
        const nativeScreen = require('electron').remote.screen;
        const primary = nativeScreen.getPrimaryDisplay();
        const targetScreen = nativeScreen.getAllDisplays().find(display => display.id !== primary.id) ||
                            primary;

        // Spawn a new preview window
        previewWindow = new BrowserWindow({
            title: 'ct.js',
            icon: 'ct_ide.png',
            x: targetScreen.bounds.x,
            y: targetScreen.bounds.y,
            width: targetScreen.bounds.width,
            height: targetScreen.bounds.height,
            resizable: true,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                affinity: 'ct game'
            }
        });
        previewWindow.setMenuBarVisibility(false);
        previewWindow.maximize();
        previewWindow.loadURL(link);
        previewWindow.focus();
        previewWindow.webContents.openDevTools();
        // Align the toolbar to top-center position
        const x = targetScreen.bounds.x + (targetScreen.bounds.width - 480) / 2,
              {y} = targetScreen.bounds;

        // Create a toolbar that provides additional game-related tools
        toolbarWindow = new BrowserWindow({
            width: 480,
            height: 40,
            x,
            y,
            //width: 1024, // In case you need to call a debugger
            //height: 1024,
            minHeight: 20,
            minWidth: 208,
            frame: false,
            transparent: true,
            resizable: false,
            title: 'ct.js',
            icon: 'ct_ide.png',
            alwaysOnTop: true,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                affinity: 'ct.IDE'
            }
        });
        // This line will prevent the toolbar from stucking behind a Windows taskbar / MacOS dock
        toolbarWindow.setAlwaysOnTop(true, 'pop-up-menu');
        toolbarWindow.loadFile('debuggerToolbar.html', {
            query: {
                parentId: require('electron').remote.getCurrentWindow().id,
                rooms: window.currentProject.rooms.map(room => room.name)
            }
        });
        //toolbarWindow.webContents.openDevTools();

        // listeners for events when one of the windows is closed; destroy both
        const closer = () => {
            if (previewWindow) {
                previewWindow.destroy();
            }
            if (toolbarWindow) {
                toolbarWindow.destroy();
            }
            toolbarWindow = previewWindow = null;
        };
        toolbarWindow.on('close', closer);
        previewWindow.on('close', closer);
    };
})();

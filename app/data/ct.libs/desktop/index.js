ct.desktop = {
    /* Initialize Properties */
    isNw: null,
    isElectron: null,
    isDesktop: null,
    /* Define Main Function */
    //eslint-disable-next-line consistent-return
    desktopFeature(feature) {
        /* Set Defaults for Undefined Parameters */
        feature.nw.method ||= feature.name.split('.')[feature.name.split('.').length - 1];
        feature.nw.parameter ||= feature.parameter;
        feature.electron.method ||= feature.name.split('.')[feature.name.split('.').length - 1];
        feature.electron.parameter ||= feature.parameter;
        /* Define Functionality for NW.js */
        if (ct.desktop.isNw) {
            /* Create Local Variables Based on Parameters */
            const namespace = feature.nw.namespace.split('.');
            /* If running in ct.js's debugger */
            if (window.iAmInCtIdeDebugger) {
                // eslint-disable-next-line no-console
                console.warn('[' + feature.name + '] - The game is running inside ct.js\'s debugger, desktop features will only work in desktop exports! :c');
            /* If running in NW.js, not in ct.js's debugger */
            } else if (namespace.length === 1) {
                if (namespace[0] === 'win') {
                    const win = nw.Window.get();
                    return win[feature.nw.method](feature.nw.parameter);
                } else if (namespace[0] !== 'win') {
                    return nw[namespace[0]][feature.nw.method](feature.nw.parameter);
                }
            } else if (namespace.length === 2) {
                if (namespace[0] === 'win') {
                    const win = nw.Window.get();
                    return win[namespace[1]][feature.nw.method](feature.nw.parameter);
                } else if (namespace[0] !== 'win') {
                    return nw[namespace[0]][namespace[1]][feature.nw.method](feature.nw.parameter);
                }
            }
        /* Define Functionality for Electron */
        } else if (ct.desktop.isElectron) {
            const {ipcRenderer} = require('electron');
            return ipcRenderer.sendSync('ct.desktop', feature);
        /* Define Functionality for Unkown Environments */
        } else {
            console.error('[' + feature.name + '] - Unknown environment :c Are we in a browser?');
        }
    },
    /* Define Methods Using Main Function */
    openDevTools(options) {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.openDevTools',
            nw: {
                namespace: 'win',
                method: 'showDevTools'
            },
            electron: {
                namespace: 'mainWindow.webContents',
                parameter: options
            }
        });
    },
    closeDevTools() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.closeDevTools',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow.webContents'
            }
        });
    },
    isDevToolsOpen() {
        return ct.desktop.desktopFeature({
            name: 'ct.desktop.isDevToolsOpen',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow.webContents',
                method: 'isDevToolsOpened'
            }
        });
    },
    quit() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.quit',
            nw: {
                namespace: 'App'
            },
            electron: {
                namespace: 'app'
            }
        });
    },
    show() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.show',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    hide() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.hide',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    isVisible() {
        return ct.desktop.desktopFeature({
            name: 'ct.desktop.isVisible',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    maximize() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.maximize',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    unmaximize() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.unmaximize',
            nw: {
                namespace: 'win'
            }
        });
    },
    isMaximized() {
        return ct.desktop.desktopFeature({
            name: 'ct.desktop.isMaximized',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    minimize() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.minimize',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    restore() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.restore',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    isMinimized() {
        return ct.desktop.desktopFeature({
            name: 'ct.desktop.isMinimized',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    fullscreen() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.fullscreen',
            nw: {
                namespace: 'win',
                method: 'enterFullscreen'
            },
            electron: {
                namespace: 'mainWindow',
                method: 'setFullScreen',
                parameter: true
            }
        });
    },
    unfullscreen() {
        ct.desktop.desktopFeature({
            name: 'ct.desktop.unfullscreen',
            nw: {
                namespace: 'win',
                method: 'leaveFullscreen'
            },
            electron: {
                namespace: 'mainWindow',
                method: 'setFullScreen',
                parameter: false
            }
        });
    },
    isFullscreen() {
        return ct.desktop.desktopFeature({
            name: 'ct.desktop.isFullscreen',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow',
                method: 'isFullScreen'
            }
        });
    }
};
/* Set Prevously Initialized Properties */
try {
    ct.desktop.isNw = Boolean(nw && nw.App);
} catch (e) {
    ct.desktop.isNw = false;
}
try {
    require('electron');
    ct.desktop.isElectron = true;
} catch (e) {
    ct.desktop.isElectron = false;
}
ct.desktop.isDesktop = ct.desktop.isNw || ct.desktop.isElectron;

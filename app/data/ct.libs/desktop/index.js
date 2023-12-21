window.desktop = {
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
        if (window.desktop.isNw) {
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
        } else if (window.desktop.isElectron) {
            const {ipcRenderer} = require('electron');
            return ipcRenderer.sendSync('ct.desktop', feature);
        /* Define Functionality for Unkown Environments */
        } else {
            console.error('[' + feature.name + '] - Unknown environment :c Are we in a browser?');
        }
    },
    /* Define Methods Using Main Function */
    openDevTools(options) {
        window.desktop.desktopFeature({
            name: 'desktop.openDevTools',
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
        window.desktop.desktopFeature({
            name: 'desktop.closeDevTools',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow.webContents'
            }
        });
    },
    isDevToolsOpen() {
        return window.desktop.desktopFeature({
            name: 'desktop.isDevToolsOpen',
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
        window.desktop.desktopFeature({
            name: 'desktop.quit',
            nw: {
                namespace: 'App'
            },
            electron: {
                namespace: 'app'
            }
        });
    },
    show() {
        window.desktop.desktopFeature({
            name: 'desktop.show',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    hide() {
        window.desktop.desktopFeature({
            name: 'desktop.hide',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    isVisible() {
        return window.desktop.desktopFeature({
            name: 'desktop.isVisible',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    maximize() {
        window.desktop.desktopFeature({
            name: 'desktop.maximize',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    unmaximize() {
        window.desktop.desktopFeature({
            name: 'desktop.unmaximize',
            nw: {
                namespace: 'win'
            }
        });
    },
    isMaximized() {
        return window.desktop.desktopFeature({
            name: 'desktop.isMaximized',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    minimize() {
        window.desktop.desktopFeature({
            name: 'desktop.minimize',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    restore() {
        window.desktop.desktopFeature({
            name: 'desktop.restore',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    isMinimized() {
        return window.desktop.desktopFeature({
            name: 'desktop.isMinimized',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            }
        });
    },
    fullscreen() {
        window.desktop.desktopFeature({
            name: 'desktop.fullscreen',
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
        window.desktop.desktopFeature({
            name: 'desktop.unfullscreen',
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
        return window.desktop.desktopFeature({
            name: 'desktop.isFullscreen',
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
    window.desktop.isNw = Boolean(nw && nw.App);
} catch (e) {
    window.desktop.isNw = false;
}
try {
    require('electron');
    window.desktop.isElectron = true;
} catch (e) {
    window.desktop.isElectron = false;
}
window.desktop.isDesktop = window.desktop.isNw || window.desktop.isElectron;

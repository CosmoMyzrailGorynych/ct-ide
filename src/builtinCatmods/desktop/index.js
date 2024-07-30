const desktop = {
    /* Initialize Properties */
    isNw: null,
    isElectron: null,
    isDesktop: null,
    isNeutralino: Boolean(window.Neutralino),
    /* Define Main Function */
    // eslint-disable-next-line consistent-return, complexity
    desktopFeature(feature) {
        /* Define Functionality for NW.js */
        if (desktop.isNw) {
            if (!feature.nw) {
                throw new Error('[' + feature.name + '] - This method is not available in NW.js');
            }
            const {nw} = feature;
            nw.method ||= feature.name.split('.')[feature.name.split('.').length - 1];
            nw.parameter ||= feature.parameter;
            /* Create Local Variables Based on Parameters */
            const namespace = nw.namespace.split('.');
            /* If running in ct.js's debugger */
            if (window.iAmInCtIdeDebugger) {
                // eslint-disable-next-line no-console
                console.warn('[' + feature.name + '] - The game is running inside ct.js\'s debugger, desktop features will only work in desktop exports! :c');
            /* If running in NW.js, not in ct.js's debugger */
            } else if (namespace.length === 1) {
                if (namespace[0] === 'win') {
                    const win = nw.Window.get();
                    const val = win[nw.method](nw.parameter);
                    if (nw.promisify) {
                        return Promise.resolve(val);
                    }
                    return val;
                } else if (namespace[0] !== 'win') {
                    const val = nw[namespace[0]][nw.method](nw.parameter);
                    if (nw.promisify) {
                        return Promise.resolve(val);
                    }
                    return val;
                }
            } else if (namespace.length === 2) {
                if (namespace[0] === 'win') {
                    const win = nw.Window.get();
                    const val = win[namespace[1]][nw.method](nw.parameter);
                    if (nw.promisify) {
                        return Promise.resolve(val);
                    }
                    return val;
                } else if (namespace[0] !== 'win') {
                    const val = nw[namespace[0]][namespace[1]][nw.method](nw.parameter);
                    if (nw.promisify) {
                        return Promise.resolve(val);
                    }
                    return val;
                }
            }
        /* Define Functionality for Electron */
        } else if (desktop.isElectron) {
            if (!feature.electron) {
                throw new Error('[' + feature.name + '] - This method is not available in Electron.js');
            }
            feature.electron.method ||= feature.name.split('.')[feature.name.split('.').length - 1];
            feature.electron.parameter ||= feature.parameter;
            const {ipcRenderer} = require('electron');
            const val = ipcRenderer.sendSync('ct.desktop', feature);
            if (feature.electron.promisify) {
                return Promise.resolve(val);
            }
            return val;
        /* Define Functionality for Unkown Environments */
        } else if (desktop.isNeutralino) {
            if (!feature.neutralino) {
                throw new Error('[' + feature.name + '] - This method is not available in Electron.js');
            }
            const n = feature.neutralino;
            n.method ||= feature.name.split('.')[feature.name.split('.').length - 1];
            n.parameter ||= feature.parameter;
            return window.Neutralino[n.namespace][n.method](n.parameter);
        } else {
            console.error('[' + feature.name + '] - Unknown environment :c Are we in a browser?');
        }
    },
    /* Define Methods Using Main Function */
    restartWithDevtools() {
        desktop.desktopFeature({
            name: 'desktop.restartWithDevtools',
            neutralino: {
                namespace: 'app',
                method: 'restartProcess',
                parameter: {
                    args: '--window-enable-inspector=true'
                }
            }
        });
    },
    /* Define Methods Using Main Function */
    openDevTools(options) {
        desktop.desktopFeature({
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
        desktop.desktopFeature({
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
        return desktop.desktopFeature({
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
        desktop.desktopFeature({
            name: 'desktop.quit',
            nw: {
                namespace: 'App'
            },
            electron: {
                namespace: 'app'
            },
            neutralino: {
                namespace: 'app',
                method: 'exit'
            }
        });
    },
    show() {
        desktop.desktopFeature({
            name: 'desktop.show',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            },
            neutralino: {
                namespace: 'window',
                method: 'show'
            }
        });
    },
    hide() {
        desktop.desktopFeature({
            name: 'desktop.hide',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            },
            neutralino: {
                namespace: 'window',
                method: 'hide'
            }
        });
    },
    isVisible() {
        return desktop.desktopFeature({
            name: 'desktop.isVisible',
            nw: {
                namespace: 'win',
                promisify: true
            },
            electron: {
                namespace: 'mainWindow',
                promisify: true
            },
            neutralino: {
                namespace: 'window',
                method: 'isVisible'
            }
        });
    },
    maximize() {
        desktop.desktopFeature({
            name: 'desktop.maximize',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            },
            neutralino: {
                namespace: 'window',
                method: 'maximize'
            }
        });
    },
    unmaximize() {
        desktop.desktopFeature({
            name: 'desktop.unmaximize',
            nw: {
                namespace: 'win'
            },
            neutralino: {
                namespace: 'window',
                method: 'unmaximize'
            }
        });
    },
    isMaximized() {
        return desktop.desktopFeature({
            name: 'desktop.isMaximized',
            nw: {
                namespace: 'win',
                promisify: true
            },
            electron: {
                namespace: 'mainWindow',
                promisify: true
            },
            neutralino: {
                namespace: 'window',
                method: 'isMaximized'
            }
        });
    },
    minimize() {
        desktop.desktopFeature({
            name: 'desktop.minimize',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            },
            neutralino: {
                namespace: 'window',
                method: 'minimize'
            }
        });
    },
    restore() {
        desktop.desktopFeature({
            name: 'desktop.restore',
            nw: {
                namespace: 'win'
            },
            electron: {
                namespace: 'mainWindow'
            },
            neutralino: {
                namespace: 'window',
                method: 'maximize'
            }
        });
    },
    isMinimized() {
        return desktop.desktopFeature({
            name: 'desktop.isMinimized',
            nw: {
                namespace: 'win',
                promisify: true
            },
            electron: {
                namespace: 'mainWindow',
                promisify: true
            }
        });
    },
    fullscreen() {
        desktop.desktopFeature({
            name: 'desktop.fullscreen',
            nw: {
                namespace: 'win',
                method: 'enterFullscreen'
            },
            electron: {
                namespace: 'mainWindow',
                method: 'setFullScreen',
                parameter: true
            },
            neutralino: {
                namespace: 'window',
                method: 'setFullScreen'
            }
        });
    },
    unfullscreen() {
        desktop.desktopFeature({
            name: 'desktop.unfullscreen',
            nw: {
                namespace: 'win',
                method: 'leaveFullscreen'
            },
            electron: {
                namespace: 'mainWindow',
                method: 'setFullScreen',
                parameter: false
            },
            neutralino: {
                namespace: 'window',
                method: 'exitFullScreen'
            }
        });
    },
    isFullscreen() {
        return desktop.desktopFeature({
            name: 'desktop.isFullscreen',
            nw: {
                namespace: 'win',
                promisify: true
            },
            electron: {
                namespace: 'mainWindow',
                method: 'isFullScreen',
                promisify: true
            },
            neutralino: {
                namespace: 'window',
                method: 'isFullScreen'
            }
        });
    }
};
/* Set Prevously Initialized Properties */
try {
    desktop.isNw = Boolean(nw && nw.App);
} catch (e) {
    desktop.isNw = false;
}
try {
    require('electron');
    desktop.isElectron = true;
} catch (e) {
    desktop.isElectron = false;
}
desktop.isDesktop = desktop.isNeutralino ||
    desktop.isNw ||
    desktop.isElectron;

window.desktop = desktop;

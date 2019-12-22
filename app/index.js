/* eslint-disable camelcase */
const {app, dialog, BrowserWindow} = require('electron');

app.commandLine.appendSwitch('remote-debugging-port', '18364');

let mainWindow;
const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        minWidth: 380,
        minHeight: 380,
        center: true,
        resizable: true,

        title: 'ct.js',
        icon: 'ct_ide.png',

        webPreferences: {
            nodeIntegration: true,
            defaultFontFamily: 'sansSerif',
            backgroundThrottling: true,
            webviewTag: true,
            webSecurity: false
        }
    });
    mainWindow.removeMenu();
    mainWindow.loadFile('index.html');

    try {
        require('gulp'); // a silly check for development environment
        mainWindow.webContents.openDevTools();
    } catch (e) {
        void 0;
    }

    mainWindow.on('close', e => {
        e.preventDefault();
        dialog.showMessageBox(mainWindow, {
            type: 'question',
            title: 'Exit confirmation',
            message: 'Do you really want to quit?\nAll the unsaved changes will be lost!',
            buttons: ['Yes', 'No'],
            defaultId: 1
        }).then(res => {
            if (res.response === 0){
                //Yes button pressed
                mainWindow.destroy();
            }
        });
    });
};

app.on('ready', createMainWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});

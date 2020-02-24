(function () {
    if (!document.body.hasAttribute('data-manage-window')) {
        return;
    }
    const {remote} = require('electron');
    const win = remote.getCurrentWindow();

    const saveState = function () {
        let lastState = 'center';
        if (win.isFullScreen()) {
            lastState = 'fullscreen';
        } else if (win.isMaximized()) {
            lastState = 'maximized';
        }
        localStorage.windowSettings = JSON.stringify({
            mode: win.isFullScreen()? 'fullscreen' : lastState
        });
    };
    win.on('restore', () => {
        saveState();
    });
    win.on('maximize', () => {
        saveState();
    });
    win.on('unmaximize', function () {
        saveState();
    });
    win.on('move', function () {
        saveState();
    });
    window.addEventListener('resize', function () {
        saveState();
    });
    win.on('close', function () {
        saveState();
    });

    const settings = localStorage.windowSettings? JSON.parse(localStorage.windowSettings) : {
        mode: 'center'
    };
    if (settings.mode === 'fullscreen') {
        win.setFullScreen(true);
    } else if (settings.mode === 'maximized') {
        win.maximize();
    } else {
        win.center();
    }
})();

(function windowWatcher() {
    if (!document.body.hasAttribute('data-manage-window')) {
        return;
    }
    var maximized = false;
    const win = nw.Window.get();

    const saveState = function () {
        let lastState = 'center';
        if (win.isFullscreen) {
            lastState = 'fullscreen';
        } else if (maximized) {
            lastState = 'maximized';
        }
        localStorage.windowSettings = JSON.stringify({
            mode: win.isFullscreen ? 'fullscreen' : lastState
        });
    };
    win.on('restore', () => {
        maximized = false;
        saveState();
    });
    win.on('maximize', () => {
        maximized = true;
    });
    win.on('move', function windowMoveListener() {
        maximized = false;
        saveState();
    });
    window.addEventListener('resize', function windowResizeListener() {
        maximized = false;
        saveState();
    });
    win.on('closed', function windowCloseListener() {
        saveState();
    });

    const settings = localStorage.windowSettings ?
        JSON.parse(localStorage.windowSettings) :
        {
            mode: 'center'
        };
    if (settings.mode === 'fullscreen') {
        win.enterFullscreen();
    } else if (settings.mode === 'maximized') {
        win.maximize();
    } else {
        win.setPosition('center');
    }
})();

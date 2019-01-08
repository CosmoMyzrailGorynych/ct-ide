(function () {
    /* global nw */
    const win = nw.Window.get();
    var lastState = 'normal';

    const saveState = function () {
        localStorage.windowSettings = JSON.stringify({
            mode: win.isFullscreen? 'fullscreen' : lastState,
            x: win.x,
            y: win.y,
            width: win.width,
            height: win.height
        });
    };
    win.on('restore', () => {
        lastState = 'normal';
        saveState();
    });
    win.on('maximize', () => {
        lastState = 'maximized';
        saveState();
    });
    win.on('unmaximize', function () {
        lastState = 'normal';
        saveState();
    });
    win.on('move', function () {
        lastState = 'normal';
        saveState();
    });
    win.window.addEventListener('resize', function () {
        saveState();
    });
    win.on('close', function () {
        saveState();
    });

    const settings = localStorage.windowSettings? JSON.parse(localStorage.windowSettings) : {
        mode: 'center'
    };
    if (settings.mode === 'center') {
        win.setPosition('center');
    } else if (settings.mode === 'fullscreen') {
        win.enterFullscreen();
    } else if (settings.mode === 'maximized') {
        win.maximize();
    } else if (settings.mode === 'normal') {
        const {screens} = nw.Screen;
        var locationIsOnAScreen = false;
        for (const screen of screens) {
            if (settings.x > screen.bounds.x && settings.x < screen.bounds.x + screen.bounds.width) {
                if (settings.y > screen.bounds.y && settings.y < screen.bounds.y + screen.bounds.height) {
                    locationIsOnAScreen = true;
                }
            }
        }

        if (!locationIsOnAScreen) {
            win.setPosition('center');
        } else {
            win.width = settings.width;
            win.height = settings.height;
            win.x = settings.x;
            win.y = settings.y;
        }
    }
})();

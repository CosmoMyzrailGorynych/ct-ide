(function () {
    var toolbarWindow;

    window.openDebugger = function(link) {
        if (toolbarWindow && !toolbarWindow.isClosing) {
            toolbarWindow.isClosing = true;
            toolbarWindow.close();
            toolbarWindow = null;
        }

        // eslint-disable-next-line new-cap
        nw.Screen.Init();
        const {screens} = nw.Screen;
        const builtIn = screens.find(screen => screen.isBuiltIn);
        const targetScreen = builtIn || screens[1] || screens[0];
        // Align the toolbar to top-center position
        const x = Math.round(targetScreen.work_area.x + (targetScreen.work_area.width - 480) / 2),
              {y} = Math.round(targetScreen.work_area);

        // Create a toolbar that provides additional game-related tools
        nw.Window.open('debuggerToolbar.html', {
            width: 480, // these are the starting values; the window adjusts itself in src/riotTags/debugger/debugger-toolbar.tag
            height: 40,
            x,
            y,
            frame: false,
            transparent: true,
            resizable: false,
            title: 'ct.js toolbar',
            icon: 'ct_ide.png',
            // eslint-disable-next-line camelcase
            always_on_top: true,
            // eslint-disable-next-line camelcase
            show_in_taskbar: false,
            id: 'ctjsToolbar'
        }, newWindow => {
            newWindow.eval(null, `
                window.gameLink = "${link}";
                window.gameRooms = (${JSON.stringify(global.currentProject.rooms.map(room => room.name))});
                window.gameName = (${JSON.stringify(global.currentProject.settings.title || 'ct.js game')});
            `);
        });

        /* This is the approach that was initially planned, but got cancelled due to a bug in nw.js
           See https://github.com/nwjs/nw.js/issues/7119 */
        /*
        nw.Window.open('debugger.html', {
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
            newWindow.once('loaded', () => {
                const webView = newWindow.window.document.querySelector('#thePreview');
                console.log(webView);
                webView.addEventListener('loadstop', () => {
                    webView.executeScript({
                        code: 'window.iAmInCtIdeDebugger = true;',
                        mainWorld: true
                    });
                    webView.showDevTools(true, newWindow.window.document.querySelector('#theDebugger'));
                }, {
                    once: true
                });
                webView.src = link;
                webView.showDevTools(true, newWindow.window.document.querySelector('#theDebugger'));
            });
        });
        */
    };
})();

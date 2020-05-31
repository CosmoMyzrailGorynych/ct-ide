(function ctDebuggerTools() {
    var previewWindow;

    window.openDebugger = function openDebugger(link) {
        if (previewWindow) {
            var nwWin = nw.Window.get(previewWindow);
            nwWin.show();
            nwWin.focus();
            previewWindow.document.getElementById('thePreview').reload();
            return;
        }
        nw.Window.open(`debugger.html?title=${encodeURIComponent(global.currentProject.settings.title || 'ct.js game')}&link=${encodeURIComponent(link)}`, {
            // eslint-disable-next-line camelcase
            new_instance: false,
            id: 'ctPreview',
            title: 'ct.IDE Debugger'
        }, function onDebuggerOpen(newWin) {
            var wind = newWin.window;
            previewWindow = wind;
            newWin.once('loaded', () => {
                newWin.maximize();
            });
            newWin.once('closed', () => {
                previewWindow = null;
            });
        });
    };
})();

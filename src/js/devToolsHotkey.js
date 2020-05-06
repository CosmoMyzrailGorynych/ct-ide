(() => {
    const hotkeyListener = function (e) {
        if (e.key === 'C' && e.ctrlKey && e.shiftKey) {
            const win = nw.Window.get();
            if (win.isDevToolsOpen()) {
                win.closeDevTools();
            } else {
                win.showDevTools();
            }
        }
    };
    document.addEventListener('keydown', hotkeyListener);
})();

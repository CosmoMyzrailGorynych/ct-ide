(() => {
    const hotkeyListener = function (e) {
        if (e.key === 'C' && e.ctrlKey && e.shiftKey) {
            const win = nw.Window.get();
            win.showDevTools();
        }
    };
    document.addEventListener('keydown', hotkeyListener);
})();

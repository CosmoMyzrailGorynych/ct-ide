(() => {
    const hotkeyListener = function (e) {
        if (e.key === 'C' && e.ctrlKey && e.shiftKey) {
            const {remote} = require('electron');
            remote.getCurrentWindow().webContents.openDevTools();
        }
    };
    document.addEventListener('keydown', hotkeyListener);
})();

(function (ct) {
    ct.desktop = {
        quit() {
            try {
                nw.App.quit();
                return true;
            } catch (e) {
                console.error('[ct.desktop] Cannot exit. Are you running in browser?');
                return false;
            }
        }
    };
    /* global nw */
    try {
        ct.desktop.platform = process.platform || 'browser';
    } catch (e) {
        ct.desktop.platform = 'browser';
    }
})(ct);

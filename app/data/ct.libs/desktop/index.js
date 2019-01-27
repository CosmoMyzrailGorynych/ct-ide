(function (ct) {
    ct.desktop = {
        quit() {
            try {
                nw.App.quit();
            } catch (e) {
                console.error('[ct.desktop] Cannot exit. Are you running in browser?');
            }
        }
    };
    /* global nw */
    try {
        ct.desktop.platform = process.platform;
    } catch (e) {
        ct.desktop.platform = 'browser';
    }
})(ct);

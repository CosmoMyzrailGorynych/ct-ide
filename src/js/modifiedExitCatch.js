(window => {
    var gui = require('nw.gui');
    var win = gui.Window.get();

    win.on('close', function () {
        const glob = require('glob');
        /* nw.js Requires synchronous calls here */
        /* eslint "no-alert": "off" */
        if (glob.modified && !confirm(window.languageJSON.common.reallyexit)) {
            return false;
        }
        return this.close(true);
    });
})(this);

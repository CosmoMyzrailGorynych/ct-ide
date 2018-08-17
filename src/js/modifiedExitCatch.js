(window => {
    var gui = require('nw.gui');
    var win = gui.Window.get();
    var modified = false;
    window.glob = {
        get modified () {
            return modified;
        },
        set modified (v) {
            if (v) {
                window.title = 'ctjs — ' + sessionStorage.projname + ' •';
            } else {
                window.title = 'ctjs — ' + sessionStorage.projname;
            }
            modified = v;
            return modified;
        }
    };

    win.on('close', function () {
        /* nw.js Requires synchronous calls here */
        /* eslint "no-alert": "off" */
        if (window.glob.modified && !confirm(window.languageJSON.common.reallyexit)) {
            return false;
        }
        return this.close(true);
    });
})(this);

(window => {
    var gui = require('nw.gui');
    var win = gui.Window.get();
    window.glob = {
        mmodified: false,
        get modified () {
            return this.mmodified;
        },
        set modified (v) {
            if (v) {
                window.title = 'ctjs — ' + sessionStorage.projname + ' •';
            } else {
                window.title = 'ctjs — ' + sessionStorage.projname;
            }
            this.mmodified = v;
            return this.mmodified;
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

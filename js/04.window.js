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

    // Не исправлять жалобы eslint. nw.js-специфично.
    win.on('close', function () {
        if (window.glob.modified) {
            if (!confirm(window.languageJSON.common.reallyexit)) {
                return false;
            } else {
                this.close(true);
            }
        } else {
            this.close(true);
        }
    });
})(this);

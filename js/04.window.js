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
                win.title = 'ct.ide — ' + sessionStorage.projname + ' •';
            } else {
                win.title = 'ct.ide — ' + sessionStorage.projname;
            }
            this.mmodified = v;
            return this.mmodified;
        }
    };

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

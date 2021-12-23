(function exitConfirmer() {
    const win = nw.Window.get();
    const glob = require('./data/node_requires/glob');
    win.on('close', function exitConfirmListener() {
        if (!glob.modified) {
            win.close(true);
        } else {
            window.alertify.confirm(window.languageJSON.common.reallyExitConfirm)
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    win.close(true);
                }
            });
        }
    });
})();

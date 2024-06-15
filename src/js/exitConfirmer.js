(function exitConfirmer() {
    const win = nw.Window.get();
    const glob = require('src/node_requires/glob');
    win.on('close', function exitConfirmListener() {
        if (!glob.modified) {
            win.close(true);
        } else {
            const {getLanguageJSON} = require('src/node_requires/i18n');
            window.alertify.confirm(getLanguageJSON().common.reallyExitConfirm)
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    win.close(true);
                }
            });
        }
    });
})();

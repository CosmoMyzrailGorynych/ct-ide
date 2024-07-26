
(function exitConfirmer() {
    const Neutralino = require('@neutralinojs/lib');
    const glob = require('src/node_requires/glob');
    Neutralino.events.on('windowClose', function exitConfirmListener() {
        if (!glob.modified) {
            Neutralino.app.exit();
        } else {
            const {getLanguageJSON} = require('src/node_requires/i18n');
            window.alertify.confirm(getLanguageJSON().common.reallyExitConfirm)
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    Neutralino.app.exit();
                }
            });
        }
    });
})();

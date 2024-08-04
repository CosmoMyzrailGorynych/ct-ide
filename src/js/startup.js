/* eslint-disable max-lines-per-function */
/* eslint-disable require-atomic-updates */
window.ctIdeStartup = async () => {
    await window.Neutralino.init();

    window.ctjsVersion = (await window.Neutralino.app.getConfig()).version;
    // Load default translation file.
    await require('src/node_requires/neutralino-storage').init();
    await require('src/node_requires/i18n').initTranslations();
    // Run the Bun extension.
    window.BUN = require('src/node_requires/bunchat').bun;

    // Mount riot components.
    window.signals = riot.observable({});
    window.orders = riot.observable({});
    riot.mount('*');
    // Hide loading screen.
    setTimeout(() => {
        document.getElementById('theLoadingScreen').remove();
    }, 0);

    // Ask for confirmation before closing the window.
    const glob = require('src/node_requires/glob');
    window.Neutralino.events.on('windowClose', function exitConfirmListener() {
        if (!glob.modified) {
            window.Neutralino.app.exit();
        } else {
            const {getLanguageJSON} = require('src/node_requires/i18n');
            window.alertify.confirm(getLanguageJSON().common.reallyExitConfirm)
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    window.Neutralino.app.exit();
                }
            });
        }
    });

    // Configure monaco-editor
    require('src/node_requires/monaco').default();

    // Open external links in the default browser.
    document.body.addEventListener('click', function externalLinkslistener(e) {
        if (e.target && e.target.matches('a')) {
            if (e.target.href) {
                window.Neutralino.os.open(e.target.href);
                e.stopPropagation();
            }
            e.preventDefault();
        }
    });
};

// Exposes window.alertify
require('src/lib/alertify');

/* eslint-disable max-lines-per-function */
/* eslint-disable require-atomic-updates */
window.ctIdeStartup = async () => {
    // Needed for the debugging toolbar to share connection with the debugged game and ct.IDE.
    if (location.search.includes('NL_TOKEN')) {
        // eslint-disable-next-line prefer-destructuring
        window.NL_TOKEN = location.search.split('=')[1];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-destructuring
    await window.Neutralino.init();
    window.ctjsVersion = (await window.Neutralino.app.getConfig()).version;

    // Bootstrap neutralino-storage and load the default translation file.
    await require('src/lib/neutralino-storage').init();
    await require('src/lib/i18n').initTranslations();

    // Some operations are not needed in the game debugging toolbar.
    if (!document.body.classList.contains('gametools')) {
        // set app scaling
        const emSize = Number(localStorage.emSize);
        document.body.parentElement.style.fontSize = document.body.style.fontSize = `${emSize}px`;
        document.body.parentElement.style.lineHeight = document.body.style.lineHeight = `${emSize * 2}px`;
        // Registers a debug event listener for bun responses.
        require('src/lib/bunchat');
    }

    // Mount riot components.
    window.signals = riot.observable({});
    window.orders = riot.observable({});
    riot.mount('*');

    if (!document.body.classList.contains('gametools')) {
        // Hide the loading screen.
        setTimeout(() => {
            const loadingScreen = document.getElementById('theLoadingScreen');
            loadingScreen.classList.add('whooshout');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 0);
        // Ask for confirmation before closing the window.
        const glob = require('src/lib/glob');
        window.Neutralino.events.on('windowClose', function exitConfirmListener() {
            if (!glob.modified) {
                window.Neutralino.app.exit();
            } else {
                const {getLanguageJSON} = require('src/lib/i18n');
                window.alertify.confirm(getLanguageJSON().common.reallyExitConfirm)
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        window.Neutralino.app.exit();
                    }
                });
            }
        });
        // Configure monaco-editor
        require('src/lib/monaco').default();

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
    }
};

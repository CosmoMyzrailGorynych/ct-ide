// Exposes window.alertify
require('src/lib/alertify');

/* eslint-disable max-lines-per-function */
/* eslint-disable require-atomic-updates */
window.ctIdeStartup = async () => {
    await window.Neutralino.init();

    window.ctjsVersion = (await window.Neutralino.app.getConfig()).version;
    // Load default translation file.
    await require('src/lib/neutralino-storage').init();
    const emSize = Number(localStorage.emSize);
    document.body.parentElement.style.fontSize = document.body.style.fontSize = `${emSize}px`;
    document.body.parentElement.style.lineHeight = document.body.style.lineHeight = `${emSize * 2}px`;

    await require('src/lib/i18n').initTranslations();

    // Registers a debug event listener for bun responses.
    require('src/lib/bunchat');

    // Mount riot components.
    window.signals = riot.observable({});
    window.orders = riot.observable({});
    riot.mount('*');
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
};

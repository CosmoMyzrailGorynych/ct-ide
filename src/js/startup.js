/* eslint-disable max-lines-per-function */
/* eslint-disable require-atomic-updates */
window.ctIdeStartup = async () => {
    await window.Neutralino.init();
    window.ctjsVersion = (await window.Neutralino.app.getConfig()).version;
    // Load default translation file.
    await require('src/node_requires/i18n').initTranslations();

    // Run the Bun extension.

    /* eslint-disable no-console */
    // BunExtension
    //
    // Run BunExtension functions by sending dispatched event messages.
    //
    // (c)2023-2023 Harald Schneider - marketmix.com
    const {extensions, app} = window.Neutralino;
    class BunExtension {
        constructor(debug = false) {
            this.version = '1.0.1';
            this.debug = debug;

            if (window.NL_MODE !== 'window') {
                window.addEventListener('beforeunload', (e) => {
                    e.preventDefault();
                    e.returnValue = '';
                    this.stop();
                    return '';
                });
            }
        }
        async run(f, p = null) {
            //
            // Call a BunExtension function.

            const ext = 'extBun';
            const event = 'runBun';

            const json = {
                function: f,
                parameter: p
            };

            if (this.debug) {
                console.log(`EXT_BUN: Calling ${ext}.${event} : ` + JSON.stringify(json));
            }

            await extensions.dispatch(ext, event, json);
        }

        async stop() {
            //
            // Stop and quit the Bun-extension and its parent app.
            // Use this if Neutralino runs in Cloud-Mode.

            const ext = 'extBun';
            const event = 'appClose';

            if (this.debug) {
                console.log(`EXT_BUN: Calling ${ext}.${event}`);
            }
            await extensions.dispatch(ext, event, '');
            await app.exit();
        }
    }
    window.BUN = new BunExtension(true);

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
    console.log(require('src/node_requires/monaco'));
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

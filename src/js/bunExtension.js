// BunExtension
//
// Run BunExtension functions by sending dispatched event messages.
//
// (c)2023-2023 Harald Schneider - marketmix.com

class BunExtension {
    constructor(debug = false) {
        this.version = '1.0.1';
        this.debug = debug;

        if (NL_MODE !== 'window') {
            window.addEventListener('beforeunload', function (e) {
                e.preventDefault();
                e.returnValue = '';
                window.BUN.stop();
                return '';
            });
        }
    }
    async run(f, p = null) {
        //
        // Call a BunExtension function.

        const ext = 'extBun';
        const event = 'runBun';

        const data = {
            function: f,
            parameter: p
        };

        if (this.debug) {
            console.log(`EXT_BUN: Calling ${ext}.${event} : ` + JSON.stringify(data));
        }

        await Neutralino.extensions.dispatch(ext, event, data);
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
        await Neutralino.extensions.dispatch(ext, event, '');
        await Neutralino.app.exit();
    }
}
window.BUN = new BunExtension(true);

// BunExtension
//
// Run BunExtension functions by sending dispatched event messages.
//
// (c)2023-2023 Harald Schneider - marketmix.com

class BunExtension {
    version = '1.0.1';
    debug: boolean;
    constructor(debug = false) {
        this.debug = debug;
        if (NL_MODE !== 'window') {
            window.addEventListener('beforeunload', (e) => {
                e.preventDefault();
                e.returnValue = '';
                this.stop();
                return '';
            });
        }
    }
    async run(f: string, p: any = null) {
        //
        // Call a BunExtension function.

        const ext = 'extBun';
        const event = 'runBun';

        const json = {
            function: f,
            parameter: p
        };

        if (this.debug) {
            // eslint-disable-next-line no-console
            console.log(`EXT_BUN: Calling ${ext}.${event} : ` + JSON.stringify(json));
        }

        await Neutralino.extensions.dispatch(ext, event, json);
    }

    async stop() {
        //
        // Stop and quit the Bun-extension and its parent app.
        // Use this if Neutralino runs in Cloud-Mode.

        const ext = 'extBun';
        const event = 'appClose';

        if (this.debug) {
            // eslint-disable-next-line no-console
            console.log(`EXT_BUN: Calling ${ext}.${event}`);
        }
        await Neutralino.extensions.dispatch(ext, event, '');
        await Neutralino.app.exit();
    }
}

const BUN = new BunExtension(NL_ARGS.includes('--neu-dev-auto-reload'));
export default BUN;
export const run = BUN.run.bind(BUN);
export const stop = BUN.stop.bind(BUN);

/* eslint-disable no-console */
/* eslint-disable id-blacklist */
// NeutralinoExtension
//
// A Bun extension engine for Neutralino.
//
// (c)2023-2024 Harald Schneider - marketmix.com

import WebSocket from 'ws';

export default class NeutralinoExtension {
    debugTermColors = true; // Use terminal colors
    debugTermColorIN = '\x1b[32m'; // Green: All incoming events, except function calls
    debugTermColorCALL = '\x1b[91m'; // Red: Incoming function calls
    debugTermColorOUT = '\x1b[33m'; // Yellow: Outgoing events
    termOnWindowClose = true; // Terminate on windowCloseEvent message
    version = '1.0.4';

    port: string;
    token: string;
    connectToken: string;
    idExtension: string;
    urlSocket: string;
    debug: boolean;
    socket: WebSocket | undefined;

    constructor(debug = false) {
        this.debug = debug;
    }

    async init() {
        if (Bun.argv.length > 2) {
            [, this.port] = Bun.argv[2].split('=');
            [, this.token] = Bun.argv[3].split('=');
            this.connectToken = '';
            [, this.idExtension] = Bun.argv[4].split('=');
            this.urlSocket = `ws://127.0.0.1:${this.port}?extensionId=${this.idExtension}`;
        } else {
            const conf = await Bun.stdin.json();
            this.port = conf.nlPort;
            this.token = conf.nlToken;
            this.connectToken = conf.nlConnectToken;
            this.idExtension = conf.nlExtensionId;
            this.urlSocket = `ws://127.0.0.1:${this.port}?extensionId=${this.idExtension}&connectToken=${this.connectToken}`;
        }

        this.socket = void 0;
        this.debugLog(`${this.idExtension} running on port ${this.port}`);
    }

    sendMessage(event: string, data = null) {
        //
        // Add a data package to the sending queue.
        // Triggers an event in the parent app.
        // :param event: Event name as string
        // :param data: Event data
        // :return: --

        const d = {
            id: crypto.randomUUID(),
            method: 'app.broadcast',
            accessToken: this.token,
            data: {
                event,
                data
            }
        };
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const msg = JSON.stringify(d);
            this.socket.send(msg);
            this.debugLog(`${msg}`, 'out');
        } else {
            console.warn('WebSocket send: Socket is not connected.');
        }
    }

    run(onReceiveMessage: (msg: string) => void) {
        //
        //  Socket-handler main loop. Sends and receives messages.
        //  :param onReceiveMessage: Callback for incoming messages

        this.socket = new WebSocket(this.urlSocket);

        this.socket.on('open', () => {
            console.log('WebSocket ready');
            console.log(`Running on port ${this.port}`);
        });

        this.socket.on('message', (data) => {
            let msg: any = data.toString('utf-8');

            try {
                msg = JSON.parse(msg);
            } catch (e) {
                void 0;
            }

            try {
                if (self.termOnWindowClose) {
                    if (msg.event === 'windowClose' || msg.event === 'appClose') {
                        try {
                            // eslint-disable-next-line no-process-exit
                            process.exit();
                        } catch (e) {
                            void 0;
                        }
                        return;
                    }
                }
            } catch (e) {
                void 0;
            }

            self.debugLog(msg, 'in');
            onReceiveMessage(msg);
        });

        this.socket.on('close', (code, reason) => {
            console.log(`WebSocket closed: ${code} - ${reason}`);
        });

        this.socket.on('error', (error) => {
            console.error(`WebSocket Error: ${error}`);
        });
    }
    static isEvent(e: any, eventName: string) {
        // Checks data package for a particular event.

        if ('event' in e && e.event === eventName) {
            return true;
        }
        return false;
    }

    debugLog(msg: string, tag: 'info' | 'in' | 'out' = 'info') {
        //
        // Log messages to terminal.
        // :param msg: Message string
        // :param tag: Type of log entry
        // :return: --

        let cIN = '';
        let cCALL = '';
        let cOUT = '';
        let cRST = '';

        if (this.debugTermColors) {
            cIN = this.debugTermColorIN;
            cCALL = this.debugTermColorCALL;
            cOUT = this.debugTermColorOUT;
            cRST = '\x1b[0m';
        }

        if (!this.debug) {
            return;
        }

        try {
            msg = JSON.stringify(msg);
        } catch (e) {
            void 0;
        }

        if (tag === 'in') {
            if (msg.includes('runBun')) {
                console.log(`${cCALL}IN:  ${msg}${cRST}`);
            } else {
                console.log(`${cIN}IN:  ${msg}${cRST}`);
            }
            return;
        }
        if (tag === 'out') {
            console.log(`${cOUT}OUT: ${msg}${cRST}`);
        }
    }
}

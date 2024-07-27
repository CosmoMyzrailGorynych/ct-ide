// main.js 1.0.2
//
// Neutralino BunExtension.
//
// (c) 2024 Harald Schneider - marketmix.com

import NeutralinoExtension from './neutralinoExtension';
const DEBUG = true; // Print incoming event messages to the console

// Activate Extension
const ext = new NeutralinoExtension(DEBUG);

import convertPngToIco from './lib/png2icons';

const functionMap: Record<string, (param: any) => Promise<void>> = {
    convertPngToIco
};
const eventHandler = (json: any) => {
    if (NeutralinoExtension.isEvent(json, 'runBun')) {
        if (json.data.function) {
            functionMap[json.data.function](json.data.parameter);
        }
    }
};


ext.init().then(() => {
    ext.run(eventHandler);
});


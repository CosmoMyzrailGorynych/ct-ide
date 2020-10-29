const defaultProjectTemplate = {
    ctjsVersion: process.versions.ctjs,
    notes: '/* empty */',
    libs: {
        place: {
            gridX: 1024,
            gridY: 1024
        },
        fittoscreen: {
            mode: 'scaleFit'
        },
        mouse: {},
        keyboard: {},
        'keyboard.polyfill': {},
        'sound.howler': {}
    },
    textures: [],
    skeletons: [],
    types: [],
    sounds: [],
    styles: [],
    rooms: [],
    actions: [],
    emitterTandems: [],
    scripts: [],
    starting: 0,
    settings: {
        authoring: {
            author: '',
            site: '',
            title: '',
            version: [0, 0, 0],
            versionPostfix: ''
        },
        rendering: {
            usePixiLegacy: true,
            maxFPS: 60,
            pixelatedrender: false,
            highDensity: true,
            desktopMode: 'maximized'
        },
        export: {
            windows: true,
            linux: true,
            mac: true,
            functionWrap: false,
            codeModifier: 'none'
        },
        branding: {
            icon: -1,
            accent: '#446adb', // ct.js' crystal blue
            invertPreloaderScheme: true
        }
    }
};

module.exports = {
    get() {
        return JSON.parse(JSON.stringify(defaultProjectTemplate));
    }
};

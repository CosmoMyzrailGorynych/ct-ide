const defaultProjectTemplate = {
    ctjsVersion: require('package.json').version,
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
    starting: 0,
    settings: {
        minifyhtmlcss: false,
        minifyjs: false,
        fps: 60,
        version: [0, 0, 0],
        versionPostfix: '',
        usePixiLegacy: true,
        export: {
            windows: true,
            linux: true,
            mac: true
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

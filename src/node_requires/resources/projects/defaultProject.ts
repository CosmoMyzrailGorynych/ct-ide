const defaultProjectTemplate: IProject = {
    ctjsVersion: process.versions.ctjs,
    language: 'typescript',
    notes: '/* empty */',
    libs: {
        place: {
            gridX: 1024,
            gridY: 1024
        },
        fittoscreen: {
            mode: 'scaleFit'
        },
        pointer: {},
        keyboard: {},
        'keyboard.polyfill': {},
        'sound.howler': {}
    },
    textures: [],
    skeletons: [],
    templates: [],
    sounds: [],
    styles: [],
    fonts: [],
    rooms: [],
    actions: [],
    emitterTandems: [],
    scripts: [],
    startroom: -1,
    contentTypes: [],
    groups: {
        fonts: [],
        textures: [],
        styles: [],
        rooms: [],
        templates: [],
        sounds: [],
        emitterTandems: []
    },
    settings: {
        authoring: {
            author: '',
            site: '',
            title: '',
            version: [0, 0, 0],
            versionPostfix: '',
            appId: ''
        },
        rendering: {
            usePixiLegacy: true,
            maxFPS: 60,
            pixelatedrender: false,
            highDensity: true,
            desktopMode: 'maximized',
            hideCursor: false,
            mobileScreenOrientation: 'unspecified'
        },
        export: {
            windows: true,
            linux: true,
            mac: true,
            functionWrap: false,
            codeModifier: 'none'
        },
        branding: {
            accent: '#446adb', // ct.js' crystal blue
            invertPreloaderScheme: true,
            icon: -1,
            splashScreen: -1,
            forceSmoothIcons: false,
            forceSmoothSplashScreen: false,
            hideLoadingLogo: false
        }
    }
};

module.exports = {
    get(): IProject {
        return JSON.parse(JSON.stringify(defaultProjectTemplate)) as IProject;
    }
};

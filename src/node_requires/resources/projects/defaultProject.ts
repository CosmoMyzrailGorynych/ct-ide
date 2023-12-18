const defaultProjectTemplate: IProject = {
    ctjsVersion: process.versions.ctjs,
    language: 'typescript',
    notes: '/* empty */',
    libs: {
        place: {
            gridX: 1024,
            gridY: 1024
        },
        pointer: {},
        keyboard: {},
        'keyboard.polyfill': {}
    },
    startroom: -1,
    contentTypes: [],
    actions: [],
    scripts: [],
    assets: [],
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
            transparent: false,
            maxFPS: 60,
            pixelatedrender: false,
            highDensity: true,
            desktopMode: 'maximized',
            hideCursor: false,
            mobileScreenOrientation: 'unspecified',
            viewMode: 'scaleFit'
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
            hideLoadingLogo: false,
            alternativeLogo: false,
            customLoadingText: ''
        }
    }
};

module.exports = {
    get(): IProject {
        return JSON.parse(JSON.stringify(defaultProjectTemplate)) as IProject;
    }
};

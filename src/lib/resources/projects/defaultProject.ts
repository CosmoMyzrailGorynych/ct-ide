const defaultProjectTemplate: IProject = {
    ctjsVersion: window.ctjsVersion as string,
    backups: 3,
    language: 'typescript',
    notes: '/* empty */',
    libs: {
        place: {
            gridX: 1024,
            gridY: 1024
        },
        pointer: {},
        keyboard: {},
        'keyboard.polyfill': {},
        'pointer.polyfill': {}
    },
    startroom: -1,
    contentTypes: [],
    actions: [],
    scripts: [],
    assets: [],
    globalVars: [],
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
            showErrors: true,
            errorsLink: '',
            autocloseDesktop: true,
            windows: true,
            linux: true,
            mac: true,
            functionWrap: false,
            codeModifier: 'none',
            bundleAssetTree: false,
            bundleAssetTypes: {
                texture: true,
                template: true,
                room: true,
                behavior: false,
                typeface: false,
                sound: false,
                style: false,
                tandem: false,
                script: false,
                enum: false
            }
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
export const get = (): IProject => structuredClone(defaultProjectTemplate);
export default {
    get
};

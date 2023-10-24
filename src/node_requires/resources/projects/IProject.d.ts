// eslint-disable-next-line no-use-before-define
declare type folderEntries = Array<IAsset | IAssetFolder>;
declare interface IAssetFolder {
    readonly type: 'folder';
    readonly uid: string;
    colorClass: string;
    icon: string;
    name: string;
    lastmod: number;
    entries: folderEntries;
}
declare interface ICtActionInputMethod {
    code: string;
    multiplier?: number;
}
declare interface ICtAction {
    name: string;
    methods: ICtActionInputMethod[]
}

declare interface IScript {
    name: string;
    code: string;
}

type viewMode = 'asIs' | 'fastScale' | 'fastScaleInteger' | 'expand' | 'expandViewport' | 'scaleFit' | 'scaleFill';

declare type UserDefinedField = {
    name: string;
    readableName: string;
    required?: boolean;
    array?: boolean;
    type: 'text' | 'textfield' | 'code' | 'number' | 'sliderAndNumber' | 'point2D' |
          'texture' | 'template' | 'sound' | 'room' | 'tandem' |
          'checkbox' | 'color';
}

declare interface IContentType {
    entries: Record<string, unknown>[];
    icon: string;
    name: string;
    readableName: string;
    specification: UserDefinedField[];
}

declare interface IProject {
    ctjsVersion: string;
    notes: string;
    language: 'typescript' | 'coffeescript';
    libs: Record<string, Record<string, unknown>>;
    actions: ICtAction[];
    scripts: IScript[];
    contentTypes: IContentType[];
    assets: folderEntries;
    startroom: assetRef;
    settings: {
        authoring: {
            author: string,
            site: string,
            title: string
            version: [number, number, number],
            versionPostfix: string,
            appId: string
        },
        rendering: {
            usePixiLegacy: boolean,
            transparent: boolean,
            maxFPS: 60,
            pixelatedrender: boolean,
            highDensity: boolean,
            desktopMode: 'maximized' | 'fullscreen' | 'windowed',
            hideCursor: boolean,
            mobileScreenOrientation: 'unspecified' | 'landscape' | 'portrait',
            viewMode: viewMode,
        },
        export: {
            windows: boolean,
            linux: boolean,
            mac: boolean,
            functionWrap: boolean,
            codeModifier: 'none' | 'minify' | 'obfuscate'
        },
        branding: {
            icon: assetRef,
            /** A hex color */
            accent: string,
            invertPreloaderScheme: boolean,
            splashScreen: assetRef,
            forceSmoothIcons: boolean,
            forceSmoothSplashScreen: boolean,
            hideLoadingLogo: boolean,
            alternativeLogo: boolean,
            customLoadingText: string
        }
    };
}

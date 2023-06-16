declare interface IResourceGroup {
    colorClass: string;
    icon: string;
    name: string;
    uid: string;
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

declare interface IContentType {
    entries: Record<string, unknown>[];
    icon: string;
    name: string;
    readableName: string;
    specification: {
        name: string;
        readableName: string;
        required?: boolean;
        array?: boolean;
        type: 'text' | 'textfield' | 'code' | 'number' | 'sliderAndNumber' | 'point2D' |
              'texture' | 'template' | 'sound' | 'room' | 'tandem' |
              'checkbox' | 'color';
    }[];
}

declare interface IProject {
    ctjsVersion: string;
    notes: string;
    language: 'typescript' | 'coffeescript';
    libs: Record<string, Record<string, unknown>>;
    actions: ICtAction[];
    scripts: IScript[];
    textures: ITexture[];
    skeletons: ISkeleton[];
    templates: ITemplate[];
    sounds: ISound[];
    rooms: IRoom[];
    startroom: assetRef;
    emitterTandems: ITandem[];
    fonts: IFont[];
    styles: IStyle[];
    contentTypes: IContentType[];
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
            maxFPS: 60,
            pixelatedrender: boolean,
            highDensity: boolean,
            desktopMode: 'maximized' | 'fullscreen' | 'windowed',
            hideCursor: boolean,
            mobileScreenOrientation: 'unspecified' | 'landscape' | 'portrait'
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
            hideLoadingLogo: boolean
        }
    };
    groups: {
        emitterTandems: IResourceGroup[],
        fonts: IResourceGroup[],
        rooms: IResourceGroup[],
        sounds: IResourceGroup[],
        styles: IResourceGroup[],
        templates: IResourceGroup[],
        textures: IResourceGroup[]
    }
}

declare interface IProject {
    textures: ITexture[];
    templates: ITemplate[];
    sounds: ISound[];
    rooms: IRoom[];
    emitterTandems: ITandem[];
    fonts: IFont[];
    styles: IStyle[];
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
    [key: string]: any;
}

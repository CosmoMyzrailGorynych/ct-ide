export type packForDesktopOptions = {
    authoring: {
        author: string,
        title: string,
        version: [number, number, number],
        appId?: string
    },
    versionPostfix?: string,
    startingWidth: number,
    startingHeight: number,
    inputDir: string,
    outputDir: string,
    desktopMode: 'fullscreen' | 'windowed' |'maximized',
    iconPath: string,
    pixelartIcon: boolean
};
export type packForDesktopResponse = string;

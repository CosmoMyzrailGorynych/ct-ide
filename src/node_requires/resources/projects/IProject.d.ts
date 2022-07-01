declare interface IProject {
    textures: ITexture[];
    templates: ITemplate[];
    sounds: ISound[];
    rooms: IRoom[];
    tandems: ITandem[];
    fonts: IFont[];
    styles: IStyle[];
    [key: string]: any;
}

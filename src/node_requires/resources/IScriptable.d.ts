interface IScriptableEvent {
    lib: 'core' | string;
    arguments: {
        [key: string]: assetRef | string | number | boolean;
    };
    code: string;
    eventKey: string;
}

interface IScriptable extends IAsset {
    name: string;
    events: IScriptableEvent[];
}

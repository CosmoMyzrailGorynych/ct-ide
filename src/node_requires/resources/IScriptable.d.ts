interface IScriptableEvent {
    /** The codename of the module that added this event, or 'core' if it is a built-in event */
    lib: 'core' | string;
    arguments: {
        [key: string]: assetRef | string | number | boolean;
    };
    /** The user-written JS/CoffeeScript code */
    code: string;
    /** The codename of the current event, excluding the lib prefix, e.g. OnCreate */
    eventKey: string;
}

/** Describes an asset that supports scripting through ct.js events */
interface IScriptable extends IAsset {
    name: string;
    events: IScriptableEvent[];
}

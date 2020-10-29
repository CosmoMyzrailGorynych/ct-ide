interface ITileTemplate {
    x: number;
    y: number;
}

interface ITileLayerTemplate {
    depth: number;
    tiles: Array<ITileTemplate>
}

interface IRoomTemplate {
    name: string;
    width: number;
    height: number;
    objects: ICopyTemplate;
    bgs: Array<IBackgroundTemplate>;
    tiles: Array<ITileLayerTemplate>;
    onStep(): void;
    onDraw(): void;
    onLeave(): void;
    onCreate(): void;
}

declare class Room extends PIXI.Container {
    /**
     * Creates an instance of `Room`, based on a given template.
     * @param {object} template The template to use, usually from `ct.rooms.templates`.
     */
    constructor(template: IRoomTemplate);

    /** The horizontal position of the camera */
    x: number;
    /** The vertical position of the camera */
    y: number;

    tileLayers: Array<PIXI.TileLayer>
    backgrounds: Array<Background>

    onCreate(): void;
    onStep(): void;
    onDraw(): void;
    onLeave(): void;

    template: IRoomTemplate;

    /** The name of the room, as defined in ct.IDE */
    name: string;

    /** The unique identifier of a room. Can be used to differentiate rooms without capturing them in a closure. */
    uid: number;

    [key: string]: any
}
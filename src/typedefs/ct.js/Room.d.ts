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

    /** If set, the room's camera will follow the given copy */
    follow: Copy|null;
    /** Works if `follow` is set to a copy. Sets the frame inside which the copy will be kept */
    borderX: number;
    /** Works if `follow` is set to a copy. Sets the frame inside which the copy will be kept */
    borderY: number;
    /** Works if `follow` is set to a copy. Displaces the camera horizontally, relative to the copy. */
    followShiftX: number;
    /** Works if `follow` is set to a copy. Displaces the camera vertically, relative to the copy. */
    followShiftY: number;
    /** Works if `follow` is set to a copy. If set to a value between 0 and 1, it will make camera movement smoother */
    followDrift: number;

    tileLayers: Array<PIXI.TileLayer>
    backgrounds: Array<Background>

    onCreate(): void;
    onStep(): void;
    onDraw(): void;
    onLeave(): void;

    template: IRoomTemplate;

    /** The name of the room, as defined in ct.IDE */
    name: string;

    [key: string]: any
}
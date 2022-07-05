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

    /** Time for the next run of the 1st timer, in seconds. */
    timer1: number;
    /** Time for the next run of the 2nd timer, in seconds. */
    timer2: number;
    /** Time for the next run of the 3rd timer, in seconds. */
    timer3: number;
    /** Time for the next run of the 4th timer, in seconds. */
    timer4: number;
    /** Time for the next run of the 5th timer, in seconds. */
    timer5: number;
    /** Time for the next run of the 6th timer, in seconds. */
    timer6: number;

    [key: string]: any
}

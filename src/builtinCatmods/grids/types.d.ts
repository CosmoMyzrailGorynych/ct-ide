type TypedArray = Float32Array | Float64Array | Int8Array | Int16Array | Int32Array |
                  Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;
type TypedConstructor = Float32ArrayConstructor | Float64ArrayConstructor |
                        Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor |
                        Uint8ArrayConstructor | Uint8ClampedArrayConstructor |
                        Uint16ArrayConstructor | Uint32ArrayConstructor;
type GridColorStop = {
    value: number;
    color: number;
    alpha: number;
};
class Grid {
    #private;
    autoredraw: boolean;
    constructor(width: number, height: number, scale?: number, storageType?: TypedConstructor);
    get width(): number;
    get height(): number;
    get scale(): number;
    reset(): void;
    coordAt(x: number, y: number): {
        x: number;
        y: number;
    };
    xAt(x: number): number;
    yAt(y: number): number;
    cellFromCoord(x: number, y: number): {
        x: number;
        y: number;
    };
    read(x: number, y: number): number;
    isInWidth(x: number): boolean;
    isInHeight(y: number): boolean;
    clampX(x: number): number;
    clampY(y: number): number;
    set(x: number, y: number, value: number): void;
    add(x: number, y: number, value: number): void;
    multiply(x: number, y: number, value: number): void;
    setRect(x1: number, y1: number, x2: number, y2: number, value: number): void;
    addRect(x1: number, y1: number, x2: number, y2: number, value: number): void;
    multiplyRect(x1: number, y1: number, x2: number, y2: number, multiplier: number): void;
    setCircle(x1: number, y1: number, r: number, value: number): void;
    addCircle(x1: number, y1: number, r: number, value: number): void;
    multiplyCircle(x1: number, y1: number, r: number, multiplier: number): void;
    remap(
        predicate: (value: number, x: number, y: number) => number,
        x1?: number,
        y1?: number,
        x2?: number,
        y2?: number
    );
    forEach(
        predicate: (value: number, x: number, y: number) => void,
        x1?: number,
        y1?: number,
        x2?: number,
        y2?: number
    );
    some(
        predicate: (value: number, x: number, y: number) => boolean,
        x1 = 0,
        y1 = 0,
        x2 = #width - 1,
        y2 = #height - 1
    ): boolean;
    setColorStops(stops: GridColorStop[]): void;
    interpolateColor(value: number): [number, number, number, number];
    get canvas(): HTMLCanvasElement;
    fill(value: number): void;
    redrawFragment(x1: number, y1: number, x2: number, y2: number): void;
    redrawViewport(): void;
    addSpriteToRoom(depth?: number): PIXI.Sprite;
    setSmoothing(smooth: boolean): void;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    initSprite(): void;
}
declare namespace grids {
    function create(
        width: number,
        height: number,
        scale?: number,
        storageType?: TypedConstructor
    ): Grid;
}

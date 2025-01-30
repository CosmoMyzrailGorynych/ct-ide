type BinaryGridColorStop = {
    color: number;
    alpha: number;
};
class BinaryGrid {
    #private;
    autoredraw: boolean;
    constructor(width: number, height: number, scale?: number);
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
    read(x: number, y: number): boolean;
    isInWidth(x: number): boolean;
    isInHeight(y: number): boolean;
    clampX(x: number): number;
    clampY(y: number): number;
    set(x: number, y: number): void;
    unset(x: number, y: number): void;
    toggle(x: number, y: number): void;
    setRect(x1: number, y1: number, x2: number, y2: number): void;
    unsetRect(x1: number, y1: number, x2: number, y2: number): void;
    toggleRect(x1: number, y1: number, x2: number, y2: number): void;
    setCircle(x1: number, y1: number, r: number): void;
    unsetCircle(x1: number, y1: number, r: number): void;
    toggleCircle(x1: number, y1: number, r: number): void;
    remap(
        predicate: (value: boolean, x: number, y: number) => boolean,
        x1?: number,
        y1?: number,
        x2?: number,
        y2?: number
    ): void;
    forEach(
        predicate: (value: boolean, x: number, y: number) => void,
        x1?: number,
        y1?: number,
        x2?: number,
        y2?: number
    );
    some(
        predicate: (value: boolean, x: number, y: number) => boolean,
        x1 = 0,
        y1 = 0,
        x2 = #width - 1,
        y2 = #height - 1
    ): boolean
    isRectSet(x1: number, y1: number, x2: number, y2: number): boolean;
    isRectUnset(x1: number, y1: number, x2: number, y2: number): boolean;
    isCircleSet(x1: number, y1: number, r: number): boolean;
    isCircleUnset(x1: number, y1: number, r: number): boolean;
    setColorStops(stops: ColorStop[]): ColorStop[];
    getColor(value: number): [number, number, number, number];
    get canvas(): HTMLCanvasElement;
    fill(value: boolean): void;
    redrawFragment(x1: number, y1: number, x2: number, y2: number): void;
    redrawViewport(): void;
    addSpriteToRoom(depth?: number): PIXI.Sprite;
    setSmoothing(smooth: boolean): void;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    initSprite(): void;
}
declare namespace binaryGrids {
    function create(
        width: number,
        height: number,
        scale?: number
    ): BinaryGrid;
}

type canvasPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

interface IRoomBackground {
    depth: number,
    texture: assetRef,
    parallaxX: number,
    parallaxY: number,
    shiftX: number,
    shiftY: number,
    movementX: number,
    movementY: number,
    scaleX: number,
    scaleY: number,
    repeat: canvasPatternRepeat
}

interface IRoomCopy {
    x: number,
    y: number,
    uid: string,
    scale: {
        x: number,
        y: number
    },
    rotation?: number,
    tint?: number,
    opacity?: number,
    exts: {
        [key: string]: unknown
    },
    customProperties: Record<string, unknown>
}

interface ITileTemplate {
    x: number;
    y: number;
    opacity: number;
    tint: number;
    frame: number;
    scale: {
        x: number,
        y: number
    };
    rotation: number;
    texture: string;
}

interface ITileLayerTemplate {
    depth: number;
    tiles: Array<ITileTemplate>,
    extends?: Record<string, unknown>
    hidden?: boolean;
}

interface IRoom extends IScriptable {
    width: number;
    height: number;
    /** A CSS color */
    backgroundColor: string;
    backgrounds: Array<IRoomBackground>;
    copies: Array<IRoomCopy>;
    tiles: Array<ITileLayerTemplate>;
    gridX: number;
    gridY: number;
    diagonalGrid: boolean;
    simulate: boolean;
    restrictCamera?: boolean;
    restrictMinX?: number;
    restrictMinY?: number;
    restrictMaxX?: number;
    restrictMaxY?: number;
    follow: assetRef;
    isUi: boolean;
    extends: {
        [key: string]: unknown
    };
}

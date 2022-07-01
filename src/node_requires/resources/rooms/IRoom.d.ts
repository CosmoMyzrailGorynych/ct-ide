type canvasPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

interface IRoomBackground {
    depth: number,
    texture: assetRef,
    extends: {
        parallaxX?: number,
        parallaxY?: number,
        shiftX?: number,
        shiftY?: number,
        repeat: canvasPatternRepeat
        [key: string]: unknown
    }
}

interface IRoomCopy {
    x: number,
    y: number,
    uid: assetRef,
    tx?: number,
    ty?: number,
    exts: {
        [key: string]: unknown
    }
}

interface ITileTemplate {
    x: number;
    y: number;
    grid: number[];
    texture: string;
}

interface ITileLayerTemplate {
    depth: number;
    tiles: Array<ITileTemplate>,
    extends?: Record<string, unknown>
}

interface IRoom extends IScriptable {
    width: number,
    height: number,
    /** A CSS color */
    backgroundColor: string,
    backgrounds: Array<IRoomBackground>,
    copies: Array<IRoomCopy>,
    tiles: Array<ITileLayerTemplate>
    gridX: number,
    gridY: number,
    thumbnail: string,
    restrictCamera?: boolean,
    restrictMinX?: number,
    restrictMinY?: number,
    restrictMaxX?: number,
    restrictMaxY?: number,
    extends: {
        [key: string]: unknown
    }
}

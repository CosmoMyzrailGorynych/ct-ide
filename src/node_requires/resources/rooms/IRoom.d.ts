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
}

interface ITileLayerTemplate {
    depth: number;
    tiles: Array<ITileTemplate>
}

interface IRoom extends IAsset {
    // Currently just stick to the old structure
    width: number,
    height: number,
    backgrounds: Array<IRoomBackground>,
    copies: Array<IRoomCopy>,
    tiles: Array<ITileLayerTemplate>
    gridX: number,
    gridY: number,
    oncreate: string,
    onstep: string,
    ondraw: string,
    onleave: string,
    thumbnail: string,
    extends: {
        [key: string]: unknown
    }
}

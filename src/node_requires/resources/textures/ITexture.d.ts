interface ITexture extends IAsset {
    type: 'texture';
    uid: string;
    name: string;
    origname: string;
    /* Number of columns and rows, accordigly */
    grid: [number, number];
    axis: [number, number];
    width: number;
    height: number;
    imgWidth: number;
    imgHeight: number;
    offx: number;
    offy: number;
    marginx: number;
    marginy: number;
    padding: number;
    untill: number;
    lastmod: number;
    source?: string;
    shape: 'rect' | 'strip' | 'circle',
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    r?: number;
    stripPoints?: {x: number, y: number}[];
    closedStrip?: boolean;
    tiled?: boolean;
    isBlank?: boolean;
    ignoreTiledUse?: boolean;
}

type textureShapeRect = {
    type: 'rect';
    top: number;
    bottom: number;
    left: number;
    right: number;
};
type textureShapeCircle = {
    type: 'circle';
    r: number;
};
type textureShapePolyline = {
    type: 'strip',
    points: {x: number, y: number}[],
    closedStrip: boolean
}
type textureShapePoint = {
    type: 'point';
}

declare type textureShape =
    textureShapeRect |
    textureShapeCircle |
    textureShapePolyline |
    textureShapePoint;

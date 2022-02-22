interface ITexture extends IAsset {
    type: 'texture';
    uid: string;
    name: string;
    origname: string;
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
    tiled?: boolean;
}

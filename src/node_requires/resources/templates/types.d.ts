interface ITemplate extends IAsset {
    depth: number,
    texture: assetRef,
    visible: boolean,
    oncreate: string,
    onstep: string,
    ondestroy: string,
    ondraw: string,
    extends: {
        [key: string]: unknown
    }
}

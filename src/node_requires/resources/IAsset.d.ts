interface IAsset {
    readonly type: resourceType;
    readonly uid: string;
    lastmod: number;
    group?: string;
}

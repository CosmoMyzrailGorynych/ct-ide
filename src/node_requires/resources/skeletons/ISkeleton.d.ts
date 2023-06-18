declare type skeletonApp = 'dragonbones' | 'spine' | 'unknown';

declare interface ISkeleton extends IAsset, IHasCollision {
    type: 'skeleton';
    origname: string;
    from: skeletonApp;
    name: string;
    skins: string[];
    animations: string[];
    axis: [number, number];
}

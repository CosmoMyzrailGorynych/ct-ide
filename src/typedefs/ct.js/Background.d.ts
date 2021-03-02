interface IBackgroundTemplate {
    // TODO:
}

declare class Background extends PIXI.TilingSprite {
    constructor(bgName: string, frame: number, depth: number, exts: object);
    constructor(pixiTexture: PIXI.Texture, frame: number, depth: number, exts: object);
    depth: number;
    shiftX: number;
    shiftY: number;
    movementX: number;
    movementY: number;
    parallaxX: number;
    parallaxY: number;
    scaleX: number;
    scaleY: number;
    repeat: string;
}

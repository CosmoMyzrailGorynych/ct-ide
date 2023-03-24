import * as PIXI from 'node_modules/pixi.js';

/**
 * @module
 * These type definitions are used both by ct.IDE's exporter and by ct.js library,
 * to ensure their types always match and are used correctly.
*/

export type TextureShape = textureShape;

export type ExportedTiledTexture = {
    source: string;
    shape: textureShape;
    anchor: {
        x: number;
        y: number;
    };
};


export type ExportedSkeleton = [string, string, string, string];

export type ExportedTandem = {
    texture: string;
    settings: ITandem['emitters'][0]['settings'];
}[];

export type ExportedTandems = Record<string, ExportedTandem>;

export type ExportedTile = {
    texture: string,
    frame: number,
    x: number,
    y: number,
    width: number,
    height: number,
    opacity: number,
    rotation: number,
    scale: {
        x: number,
        y: number
    },
    tint: number
}

export type ExportedTilemap = {
    depth: number;
    tiles: ExportedTile[];
    extends: {cgroup?: string} & Record<string, any>;
}

export type ExportedCopy = Omit<IRoomCopy, 'uid'> & {template: string};

export type ExportedBg = {
    texture: string,
    depth: number,
    exts: {
        movementX: number,
        movementY: number,
        parallaxX: number,
        parallaxY: number,
        repeat: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y',
        scaleX: number,
        scaleY: number,
        shiftX: number,
        shiftY: number
    }
};

export type ExportedRoom = {
    name: string;
    group: string;
    width: number;
    height: number;
    objects: ExportedCopy[];
    bgs: ExportedBg[];
    tiles: ExportedTilemap[];
    backgroundColor: string;
    cameraConstraints?: {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    };
    onStep: () => void;
    onDraw: () => void;
    onLeave: () => void;
    onCreate: () => void;
    isUi: boolean;
    follow: -1 | string;
    extends: Record<string, any>;
}

export type ExportedTemplate = {
    texture?: string;
    anchorX?: number;
    anchorY?: number;
    height?: number;
    width?: number;
    depth: number;
    blendMode: PIXI.BLEND_MODES;
    animationFPS: number;
    playAnimationOnStart: boolean;
    loopAnimation: boolean;
    visible: boolean;
    group?: string;
    onStep: () => void;
    onDraw: () => void;
    onDestroy: () => void;
    onCreate: () => void;
    extends: Record<string, any>;
}

export type ExportedMeta = {
    name: string;
    author: string;
    site: string;
    version: string;
}

export type ExportedStyle = {
    align: 'left'|'center'|'right';
    fontFamily: string;
    fontSize: number;
    fontStyle: 'normal' | 'italic';
    fontWeight: number;
    lineJoin: 'round';
    lineHeight: number;
    wordWrap?: boolean;
    wordWrapWidth?: number;
    fill?: string | string[];
    fillGradientType?: 0 | 1;
    stroke?: string;
    strokeThickness?: number;
    dropShadow?: boolean;
    dropShadowColor?: string;
    dropShadowBlur?: number;
    dropShadowAngle?: number;
    dropShadowDistance?: number;
}

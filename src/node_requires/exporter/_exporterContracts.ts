// References are needed for the client library to fetch only a subset
// of the ct.IDE typeset.

/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable spaced-comment */
/// <reference path="../resources/commonTypes.d.ts" />
/// <reference path="../resources/IAsset.d.ts" />
/// <reference path="../resources/projects/IProject.d.ts" />
/// <reference path="../resources/textures/ITexture.d.ts" />
/// <reference path="../resources/templates/ITemplate.d.ts" />
/// <reference path="../resources/emitterTandems/types.d.ts" />
/// <reference path="../resources/rooms/IRoom.d.ts" />
/// <reference path="../resources/sounds/types.d.ts" />

import * as PIXI from 'pixi.js';

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

export type viewMode = IProject['settings']['rendering']['viewMode'];

export type ExportedSkeleton = {
    /** The name of the skeleton and how it is used in the code */
    name: string;
    /**
     * The path to the JSON data file of the skeleton.
     * PNG atlas and its metadata must reside next to it.
     */
    dataPath: string;
};

export type ExportedEmitter = {
    texture: string;
    textureBehavior: ITandemEmitter['textureBehavior'];
    animatedSingleFramerate: number;
    settings: Omit<ITandem['emitters'][0]['settings'], 'behaviors'> & {
        delay: number;
        behaviors: {
            type: string;
            config: Record<string, any>;
        }[]
    };
};
export type ExportedTandem = ExportedEmitter[];
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
    cache: boolean;
    extends: {cgroup?: string} & Record<string, unknown>;
}
export type ExportedCopy = Omit<IRoomCopy, 'uid' | 'bindings'> & {
    template: string;
};

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
    width: number;
    height: number;
    objects: ExportedCopy[];
    bgs: ExportedBg[];
    tiles: ExportedTilemap[];
    backgroundColor: string;
    behaviors: string[];
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
    extends: Record<string, unknown>;
    bindings: Record<number, () => void>;
}

export type BaseClass = TemplateBaseClass;
export type ExportedTemplate = {
    name: string;
    anchorX?: number;
    anchorY?: number;
    height?: number;
    width?: number;
    depth: number;
    blendMode: PIXI.BLEND_MODES;
    visible: boolean;
    behaviors: string[];
    onStep: () => void;
    onDraw: () => void;
    onDestroy: () => void;
    onCreate: () => void;
    extends: Record<string, unknown>;
} & ({
    baseClass: 'AnimatedSprite';
    animationFPS: number;
    playAnimationOnStart: boolean;
    loopAnimation: boolean;
    texture?: string;
} | {
    baseClass: 'Text';
    textStyle: string | -1;
    defaultText: string;
} | {
    baseClass: 'NineSlicePlane';
    nineSliceSettings: ITemplate['nineSliceSettings'];
    texture: string;
} | {
    baseClass: 'Container'
} | {
    baseClass: 'Button',
    nineSliceSettings: ITemplate['nineSliceSettings'];
    texture: string;
    hoverTexture?: string;
    pressedTexture?: string;
    disabledTexture?: string;
    textStyle: string | -1;
    defaultText: string;
} | {
    baseClass: 'RepeatingTexture';
    scrollX: number;
    scrollY: number;
    isUi: boolean;
    texture: string;
} | {
    baseClass: 'SpritedCounter';
    spriteCount: number;
    texture: string;
} | {
    baseClass: 'TextBox';
    nineSliceSettings: ITemplate['nineSliceSettings'];
    texture: string;
    hoverTexture?: string;
    pressedTexture?: string;
    disabledTexture?: string;
    selectionColor?: string;
    textStyle: string | -1;
    defaultText: string;
    fieldType: ITemplate['fieldType'];
    maxTextLength: number;
} | {
    baseClass: 'ScrollBox';
    nineSliceSettings: ITemplate['nineSliceSettings'];
    texture: string;
});

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
    fontWeight: 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' |
                '400' | '500' | '600' | '700' | '800' | '900';
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

export type ExportedSound = Omit<ISound, 'uid' | 'group' | 'lastmod' | 'type' | 'distortion' | 'eq' | 'pitch' | 'reverb' | 'volume'> &
    Partial<Pick<ISound, 'distortion' | 'eq' | 'pitch' | 'reverb' | 'volume'>>;

export type ExportedBehaviorDynamic = {
    thisOnStep?: () => void,
    thisOnCreate?: () => void,
    thisOnDraw?: () => void,
    thisOnDestroy?: () => void,
    thisOnAdded?: () => void,
    thisOnRemoved?: () => void
};
export type ExportedBehavior = 'static' | ExportedBehaviorDynamic;

export type ExportedAsset = {
    type: resourceType,
    name: string
};
export type ExportedFolder = {
    type: 'folder',
    name: string,
    entries: (ExportedAsset | ExportedFolder)[]
};

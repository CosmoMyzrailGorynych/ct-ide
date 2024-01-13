type PixiBlendMode = 'normal' | 'add' | 'multiply' | 'screen';
type TemplateBaseClass = 'AnimatedSprite' | 'Text' | 'NineSlicePlane' | 'Container' |
                         'Button' | 'SpritedCounter' | 'RepeatingTexture';

interface ITemplate extends IScriptableBehaviors {
    type: 'template',
    texture?: assetRef,
    hoverTexture?: assetRef,
    pressedTexture?: assetRef,
    disabledTexture?: assetRef,
    textStyle?: assetRef,
    defaultText?: string,
    /** Skeleton reference must have priority over the texture's value. */
    skeleton?: assetRef,
    baseClass: TemplateBaseClass,
    nineSliceSettings?: {
        top: number,
        left: number,
        bottom: number,
        right: number,
        autoUpdate: boolean
    };
    tilingSettings?: {
        scrollSpeedX: number;
        scrollSpeedY: number;
        isUi: boolean;
    };
    repeaterSettings?: {
        defaultCount: number;
    };
    depth: number,
    visible: boolean,
    blendMode?: PixiBlendMode,
    playAnimationOnStart: boolean,
    loopAnimation: boolean,
    animationFPS: number
}

type PixiBlendMode = 'normal' | 'add' | 'multiply' | 'screen';

interface ITemplate extends IScriptableBehaviors {
    type: 'template',
    texture: assetRef,
    /** Skeleton reference must have priority over the texture's value. */
    skeleton?: assetRef,
    depth: number,
    visible: boolean,
    blendMode?: PixiBlendMode,
    playAnimationOnStart: boolean,
    loopAnimation: boolean,
    animationFPS: number,
    extends: {
        [key: string]: unknown
    }
}

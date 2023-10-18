type EmitterConfigV3 = import('node_modules/@pixi/particle-emitter/lib/EmitterConfig').EmitterConfigV3;
type AccelerationBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/AccelerationMovement').AccelerationBehavior;
type AlphaBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/Alpha').AlphaBehavior;
type ColorBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/Color').ColorBehavior;
type BlendModeBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/BlendMode').BlendModeBehavior;
type RotationBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/Rotation').RotationBehavior;
type NoRotationBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/Rotation').NoRotationBehavior;
type ScaleBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/Scale').ScaleBehavior;
type SpeedBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/SpeedMovement').SpeedBehavior;
type ShapeSpawnBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/ShapeSpawn').ShapeSpawnBehavior;
type BurstSpawnBehavior = typeof import('node_modules/@pixi/particle-emitter/lib/behaviors/BurstSpawn').BurstSpawnBehavior;

type EmitterTabsNames = 'texture' | 'colors' | 'scaling' | 'velocity' | 'gravity' |
                        'direction' | 'rotation' | 'spawning' | 'shape';

type EmitterBlendModes = 'normal' | 'multiply' | 'screen' | 'add';

interface ITimeSeries<type> {
    value: type,
    time: number
}

interface IEmitterConfigTupled extends EmitterConfigV3 {
    behaviors: [{ // 0
        type: 'alpha',
        config: ConstructorParameters<AlphaBehavior>[0]
    },
    { // 1
        type: 'color',
        config: ConstructorParameters<ColorBehavior>[0]
    },
    { // 2
        type: 'blendMode',
        config: ConstructorParameters<BlendModeBehavior>[0]
    },
    { // 3
        type: 'scale',
        config: ConstructorParameters<ScaleBehavior>[0]
    },
    { // 4
        type: 'moveSpeed',
        config: ConstructorParameters<SpeedBehavior>[0]
    } | {
        type: 'moveAcceleration',
        config: ConstructorParameters<AccelerationBehavior>[0]
    },
    { // 5
        type: 'spawnShape',
        config: ConstructorParameters<ShapeSpawnBehavior>[0]
    } | {
        type: 'spawnBurst',
        config: ConstructorParameters<BurstSpawnBehavior>[0]
    },
    { // 6
        type: 'rotation',
        config: ConstructorParameters<RotationBehavior>[0]
    } | {
        type: 'noRotation',
        config: ConstructorParameters<NoRotationBehavior>[0]
    }]
}

declare interface ITandemEmitter {
    uid: string;
    texture: assetRef,
    textureBehavior: 'textureRandom' | 'animatedSingle',
    animatedSingleFramerate: number,
    openedTabs: Array<EmitterTabsNames>,
    settings: IEmitterConfigTupled
}

declare interface ITandem extends IAsset {
    type: 'tandem';
    name: string;
    emitters: Array<ITandemEmitter>;
}

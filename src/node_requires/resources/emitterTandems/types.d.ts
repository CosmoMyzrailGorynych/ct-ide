import {EmitterConfigV3} from 'node_modules/@pixi/particle-emitter';
import type {AccelerationBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/AccelerationMovement.d.ts';
import type {AlphaBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/Alpha.d.ts';
import type {ColorBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/Color.d.ts';
import type {BlendModeBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/BlendMode.d.ts';
import type {RotationBehavior, NoRotationBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/Rotation.d.ts';
import type {ScaleBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/Scale.d.ts';
import type {SpeedBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/SpeedMovement.d.ts';
import type {ShapeSpawnBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/ShapeSpawn.d.ts';
import type {BurstSpawnBehavior} from 'node_modules/@pixi/particle-emitter/lib/behaviors/BurstSpawn.d.ts';

type EmitterTabsNames = 'texture' | 'colors' | 'scaling' | 'velocity' | 'gravity' |
                        'direction' | 'rotation' | 'spawningHeading' | 'shape';

type EmitterBlendModes = 'normal' | 'multiply' | 'screen' | 'add';

interface ITimeSeries<type> {
    value: type,
    time: number
}

interface IEmitterConfigTupled extends EmitterConfigV3 {
    behaviors: [{ // 0
        type: 'alpha',
        config: ConstructorParameters<typeof AlphaBehavior>[0]
    },
    { // 1
        type: 'color',
        config: ConstructorParameters<typeof ColorBehavior>[0]
    },
    { // 2
        type: 'blendMode',
        config: ConstructorParameters<typeof BlendModeBehavior>[0]
    },
    { // 3
        type: 'scale',
        config: ConstructorParameters<typeof ScaleBehavior>[0]
    },
    { // 4
        type: 'moveSpeed',
        config: ConstructorParameters<typeof SpeedBehavior>[0]
    } | {
        type: 'moveAcceleration',
        config: ConstructorParameters<typeof AccelerationBehavior>[0]
    },
    { // 5
        type: 'spawnShape',
        config: ConstructorParameters<typeof ShapeSpawnBehavior>[0]
    } | {
        type: 'spawnBurst',
        config: ConstructorParameters<typeof BurstSpawnBehavior>[0]
    },
    { // 6
        type: 'rotation',
        config: ConstructorParameters<typeof RotationBehavior>[0]
    } | {
        type: 'noRotation',
        config: ConstructorParameters<typeof NoRotationBehavior>[0]
    }]
}

interface ITandemEmitter {
    uid: string;
    texture: assetRef,
    openedTabs: Array<EmitterTabsNames>,
    settings: IEmitterConfigTupled
}

interface ITandem extends IAsset {
    type: 'tandem';
    name: string;
    emitters: Array<ITandemEmitter>;
}

type EmitterTabsNames = 'texture' | 'colors' | 'scaling' | 'velocity' | 'gravity' |
                        'direction' | 'rotation' | 'spawningHeading' | 'shape';

type EmitterBlendModes = 'normal' | 'multiply' | 'screen' | 'add';

type EmitterSpawnTypes = 'point' | 'rect' | 'circle' | 'ring' | 'burst';

interface ITimeSeries<type> {
    value: type,
    time: number
}

interface ITandemEmitter {
    texture: -1,
    openedTabs: Array<EmitterTabsNames>,
    settings: {
        alpha: {
            list: Array<ITimeSeries<number>>,
            isStepped: boolean
        },
        scale: {
            list: Array<ITimeSeries<number>>,
            isStepped: boolean
        },
        color: {
            list: Array<ITimeSeries<string>>,
            isStepped: boolean
        },
        blendMode: EmitterBlendModes,
        speed: {
            list: Array<ITimeSeries<number>>,
            isStepped: boolean
        },
        startRotation: {
            min: number,
            max: number
        },
        rotationSpeed: {
            min: number,
            max: number
        },
        rotationAcceleration: number,
        lifetime: {
            min: number,
            max: number
        },
        frequency: number,
        spawnChance: number,
        particlesPerWave: number,
        angleStart: number,
        emitterLifetime: number,
        maxParticles: number,
        maxSpeed: number,
        pos: {
            x: number,
            y: number
        },
        acceleration: {
            x: number,
            y: number
        },
        addAtBack: boolean,
        spawnType: EmitterSpawnTypes,
        spawnCircle?: {
            x: number,
            y: number,
            r: number,
            minR?: number
        },
        spawnRect?: {
            w: number,
            h: number
        },
        delay: number
    }
}

interface ITandem extends IAsset {
    emitters: Array<ITandemEmitter>
}

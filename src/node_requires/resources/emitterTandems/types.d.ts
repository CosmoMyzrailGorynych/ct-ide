type EmitterTabsNames = 'texture' | 'colors' | 'scaling' | 'velocity' | 'gravity' |
                        'direction' | 'rotation' | 'spawningHeading' | 'shape';

type EmitterBlendModes = 'normal' | 'multiply' | 'screen' | 'add';

type EmitterSpawnTypes = 'point' | 'rect' | 'circle' | 'ring' | 'burst';

interface ITimeSeries<type> {
    value: type,
    time: number
}

type EmitterConfigV3 = import('node_modules/@pixi/particle-emitter').EmitterConfigV3;
interface ITandemEmitter {
    uid: string;
    texture: -1;
    openedTabs: Array<EmitterTabsNames>;
    settings: EmitterConfigV3
}

interface ITandem extends IAsset {
    name: string;
    emitters: Array<ITandemEmitter>;
}

type soundVariant = {
    uid: string,
    source: string
};

type randomized = {
    min: number,
    max: number
};

type eqBands = [
    randomized,
    randomized,
    randomized,
    randomized,
    randomized,
    randomized,
    randomized,
    randomized,
    randomized,
    randomized
];

interface ISound extends IAsset {
    type: 'sound';
    name: string,
    preload: boolean,
    variants: soundVariant[],
    volume: randomized & {
        enabled: boolean
    },
    pitch: randomized & {
        enabled: boolean
    },
    distortion: randomized & {
        enabled: boolean
    },
    reverb: {
        enabled: boolean,
        secondsMin: number,
        secondsMax: number,
        decayMin: number,
        decayMax: number,
        reverse: boolean
    },
    eq: {
        enabled: boolean,
        bands: eqBands
    }
}

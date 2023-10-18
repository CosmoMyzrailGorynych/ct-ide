interface ISound extends IAsset {
    type: 'sound';
    name: string,
    isMusic: boolean,
    origname?: string,
    wav?: string,
    ogg?: string,
    mp3?: string,
    poolSize: number
}

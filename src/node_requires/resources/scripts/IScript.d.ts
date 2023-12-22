interface IScript extends IAsset {
    name: string;
    code: string;
    language: 'typescript' | 'coffeescript';
    runAutomatically: boolean;
}

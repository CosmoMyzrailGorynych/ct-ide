interface IScript extends IAsset {
    name: string;
    code: string | BlockScript;
    language: typeof IProject['language'];
    runAutomatically: boolean;
    variables: string[];
}

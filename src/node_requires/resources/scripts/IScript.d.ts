interface IScript extends IAsset {
    code: string | BlockScript;
    language: typeof IProject['language'];
    runAutomatically: boolean;
    variables: string[];
}

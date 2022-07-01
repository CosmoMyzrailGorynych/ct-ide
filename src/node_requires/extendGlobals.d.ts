// eslint-disable-next-line spaced-comment
/// <reference types="../../app/node_modules/pixi.js/" />

export {};
declare global {
    var signals: any;
    var orders: any;
    var alertify: any;
    var brehautColor: any;
    var languageJSON: any;
    var monaco: any;
    var currentProject: IProject;
    var projdir: string;
    function showOpenDialog(options: any): Promise<string | false>;
    function showSaveDialog(options: any): Promise<string | false>;
    interface Window {
        signals: any;
        orders: any;
        alertify: any;
        currentProject: IProject;
        languageJSON: any;
        monaco: any;
        projdir: string;
        showOpenDialog(options: any): Promise<string | false>;
        showSaveDialog(options: any): Promise<string | false>;
    }
}
declare namespace PIXI {
    var Texture: any;
}

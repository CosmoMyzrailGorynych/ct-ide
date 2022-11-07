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
    var dragonBones: any;
    var currentProject: IProject;
    var projdir: string;
    var migrationProcess: any[];
    var riot: any;
    function showOpenDialog(options: any): Promise<string | false>;
    function showSaveDialog(options: any): Promise<string | false>;
    interface Window {
        path: string;
        id: number;
        signals: any;
        orders: any;
        alertify: any;
        currentProject: IProject;
        languageJSON: any;
        monaco: any;
        projdir: string;
        showOpenDialog(options: any): Promise<string | false>;
        showSaveDialog(options: any): Promise<string | false>;
        updateWindowMenu?(): Promise<void>;
    }
}
declare namespace PIXI {
    var Texture: any;
}

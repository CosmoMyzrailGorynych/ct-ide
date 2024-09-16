type observable = {
    trigger<T>(name: string, eventArg?: T): void;
    on<T>(name: string, callback: (eventArg?: T) => void): void;
    off<T>(name: string, callback: (eventArg?: T) => void): void;
    one<T>(name: string, callback: (eventArg?: T) => void): void
};

interface IOpenDialogOptions {
    openDirectory?: boolean;
    defaultPath?: string;
    title?: string;
    multiple?: boolean;
    filter?: string;
    saveAs?: boolean;
}
interface ISaveDialogOptions {
    defaultPath?: string;
    defaultName?: string;
    filter?: string;
}

export {};
declare global {
    var signals: observable;
    var orders: observable;
    var alertify: any;
    var brehautColor: any;
    var languageJSON: any;
    var monaco: typeof import('monaco-editor');
    var currentProject: IProject;
    /** The directory of the currently opened project */
    var projdir: string;
    var migrationProcess: {
        version: string,
        process: (project: Partial<IProject>) => Promise<void>
    }[];
    var riot: any;
    function showOpenDialog(options: IOpenDialogOptions): Promise<string[] | string | false>;
    function showSaveDialog(options: ISaveDialogOptions): Promise<string | false>;
    interface Window {
        path: string;
        id: number;
        signals: observable;
        orders: observable;
        alertify: any;
        currentProject: IProject;
        languageJSON: any;
        monaco: typeof import('monaco-editor');
        /** The directory of the currently opened project */
        projdir: string;
        migrationProcess: {
            version: string,
            process: (project: Partial<IProject>) => Promise<void>
        }[];
        showOpenDialog(options: IOpenDialogOptions): Promise<string[] | string | false>;
        showSaveDialog(options: ISaveDialogOptions): Promise<string | false>;
        updateWindowMenu?(): Promise<void>;
    }
}

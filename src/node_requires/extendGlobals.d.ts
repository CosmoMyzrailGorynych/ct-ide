type observable = {
    trigger<T>(name: string, eventArg?: T): void;
    on<T>(name: string, callback: (eventArg?: T) => void): void;
    off<T>(name: string, callback: (eventArg?: T) => void): void;
    once<T>(name: string, callback: (eventArg?: T) => void): void
};

export {};
declare global {
    var signals: observable;
    var orders: any;
    var alertify: any;
    var brehautColor: any;
    var languageJSON: any;
    var monaco: any;
    var currentProject: IProject;
    /** The directory of the currently opened project */
    var projdir: string;
    var migrationProcess: any[];
    var riot: any;
    function showOpenDialog(options: any): Promise<string | false>;
    function showSaveDialog(options: any): Promise<string | false>;
    interface Window {
        path: string;
        id: number;
        signals: observable;
        orders: any;
        alertify: any;
        currentProject: IProject;
        languageJSON: any;
        monaco: any;
        /** The directory of the currently opened project */
        projdir: string;
        showOpenDialog(options: any): Promise<string | false>;
        showSaveDialog(options: any): Promise<string | false>;
        updateWindowMenu?(): Promise<void>;
    }
}

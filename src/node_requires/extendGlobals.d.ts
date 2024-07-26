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
    /** Mode of the application: window, browser, cloud, or chrome */
    const NL_MODE: Mode;
    /** Application port */
    const NL_PORT: number;
    /** Command-line arguments */
    const NL_ARGS: string[];
    /** Basic authentication token */
    const NL_TOKEN: string;
    /** Neutralinojs client version */
    const NL_CVERSION: string;
    /** Application identifier */
    const NL_APPID: string;
    /** Application version */
    const NL_APPVERSION: string;
    /** Application path */
    const NL_PATH: string;
    /** Returns true if extensions are enabled */
    const NL_EXTENABLED: boolean;
    /** Operating system name: Linux, Windows, Darwin, FreeBSD, or Uknown */
    const NL_OS: OperatingSystem;
    /** CPU architecture: x64, arm, itanium, ia32, or unknown */
    const NL_ARCH: Architecture;
    /** Neutralinojs server version */
    const NL_VERSION: string;
    /** Current working directory */
    const NL_CWD: string;
    /** Identifier of the current process */
    const NL_PID: string;
    /** Source of application resources: bundle or directory */
    const NL_RESMODE: string;
    /** Release commit of the client library */
    const NL_CCOMMIT: string;
    /** An array of custom methods */
    const NL_CMETHODS: string[];

    var signals: observable;
    var orders: observable;
    var alertify: any;
    var brehautColor: any;
    var languageJSON: any;
    var monaco: any;
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
        monaco: any;
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

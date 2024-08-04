type observable = {
    trigger<T>(name: string, eventArg?: T): void;
    on<T>(name: string, callback: (eventArg?: T) => void): void;
    off<T>(name: string, callback: (eventArg?: T) => void): void;
    one<T>(name: string, callback: (eventArg?: T) => void): void
};

declare var signals: observable;
declare var orders: observable;
declare var alertify: typeof import('./alertify').default;
declare var brehautColor: any;
declare var languageJSON: any;
declare var monaco: any;
declare var currentProject: IProject;
/** The directory of the currently opened project */
declare var projdir: string;
declare var migrationProcess: {
    version: string,
    process: (project: Partial<IProject>) => Promise<void>
}[];
declare var riot: any;

declare var alertify: typeof import('./alertify').default;

interface Window {
    path: string;
    id: number;
    signals: observable;
    orders: observable;
    alertify: typeof import('./alertify').default;
    currentProject: IProject;
    languageJSON: any;
    monaco: any;
    /** The directory of the currently opened project */
    projdir: string;
    migrationProcess: {
        version: string,
        process: (project: Partial<IProject>) => Promise<void>
    }[];
    updateWindowMenu?(): Promise<void>;
}

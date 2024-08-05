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
declare var languageJSON: import('./i18n').vocLike;
declare var monaco: typeof import('monaco-editor');
declare var currentProject: IProject;
/** The directory of the currently opened project */
declare var projdir: string;
declare var migrationProcess: {
    version: string,
    process: (project: Partial<IProject>) => Promise<void>
}[];
declare var riot: {
    mount(selector: string, opts?: Record<string, unknown>): void;
    mount(selector: string, tagName: string, component: Record<string, unknown>): void;
    mount(domNode: HTMLElement, tagName: string, component: Record<string, unknown>): void;
    unregister(tagName: string): void;
    /** Updates all the mounted tags and their expressions on the page. */
    update(): void;
};
declare var ctjsVersion: string;

declare var alertify: typeof import('./alertify').default;

interface Window {
    path: string;
    id: number;
    signals: observable;
    orders: observable;
    alertify: typeof import('./alertify').default;
    currentProject: IProject;
    languageJSON: import('./i18n').vocLike;
    monaco: typeof import('monaco-editor');
    riot: typeof riot;
    ctjsVersion: string;
    /** The directory of the currently opened project */
    projdir: string;
    migrationProcess: {
        version: string,
        process: (project: Partial<IProject>) => Promise<void>
    }[];
    updateWindowMenu?(): Promise<void>;
}

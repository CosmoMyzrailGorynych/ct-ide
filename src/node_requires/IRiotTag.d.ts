declare interface IRiotTag<OptsTypes = Record<string, any>> {
    update: () => void;
    on: <T>(this: IRiotTag, event: string, callback: (payload: T) => void) => void;
    off: (this: IRiotTag, event: string, callback: (payload: any) => void) => void;
    once: <T>(this: IRiotTag, event: string, callback: (payload: T) => void) => void;
    opts: OptsTypes;
    refs: Record<string, HTMLElement | HTMLElement[] | IRiotTag | IRiotTag[]>;
    root: HTMLElement;

    // Fields ct.js actively uses in its tags

    // `voc` mixin
    namespace?: string;
    vocGlob?: Record<string, Record<string, any>>;
    vocMeta?: Record<string, Record<string, any>>;
    localizeField?: (obj: Record<string, any>, field: string) => string;

    // `wire` mixin
    wire?: (path: string, update?: boolean) => (e: InputEvent) => void;

    // `niceTime` mixin
    niceTime?: (date: Date) => string;

    // `discardio` mixin
    writeChanges: () => void;
    discardChanges: () => void;
    isDirty: () => boolean;

    asset?: IAsset;

    [key: string]: any;
}

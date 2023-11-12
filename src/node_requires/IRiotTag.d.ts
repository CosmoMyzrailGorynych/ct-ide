// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare interface IRiotTag<OptsTypes = Record<string, any>> {
    update: () => void;
    on: <T>(this: IRiotTag, event: string, callback: (payload: T) => void) => void;
    off: (this: IRiotTag, event: string, callback: (payload: never) => void) => void;
    once: <T>(this: IRiotTag, event: string, callback: (payload: T) => void) => void;
    opts: OptsTypes;
    refs: Record<string, HTMLElement | HTMLElement[] | IRiotTag | IRiotTag[]>;
    root: HTMLElement;

    // Fields ct.js actively uses in its tags

    // `voc` mixin
    namespace?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vocGlob?: Record<string, Record<string, any>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vocMeta?: Record<string, Record<string, any>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    [key: string]: unknown;
}

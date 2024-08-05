declare interface IRiotMixin {
    init?(opts: Record<string, unknown>): void;
    getOpts?(): Record<string, unknown>;
    setOpts?(newValues: Record<string, unknown>, update?: boolean): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare interface IRiotTag<OptsTypes = Record<string, any>> {
    update: (newValues?: Record<string, unknown>) => void;
    /**
     * Detaches the tag and its children from the page.
     * An “unmount” event is fired. If you want to unmount a tag
     * without removing the parent tag you need to pass true to the unmount method.
     */
    unmount: (saveParent?: boolean) => void;
    on: <T>(this: IRiotTag, event: string, callback: (payload: T) => void) => void;
    off: (this: IRiotTag, event: string, callback: (payload: never) => void) => void;
    once: <T>(this: IRiotTag, event: string, callback: (payload: T) => void) => void;
    mixin: (mixin: IRiotMixin) => void;
    opts: OptsTypes;
    refs: Record<string, HTMLElement | HTMLElement[] | IRiotTag | IRiotTag[]>;
    root: HTMLElement;
    tags: Record<string, IRiotTag | IRiotTag[]>;
    parent: IRiotTag;

    // Fields ct.js actively uses in its tags

    // `voc` mixin
    namespace?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vocGlob?: Record<string, Record<string, any>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vocMeta?: import('./i18n').vocLike['me'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vocFull?: import('./i18n').vocLike;
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

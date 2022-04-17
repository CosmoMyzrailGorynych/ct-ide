interface WindowOrWorkerGlobalScope {
    readonly caches: CacheStorage;
    readonly crossOriginIsolated: boolean;
    readonly crypto: Crypto;
    readonly indexedDB: IDBFactory;
    readonly isSecureContext: boolean;
    readonly origin: string;
    readonly performance: Performance;
    atob(data: string): string;
    btoa(data: string): string;
    clearInterval(handle?: number): void;
    clearTimeout(handle?: number): void;
    createImageBitmap(image: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap>;
    createImageBitmap(image: ImageBitmapSource, sx: number, sy: number, sw: number, sh: number, options?: ImageBitmapOptions): Promise<ImageBitmap>;
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
    queueMicrotask(callback: VoidFunction): void;
    setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
    setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
}

interface Window extends WindowOrWorkerGlobalScope {
    readonly devicePixelRatio: number;
    readonly document: Document;
    [key: string]: any;
}

// Mainly you don't need any DOM API in game development, so let's not pollute typings with tons of global prototypes, mmkay?
var window: Window;
var document: any;

declare const atob: (data: string) => string;
declare const btoa: (data: string) => string;
declare const clearInterval: (handle?: number) => void;
declare const clearTimeout: (handle?: number) => void;
declare const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
declare const queueMicrotask: (callback: VoidFunction) => void;
declare const setInterval: (handler: TimerHandler, timeout?: number, ...arguments: any[]) => number;
declare const setTimeout: (handler: TimerHandler, timeout?: number, ...arguments: any[]) => number;

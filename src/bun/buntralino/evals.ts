export type PromiseResolveCallback = (value: void | PromiseLike<void>) => void;
export type PromiseRejectCallback = (reason?: Error) => void;
export const evalsMap = new Map<string, [PromiseResolveCallback, PromiseRejectCallback]>();

import {md5} from 'hash-wasm';

export const revHash = async (value: string | ArrayBuffer | Uint8Array | Uint16Array | Uint32Array):
Promise<string> => {
    if (value instanceof ArrayBuffer) {
        value = new Uint8Array(value);
    }
    return (await md5(value as string | Uint8Array | Uint16Array | Uint32Array))
    .toString()
    .slice(0, 10);
};

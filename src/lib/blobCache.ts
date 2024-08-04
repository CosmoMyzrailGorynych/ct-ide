const fs = Neutralino.filesystem;

type cachedBlob = {
    blob: Blob;
    url: string;
    lastModified: number;
    arrayBuffer: ArrayBuffer;
}

export class BlobCache {
    private cache: Map<string, cachedBlob> = new Map();
    private promises: Map<string, Promise<cachedBlob>> = new Map();
    private async updateEntry(file: string): Promise<cachedBlob> {
        const {modifiedAt} = await fs.getStats(file);
        const arrayBuffer = await fs.readBinaryFile(file);
        if (!this.promises.has(file)) {
            throw new Error(`Loading ${file} was cancelled.`);
        }
        const blob = new Blob([arrayBuffer]);
        const entry: cachedBlob = {
            blob,
            arrayBuffer,
            url: URL.createObjectURL(blob),
            lastModified: modifiedAt
        };
        this.cache.set(file, entry);
        return entry;
    }
    get = ((key: string | string[]): Promise<cachedBlob | cachedBlob[]> => {
        if (Array.isArray(key)) {
            return Promise.all(key.map(k => this.get(k)));
        }
        if (this.cache.has(key)) {
            if (Number(new Date()) > this.cache.get(key)!.lastModified) {
                const promise = this.updateEntry(key);
                this.promises.set(key, promise);
                return promise;
            }
        }
        if (this.promises.has(key)) {
            return this.promises.get(key)!;
        }
        const promise = this.updateEntry(key);
        this.promises.set(key, promise);
        return promise;
    }) as ((key: string) => Promise<cachedBlob>) & ((key: string[]) => Promise<cachedBlob[]>);

    async getUrl(key: string): Promise<string> {
        return (await this.get(key)).url;
    }
    getURL = this.getUrl;

    async getBlob(key: string): Promise<Blob> {
        return (await this.get(key)).blob;
    }

    exists(key: string): boolean {
        return this.cache.has(key);
    }

    delete(key: string | string[]): void {
        if (Array.isArray(key)) {
            key.forEach(k => this.cache.delete(k));
        } else {
            if (this.promises.has(key)) {
                this.promises.delete(key);
            }
            if (this.cache.has(key)) {
                URL.revokeObjectURL(this.cache.get(key)!.url);
                this.cache.delete(key);
            }
        }
    }

    reset(): void {
        for (const blob of this.cache.values()) {
            URL.revokeObjectURL(blob.url);
        }
        this.cache.clear();
        this.promises.clear();
    }

    bind(riotTag: IRiotTag): void {
        riotTag.on('unmount', () => this.reset());
    }
}

export default new BlobCache();

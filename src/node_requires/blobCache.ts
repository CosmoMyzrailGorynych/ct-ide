const fs = Neutralino.filesystem;

type cachedBlob = {
    blob: Blob;
    url: string;
    lastModified: number;
}

export class BlobCache {
    private cache: Map<string, cachedBlob> = new Map();
    private async updateEntry(file: string): Promise<cachedBlob> {
        const {modifiedAt} = await fs.getStats(file);
        const blob = new Blob([await fs.readBinaryFile(file)]);
        const entry: cachedBlob = {
            blob,
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
                return this.updateEntry(key);
            }
            return Promise.resolve(this.cache.get(key)!);
        }
        return this.updateEntry(key);
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
            this.cache.delete(key);
        }
    }

    reset(): void {
        this.cache.clear();
    }
}

export default new BlobCache();

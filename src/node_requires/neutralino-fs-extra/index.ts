import Neutralino from '@neutralinojs/lib';

const fs = {
    ...Neutralino.filesystem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async readJSON(path: string): Promise<any> {
        return JSON.parse(await fs.readFile(path));
    },
    readJson(path: string): Promise<any> {
        return fs.readJSON(path);
    },
    async ensureDir(path: string): Promise<void> {
        try {
            await fs.getStats(path);
        } catch (e) {
            fs.createDirectory(path);
        }
    },
    async pathExists(path: string): Promise<boolean> {
        try {
            await fs.getStats(path);
            return true;
        } catch (e) {
            return false;
        }
    },
    async readdir(path: string): Promise<string[]> {
        const entries = await fs.readDirectory(path);
        return entries.map(entry => entry.entry);
    },
    outputFile(file: string, val: string): Promise<void> {
        return fs.writeFile(file, val);
    },
    outputBinaryFile(file: string, val: ArrayBuffer): Promise<void> {
        return fs.writeBinaryFile(file, val);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputJSON(file: string, val: any, options?: Parameters<JSON['stringify']>[2]): Promise<void> {
        const json = JSON.stringify(val, null, options);
        return fs.outputFile(file, json);
    }
};
export default fs;

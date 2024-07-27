import {filesystem} from '@neutralinojs/lib';

enum FsConstants {
    F_OK = 1,
    R_OK = 2,
    W_OK = 4,
    X_OK = 8
}

const fs = {
    ...filesystem,
    /** Reads a text file. The encoding is ignored and will always be utf-8. */
    readFile: ((path: string, encoding?: 'utf8'): Promise<string | ArrayBuffer> => {
        if (encoding === 'utf8') {
            return filesystem.readFile(path);
        }
        return filesystem.readBinaryFile(path);
    }) as ((path: string, encoding: 'utf8') => Promise<string>) &
          ((path: string) => Promise<ArrayBuffer>),

    writeFile: ((path: string, contents: string | ArrayBuffer, encoding?: 'utf8'): Promise<void> => {
        if (encoding === 'utf8') {
            return filesystem.writeFile(path, contents as string);
        }
        return filesystem.writeBinaryFile(path, contents as ArrayBuffer);
    }) as ((path: string, contents: string, encoding: 'utf8') => Promise<void>) &
          ((path: string, contents: ArrayBuffer) => Promise<void>),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async readJSON(path: string): Promise<any> {
        return JSON.parse(await filesystem.readFile(path));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    },
    async mkdtemp(path: string): Promise<string> {
        const randomId = Math.random()
            .toString(36)
            .substr(2, 9);
        await fs.ensureDir(path + randomId);
        return path + randomId;
    },
    async access(path: string, mode: number): Promise<void> {
        // eslint-disable-next-line no-bitwise
        if (mode & FsConstants.F_OK || mode & FsConstants.X_OK) {
            await filesystem.getStats(path);
        }
        // eslint-disable-next-line no-bitwise
        if (mode & FsConstants.R_OK) {
            await filesystem.readBinaryFile(path);
        }
        // eslint-disable-next-line no-bitwise
        if (mode & FsConstants.W_OK) {
            const stats = await filesystem.getStats(path);
            if (stats.isDirectory) {
                const randomTester = `${Math.random()}.acctest`;
                await fs.writeFile(path + '/' + randomTester, '');
                await fs.remove(path + '/' + randomTester);
            }
        }
    },
    constants: FsConstants
};
export default fs;

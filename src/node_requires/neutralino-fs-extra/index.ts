import path from 'path';
const {filesystem} = Neutralino;

enum FsConstants {
    F_OK = 1,
    R_OK = 2,
    W_OK = 4,
    X_OK = 8
}
export const constants = FsConstants;

/** Reads a text file. The encoding is ignored and will always be utf-8. */
export const readFile = ((path: string, encoding?: 'utf8' | {
    encoding?: 'utf8'
}): Promise<string | ArrayBuffer> => {
    if (encoding === 'utf8' || (typeof encoding === 'object' && encoding.encoding === 'utf8')) {
        return filesystem.readFile(path);
    }
    return filesystem.readBinaryFile(path);
}) as ((path: string, encoding: 'utf8') => Promise<string>) &
      ((path: string, encoding: {
          encoding: 'utf8'
      }) => Promise<string>) &
      ((path: string) => Promise<ArrayBuffer>);

export const writeFile = ((path: string, contents: string | ArrayBuffer, encoding?: 'utf8'): Promise<void> => {
    if (encoding === 'utf8') {
        return filesystem.writeFile(path, contents as string);
    }
    return filesystem.writeBinaryFile(path, contents as ArrayBuffer);
}) as ((path: string, contents: string, encoding?: 'utf8') => Promise<void>) &
      ((path: string, contents: ArrayBuffer) => Promise<void>);

export const readJSON = async (path: string, options: {
    encoding?: 'utf8'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} = {}): Promise<any> => {
    void options;
    return JSON.parse(await filesystem.readFile(path));
};

export const readJson = (path: string, options: {
    encoding?: 'utf8'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} = {}): Promise<any> => {
    void options;
    return readJSON(path);
};

export const pathExists = async (path: string): Promise<boolean> => {
    try {
        await filesystem.getStats(path);
        return true;
    } catch (e) {
        return false;
    }
};
export const exists = pathExists;

export const ensureDir = async (targetPath: string): Promise<void> => {
    try {
        await filesystem.getStats(targetPath);
    } catch (e) {
        const {rootPath} = await filesystem.getPathParts(targetPath);
        const pieces = path.normalize(rootPath).split(path.sep);
        for (let i = 1, [currentPath] = pieces; i < pieces.length; i++) {
            currentPath = path.join(currentPath, pieces[i]);
            // eslint-disable-next-line no-await-in-loop
            if (!await pathExists(currentPath)) {
                filesystem.createDirectory(currentPath);
            }
        }
    }
};

export const readdir = (async (dir: string, options: {
    encoding?: 'utf8',
    withFileTypes?: boolean,
    recursive?: boolean
} = {}) => {
    const entries = await filesystem.readDirectory(dir, {
        recursive: options.recursive ?? false
    });
    if (!options.withFileTypes) {
        return entries.map(entry => entry.entry);
    }
    return entries.map(entry => ({
        name: entry.entry,
        parentPath: path.join(dir, path.dirname(entry.entry)),
        isDirectory: () => entry.type === 'DIRECTORY',
        isFile: () => entry.type === 'FILE'
    }));
}) as ((dir: string, options: {
    encoding?: 'utf8',
    withFileTypes: true,
    recursive?: boolean
}) => Promise<{
    name: string;
    isDirectory: () => boolean;
    isFile: () => boolean;
}>) & ((dir: string, options?: {
    encoding?: 'utf8',
    withFileTypes?: false,
    recursive?: boolean
}) => Promise<string[]>);

export const outputFile = (async (file: string, val: string | ArrayBuffer, encoding?: 'utf8'): Promise<void> => {
    await ensureDir(path.dirname(file));
    await writeFile(file, val as never, encoding);
}) as ((path: string, contents: string, encoding?: 'utf8') => Promise<void>) &
      ((path: string, contents: ArrayBuffer) => Promise<void>);

export const outputBinaryFile = async (file: string, val: ArrayBuffer): Promise<void> => {
    await ensureDir(path.dirname(file));
    await filesystem.writeBinaryFile(file, val);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const outputJSON = (file: string, val: any, options: {
    encoding?: 'utf8',
    spaces?: Parameters<JSON['stringify']>[2],
    EOL?: string,
    replacer?: Parameters<JSON['stringify']>[1]
} = {}): Promise<void> => {
    const json = JSON.stringify(val, options.replacer, options.spaces);
    return outputFile(file, json);
};
export const mkdtemp = async (path: string): Promise<string> => {
    const randomId = Math.random()
        .toString(36)
        .substr(2, 9);
    await ensureDir(path + randomId);
    return path + randomId;
};
export const access = async (path: string, mode: number = FsConstants.F_OK): Promise<void> => {
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
            await filesystem.writeFile(path + '/' + randomTester, '');
            await filesystem.remove(path + '/' + randomTester);
        }
    }
};

export const move = async (src: string, dest: string, options: {
    overwrite?: boolean
} = {}): Promise<void> => {
    if (options.overwrite === false) {
        if (await pathExists(dest)) {
            throw new Error(`[neutralino-fs-extra] Destination '${dest}' already exists.`);
        }
    }
    await filesystem.move(src, dest);
};

export type Stats = {
    isFile: () => boolean;
    isDirectory: () => boolean;
    size: number;
    birthtimeMs: number;
    atimeMs: number;
    ctimeMs: number;
    mtimeMs: number;
    birthtime: Date;
    atime: Date;
    ctime: Date;
    mtime: Date;
};

export const stat = (path: string): Promise<Stats> => filesystem.getStats(path).then(stats => ({
    isFile: () => stats.isFile,
    isDirectory: () => stats.isDirectory,
    size: stats.size,
    birthtimeMs: stats.createdAt,
    atimeMs: stats.modifiedAt,
    ctimeMs: stats.modifiedAt,
    mtimeMs: stats.modifiedAt,
    birthtime: new Date(stats.createdAt),
    atime: new Date(stats.modifiedAt),
    ctime: new Date(stats.modifiedAt),
    mtime: new Date(stats.modifiedAt)
}));
export const lstat = stat;

export const {copy, remove} = filesystem;

export default {
    ...filesystem,
    stat,
    lstat,
    exists,
    constants,
    readFile,
    writeFile,
    readJSON,
    readJson,
    ensureDir,
    pathExists,
    readdir,
    outputFile,
    outputBinaryFile,
    outputJSON,
    mkdtemp,
    access,
    move
};

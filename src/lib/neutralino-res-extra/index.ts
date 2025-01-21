import {normalize, basename, dirname, join} from 'path';
import neutralino from '@neutralinojs/lib';
import {ensureDir} from '../neutralino-fs-extra';

const Neutralino = window.Neutralino ?? neutralino;
const res = Neutralino.resources;
const fs = Neutralino.filesystem;

type FolderEntry = {
    name: string;
    fullPath: string;
    parent: string;
    isDirectory: boolean;
}
const analyzedFiles: FolderEntry[] = [];
let analyzePromise: Promise<FolderEntry[]> | null = null;

export const getFiles = async (): Promise<string[]> => {
    if (window.NL_RESMODE === 'directory') {
        const appPath = (await Neutralino.app.getConfig()).cli.resourcesPath;
        const entries = await fs.readDirectory(NL_CWD + '/' + appPath, {
            recursive: true
        });
        return entries.map(e => e.path.slice(NL_CWD.length + 1));
    }
    return res.getFiles();
};

const analyzeResources = async () => {
    analyzedFiles.length = 0;
    const filepaths = await getFiles();
    for (const file of filepaths) {
        const entry = {
            name: basename(file),
            fullPath: file,
            parent: dirname(file),
            isDirectory: filepaths.some(f => f.startsWith(`${file}/`))
        };
        analyzedFiles.push(entry);
    }
    return analyzedFiles;
};
const getAnalyzedFiles = () => {
    if (analyzePromise) {
        return analyzePromise;
    }
    const promise = analyzeResources();
    analyzePromise = promise;
    return promise;
};

export const pathExists = async (filePath: string): Promise<boolean> => {
    if (!analyzedFiles.length) {
        await getAnalyzedFiles();
    }
    return analyzedFiles.some(entry => entry.fullPath === filePath);
};

export const extractFile = async (src: string, dest: string): Promise<void> => {
    if (window.NL_RESMODE === 'directory') {
        await fs.copy(NL_CWD + src, dest);
        return;
    }
    await res.extractFile(src, dest);
};

export const readFile = (filePath: string): Promise<string> => {
    if (window.NL_RESMODE === 'directory') {
        return fs.readFile(NL_CWD + filePath);
    }
    return res.readFile(filePath);
};

export const readBinaryFile = (filePath: string): Promise<ArrayBuffer> => {
    if (window.NL_RESMODE === 'directory') {
        return fs.readBinaryFile(NL_CWD + filePath);
    }
    return res.readBinaryFile(filePath);
};

export const getFolderEntries = async (path: string): Promise<FolderEntry[]> => {
    let folderPath = normalize(path);
    if (folderPath.endsWith('/')) {
        folderPath = folderPath.slice(0, -1);
    }
    if (!analyzedFiles.length) {
        await getAnalyzedFiles();
    }
    return analyzedFiles.filter(entry => entry.parent === folderPath);
};
export const readdir = getFolderEntries;
export const extractFolder = async (src: string, dest: string): Promise<void> => {
    if (window.NL_RESMODE === 'directory') {
        await fs.copy(NL_CWD + src, dest);
        return;
    }
    if (!analyzedFiles.length) {
        await getAnalyzedFiles();
    }
    const entries = await getFolderEntries(src);
    const folders = entries.filter(entry => entry.isDirectory);
    /* eslint-disable no-await-in-loop */
    for (const folder of folders) {
        const entryDest = normalize(folder.fullPath.replace(src, dest));
        await ensureDir(entryDest);
    }
    /* eslint-enable no-await-in-loop */
    await Promise.all(entries.map(async entry => {
        const entryDest = normalize(entry.fullPath.replace(src, dest));
        if (entry.isDirectory) {
            await extractFolder(entry.fullPath, entryDest);
            return;
        }
        await extractFile(entry.fullPath, entryDest);
    }));
};
export const copyFolder = extractFolder;


export default {
    readdir,
    getFolderEntries,
    getFiles,
    extractFile,
    readFile,
    readBinaryFile,
    pathExists,
    extractFolder
};

import {normalize, basename, dirname, join} from 'path';
import neutralino from '@neutralinojs/lib';
import fs from '../neutralino-fs-extra';

const Neutralino = window.Neutralino ?? neutralino;
const res = Neutralino.resources;

type FolderEntry = {
    name: string;
    fullPath: string;
    parent: string;
    isDirectory: boolean;
}
const analyzedFiles: FolderEntry[] = [];

const analyzeResources = async () => {
    analyzedFiles.length = 0;
    const filepaths = await res.getFiles();
    for (const file of filepaths) {
        const entry = {
            name: basename(file),
            fullPath: file,
            parent: dirname(file),
            isDirectory: filepaths.some(f => f.startsWith(`${file}/`))
        };
        analyzedFiles.push(entry);
    }
};

const series = async (tasks: Promise<unknown>[]): Promise<void> => {
    for (const task of tasks) {
        // eslint-disable-next-line no-await-in-loop
        await task;
    }
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
        return fs.readFile(NL_CWD + filePath, 'utf8');
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
    if (window.NL_RESMODE === 'directory') {
        const entries = await fs.readdir(NL_CWD + folderPath, {
            withFileTypes: true
        });
        return entries.map(e => ({
            name: e.name,
            fullPath: join(folderPath, e.name),
            parent: folderPath,
            isDirectory: e.isDirectory()
        }));
    }
    if (!analyzedFiles.length) {
        await analyzeResources();
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
        await analyzeResources();
    }
    const entries = await getFolderEntries(src);
    await series(entries.map(async entry => {
        if (entry.isDirectory) {
            await fs.ensureDir(entry.fullPath);
            await extractFolder(entry.fullPath, normalize(entry.fullPath.replace(src, dest)));
            return;
        }
        await extractFile(entry.fullPath, normalize(entry.fullPath.replace(src, dest)));
    }));
};
export const copyFolder = extractFolder;


export default {
    readdir,
    getFolderEntries,
    extractFile,
    readFile,
    readBinaryFile,
    extractFolder
};

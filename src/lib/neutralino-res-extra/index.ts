import {normalize, basename, dirname} from 'path';
import neutralino from '@neutralinojs/lib';

const Neutralino = window.Neutralino ?? neutralino;
const res = Neutralino.resources;

type FolderEntry = {
    name: string;
    fullPath: string;
    parent: string;
    isDirectory: boolean;
}
const analyzedFiles: FolderEntry[] = [];
let analyzePromise: Promise<FolderEntry[]> | null = null;

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


export default {
    readdir,
    getFolderEntries,
    pathExists
};

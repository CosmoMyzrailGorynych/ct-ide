import path from 'path';

import {isDev} from 'src/lib/platformUtils';

const moduleDir = isDev() ? path.join(NL_CWD, 'src/builtinCatmods') : path.join(NL_CWD, 'catmods');

const getModulePathByName = (moduleName: string): string => path.join(moduleDir, moduleName);
import {importEventsFromModule, unloadEventsFromModule} from '../../events';
import {loadModdedBlocks, unloadModdedBlocks} from '../../catnip';

/* async */
const loadModule = (moduleDir: string): Promise<ICatmodManifest> => {
    const fs = require('../../neutralino-fs-extra');
    return fs.readJSON(path.join(moduleDir, 'module.json'));
};

/* async */
const loadModuleByName = (moduleName: string): Promise<ICatmodManifest> =>
    loadModule(getModulePathByName(moduleName));

const loadModules = async (): Promise<ICatmod[]> => {
    const fs = require('../../neutralino-fs-extra'),
          path = require('path');

    // Reads the modules directory
    const files = await fs.readdir(moduleDir);

    const modules = (await Promise.all(files.map(async (file: string) => {
        // We include only those folders that have `module.json` inside
        if (await fs.pathExists(path.join(moduleDir, file, 'module.json'))) {
            const moduleName = file;
            return {
                name: moduleName,
                path: path.join(moduleDir, file),
                manifest: await fs.readJSON(path.join(moduleDir, file, 'module.json'))
            } as ICatmod;
        }
        return false;
    }))).filter(module => module) as ICatmod[]; // Remove `false` results from array

    return modules;
};

declare interface IModuleDocStructure {
    name?: string,
    vocKey?: string,
    path?: string
}
const getModuleDocStructure = async (module: ICatmod): Promise<IModuleDocStructure[]> => {
    const path = require('path'),
          fs = require('../../neutralino-fs-extra');
    const docStructure = [];
    const readmeExists = fs.pathExists(path.join(module.path, 'README.md')),
          docsExists = fs.pathExists(path.join(module.path, 'DOCS.md')),
          docsStat = fs.lstat(path.join(module.path, 'docs'));
    if (await readmeExists) {
        docStructure.push({
            vocKey: 'documentation',
            path: path.join(module.path, 'README.md')
        });
    }
    if (await docsExists) {
        docStructure.push({
            vocKey: 'reference',
            path: path.join(module.path, 'DOCS.md')
        });
    }

    try { // Search for a docs folder and add its items
        if ((await docsStat).isDirectory()) {
            const files = (await fs.readdir(path.join(module.path, 'docs')))
                .filter((file: string) => /\.md$/.test(file));
            for (const file of files) {
                docStructure.push({
                    name: path.basename(file, path.extname(file)),
                    path: path.join(module.path, 'docs', file)
                });
            }
        }
    } catch (err) { // No such directory; do nothing
        void err;
    }
    if (docStructure.length) {
        // Such a module does not use README.md or DOCS.md,
        // but we still need to put a top-level nav item
        if (!(await readmeExists) && !(await docsExists)) {
            // The name is set right below ⤵
            docStructure.unshift({});
        }
        // The first element's name should be named after the module itself.
        docStructure[0].name = module.manifest.main.name;
    }
    return docStructure;
};

/**
 * A mapping of general module categories to their icons.
 */
const categoryToIconMap: Record<string, string> = {
    customization: 'droplet',
    utilities: 'tool',
    media: 'tv',
    misc: 'loader',
    desktop: 'monitor',
    motionPlanning: 'move',
    inputs: 'airplay',
    fx: 'sparkles',
    mobile: 'smartphone',
    integrations: 'plus-circle',
    tweaks: 'sliders',
    networking: 'globe',
    default: 'ctmod'
};

const getIcon = (module: ICatmod): string => {
    const {categories} = module.manifest.main;
    if (!categories || categories.length === 0) {
        return categoryToIconMap.default;
    }
    if (categories[0] in categoryToIconMap) {
        return categoryToIconMap[categories[0]];
    }
    return categoryToIconMap.default;
};

const addDefaults = async (moduleName: string, moduleData?: ICatmodManifest) => {
    if (!moduleData) {
        moduleData = await loadModuleByName(moduleName);
    }
    if (!moduleData.fields) {
        return;
    }
    for (const field of moduleData.fields) {
        if (!field.key) {
            continue;
        }
        if (!window.currentProject.libs[moduleName][field.key]) {
            if (field.default) {
                window.currentProject.libs[moduleName][field.key] = field.default;
            } else if (field.type === 'number') {
                window.currentProject.libs[moduleName][field.key] = 0;
            } else if (field.type === 'checkbox') {
                window.currentProject.libs[moduleName][field.key] = false;
            } else {
                window.currentProject.libs[moduleName][field.key] = '';
            }
        }
    }
};
const {removeTypedefs, addTypedefs} = require('./typedefs');
const checkModulesExistence = async (moduleNames: string[]): Promise<true|string[]> => {
    const installedModules = await loadModules();
    const nonInstalled = [];
    for (const moduleName of moduleNames) {
        if (!installedModules.some(module => module.name === moduleName)) {
            nonInstalled.push(moduleName);
        }
    }
    if (nonInstalled.length === 0) {
        return true;
    }
    return nonInstalled;
};
const isModuleEnabled = (moduleName: string): boolean =>
    (moduleName in window.currentProject.libs);
const enableModule = async (moduleName: string): Promise<void> => {
    window.currentProject.libs[moduleName] = {};
    if (window.currentProject.language === 'catnip') {
        loadModdedBlocks(moduleName);
    }
    const catmod = await loadModuleByName(moduleName);
    await addDefaults(moduleName, catmod);
    importEventsFromModule(catmod, moduleName);
    addTypedefs({
        name: moduleName,
        path: getModulePathByName(moduleName)
    }); // Loaded asynchronously, but isn't awaited so it doesn't block UI much
    window.signals.trigger('catmodAdded', moduleName);
};
const disableModule = (moduleName: string): void => {
    delete window.currentProject.libs[moduleName];
    if (window.currentProject.language === 'catnip') {
        unloadModdedBlocks(moduleName);
    }
    unloadEventsFromModule(moduleName);
    removeTypedefs({
        name: moduleName,
        path: getModulePathByName(moduleName)
    });
    window.signals.trigger('catmodRemoved', moduleName);
};

export {
    loadModule,
    loadModuleByName,
    loadModules,
    moduleDir,
    getModuleDocStructure,
    getModulePathByName,
    categoryToIconMap,
    getIcon,
    isModuleEnabled,
    checkModulesExistence,
    enableModule,
    disableModule
};

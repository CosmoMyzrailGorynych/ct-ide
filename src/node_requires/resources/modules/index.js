const moduleDir = './data/ct.libs';

/* async */
const loadModule = dir => {
    const fs = require('fs-extra'),
          path = require('path');
    return fs.readJSON(dir, path.join(dir, 'module.json'));
};
/* async */
const loadModuleByName = name => {
    const path = require('path');
    return loadModule(path.join(moduleDir, name));
};
const loadModules = async () => {
    const fs = require('fs-extra'),
          path = require('path');

    // Reads the modules directory
    const files = await fs.readdir(moduleDir);

    const modules = (await Promise.all(files.map(async file => {
        // We include only those folders that have `module.json` inside
        if (await fs.pathExists(path.join(moduleDir, file, 'module.json'))) {
            const moduleName = file;
            return {
                name: moduleName,
                path: path.join(moduleDir, file),
                manifest: await fs.readJSON(path.join(moduleDir, file, 'module.json'))
            };
        }
        return false;
    }))).filter(module => module); // Remove `false` results from array

    return modules;
};

const getModuleDocStructure = async module => {
    const path = require('path'),
          fs = require('fs-extra');
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
                .filter(file => /\.md$/.test(file));
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
const categoryToIconMap = {
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

const getIcon = module => {
    const {categories} = module.manifest.main;
    if (!categories || categories.length === 0) {
        return categoryToIconMap.default;
    }
    if (categories[0] in categoryToIconMap) {
        return categoryToIconMap[categories[0]];
    }
    return categoryToIconMap.default;
};

module.exports = {
    loadModule,
    loadModuleByName,
    loadModules,
    moduleDir,
    getModuleDocStructure,
    categoryToIconMap,
    getIcon
};

interface IDisposable {
    dispose(): void;
}

const loadedTypings: Record<string, Array<IDisposable>> = {};

const addTypedefs = async function addTypedefs(module: ICatmodMeta): Promise<void> {
    const fs = require('fs-extra'),
          path = require('path');
    const typedefPath = path.join(module.path, 'types.d.ts');
    const ts = (window as any).monaco.languages.typescript;
    if (await fs.pathExists(typedefPath)) {
        fs.readFile(typedefPath, 'utf8')
        .then((catmodTypedefs: string) => {
            loadedTypings[module.name] = [
                ts.javascriptDefaults.addExtraLib(catmodTypedefs),
                ts.typescriptDefaults.addExtraLib(catmodTypedefs)
            ];
        });
    } else {
        // generate dummy typedefs if none were provided by the module
        const catmodTypedefs = `declare namespace ct {\n/** Sorry, no in-code docs for this module :c */\n var ${module.name}: any; }`;
        loadedTypings[module.name] = [
            ts.javascriptDefaults.addExtraLib(catmodTypedefs),
            ts.typescriptDefaults.addExtraLib(catmodTypedefs)
        ];
    }
};

const removeTypedefs = function removeTypedefs(module: ICatmodMeta): void {
    if (loadedTypings[module.name]) {
        for (const lib of loadedTypings[module.name]) {
            lib.dispose();
        }
    }
    delete loadedTypings[module.name];
};

const loadAllTypedefs = async function loadAllTypedefs(): Promise<void> {
    const {loadModules} = require('.');
    for (const module of await loadModules()) {
        if (!(module.name in global.currentProject.libs)) {
            continue;
        }
        addTypedefs(module);
    }
};

const resetTypedefs = function resetTypedefs(): void {
    for (const i in loadedTypings) {
        for (const lib of loadedTypings[i]) {
            lib.dispose();
        }
        delete loadedTypings[i];
    }
};

export {
    addTypedefs,
    removeTypedefs,
    loadAllTypedefs,
    resetTypedefs
};

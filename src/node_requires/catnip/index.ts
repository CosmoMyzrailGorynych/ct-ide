import fs from 'fs-extra';
import {join} from 'path';

import {getModulePathByName, loadModuleByName} from '../resources/modules';
import {convertFromDtsToBlocks} from './blockUtils';
import {parseFile} from './declarationExtractor';
import {getByPath} from '../i18n';

import propsVarsBlocks from './stdLib/propsVars';
import logicBlocks from './stdLib/logic';
import movementBlocks from './stdLib/movement';
import appearanceBlocks from './stdLib/appearance';
import actionsBlocks from './stdLib/actions';
import cameraBlocks from './stdLib/camera';
import mathBlocks from './stdLib/math';
import objectsBlocks from './stdLib/objects';
import miscBlocks from './stdLib/misc';
import consoleBlocks from './stdLib/console';
import stringsBlocks from './stdLib/strings';
import arraysBlocks from './stdLib/arrays';
import hiddenBlocks from './stdLib/hiddenBlocks';
import {loadBlocks} from './stdLib/ctjsApi';

const builtinBlockLibrary: blockMenu[] = [{
    name: 'Properties and variables',
    items: propsVarsBlocks,
    i18nKey: 'propsVars',
    opened: true,
    icon: 'archive',
    hidden: true
}, {
    name: 'Movement',
    items: movementBlocks,
    i18nKey: 'movement',
    opened: true,
    icon: 'move'
}, {
    name: 'Appearance',
    items: appearanceBlocks,
    i18nKey: 'appearance',
    opened: true,
    icon: 'droplet'
}, {
    name: 'Actions',
    items: actionsBlocks,
    i18nKey: 'actions',
    opened: true,
    icon: 'airplay'
}, {
    name: 'Camera',
    items: cameraBlocks,
    i18nKey: 'camera',
    opened: true,
    icon: 'camera'
}, {
    name: 'Logic',
    items: logicBlocks,
    i18nKey: 'logic',
    opened: true,
    icon: 'help-circle'
}, {
    name: 'Math',
    items: mathBlocks,
    i18nKey: 'math',
    opened: true,
    icon: 'sort-numerically'
}, {
    name: 'Strings',
    items: stringsBlocks,
    i18nKey: 'strings',
    opened: true,
    icon: 'string'
}, {
    name: 'Objects',
    items: objectsBlocks,
    i18nKey: 'objects',
    opened: true,
    icon: 'code-alt'
}, {
    name: 'Arrays',
    items: arraysBlocks,
    i18nKey: 'arrays',
    opened: true,
    icon: 'grid'
}, {
    name: 'Miscellaneous',
    items: miscBlocks,
    i18nKey: 'misc',
    opened: true
}, {
    name: 'Console',
    icon: 'terminal',
    items: consoleBlocks,
    i18nKey: 'console',
    opened: true
}];
let ctjsApiMenus: blockMenu[];
loadBlocks().then(menus => {
    ctjsApiMenus = menus;
    builtinBlockLibrary.splice(4, 0, ...menus);
});

export const getCtjsI18nKeys = (): void => {
    const nameKeys: string[] = [],
          displayNameKeys: string[] = [];
    for (const menu of ctjsApiMenus) {
        for (const item of menu.items) {
            nameKeys.push(item.i18nKey);
            if (item.displayI18nKey) {
                displayNameKeys.push(item.displayI18nKey);
            }
        }
    }
    // eslint-disable-next-line no-console
    console.log(nameKeys.join('\n'));
    // eslint-disable-next-line no-console
    console.log(displayNameKeys.join('\n'));
};

/** An array of categories of blocks to be used in UI */
export const blocksLibrary: blockMenu[] = [];
/** A flat map of all the currently known blocks' declarations */
export const blocksRegistry: Map<string, blockDeclaration> = new Map();

// Fuzzy search
import {default as Fuse, IFuseOptions, FuseIndex} from 'node_modules/fuse.js';
const fuseOptions: IFuseOptions<blockDeclaration> = {
    keys: [{
        name: 'bakedName',
        weight: 0.7
    }, {
        name: 'lib',
        weight: 0.3
    }],
    findAllMatches: true,
    threshold: 0.3
};
let fuseIndex: FuseIndex<blockDeclaration>,
    fuseCollection: blockDeclaration[];
const recreateFuseIndex = () => {
    fuseCollection = [...blocksRegistry.values()];
    fuseCollection.forEach(block => {
        block.bakedName = block.i18nKey ?
            (getByPath('catnip.blockNames.' + block.i18nKey) as string ?? block.name) :
            block.name;
    });
    fuseIndex = Fuse.createIndex(fuseOptions.keys, fuseCollection);
};
export const searchBlocks = (query: string): blockDeclaration[] => {
    const fuse = new Fuse(fuseCollection, fuseOptions, fuseIndex);
    return fuse.search(query).map(result => result.item);
};

const addBlockToRegistry = (block: blockDeclaration): void => {
    blocksRegistry.set(`${block.lib}@@${block.code}`, block);
};
const removeBlockFromRegistry = (block: blockDeclaration): void => {
    blocksRegistry.delete(`${block.lib}@@${block.code}`);
};
export const getDeclaration = (lib: string, code: string): blockDeclaration => {
    if (!blocksRegistry.has(`${lib}@@${code}`)) {
        throw new Error(`[catnip] Could not find block declaration for ${lib}@@${code}. Do you have ${lib} catmod enabled?`);
    }
    return blocksRegistry.get(`${lib}@@${code}`);
};

const loadBuiltinBlocks = (): void => {
    blocksLibrary.push(...builtinBlockLibrary);
    for (const category of builtinBlockLibrary) {
        category.items.forEach(addBlockToRegistry);
    }
    hiddenBlocks.forEach(addBlockToRegistry);
};


const isFunction = (value: unknown) => (value ?
    (Object.prototype.toString.call(value) === '[object Function]' ||
    typeof value === 'function' ||
    value instanceof Function
    ) :
    false);
const validateBlocks = (
    blocks: (blockDeclaration | Record<string, unknown>)[],
    blocksPath: string
) => {
    for (const block of blocks) {
        if (typeof block !== 'object') {
            throw new Error(`[catnip] ${blocksPath} has a value ${block} that is not an object.`);
        }
        const keys = Object.keys(block) as (keyof blockDeclaration)[];
        for (const required of (['name', 'type', 'code'] as (keyof blockDeclaration)[])) {
            if (!keys.includes(required as keyof blockDeclaration)) {
                throw new Error(`[catnip] ${blocksPath} has a block ${block.name} that does not have a required parameter ${required}.`);
            }
            if (typeof block[required] !== 'string') {
                throw new Error(`[catnip] ${blocksPath} in block ${block.name} the parameter ${required} is not a string.`);
            }
        }
        if (!('jsTemplate' in block)) {
            throw new Error(`[catnip] ${blocksPath} has a block ${block.name} that does not have a required parameter jsTemplate.`);
        }
        if (!isFunction(block.jsTemplate)) {
            throw new Error(`[catnip] ${blocksPath} in block ${block.name} the parameter jsTemplate is not a function.`);
        }
        if (!('pieces' in block)) {
            throw new Error(`[catnip] ${blocksPath} has a block ${block.name} that does not have a required parameter pieces.`);
        }
        if (!Array.isArray(block.pieces)) {
            throw new Error(`[catnip] ${blocksPath} in block ${block.name} the parameter pieces that is not an array.`);
        }
    }
};


/**
 * Used for cleanup during disabling catmods; maps module names to their category of blocks.
 */
const loadedCategories: Map<string, blockMenu> = new Map();
export const loadModdedBlocks = async (modName: string, noIndex?: boolean) => {
    const meta = await loadModuleByName(modName);
    const dtsPath = join(getModulePathByName(modName), 'types.d.ts');
    const blocksPath = join(getModulePathByName(modName), 'blocks.js');
    const category: blockMenu = {
        name: modName,
        items: [],
        opened: false,
        i18nKey: modName,
        icon: meta.main.icon || 'grid-random'
    };
    try {
        await fs.access(blocksPath, fs.constants.R_OK);
        const blocks = require(blocksPath);
        if (!Array.isArray(blocks)) {
            throw new Error(`[catnip] ${blocksPath} is not a module that returns an array.`);
        }
        category.items.push(...blocks);
        validateBlocks(blocks, blocksPath);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error(err);
        }
    }
    try {
        await fs.access(dtsPath, fs.constants.R_OK);
        const usefuls = await parseFile(dtsPath);
        const blocks = convertFromDtsToBlocks(usefuls, modName);
        category.items.push(...blocks);
    } catch (oO) {
        void oO;
    }
    if (category.items.length) {
        category.items.forEach(block => {
            if (block.category) {
                const host = blocksLibrary.find(cat => cat.name === block.category);
                if (host) {
                    host.items.push(block);
                }
            }
            if (!block.icon) {
                block.icon = meta.main.icon || 'grid-random';
            }
        });
        category.items.forEach(addBlockToRegistry);
        loadedCategories.set(modName, category);
        blocksLibrary.push(category);
    } else {
        console.debug(`[catnip] Skipping the catmod ${modName} as it doesn't have valid blocks to add.`);
    }
    if (!noIndex) {
        recreateFuseIndex();
    }
};

export const unloadModdedBlocks = (modName: string) => {
    if (loadedCategories.has(modName)) {
        const cat = loadedCategories.get(modName);
        blocksLibrary.splice(blocksLibrary.indexOf(cat), 1);
        cat.items.forEach(removeBlockFromRegistry);
        cat.items.forEach(block => {
            if (block.category) {
                const host = blocksLibrary.find(cat => cat.name === block.category);
                if (host && host.items.includes(block)) {
                    host.items.splice(host.items.indexOf(block), 1);
                }
            }
        });
    }
    loadedCategories.delete(modName);
    recreateFuseIndex();
};
/**
 * Resets the list of modded blocks and loads all the blocks from the enabled modules.
 */
export const loadAllBlocks = async (project: IProject) => {
    blocksLibrary.length = 0;
    for (const [name] of loadedCategories) {
        unloadModdedBlocks(name);
    }
    loadedCategories.clear();
    blocksRegistry.clear();
    loadBuiltinBlocks();
    await Promise.all(Object.keys(project.libs).map(lib => loadModdedBlocks(lib, true)));
    recreateFuseIndex();
};


let transmittedBlocks: IBlock[] = [];
let transmissionSource: (IBlock | 'MARKER')[] | Record<string, IBlock> = [];
let transmissionSourceKey: string;
let cloningMode = false;
let transmissionType: blockDeclaration['type'];
export const getTransmissionType = () => transmissionType;
export const getTransmissionReturnVal = () => {
    const declaration = getDeclaration(
        transmittedBlocks[0].lib,
        transmittedBlocks[0].code
    ) as IBlockComputedDeclaration;
    return declaration.typeHint;
};
/** A block after which a (+) indicator will be placed */
let suggestedTarget: IBlock;
export const getSuggestedTarget = () => suggestedTarget;
export const setSuggestedTarget = (target?: IBlock) => (suggestedTarget = target);

export const startBlocksTransmit = (
    blocks: IBlock[],
    source: typeof transmissionSource,
    key?: string,
    cloning?: boolean
) => {
    transmittedBlocks = blocks;
    transmissionType = getDeclaration(blocks[0].lib, blocks[0].code).type;
    transmissionSource = source;
    transmissionSourceKey = key;
    cloningMode = Boolean(cloning);
};
export const endBlocksTransmit = (
    destination: typeof transmissionSource,
    index: number | string
) => {
    if (!cloningMode) {
        // Remove from the old object
        if (Array.isArray(transmissionSource)) {
            for (const block of transmittedBlocks) {
                // Remove the source blocks but put a marker in place of it
                // to maintain positions while reordering blocks inside the same container.
                transmissionSource.splice(transmissionSource.indexOf(block), 1, 'MARKER');
            }
        } else {
            delete transmissionSource[transmissionSourceKey];
        }
    } else {
        transmittedBlocks = structuredClone(transmittedBlocks);
    }
    if (Array.isArray(destination)) {
        destination.splice(index as number, 0, ...transmittedBlocks);
    } else {
        [destination[index]] = transmittedBlocks;
    }
    if (!cloningMode && Array.isArray(transmissionSource)) {
        while (transmissionSource.includes('MARKER')) {
            transmissionSource.splice(transmissionSource.indexOf('MARKER'), 1);
        }
    }
    suggestedTarget = void 0;
    window.signals.trigger('blockTransmissionEnd');
};
export const blockFromDeclaration = (declaration: blockDeclaration): IBlock => {
    const block: IBlock = {
        lib: declaration.lib,
        code: declaration.code,
        values: {}
    };
    for (const piece of declaration.pieces) {
        if (piece.type === 'blocks') {
            block.values[piece.key] = [] as IBlock[];
        }
    }
    return block;
};
export const insertBlock = (
    dest: BlockScript,
    pos: number,
    declaration: blockDeclaration
): void => {
    dest.splice(pos + 1, 0, blockFromDeclaration(declaration));
};
export const emptyTexture = document.createElement('canvas');
emptyTexture.width = emptyTexture.height = 1;


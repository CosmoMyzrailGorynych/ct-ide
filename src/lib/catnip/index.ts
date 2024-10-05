import fs from '../neutralino-fs-extra';
import {join} from 'path';

import {getModulePathByName, loadModuleByName} from '../resources/modules';
import {convertFromDtsToBlocks} from './blockUtils';
import {parseFile} from './declarationExtractor';
import {getByPath} from '../i18n';
import {getBehaviorFields} from '../events';

import {BlobCache} from '../blobCache';
const importsCache = new BlobCache();

import propsVarsBlocks from './stdLib/propsVars';
import logicBlocks from './stdLib/logic';
import movementBlocks from './stdLib/movement';
import appearanceBlocks from './stdLib/appearance';
import actionsBlocks from './stdLib/actions';
import cameraBlocks from './stdLib/camera';
import mathBlocks from './stdLib/math';
import timerBlocks from './stdLib/timers';
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
    name: 'Timers',
    items: timerBlocks,
    i18nKey: 'timers',
    opened: true,
    icon: 'clock'
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

/** A utility function for dumping all the i18n keys of built-in blocks */
export const getCtjsI18nKeys = (): void => {
    const nameKeys: string[] = [],
          displayNameKeys: string[] = [];
    for (const menu of ctjsApiMenus) {
        for (const item of menu.items) {
            if (item.i18nKey) {
                nameKeys.push(item.i18nKey);
            }
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
import {default as Fuse, IFuseOptions, FuseIndex} from 'fuse.js';
import {getByTypes} from '../resources';
const fuseOptions: IFuseOptions<blockDeclaration> = {
    keys: [{
        name: 'bakedName',
        weight: 1
    }, {
        name: 'name',
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
    fuseIndex = Fuse.createIndex(fuseOptions.keys!, fuseCollection);
};
export const searchBlocks = (query: string): blockDeclaration[] => {
    const fuse = new Fuse(fuseCollection, fuseOptions, fuseIndex);
    return fuse
        .search(query)
        .map(result => result.item)
        .filter(block => block.lib !== 'core.hidden');
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
    return blocksRegistry.get(`${lib}@@${code}`)!;
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
        const blocks = (await import(await importsCache.getUrl(blocksPath))).default;
        if (!Array.isArray(blocks)) {
            throw new Error(`[catnip] ${blocksPath} is not a module that returns an array.`);
        }
        category.items.push(...blocks);
        validateBlocks(blocks, blocksPath);
        for (const block of blocks) {
            if (!('lib' in block)) {
                block.lib = modName;
            }
        }
    } catch (err) {
        if (err.code !== 'NE_FS_FILRDER' && err.code !== 'NE_FS_NOPATHE') {
            console.error(err);
        }
    }
    try {
        await fs.access(dtsPath, fs.constants.R_OK);
        const usefuls = await parseFile(dtsPath, false);
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
        // eslint-disable-next-line no-console
        console.debug(`[catnip] Skipping the catmod ${modName} as it doesn't have valid blocks to add.`);
    }
    if (!noIndex) {
        recreateFuseIndex();
    }
};

export const unloadModdedBlocks = (modName: string) => {
    if (!loadedCategories.has(modName)) {
        return;
    }
    const cat = loadedCategories.get(modName)!;
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

/** A helper function that calls onblock on every block in the given script. */
export const walkOverScript = (script: IBlock[], onblock: (block: IBlock) => void) => {
    for (const block of script) {
        onblock(block);
        if (block.customOptions?.length) {
            for (const option of Object.values(block.customOptions)) {
                if (typeof option === 'object') {
                    onblock(option);
                }
            }
        }
        for (const value of Object.values(block.values)) {
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    walkOverScript(value, onblock);
                } else {
                    onblock(value);
                    walkOverScript([value], onblock);
                }
            }
        }
    }
};

/** Renames a given property or a variable in a script. */
export const renamePropVar = (script: IBlock[], eventData: {
    type: 'property' | 'variable' | 'global variable',
    from: string, // old name of the property/variable
    to: string // new name of the prop/var
}) => {
    walkOverScript(script, block => {
        if (block.lib === 'core.hidden' && block.code === eventData.type) {
            if (block.values.variableName === eventData.from) {
                block.values.variableName = eventData.to;
            }
        }
    });
};

// Listen to global variable renames and patch all relevant assets.
window.orders.on('catnipGlobalVarRename', (eventData: {
    type: 'global variable',
    from: string, // old name of the property/variable
    to: string // new name of the prop/var
}) => {
    const assets = getByTypes();
    for (const group of [assets.room, assets.template, assets.behavior]) {
        for (const asset of group) {
            for (const event of asset.events) {
                renamePropVar(event.code as BlockScript, {
                    type: 'global variable',
                    from: eventData.from,
                    to: eventData.to
                });
            }
        }
    }
    for (const script of assets.script) {
        if (script.language !== 'catnip') {
            continue;
        }
        renamePropVar(script.code as BlockScript, {
            type: 'global variable',
            from: eventData.from,
            to: eventData.to
        });
    }
});

// Shared variables for blocks' drag and drop operations.
let transmittedBlocks: IBlock[] = [];
let transmissionSource: (IBlock | 'MARKER')[] | Record<string, IBlock> = [];
let transmissionSourceKey: string | undefined;
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
let suggestedTarget: IBlock | IBlock[] | undefined;
export const getSuggestedTarget = () => suggestedTarget;
export const setSuggestedTarget = (target?: IBlock | IBlock[] | undefined) =>
    (suggestedTarget = target);

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
        } else if (transmissionSourceKey) {
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

const migrateValues = (from: IBlock, to: IBlock) => {
    to.values = from.values;
    if (from.customOptions) {
        to.customOptions = from.customOptions;
    }
};
/**
 * Intended to be used for mutators in blocks' context menus; this function replaces one block
 * to another in a given block list or block's values.
 * Values of the old block are transferred onto the new block, and the old block is removed.
 */
export const mutate = (
    dest: BlockScript | IBlock,
    key: number | string,
    mutator: {
        lib: string,
        code: string
    },
    customOptions?: boolean
): void => {
    const newDeclaration = getDeclaration(mutator.lib, mutator.code);
    const newBlock = blockFromDeclaration(newDeclaration);
    if (Array.isArray(dest)) {
        const pos = key as number;
        migrateValues(dest[pos], newBlock);
        dest.splice(pos, 1, newBlock);
    } else if (customOptions && dest.customOptions) {
        const prevBlock = dest.customOptions[key] as IBlock;
        migrateValues(prevBlock, newBlock);
        dest.customOptions[key] = newBlock;
    } else {
        const prevBlock = dest.values[key] as IBlock;
        migrateValues(prevBlock, newBlock);
        dest.values[key] = newBlock;
    }
    for (const piece of newDeclaration.pieces) {
        if (piece.type === 'blocks' && !Array.isArray(newBlock.values[piece.key])) {
            newBlock.values[piece.key] = [];
        }
    }
};
export const emptyTexture = document.createElement('canvas');
emptyTexture.width = emptyTexture.height = 1;

export const getMenuMutators = (
    block: IBlock,
    callback: (affixedData: {mutator: blockDeclaration}) => void
): IMenuItem[] | false => {
    const declaration = getDeclaration(block.lib, block.code);
    if (!declaration.mutators || !declaration.mutators.length) {
        return false;
    }
    return declaration.mutators.map(m => {
        const mDeclaration = getDeclaration(m.lib, m.code);
        return {
            label: getByPath('catnip.changeBlockTo').replace('$1', mDeclaration.bakedName),
            icon: mDeclaration.icon,
            click: callback,
            affixedData: {
                mutator: mDeclaration
            }
        };
    });
};

/** Removes blocks that are children of other blocks. */
const getTopBlocks = (blocks: IBlock[]): IBlock[] => {
    const out = [...blocks];
    if (out.length > 1) {
        const toRemove: IBlock[] = [];
        const traverseValues = (block: IBlock) => {
            for (const value of Object.values(block.values)) {
                if (Array.isArray(value)) { // This is a block script
                    for (const child of value) {
                        if (out.includes(child)) {
                            toRemove.push(child);
                        } else {
                            traverseValues(child);
                        }
                    }
                }
            }
        };
        blocks.forEach(traverseValues);
        for (const block of toRemove) {
            blocks.splice(blocks.indexOf(block), 1);
        }
    }
    return out;
};

let clipboard: IBlock[] | null = null;
export const copy = (blocks: IBlock[]) => {
    clipboard = structuredClone(getTopBlocks(blocks));
};
export const canPaste = (target: blockArgumentType | 'script'): boolean => {
    if (clipboard === null) {
        return false;
    }
    const declaration = getDeclaration(clipboard[0].lib, clipboard[0].code);
    if (target === 'script' && declaration.type === 'command') {
        return true;
    }
    if (target !== 'script' && declaration.type === 'computed' &&
        (target === declaration.typeHint || declaration.typeHint === 'wildcard' || target === 'wildcard')) {
        return true;
    }
    return false;
};
export const paste = (
    target: IBlock | BlockScript,
    index: number | string,
    owningAsset: IScriptable,
    owningEvent: IScriptableEvent,
    customOptions?: boolean
): void => {
    if (Array.isArray(target)) {
        if (!canPaste('script')) {
            throw new Error('[catnip] Attempt to paste into a script with an invalid clipboard.');
        }
    }
    // Fist step: Find all the used variables and props and match them
    // with variables and behaviors' and regular props of the current asset.
    // Use behavior props when possible, and add missing props and variables.
    const vars = new Set<string>(),
          props = new Set<string>();
    const behaviorFields = getBehaviorFields(owningAsset);
    const convertToBh = new Set<string>();
    walkOverScript(clipboard!, block => {
        // Filter out visible blocks as props and vars are in a hidden group
        if (block.lib !== 'core.hidden') {
            return;
        }
        // Handle behaviors' and regular props
        if (block.code === 'property' || block.code === 'behavior property') {
            const propName = block.values.variableName as string;
            // If the asset has a behavior prop with the same name,
            // convert this prop to behavior prop later
            if (behaviorFields.includes(propName)) {
                convertToBh.add(propName);
            } else {
                props.add(propName);
            }
        } else if (block.code === 'variable') {
            // Handle variables
            vars.add(block.values.variableName as string);
        }
    });
    // Add missing variables
    for (const varName of vars) {
        if (!('variables' in owningEvent)) {
            owningEvent.variables = [];
        }
        if (!owningEvent.variables!.includes(varName)) {
            owningEvent.variables!.push(varName);
        }
    }
    // Add missing props
    for (const propName of props) {
        if (!('properties' in owningAsset)) {
            owningAsset.properties = [];
        }
        if (!owningAsset.properties!.includes(propName)) {
            owningAsset.properties!.push(propName);
        }
    }

    /**
     * @returns A copy with regular properties replaced with behavior properties where possible.
     */
    const patchProps = (contents: IBlock | IBlock[]) => {
        const copy = structuredClone(contents);
        walkOverScript(Array.isArray(copy) ? copy : [copy], block => {
            if (block.lib === 'core.hidden' && block.code === 'property') {
                if (convertToBh.has(block.values.variableName as string)) {
                    block.code = 'behavior property';
                }
            }
        });
        return copy;
    };

    // Actually paste stuff
    if (Array.isArray(target)) { // The target is a block list
        target.splice(index as number, 0, ...(patchProps(clipboard!) as IBlock[]));
        window.signals.trigger('rerenderCatnipLibrary');
        return;
    }
    // The target is a block
    const block = target as IBlock;
    if (customOptions) {
        // eslint-disable-next-line prefer-destructuring
        block.customOptions![index as string] = patchProps(clipboard![0]) as IBlock;
    } else {
        // eslint-disable-next-line prefer-destructuring
        block.values[index as string] = patchProps(clipboard![0]) as IBlock;
    }
    window.signals.trigger('rerenderCatnipLibrary');
};

/*
    Code for implementing multiple selection and mass operattions.
    Multiple selection supports only command blocks.
*/
const multipleSelection = new Map<IBlock, IRiotTag>();
/**
 * Redraws all the selected blocks' parents.
 * If oldBlocks is provided, only those blocks' parents will be redrawn;
 * otherwise it defaults to the current selection.
 */
export const redrawSelectedBlocks = (
    toUpdate = [...multipleSelection.keys()],
    map = multipleSelection
): void => {
    // Redraw as little as possible
    const blocks = getTopBlocks(toUpdate);
    const alreadyUpdated = new Set<IRiotTag>();
    for (const block of blocks) {
        const riotTag = map.get(block)!;
        if (!alreadyUpdated.has(riotTag)) {
            if (riotTag.parent) {
                riotTag.parent.update();
                alreadyUpdated.add(riotTag);
            }
        }
    }
};
export const addToSelection = (block: IBlock, riotTag: IRiotTag) => {
    multipleSelection.set(block, riotTag);
    riotTag.parent.update();
};
export const setSelection = (block: IBlock, riotTag: IRiotTag): void => {
    const previouslySelected = [...multipleSelection.keys()],
          previousMap = new Map(multipleSelection);
    multipleSelection.clear();
    multipleSelection.set(block, riotTag);
    redrawSelectedBlocks(previouslySelected, previousMap);
};
export const isSelected = (block: IBlock): boolean => multipleSelection.has(block);
export const isAnythingSelected = (): boolean => multipleSelection.size > 0;
export const removeFromSelection = (block: IBlock): void => {
    const previouslySelected = [...multipleSelection.keys()],
          previousMap = new Map(multipleSelection);
    multipleSelection.delete(block);
    redrawSelectedBlocks(previouslySelected, previousMap);
};
export const toggleSelection = (block: IBlock, riotTag: IRiotTag): void => {
    if (isSelected(block)) {
        removeFromSelection(block);
    } else {
        addToSelection(block, riotTag);
    }
};
export const clearSelection = (): void => {
    const previouslySelected = [...multipleSelection.keys()],
          previousMap = new Map(multipleSelection);
    multipleSelection.clear();
    redrawSelectedBlocks(previouslySelected, previousMap);
};
export const copySelected = () => {
    clipboard = structuredClone(getTopBlocks([...multipleSelection.keys()]));
};
export const getSelectionHTML = (): void => {
    const html = [];
    const dummy = document.createElement('catnip-block');
    for (const [, riotTag] of multipleSelection) {
        html.push(riotTag.html);
        dummy.innerHTML = riotTag.root.innerHTML;
        // cleanup unneeded tags or attributes
        dummy.querySelectorAll('catnip-insert-mark, context-menu').forEach(t => t.remove());
        for (const attr of ['showplaceholder', 'placeholder', 'title', 'ref', 'draggable']) {
            dummy.querySelectorAll(`[${attr}]`).forEach(t => t.removeAttribute(attr));
        }
        dummy.querySelectorAll('input, textarea').forEach(t => t.setAttribute('readonly', 'readonly'));
        dummy.querySelectorAll('img').forEach(t => {
            const img = document.createElement('img');
            img.src = '/assets/icons/image.svg';
            img.className = 'feather';
            t.parentNode!.insertBefore(img, t);
            t.remove();
        });
        dummy.querySelectorAll('svg').forEach(t => {
            const img = document.createElement('img');
            const name = t.children[0].getAttribute('xlink:href')!.slice(1);
            img.src = `/assets/icons/${name}.svg`;
            img.className = 'feather';
            t.parentNode!.insertBefore(img, t);
            t.remove();
        });
        dummy.className = riotTag.root.className;
        html.push(dummy.outerHTML);
    }
    navigator.clipboard.writeText(html.join('\n'));
};
export const removeSelectedBlocks = (): void => {
    const blocks = getTopBlocks([...multipleSelection.keys()]);
    for (const block of blocks) {
        const riotTag = multipleSelection.get(block)!;
        const parentsBlocks = riotTag.parent.opts.blocks as IBlock[];
        (parentsBlocks).splice(parentsBlocks.indexOf(block), 1);
    }
    clearSelection();
};

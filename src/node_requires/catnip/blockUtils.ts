/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {usableDeclaration} from './declarationExtractor';

const specials = /[_.]/g;
const camels = /(\w)([A-Z])/g;
export const niceBlockName = (name: string, lowercase?: boolean): string => {
    name = name.replace(specials, ' ')
               .replace(camels, val => `${val[0]} ${val[1].toLocaleLowerCase()}`);
    if (!lowercase) {
        return name.charAt(0).toLocaleUpperCase() + name.slice(1);
    }
    return name;
};

const sortHelper = {
    command: -1,
    computed: 1
};

const supportedTypes = ['string', 'number', 'boolean', 'wildcard', 'function'];

const getPieces = (piecesAssets: Record<string, resourceType | 'action'>, useful: usableDeclaration): (IBlockPieceArgument | IBlockPieceBlocks)[] =>
    (useful.kind === 'function' ? useful.args : []).map(arg => {
        if (arg.type === 'BLOCKS') {
            return {
                type: 'blocks',
                key: arg.name
            };
        }
        return {
            type: 'argument' as const,
            key: arg.name,
            typeHint: supportedTypes.includes(arg.type) ? arg.type : 'wildcard',
            assets: piecesAssets[arg.name],
            required: arg.required
        };
    });

const stringifyArg = (values: Record<string, string>) => (arg: {
    type: blockArgumentType | 'BLOCKS';
    name: string;
}) => {
    if (arg.type === 'BLOCKS') {
        return `function () {\n    ${values[arg.name]}\n}`;
    }
    return values[arg.name];
};

export const convertFromDtsToBlocks = (usefuls: usableDeclaration[], lib: 'core' | string, icon?: string):
(IBlockCommandDeclaration | IBlockComputedDeclaration)[] => {
    const knownCodes = new Set<string>();
    const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [];
    // eslint-disable-next-line no-labels
    onusefulLoop: for (const useful of usefuls) {
        if (knownCodes.has(useful.name)) {
            continue; // Skip duplicates (these usually happen due to several methods' overloads)
        } else {
            knownCodes.add(useful.name);
        }
        let documentation = useful.description,
            name = niceBlockName(useful.name),
            displayName: string | undefined;
        const piecesAssets: Record<string, resourceType | 'action'> = {};
        const piecesDefaults: Record<string, string | number | boolean> = {};
        const extraNames: Record<string, string> = {};
        let returnSave = false,
            promise: false | 'both' | 'catch' | 'then' = false,
            promiseSave: blockArgumentType | false = false,
            listType: resourceType | false = false;
        if (useful.jsDoc) {
            for (const jsDoc of useful.jsDoc) {
                if (!jsDoc.tags) {
                    continue;
                }
                documentation += '\n';
                for (const node of jsDoc.tags) {
                    if (node.tagName.escapedText === 'param') {
                        documentation += `\n**${(node as any).name.escapedText}** ${node.comment}`;
                    } else if (node.tagName.escapedText === 'returns' || node.tagName.escapedText === 'return') {
                        documentation += `\n\n**Returns** ${node.comment}`;
                    } else if (node.tagName.escapedText === 'catnipIgnore') {
                        // eslint-disable-next-line no-labels
                        continue onusefulLoop;
                    } else if (node.tagName.escapedText === 'catnipLabel' && node.comment) {
                        displayName = node.comment?.toString();
                    } else if (node.tagName.escapedText === 'catnipName' && node.comment) {
                        name = node.comment.toString();
                    } else if (String(node.tagName.escapedText).startsWith('catnipName_') && node.comment) {
                        const key = String(node.tagName.escapedText).replace('catnipName_', 'name_');
                        extraNames[key] = node.comment.toString().trim();
                    } else if (String(node.tagName.escapedText).startsWith('catnipLabel_') && node.comment) {
                        const key = String(node.tagName.escapedText).replace('catnipLabel_', 'displayName_');
                        extraNames[key] = node.comment.toString().trim();
                    } else if (node.tagName.escapedText === 'catnipIcon' && node.comment) {
                        icon = node.comment.toString();
                    } else if (node.tagName.escapedText === 'catnipAsset' && node.comment) {
                        let [key, assetType] = node.comment.toString().split(':');
                        key = key.trim();
                        assetType = assetType.trim();
                        piecesAssets[key] = assetType as resourceType | 'action';
                    } else if (node.tagName.escapedText === 'catnipDefault' && node.comment) {
                        let [key, value] = node.comment.toString().split(':');
                        key = key.trim();
                        value = value.trim();
                        if (isFinite(Number(value))) {
                            piecesDefaults[key] = Number(value);
                        } else if (value === 'true') {
                            piecesDefaults[key] = true;
                        } else if (value === 'false') {
                            piecesDefaults[key] = false;
                        } else {
                            piecesDefaults[key] = value;
                        }
                    } else if (node.tagName.escapedText === 'catnipList' && node.comment) {
                        listType = node.comment.toString().trim() as resourceType;
                        icon = 'grid';
                    } else if (node.tagName.escapedText === 'catnipSaveReturn') {
                        returnSave = true;
                    } else if (node.tagName.escapedText === 'catnipPromise') {
                        const raw = node.comment?.toString().trim();
                        if (raw === 'catch') {
                            promise = 'catch';
                        } else if (raw === 'then') {
                            promise = 'then';
                        } else {
                            promise = 'both';
                        }
                    } else if (node.tagName.escapedText === 'catnipPromiseSave' && node.comment) {
                        promiseSave = node.comment.toString().trim() as blockArgumentType || 'wildcard';
                    }
                }
            }
        }
        let isCommand = useful.kind === 'function' && (!useful.returnType || useful.returnType === 'void');
        if (returnSave || promise) {
            isCommand = true;
        }
        if (!displayName) {
            displayName = name;
        }
        const draft = {
            code: useful.name,
            lib,
            type: isCommand ? 'command' : 'computed',
            typeHint: useful.returnType,
            name: isCommand ? name.slice(0, 1).toUpperCase() + name.slice(1) : name.toLowerCase(),
            displayName: displayName && (isCommand ?
                displayName.slice(0, 1).toUpperCase() + displayName.slice(1) :
                displayName.toLowerCase()),
            ...extraNames,
            documentation,
            pieces: getPieces(piecesAssets, useful)
        } as Omit<IBlockComputedDeclaration, 'jsTemplate'> & Partial<Pick<IBlockComputedDeclaration, 'jsTemplate'>>;
        if (icon) {
            draft.icon = icon;
        }
        if (listType) {
            draft.pieces.push({
                type: 'argument',
                key: 'list',
                typeHint: 'wildcard',
                assets: listType
            });
        }
        if (returnSave || promiseSave) {
            draft.pieces.push({
                type: 'filler'
            }, {
                type: 'label',
                name: 'store in',
                i18nKey: 'store in'
            }, {
                type: 'argument',
                key: 'return',
                typeHint: promiseSave || 'wildcard'
            });
            if (promiseSave) {
                draft.pieces.push({
                    type: 'asyncMarker'
                });
            }
        } else if (promise) {
            draft.pieces.push({
                type: 'filler'
            }, {
                type: 'asyncMarker'
            });
        }
        if (promise) {
            if (promise === 'then' || promise === 'both') {
                draft.pieces.push({
                    type: 'break'
                }, {
                    type: 'icon',
                    icon: 'redo'
                }, {
                    type: 'label',
                    name: 'then',
                    i18nKey: 'then'
                }, {
                    type: 'blocks',
                    placeholder: 'do nothing',
                    key: 'then'
                });
            }
            if (promise === 'catch' || promise === 'both') {
                draft.pieces.push({
                    type: 'break'
                }, {
                    type: 'icon',
                    icon: 'alert-octagon'
                }, {
                    type: 'label',
                    name: 'catch',
                    i18nKey: 'catch'
                }, {
                    type: 'blocks',
                    placeholder: 'do nothing',
                    key: 'catch'
                });
            }
        }
        if (useful.kind === 'prop') {
            if (listType) {
                draft.jsTemplate = vals => `${useful.name}[${vals.list}]`;
            } else {
                draft.jsTemplate = () => useful.name;
            }
        } else {
            const {name, args} = useful;
            if (returnSave) {
                draft.jsTemplate = values => {
                    if (values.return && values.return !== 'undefined') {
                        return `${values.return} = ${name}(${args.map(stringifyArg(values)).join(', ')});`;
                    }
                    return `${name}(${args.map(stringifyArg(values)).join(', ')});`;
                };
            } else if (promise) {
                if (promise === 'catch') {
                    draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                    .catch(() => {
                        ${values.catch}
                    });`;
                } else if (promise === 'then') {
                    if (promiseSave) {
                        draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                        .then(val => {
                            ${values.return} = val;
                            ${values.then}
                        });`;
                    } else {
                        draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                        .then(() => {
                            ${values.then}
                        });`;
                    }
                } else if (promiseSave) { // promise === 'both'
                    draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                    .then(val => {
                        ${values.return} = val;
                        ${values.then}
                    }).catch(() => {
                        ${values.catch}
                    });`;
                } else {
                    draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                    .then(() => {
                        ${values.then}
                    }).catch(() => {
                        ${values.catch}
                    });`;
                }
            } else if (isCommand) {
                draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')});`;
            } else {
                draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})`;
            }
        }
        blocks.push(draft as IBlockComputedDeclaration | IBlockCommandDeclaration);
    }
    blocks.sort((a, b) => sortHelper[a.type] - sortHelper[b.type]);
    return blocks;
};

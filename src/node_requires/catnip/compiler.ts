/* eslint-disable complexity */
/* eslint-disable max-depth */
import {getDeclaration} from '.';
import {ExporterError} from '../exporter/ExporterError';
import {getName, getById} from '../resources';

const jsConstants = ['true', 'false', 'null', 'undefined', 'Infinity', '-Infinity', 'NaN'];
const stringifyConstWildcard = (value: string): string => {
    if (isFinite(Number(value))) {
        return String(Number(value));
    } else if (jsConstants.includes(value)) {
        return value;
    }
    return JSON.stringify(value);
};
const writeArgumentlike = (
    piece: IBlockPieceArgument | IBlockOptions['options'][0],
    valuesIn: argumentValues,
    valuesOut: Record<string, string>,
    declaration: blockDeclaration,
    failureMeta: {
        eventKey: string,
        resourceId: assetRef,
        resourceName: string,
        resourceType: resourceType
    }
) => {
    const valueIn = valuesIn[piece.key];
    if (typeof valueIn === 'object') {
        // eslint-disable-next-line no-use-before-define
        valuesOut[piece.key] = compile([valueIn as IBlock], failureMeta);
    } else if (piece.assets && piece.assets !== 'action') {
        try {
            valuesOut[piece.key] = `'${getName(getById(piece.assets, valueIn as string))}'`;
        } catch (oO) {
            if (piece.required) {
                throw new ExporterError(`Required asset in field ${piece.key} of block "${declaration.name}" not found: ${valueIn}`, {
                    clue: 'blockArgumentMissing',
                    eventKey: failureMeta.eventKey,
                    resourceId: failureMeta.resourceId,
                    resourceName: failureMeta.resourceName,
                    resourceType: failureMeta.resourceType
                });
            } else {
                valuesOut[piece.key] = piece.defaultConstant ?? '-1';
            }
        }
    } else if (typeof valueIn === 'string') {
        if (piece.typeHint === 'wildcard') {
            valuesOut[piece.key] = stringifyConstWildcard(valueIn);
        } else if (piece.typeHint === 'color') {
            valuesOut[piece.key] = `0x${valueIn.slice(1)}`;
        } else {
            valuesOut[piece.key] = JSON.stringify(valueIn);
        }
    } else if (valuesOut[piece.key] === void 0 && piece.defaultConstant) {
        if (typeof piece.defaultConstant === 'number' ||
            typeof piece.defaultConstant !== 'string' ||
            piece.defaultConstant === 'this') {
            valuesOut[piece.key] = String(piece.defaultConstant);
        } else {
            valuesOut[piece.key] = `'${piece.defaultConstant}'`;
        }
    } else {
        // null, undefined and boolean values
        valuesOut[piece.key] = String(valueIn);
    }
};

let safeId = -1;
export const resetSafeId = () => {
    safeId = -1;
};
export const compile = (blocks: BlockScript, failureMeta: {
    eventKey: string,
    resourceId: assetRef,
    resourceName: string,
    resourceType: resourceType
}): string => {
    let result = '';
    for (const block of blocks) {
        let declaration;
        try {
            declaration = getDeclaration(block.lib, block.code);
        } catch (err) {
            throw new ExporterError(`Missing declaration for block "${block.code}" from library "${block.lib}"`, {
                clue: 'blockDeclarationMissing',
                eventKey: failureMeta.eventKey,
                resourceId: failureMeta.resourceId,
                resourceName: failureMeta.resourceName,
                resourceType: failureMeta.resourceType
            });
        }
        if (!declaration) {
            continue;
        }
        const values: Record<string, string> = {};
        for (const piece of declaration.pieces) {
            if (piece.type === 'argument') {
                writeArgumentlike(piece, block.values, values, declaration, failureMeta);
            } else if (piece.type === 'code' || piece.type === 'textbox') {
                values[piece.key] = String(block.values[piece.key] ?? '');
            } else if (piece.type === 'options') {
                for (const option of piece.options) {
                    writeArgumentlike(option, block.values, values, declaration, failureMeta);
                }
            } else if (piece.type === 'blocks') {
                const associatedVal = block.values[piece.key];
                values[piece.key] = compile(associatedVal as IBlock[] ?? [], failureMeta);
                if (values[piece.key] === 'undefined') {
                    values[piece.key] = '';
                }
            } else if (piece.type === 'propVar') {
                values.variableName = block.values.variableName as string;
            }
        }
        safeId++;
        const customOptions: Record<string, string> = {};
        if (block.customOptions) {
            for (const [key, value] of Object.entries(block.customOptions)) {
                if (typeof value === 'string') {
                    customOptions[key] = stringifyConstWildcard(value);
                } else {
                    customOptions[key] = compile([value], failureMeta);
                }
            }
        }
        result += declaration.jsTemplate(values, safeId, customOptions);
        if (blocks.length > 1) {
            result += '\n';
        }
    }
    return result;
};

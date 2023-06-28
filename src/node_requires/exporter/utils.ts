import {getById} from '../resources';

/**
 * Creates a copy of an extends object, turning UIDs of resources into the names of these resources.
 * Understands notations of `name@@template` and `name@@texture`.
 *
 * @param exts A flat map of extends.
 * @returns An object with unwrapped extends.
 */
export const getUnwrappedExtends = (exts: Record<string, unknown>): Record<string, unknown> => {
    if (typeof exts !== 'object') {
        // This is a primitive value
        return exts;
    }
    const out = {} as Record<string, unknown>;
    for (const i in exts) {
        if (Array.isArray(exts[i])) {
            // Recursively unwrap complex objects
            out[i] = (exts[i] as unknown[]).map(getUnwrappedExtends);
            continue;
        }
        const split = i.split('@@');
        if (split.length === 1) {
            out[i] = exts[i];
            continue;
        }
        const postfix = split.pop();
        const key = split.join('@@');
        if ((postfix === 'template' || postfix === 'texture') &&
            (exts[i] === void 0 || exts[i] === -1)) {
            // Skip unset values
            continue;
        }
        if (postfix === 'template' || postfix === 'texture') {
            try {
                out[key] = getById(postfix, String(exts[i])).name;
            } catch (e) {
                alertify.error(`Could not resolve UID ${exts[i]} for field ${key} as a ${postfix}. Returning -1.`);
                console.error(e);
                // eslint-disable-next-line no-console
                console.trace();
                out[key] = -1;
            }
        } else {
            // Seems to be an unsupported postfix. Output the old key as is.
            out[i] = exts[i];
        }
    }
    return out;
};

/**
 * Supports flat objects only.
 * A helper for a content function; unwraps IDs for assets
 * according to the provided specification for this content type.
 *
 * @param exts The object which fields should be unwrapped.
 * @param spec The field schema for this particular content type.
 * @returns The unwrapped object.
 */
export const getUnwrappedBySpec = (
    exts: Record<string, unknown>,
    spec: IContentType['specification']
): Record<string, unknown> => {
    const fieldMap = {} as Record<string, IContentType['specification'][0]>;
    for (const field of spec) {
        fieldMap[field.name || field.readableName] = field;
    }
    const out = {} as Record<string, unknown>;
    for (const i in exts) {
        if ((fieldMap[i].type === 'template' || fieldMap[i].type === 'texture') &&
            (exts[i] === void 0 || exts[i] === -1)) {
            // Skip unset values
            continue;
        }
        if (fieldMap[i].type === 'template' || fieldMap[i].type === 'texture') {
            if (fieldMap[i].array) {
                out[i] = (exts[i] as string[]).map(elt => {
                    try {
                        return getById(fieldMap[i].type as 'template' | 'texture', elt).name;
                    } catch (e) {
                        alertify.error(`Could not resolve UID ${elt} for field ${i} as a ${fieldMap[i].type}. Returning -1. Full object: ${JSON.stringify(exts)}`);
                        console.error(e);
                        // eslint-disable-next-line no-console
                        console.trace();
                        return -1;
                    }
                });
                continue;
            }
            try {
                out[i] = getById(fieldMap[i].type as 'template' | 'texture', String(exts[i])).name;
            } catch (e) {
                alertify.error(`Could not resolve UID ${exts[i]} for field ${i} as a ${fieldMap[i].type}. Returning -1. Full object: ${JSON.stringify(exts)}`);
                console.error(e);
                // eslint-disable-next-line no-console
                console.trace();
                out[i] = -1;
            }
        } else {
            // Seems to be a plain value. Output the old key as is.
            out[i] = exts[i];
        }
    }
    return out;
};

export const getCleanKey = (i: string): string => {
    const split = i.split('@@');
    if (split.length > 1) {
        split.pop();
    }
    return split.join('@@');
};

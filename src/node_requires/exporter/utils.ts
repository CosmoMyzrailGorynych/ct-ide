import {getById, assetTypes} from '../resources';

// as in "can be unwrapped"
const unwrappable = [...assetTypes, 'emitterTandem'];

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
        if (unwrappable.includes(postfix as resourceType) &&
            (exts[i] === void 0 || exts[i] === -1)) {
            // Skip unset values
            continue;
        }
        if (unwrappable.includes(postfix as resourceType)) {
            try {
                const asset = getById(postfix!, String(exts[i]));
                out.key = asset.name;
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


const getUnreferencedValue = (value: string | number, fieldType: Required<IExtensionField>['arrayType']) => {
    if (assetTypes.includes(fieldType as resourceType)) {
        if (value === -1) {
            return -1;
        }
        try {
            const asset = getById(fieldType, value as string);
            return asset.name;
        } catch (e) {
            alertify.error(`Could not resolve UID ${value} as a ${fieldType}. Returning -1.`);
            console.error(e);
            // eslint-disable-next-line no-console
            console.trace();
            return -1;
        }
    }
    if (fieldType.startsWith('enum@')) {
        const {values} = getById('enum', fieldType.split('@').pop()!);
        return values.indexOf(value as string);
    }
    return value;
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
    exts: Record<string | number, unknown>,
    spec: IContentType['specification']
): Record<string, unknown> => {
    const fieldMap = {} as Record<string, IContentType['specification'][0]>;
    for (const field of spec) {
        fieldMap[field.name || field.readableName] = field;
    }
    const out = {} as Record<string, unknown>;
    for (const i in exts) {
        if (!(i in fieldMap)) {
            // Skip any fields outside of our specification
            out[i] = exts[i];
            continue;
        }
        const field = fieldMap[i];
        if (field.structure === 'array') {
            out[i] = (exts[i] as (string | number)[])
                     .map(elt => getUnreferencedValue(elt, field.type));
        } else if (field.structure === 'map') {
            out[i] = {};
            const inMap = exts[i] as Record<string | number, string | number>;
            const outMap = out[i] as Record<string | number, unknown>;
            for (const key of Object.keys(inMap)) {
                outMap[getUnreferencedValue(key, field.type)] =
                    getUnreferencedValue(inMap[key], field.mappedType!);
            }
        } else {
            out[i] = getUnreferencedValue(exts[i] as string | number, field.type);
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

const {getTemplateFromId} = require('./../resources/templates');
const {getTextureFromId} = require('./../resources/textures');
const getRoomFromId = require('./../resources/rooms').getById;
const getSoundFromId = require('./../resources/sounds').getById;
const getTandemFromId = require('./../resources/emitterTandems').getById;

const typeToGetter = {
    template: getTemplateFromId,
    texture: getTextureFromId,
    room: getRoomFromId,
    sound: getSoundFromId,
    tandem: getTandemFromId,
    emitterTandem: getTandemFromId
};

/**
 * Creates a copy of an extends object, turning UIDs of resources into the names of these resources.
 * Understands notations of `name@@template` and `name@@texture`.
 *
 * @param {object} exts A flat map of extends.
 *
 * @returns {object} An object with unwrapped extends.
 */
const getUnwrappedExtends = function getUnwrappedExtends(exts) {
    if (typeof exts !== 'object') {
        // This is a primitive value
        return exts;
    }
    const out = {};
    for (const i in exts) {
        if (Array.isArray(exts[i])) {
            // Recursively unwrap complex objects
            out[i] = exts[i].map(getUnwrappedExtends);
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
                out[key] = typeToGetter[postfix](exts[i]).name;
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

// as in "can be unwrapped"
const unwrappable = ['template', 'texture', 'sound', 'room', 'emitterTandem', 'tandem'];
/**
 * Supports flat objects only.
 * A helper for a content function; unwraps IDs for assets
 * according to the provided specification for this content type.
 *
 * @param {object} exts The object which fields should be unwrapped.
 * @param {object} spec The field schema for this particular content type.
 *
 * @returns {object} The unwrapped object.
 */
const getUnwrappedBySpec = function getUnwrappedBySpec(exts, spec) {
    const fieldMap = {};
    for (const field of spec) {
        fieldMap[field.name || field.readableName] = field;
    }
    const out = {};
    for (const i in exts) {
        if ((unwrappable.includes(fieldMap[i].type)) &&
            (exts[i] === void 0 || exts[i] === -1)) {
            // Skip unset values
            continue;
        }
        if (unwrappable.includes(fieldMap[i].type)) {
            if (fieldMap[i].array) {
                out[i] = exts[i].map(elt => {
                    try {
                        return typeToGetter[fieldMap[i].type](elt).name;
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
                out[i] = typeToGetter[fieldMap[i].type](exts[i]).name;
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

const getCleanKey = i => {
    const split = i.split('@@');
    if (split.length > 1) {
        split.pop();
    }
    return split.join('@@');
};

module.exports = {
    getUnwrappedExtends,
    getUnwrappedBySpec,
    getCleanKey
};

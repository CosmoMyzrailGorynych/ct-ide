/**
 * Creates a copy of an extends object, turning UIDs of resources into the names of these resources.
 * Understands notations of `name@@type` and `name@@texture`.
 *
 * @param {object} exts A flat map of extends.
 *
 * @returns {object} An object with unwrapped extends.
 */
const {getTypeFromId} = require('./../resources/types');
const {getTextureFromId} = require('./../resources/textures');
const getUnwrappedExtends = function getUnwrappedExtends(exts) {
    const out = {};
    for (const i in exts) {
        const split = i.split('@@');
        if (split.length === 1) {
            out[i] = exts[i];
            continue;
        }
        const postfix = split.pop();
        const key = split.join('@@');
        if ((postfix === 'type' || postfix === 'texture') &&
            (exts[i] === void 0 || exts[i] === -1)) {
            // Skip unset values
            continue;
        }
        if (postfix === 'type') {
            try {
                out[key] = getTypeFromId(exts[i]).name;
            } catch (e) {
                alertify.error(`Could not resolve UID ${exts[i]} for field ${key} as a type. Returning -1.`);
                console.error(e);
                // eslint-disable-next-line no-console
                console.trace();
                out[key] = -1;
            }
        } else if (postfix === 'texture') {
            try {
                out[key] = getTextureFromId(exts[i]).name;
            } catch (e) {
                alertify.error(`Could not resolve UID ${exts[i]} for field ${key} as a texture. Returning -1.`);
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

module.exports = {
    getUnwrappedExtends
};

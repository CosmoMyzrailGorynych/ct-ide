const getDefaultType = require('./defaultType').get;

const createNewType = function createNewType(name) {
    const type = getDefaultType();
    if (name) {
        type.name = String(name);
    }
    window.currentProject.types.push(type);
    window.signals.trigger('typesChanged');
    return type;
};

/**
 * Gets the ct.js type object by its id.
 * @param {string} id The id of the ct.js type
 * @returns {IType} The ct.js type object
 */
const getTypeFromId = function getTypeFromId(id) {
    const type = global.currentProject.types.find(t => t.uid === id);
    if (!type) {
        throw new Error(`Attempt to get a non-existent type with ID ${id}`);
    }
    return type;
};

/**
 * Retrieves the full path to a thumbnail of a given type.
 * @param {string|IType} type Either the id of the type, or its ct.js object
 * @param {boolean} [x2] If set to true, returns a 128x128 image instead of 64x64.
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the thumbnail.
 */
const getTypePreview = function getTypePreview(type, x2, fs) {
    const {getTexturePreview} = require('./../textures');
    if (typeof type === 'string') {
        type = getTypeFromId(type);
    }
    if (type === -1) {
        return getTexturePreview(-1, x2, fs);
    }
    return getTexturePreview(type.texture, x2, fs);
};

module.exports = {
    getDefaultType,
    getTypeFromId,
    getTypePreview,
    createNewType
};

const getDefaultTemplate = require('./defaultTemplate').get;

const createNewTemplate = function createNewTemplate(name) {
    const template = getDefaultTemplate();
    if (name) {
        template.name = String(name);
    }
    window.currentProject.templates.push(template);
    window.signals.trigger('templatesChanged');
    return template;
};

/**
 * Gets the ct.js template object by its id.
 * @param {string} id The id of the ct.js template
 * @returns {ITemplate} The ct.js template object
 */
const getTemplateFromId = function getTemplateFromId(id) {
    const template = global.currentProject.templates.find(t => t.uid === id);
    if (!template) {
        throw new Error(`Attempt to get a non-existent template with ID ${id}`);
    }
    return template;
};

/**
 * Retrieves the full path to a thumbnail of a given template.
 * @param {string|ITemplate} template Either the id of the template, or its ct.js object
 * @param {boolean} [x2] If set to true, returns a 128x128 image instead of 64x64.
 * @param {boolean} [fs] If set to true, returns a file system path, not a URI.
 * @returns {string} The full path to the thumbnail.
 */
const getTemplatePreview = function getTemplatePreview(template, x2, fs) {
    const {getTexturePreview} = require('./../textures');
    if (typeof template === 'string') {
        template = getTemplateFromId(template);
    }
    if (template === -1) {
        return getTexturePreview(-1, x2, fs);
    }
    return getTexturePreview(template.texture, x2, fs);
};

module.exports = {
    getDefaultTemplate,
    getTemplateFromId,
    getTemplatePreview,
    createNewTemplate
};

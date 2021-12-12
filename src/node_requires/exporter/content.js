const {getUnwrappedBySpec} = require('./utils');
const stringifyContent = function stringifyContent(project) {
    const contentDb = {};
    for (const contentType of project.contentTypes) {
        contentDb[contentType.name || contentType.readableName] = contentType.entries.map(entry =>
            getUnwrappedBySpec(entry, contentType.specification));
    }
    return JSON.stringify(contentDb)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
};
module.exports = {
    stringifyContent
};

/* global nw */
const defaultProject = require('./defaultProject');

const getDefaultProjectDir = function () {
    const path = require('path');
    return path.join(nw.App.startPath, 'projects');
};

module.exports = {
    defaultProject,
    getDefaultProjectDir
};

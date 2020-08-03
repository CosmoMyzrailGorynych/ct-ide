const defaultProject = require('./defaultProject');

const getDefaultProjectDir = function () {
    const path = require('path');
    return path.join(nw.App.startPath, 'projects');
};

const getExamplesDir = function () {
    const path = require('path');
    try {
        require('gulp');
        // Most likely, we are in a dev environment
        return path.join(nw.App.startPath, 'src/examples');
    } catch (e) {
        return path.join(nw.App.startPath, 'examples');
    }
};

module.exports = {
    defaultProject,
    getDefaultProjectDir,
    getExamplesDir
};

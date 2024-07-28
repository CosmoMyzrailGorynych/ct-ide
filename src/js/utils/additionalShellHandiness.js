/**
 * Shows an "open file" dialog, allowing a user to select files or folders.
 *
 * @param {object} [options] An object with settings
 * @param {boolean} [options.openDirectory] Whether or not to choose a directory instead of files
 * @param {string} [options.defaultPath] The path at which browsing starts
 * @param {string} [options.title] An optional title that is shown at the top of the file browser.
 * @param {boolean} [options.multiple] Whether or not to allow selecting multiple files
 * (makes no sense with `openDirectory` enabled)
 * @param {boolean} [options.filter] A file filter.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
 * @returns {Promise<Array<string>>}A promise that resolves
 * into a path to the selected file, or to an array of paths of files
 * (if options.multiple.)
 */
window.showOpenDialog = async (options = {}) => {
    const {os} = window.Neutralino;
    let response;
    if (options.openDirectory) {
        response = await os.showFolderDialog(options.title);
    } else {
        const opts = {
            defaultPath: options.defaultPath,
            multiSelections: options.multiple
        };
        if (options.filter) {
            opts.filters = [{
                name: 'Files',
                extensions: options.filter
                    .split(',')
                    .map(ext => ext.trim().slice(1)) // Remove leading dot
            }];
        }
        response = await os.showOpenDialog(options.title, opts);
    }
    return response;
};
/**
 * Shows a "save file" dialog.
 *
 * @param {object} [options] An object with settings
 * @param {string} [options.defaultPath] The path at which browsing starts
 * @param {string} [options.defaultName] The proposed file's name
 * @param {boolean} [options.filter] A file filter. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
 * @returns {Promise<string|false>} A promise that resolves into a full path to a target file
 * if the user proceeded to save a file, and into `false` if the user cancelled the operation.
 */
window.showSaveDialog = function showSaveDialog(options = {}) {
    const {os} = window.Neutralino;
    return os.showSaveDialog(options.title, {
        defaultPath: options.defaultPath,
        defaultFileName: options.defaultName
    });
};

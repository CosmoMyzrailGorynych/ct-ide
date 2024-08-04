(function firstRunSetup() {// first-launch setup
    const {write} = require('src/lib/neutralino-storage');
    const defaults = {
        fontSize: 18,
        lastProjects: '',
        notes: '',
        appLanguage: 'English',
        editorZooming: 0,
        emSize: 16
    };
    for (const key in defaults) {
        if (!(key in localStorage)) {
            write(key, defaults[key]);
        }
    }
})();

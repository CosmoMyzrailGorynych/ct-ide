(function firstRunSetup() {// first-launch setup
    const defaults = {
        fontSize: 18,
        lastProjects: '',
        notes: '',
        appLanguage: 'English',
        editorZooming: 0
    };
    for (const key in defaults) {
        if (!(key in localStorage)) {
            localStorage[key] = defaults[key];
        }
    }
})();

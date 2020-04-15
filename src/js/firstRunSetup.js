(function () {// first-launch setup
    const defaults = {
        fontSize: 18,
        lastProjects: '',
        notes: '',
        appLanguage: 'English',
        editorZooming: require('electron').webFrame.getZoomFactor() || 1
    };
    for (const key in defaults) {
        if (!(key in localStorage)) {
            localStorage[key] = defaults[key];
        }
    }
})();

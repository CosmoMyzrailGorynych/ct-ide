// language pack
// 2017: не удалять, нужно для динамической локализации

(window => {
    const os = require('os'),
        fs = require('fs-extra');

    window.languageJSON = JSON.parse(fs.readFileSync(`./i18n/${localStorage.appLanguage || 'English'}.json`));

    // OS type vars
    window.isWin = (/win[0-9]+/).test(os.platform());
    window.isLinux = os.platform() === 'linux';
    window.isMac = !(window.isWin || window.isLinux);

})(this);

// language pack

(window => {
    const os = require('os'),
        fs = require('fs-extra');

    window.languageJSON = JSON.parse(fs.readFileSync(`./data/i18n/${localStorage.appLanguage || 'English'}.json`));

    // OS type vars
    window.isWin = (/win[0-9]+/).test(os.platform());
    window.isLinux = os.platform() === 'linux';
    window.isMac = !(window.isWin || window.isLinux);

})(this);

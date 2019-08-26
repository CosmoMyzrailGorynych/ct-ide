(function () {
    const fs = require('fs-extra');
    window.languageJSON = JSON.parse(fs.readFileSync(`./data/i18n/${localStorage.appLanguage || 'English'}.json`));
})();

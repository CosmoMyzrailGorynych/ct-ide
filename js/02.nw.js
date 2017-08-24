//                  _                         _     _    _  _
//    _ _   ___  __| | ___  ___ __ __ __ ___ | |__ | |__(_)| |_
//   | ' \ / _ \/ _` |/ -_)|___|\ V  V // -_)| '_ \| / /| ||  _|
//   |_||_|\___/\__,_|\___|      \_/\_/ \___||_.__/|_\_\|_| \__|
//

// language pack
// 2017: не удалять, нужно для динамической локализации

(window => {
    const os = require('os'),
        fs = require('fs-extra');

    window.languageJSON = JSON.parse(fs.readFileSync('./i18n/Ru.json'));

    // OS type vars
    window.isMac = false;
    window.isWin = (/win[0-9]+/).test(os.platform());
    window.isX = os.platform() === 'linux';

    // better copy
    window.megacopy = function(sf,df,callback) {
        var is = fs.createReadStream(sf);
        var os = fs.createWriteStream(df);
        is.on('end', callback);
        is.pipe(os);
    };
})(this);

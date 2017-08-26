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
    window.isWin = (/win[0-9]+/).test(os.platform());
    window.isLinux = os.platform() === 'linux';
    window.isMac = !(window.isWin || window.isLinux);

    // better copy
    window.megacopy = function(sourcePath, destinationPath, callback) {
        var is = fs.createReadStream(sourcePath);
        var os = fs.createWriteStream(destinationPath);
        is.on('end', callback);
        is.pipe(os);
    };
})(this);

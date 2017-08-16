//                  _                         _     _    _  _
//    _ _   ___  __| | ___  ___ __ __ __ ___ | |__ | |__(_)| |_
//   | ' \ / _ \/ _` |/ -_)|___|\ V  V // -_)| '_ \| / /| ||  _|
//   |_||_|\___/\__,_|\___|      \_/\_/ \___||_.__/|_\_\|_| \__|
//

// path resolving utilities
var path = require('path'),
    fs = require('fs-extra'),
    os = require('os');

var gui = require('nw.gui'),
    clipboard = gui.Clipboard.get(),
    win = gui.Window.get();

var assets = process.cwd().replace(/\\/g,'/');
// file system api
// chromium API
// OS matters
// markdown renderer

// get and normalize assets folder (usually unzipped app.nw)
// get and normalize .exe path
var exec = path.dirname(process.execPath).replace(/\\/g,'/');
// get default folder for projects
var way = exec + '/projects';
// create one if it doesn't exist
fs.mkdirs(way, function (e) {
    if (e) {
        throw e;
    }
});
// sessionStorage.projdir = way + '/' + currentProject.codename
// see in events.js --> newProject
//        events.js --> openProject

// language pack
// 2017: не удалять, нужно для динамической локализации
window.languageJSON = JSON.parse(fs.readFileSync(assets+'/i18n/Ru.json'));

// OS type vars
var isMac = false,
    isWin = (/win[0-9]+/).test(os.platform()),
    isX = os.platform() === 'linux';

// better copy
window.megacopy = function(sf,df,callback) {
    var is = fs.createReadStream(sf);
    var os = fs.createWriteStream(df);
    is.on('end', callback);
    is.pipe(os);
};

/* **********************************/

window.RELEASE = 0;

/* **********************************/

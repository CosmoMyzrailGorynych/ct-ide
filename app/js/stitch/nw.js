//                  _                         _     _    _  _
//    _ _   ___  __| | ___  ___ __ __ __ ___ | |__ | |__(_)| |_ 
//   | ' \ / _ \/ _` |/ -_)|___|\ V  V // -_)| '_ \| / /| ||  _|
//   |_||_|\___/\__,_|\___|      \_/\_/ \___||_.__/|_\_\|_| \__|
//

// path resolving utilities
path = require('path');
// file system api
fs = require('fs-extra');
// chromium API
gui = require('nw.gui');
clipboard = gui.Clipboard.get();
win = gui.Window.get();
// OS matters
os = require('os');
// markdown renderer
md = require('markdown-it')({  
	html: false,  
	linkify: true,  
	typographer: true,
	breaks: true
});
// minifiers
// TODO: load on demand only
UglifyJS = require("uglify-js");
csswring = require('csswring');
htmlMinify = require('html-minifier').minify;


// get and normalize assets folder (usually unzipped app.nw)
assets = process.cwd().replace(/\\/g,'/'); 
// get and normalize .exe path
exec = path.dirname(process.execPath).replace(/\\/g,'/');
// get default folder for projects
way = exec + '/projects';
// create one if it doesn't exist
fs.mkdirs(way, function (e) {
	if (e) {
		throw e;
	}
});
// projdir = way + '/' + currentProject.codename
// see in events.js --> newProject
//        events.js --> openProject

// must be useful
//packageJSON = JSON.parse(fs.readFileSync(assets+'/package.json'));
packageJSON = gui.App.manifest;
// language pack
languageJSON = JSON.parse(fs.readFileSync(exec+'/locales/'+ $('body').attr('data-lang') +'.json'));

// OS type vars
isMac = false;
isWin = /win[0-9]+/.test(os.platform());
isX = os.platform() == 'linux';

// better copy
function megacopy(sf,df,callback) {
	var is = fs.createReadStream(sf)
	var os = fs.createWriteStream(df);
	is.on('end', callback);
	is.pipe(os);
}

/***********************************/

    RELEASE = 1000;

/***********************************/
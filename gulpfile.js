'use strict';

/* eslint no-console: 0 */
const path = require('path'),
      gulp = require('gulp'),
      concat = require('gulp-concat'),
      sourcemaps = require('gulp-sourcemaps'),
      minimist = require('minimist'),
      stylus = require('gulp-stylus'),
      riot = require('gulp-riot'),
      pug = require('gulp-pug'),
      eslint = require('gulp-eslint'),
      stylint = require('gulp-stylint'),
      globby = require('globby'),
      filemode = require('filemode'),
      zip = require('gulp-zip'),

      streamQueue = require('streamqueue'),
      notifier = require('node-notifier'),
      fs = require('fs-extra'),
      NwBuilder = require('nw-builder'),

      spawnise = require('./node_requires/spawnise');

const argv = minimist(process.argv.slice(2));

const pack = require('./app/package.json');

const nwVersion = '0.34.1',
      platforms = ['osx64', 'win32', 'win64', 'linux32', 'linux64'],
      nwFiles = ['./app/**', '!./app/export/**', '!./app/projects/**', '!./app/exportDesktop/**', '!./app/cache/**', '!./app/.vscode/**', '!./app/JamGames/**'];

var channelPostfix = argv.channel || false;

let errorBoxShown = false;
const showErrorBox = function () {
    if (!errorBoxShown) {
        errorBoxShown = true;
        console.error(`
 ╭──────────────────────────────────────────╮
 │                                          ├──╮
 │             Build failed! D:             │  │
 │                                          │  │
 │  If you have recently pulled changes     │  │
 │  or have just cloned the repo, run this  │  │
 │  command in your console:                │  │
 │                                          │  │
 │  $ gulp -f devSetup.gulpfile.js          │  │
 │                                          │  │
 ╰─┬────────────────────────────────────────╯  │
   ╰───────────────────────────────────────────╯
`);
    }
};

const makeErrorObj = (title, err) => {
    showErrorBox();
    return {
        title,
        message: err.toString(),
        icon: path.join(__dirname, 'error.png'),
        sound: true,
        wait: true
    };
};

const fileChangeNotifier = p => {
    notifier.notify({
        title: `Updating ${path.basename(p)}`,
        message: `${p}`,
        icon: path.join(__dirname, 'cat.png'),
        sound: false,
        wait: false
    });
};

const compileStylus = () =>
    gulp.src('./src/styl/theme*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
        compress: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/data/'));

const compilePug = () =>
    gulp.src('./src/pug/*.pug')
    .pipe(sourcemaps.init())
    .pipe(pug({
        pretty: false
    }))
    .on('error', err => {
        notifier.notify(makeErrorObj('Pug failure', err));
        console.error('[pug error]', err);
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/'));

const compileRiot = () =>
    gulp.src('./src/riotTags/**')
    .pipe(riot({
        compact: false,
        template: 'pug'
    }))
    .pipe(concat('riot.js'))
    .pipe(gulp.dest('./temp/'));

const concatScripts = () =>
    streamQueue({objectMode: true},
        gulp.src('./src/js/**'),
        gulp.src('./temp/riot.js')
    )
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/data/'))
    .on('error', err => {
        notifier.notify({
            title: 'Scripts error',
            message: err.toString(),
            icon: path.join(__dirname, 'error.png'),
            sound: true,
            wait: true
        });
        console.error('[scripts error]', err);
    })
    .on('change', fileChangeNotifier);
const copyRequires = () =>
    gulp.src('./src/node_requires/**/*')
    .pipe(gulp.dest('./app/data/node_requires'));

const compileScripts = gulp.series(compileRiot, concatScripts);

const watchScripts = () => {
    gulp.watch('./src/js/**/*', gulp.series(compileScripts))
    .on('error', err => {
        notifier.notify(makeErrorObj('General scripts error', err));
        console.error('[scripts error]', err);
    })
    .on('change', fileChangeNotifier);
};
const watchRiot = () => {
    gulp.watch('./src/riotTags/**/*', gulp.series(compileScripts))
    .on('error', err => {
        notifier.notify(makeErrorObj('Riot failure', err));
        console.error('[pug error]', err);
    })
    .on('change', fileChangeNotifier);
};
const watchStylus = () => {
    gulp.watch('./src/styl/**/*', compileStylus)
    .on('error', err => {
        notifier.notify(makeErrorObj('Stylus failure', err));
        console.error('[styl error]', err);
    })
    .on('change', fileChangeNotifier);
};
const watchPug = () => {
    gulp.watch('./src/pug/*.pug', compilePug)
    .on('change', fileChangeNotifier)
    .on('error', err => {
        notifier.notify(makeErrorObj('Pug failure', err));
        console.error('[pug error]', err);
    });
};
const watchRequires = () => {
    gulp.watch('./src/node_requires/**/*', copyRequires)
    .on('change', fileChangeNotifier)
    .on('error', err => {
        notifier.notify(makeErrorObj('Failure of node_requires', err));
        console.error('[node_requires error]', err);
    });
};

const watch = () => {
    watchScripts();
    watchStylus();
    watchPug();
    watchRiot();
    watchRequires();
};

const build = gulp.parallel([compilePug, compileStylus, compileScripts, copyRequires]);

const lintStylus = () => gulp.src(['./src/styl/**/*.styl', '!./src/styl/3rdParty/**/*.styl'])
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylint.reporter('fail', {
        failOnWarning: true
    }));

const lintJS = () => gulp.src(['./src/js/**/*.js', '!./src/js/3rdparty/**/*.js', './src/node_requires/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

const lint = gulp.series(lintJS, lintStylus);

const launchNw = () => { // makes a loop that keeps ct.js open if it was closed, either by a user or by assets' changes
    var nw = new NwBuilder({
        files: nwFiles,
        version: nwVersion,
        platforms,
        flavor: 'sdk'
    });
    return nw.run()
    .catch(function (error) {
        showErrorBox();
        console.error(error);
    })
    .then(launchNw);
};

const docs = async () => {
    try {
        await fs.remove('./app/data/docs/');
        await spawnise.spawn((/^win/).test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'build'], {
            cwd: './docs'
        });
        await fs.copy('./docs/docs/.vuepress/dist', './app/data/docs/');
    } catch (e) {
        showErrorBox();
        throw e;
    }
};

const nwPackages = async () => {
    await fs.remove(path.join('./build', `ctjs - v${pack.version}`));
    var nw = new NwBuilder({
        files: nwFiles,
        platforms,
        version: nwVersion,
        flavor: 'sdk',
        buildType: 'versioned',
        // forceDownload: true,
        zip: false,
        macIcns: './app/ct.ide.icns'
    });
    await nw.build();
};

// a workaround for https://github.com/nwjs-community/nw-builder/issues/289
const fixPermissions = () => {
    if (platforms.indexOf('osx64') === -1) {
        return Promise.resolve(); // skip the fix if not building for macos
    }
    const baseDir = path.posix.join('./build', `ctjs - v${pack.version}`, 'osx64', 'ctjs.app/Contents');

    const globs = [
        baseDir + '/MacOS/nwjs',
        baseDir + '/Versions/*/nwjs Framework.framework/Versions/A/nwjs Framework',
        baseDir + '/Versions/*/nwjs Helper.app/Contents/MacOS/nwjs Helper'
    ];
    return globby(globs)
    .then(files => {
        console.log('overriding permissions for', files);
        return Promise.all(files.map(file => filemode(file, '777')));
    });
};

const oldSymlink = fs.symlink;
fs.symlink = (target, destination) => {
    console.log('link', target, '<==', destination);
    return oldSymlink(target, destination);
};

const abortOnWindows = done => {
    if ((/^win/).test(process.platform) && platforms.indexOf('osx64') !== -1) {
        throw new Error('Sorry, but building ct.js for mac is not possible on Windows due to Windows\' specifics. You can edit `platforms` at gulpfile.js if you don\'t need a package for mac.');
    }
    done();
};
// Based on solution at https://github.com/strawbees/desktop-packager/blob/master/commands/darwin/bundle.js
const fixSymlinks = async () => {
    if (platforms.indexOf('osx64') === -1) {
        return; // skip the fix if not building for macos
    }
    const baseDir = path.posix.join('./build', `ctjs - v${pack.version}`, 'osx64', 'ctjs.app/Contents');

    // the actual directory depends on nw version, so let's find the needed dir with a glob
    const glob = baseDir + '/Versions/*/nwjs Framework.framework/*';
    const execute = require('./node_requires/execute');
    const frameworkDir = path.dirname((await globby([glob]))[0]);

    console.log('fixing symlinks at', frameworkDir);

    execute(async ({exec}) => {
        await exec(`
            cd "${frameworkDir}"
            rm "Versions/Current" && ln -s "./A" "./Versions/Current"
            rm "Helpers" && ln -s "./Versions/Current/Helpers"
            rm "Internet Plug-Ins" && ln -s "./Versions/Current/Internet Plug-Ins"
            rm "Libraries" && ln -s "./Versions/Current/Libraries"
            rm "nwjs Framework" && ln -s "./Versions/Current/nwjs Framework"
            rm "Resources" && ln -s "./Versions/Current/Resources"
            rm "XPCServices" && ln -s "./Versions/Current/XPCServices"
        `);
    });
};
exports.fixPermissions = fixPermissions;
exports.fixSymlinks = fixSymlinks;

const examples = () => {
    const promises = platforms.map(platform =>
        fs.copy(
            './src/examples',
            path.join('./build', `ctjs - v${pack.version}`, platform, 'examples')
        )
    );
    return Promise.all(promises);
};

let zipPackages;
if ((/^win/).test(process.platform)) {
    const zipsForAllPlatforms = platforms.map(platform => () =>
        gulp.src(`./build/ctjs - v${pack.version}/${platform}/**`)
        .pipe(zip(`ct.js v${pack.version} for ${platform}.zip`))
        .pipe(gulp.dest(`./build/ctjs - v${pack.version}/`))
    );
    zipPackages = gulp.parallel(zipsForAllPlatforms);
} else {
    const execute = require('./node_requires/execute');
    zipPackages = () => Promise.all(platforms.map(platform =>
        // `r` for dirs,
        // `q` for preventing spamming to stdout,
        // and `y` for preserving symlinks
        execute(({exec}) => exec(`
            cd "./build/ctjs - v${pack.version}/"
            zip -rqy "ct.js v${pack.version} for ${platform}.zip" "./${platform}"
        `))
    ));
}

const packages = gulp.series([
    lint,
    abortOnWindows,
    build,
    docs,
    nwPackages,
    fixSymlinks,
    fixPermissions,
    examples,
    zipPackages
]);

const deployOnly = () => {
    console.log(`For channel ${channelPostfix}`);
    return spawnise.spawn('./butler', ['push', `./build/ctjs - v${pack.version}/linux32`, `comigo/ct:linux32${channelPostfix? '-' + channelPostfix: ''}`, '--userversion', pack.version])
    .then(() => spawnise.spawn('./butler', ['push', `./build/ctjs - v${pack.version}/linux64`, `comigo/ct:linux64${channelPostfix? '-' + channelPostfix: ''}`, '--userversion', pack.version]))
    .then(() => spawnise.spawn('./butler', ['push', `./build/ctjs - v${pack.version}/osx64`, `comigo/ct:osx64${channelPostfix? '-' + channelPostfix: ''}`, '--userversion', pack.version]))
    .then(() => spawnise.spawn('./butler', ['push', `./build/ctjs - v${pack.version}/win32`, `comigo/ct:win32${channelPostfix? '-' + channelPostfix: ''}`, '--userversion', pack.version]))
    .then(() => spawnise.spawn('./butler', ['push', `./build/ctjs - v${pack.version}/win64`, `comigo/ct:win64${channelPostfix? '-' + channelPostfix: ''}`, '--userversion', pack.version]));
};

const deploy = gulp.series([packages, deployOnly]);

const launchDevMode = done => {
    watch();
    launchNw();
    done();
};
const defaultTask = gulp.series(build, launchDevMode);


exports.lint = lint;
exports.packages = packages;
exports.docs = docs;
exports.build = build;
exports.deploy = deploy;
exports.deployOnly = deployOnly;
exports.default = defaultTask;

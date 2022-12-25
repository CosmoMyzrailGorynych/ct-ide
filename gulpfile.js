'use strict';

const versions = require('./versions');

/* eslint no-console: 0 */
const path = require('path'),
      gulp = require('gulp'),
      concat = require('gulp-concat'),
      replace = require('gulp-replace'),
      sourcemaps = require('gulp-sourcemaps'),
      minimist = require('minimist'),
      ts = require('@ct.js/gulp-typescript'),
      stylus = require('gulp-stylus'),
      riot = require('gulp-riot'),
      pug = require('gulp-pug'),
      sprite = require('gulp-svgstore'),
      zip = require('gulp-zip'),

      jsdocx = require('jsdoc-x'),

      streamQueue = require('streamqueue'),
      notifier = require('node-notifier'),
      fs = require('fs-extra'),

      spawnise = require('./node_requires/spawnise');

/**
 * To download NW.js binaries from a different place (for example, from live builds),
 * do the following:
 *
 * 1) Publish a customNwManifest.json with the needed version as its latest one.
 *    See https://nwjs.io/versions.json
 * 2) Set nwSource to the directory with a folder for this version.
 *    For example, if your binaries for each platform are at
 *    https://dl.nwjs.io/live-build/nw50/20201223-162000/6a3f52427/v0.50.3/,
 *    then you should specify the URL
 *    https://dl.nwjs.io/live-build/nw50/20201223-162000/6a3f52427/.
 * 3) Set nwVersion to `undefined` so that nw-builder loads the needed version from
 *    the created manifest and downloads it from a given source.
 *
 * For some reason, setting nwVersion to a specific version doesn't work, even with
 * a custom manifest.
 *
 * Also note that you may need to clear the `ct-js/cache` folder.
 */
const nwVersion = versions.nwjs,
      platforms = ['linux32', 'linux64', 'osx64', 'osxarm', 'win32', 'win64'],
      nwFiles = ['./app/**', '!./app/export/**', '!./app/projects/**', '!./app/exportDesktop/**', '!./app/cache/**', '!./app/.vscode/**', '!./app/JamGames/**'];

const argv = minimist(process.argv.slice(2));
const npm = (/^win/).test(process.platform) ? 'npm.cmd' : 'npm';

const pack = require('./app/package.json');

var channelPostfix = argv.channel || false,
    fixEnabled = argv.fix || false,
    nightly = argv.nightly || false,
    buildNumber = argv.buildNum || false;
var verbose = argv.verbose || false;

if (nightly) {
    channelPostfix = 'nightly';
}

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
        wait: false
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
        compress: true,
        'include css': true
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

const riotSettings = {
    compact: false,
    template: 'pug'
};
const compileRiot = () =>
    gulp.src('./src/riotTags/**/*.tag')
    .pipe(riot(riotSettings))
    .pipe(concat('riotTags.js'))
    .pipe(gulp.dest('./app/data/'));

const compileRiotPartial = path => {
    console.log(`Updating tag at ${path}…`);
    return gulp.src(path)
    .pipe(riot(riotSettings))
    .pipe(gulp.dest('./app/data/hotLoadTags/'));
};

const concatScripts = () =>
    streamQueue(
        {
            objectMode: true
        },
        gulp.src('./src/js/3rdparty/riot.min.js'),
        gulp.src(['./src/js/**', '!./src/js/3rdparty/riot.min.js'])
    )
    .pipe(sourcemaps.init({
        largeFile: true
    }))
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
    gulp.src([
        './src/node_requires/**/*',
        '!./src/node_requires/**/*.ts'
    ])
    .pipe(sourcemaps.init())
    // ¯\_(ツ)_/¯
    .pipe(sourcemaps.mapSources((sourcePath) => '../../src/' + sourcePath))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/data/node_requires'));

const tsProject = ts.createProject('tsconfig.json');

const processRequiresTS = () =>
    gulp.src('./src/node_requires/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/data/node_requires'));

const processRequires = gulp.series(copyRequires, processRequiresTS);

const copyInEditorDocs = () =>
    gulp.src('./docs/docs/ct.*.md')
    .pipe(gulp.dest('./app/data/node_requires'));

const compileScripts = gulp.series(compileRiot, concatScripts);

const makeIconAtlas = () =>
    gulp.src('./src/icons/**/*.svg', {
        base: './src/icons'
    })
    .pipe(sprite())
    .pipe(gulp.dest('./app/data'));

const writeIconList = () => fs.readdir('./src/icons')
    .then(files => files.filter(file => path.extname(file) === '.svg'))
    .then(files => files.map(file => path.basename(file, '.svg')))
    .then(files => fs.outputJSON('./app/data/icons.json', files));

const icons = gulp.series(makeIconAtlas, writeIconList);

const watchScripts = () => {
    gulp.watch('./src/js/**/*', gulp.series(compileScripts))
    .on('error', err => {
        notifier.notify(makeErrorObj('General scripts error', err));
        console.error('[scripts error]', err);
    })
    .on('change', fileChangeNotifier);
};
const watchRiot = () => {
    const watcher = gulp.watch('./src/riotTags/**/*', compileRiot);
    watcher.on('error', err => {
        notifier.notify(makeErrorObj('Riot failure', err));
        console.error('[pug error]', err);
    });
    watcher.on('change', compileRiotPartial);
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
    gulp.watch('./src/pug/**/*.pug', compilePug)
    .on('change', fileChangeNotifier)
    .on('error', err => {
        notifier.notify(makeErrorObj('Pug failure', err));
        console.error('[pug error]', err);
    });
};
const watchRequires = () => {
    gulp.watch('./src/node_requires/**/*', processRequires)
    .on('change', fileChangeNotifier)
    .on('error', err => {
        notifier.notify(makeErrorObj('Failure of node_requires', err));
    });
};
const watchIcons = () => {
    gulp.watch('./src/icons/**/*.svg', icons);
};

const watch = () => {
    watchScripts();
    watchStylus();
    watchPug();
    watchRiot();
    watchRequires();
    watchIcons();
};

const lintStylus = () => {
    const stylelint = require('stylelint');
    return stylelint.lint({
        files: [
            './src/styl/**/*.styl',
            '!./src/styl/3rdParty/**/*.styl'
        ],
        formatter: 'string'
    }).then(lintResults => {
        if (lintResults.errored) {
            console.log(lintResults.output);
        } else {
            console.log('✔ Cheff\'s kiss! 😙👌');
        }
    });
};

const lintJS = () => {
    const eslint = require('gulp-eslint');
    return gulp.src([
        './src/js/**/*.js',
        '!./src/js/3rdparty/**/*.js',
        './src/node_requires/**/*.js',
        './app/data/ct.release/**/*.js',
        '!./app/data/ct.release/**/*.min.js',
        './src/pug/**/*.pug'
    ])
    .pipe(eslint({
        fix: fixEnabled
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};
const lintTags = () => {
    const eslint = require('gulp-eslint'),
          replaceExt = require('gulp-ext-replace');
    return gulp.src(['./src/riotTags/**/*.tag'])
    .pipe(replaceExt('.pug')) // rename so that it becomes edible for eslint-plugin-pug
    .pipe(eslint()) // ESLint-pug cannot automatically fix issues
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

const lintI18n = () => require('./node_requires/i18n')(verbose).then(console.log);

const lint = gulp.series(lintJS, lintTags, lintStylus, lintI18n);

const processToPlatformMap = {
    'darwin-x64': 'osx64',
    'darwin-arm64': 'osxarm',
    'win32-x32': 'win32',
    'win32-x64': 'win64',
    'linux-x32': 'linux32',
    'linux-x64': 'linux64'
};
const launchApp = () => {
    const platformKey = `${process.platform}-${process.arch}`;
    const NwBuilder = (platformKey === 'darwin-arm64') ? require('nw-builder-arm') : require('nw-builder');
    if (!(platformKey in processToPlatformMap)) {
        throw new Error(`Combination of OS and architecture ${process.platform}-${process.arch} is not supported by NW.js.`);
    }
    const nw = new NwBuilder({
        files: nwFiles,
        version: nwVersion,
        platforms: [processToPlatformMap[platformKey]],
        flavor: 'sdk'
    });
    return nw.run()
    .catch(error => {
        showErrorBox();
        console.error(error);
    })
    .then(launchApp);
};

const docs = async () => {
    try {
        await fs.remove('./app/data/docs/');
        await spawnise.spawn(npm, ['run', 'build'], {
            cwd: './docs'
        });
        await fs.copy('./docs/docs/.vuepress/dist', './app/data/docs/');
    } catch (e) {
        showErrorBox();
        throw e;
    }
};

// @see https://microsoft.github.io/monaco-editor/api/enums/monaco.languages.completionitemkind.html
const kindMap = {
    function: 'Function',
    class: 'Class'
};
const getAutocompletion = doc => {
    if (doc.kind === 'function') {
        if (!doc.params || doc.params.length === 0) {
            return doc.longname + '()';
        }
        return doc.longname + `(${doc.params.map(param => param.name).join(', ')})`;
    }
    if (doc.kind === 'class') {
        return doc.name;
    }
    return doc.longname;
};
const getDocumentation = doc => {
    if (!doc.description) {
        return void 0;
    }
    if (doc.kind === 'function') {
        return {
            value: `${doc.description}
${(doc.params || []).map(param => `* \`${param.name}\` (${param.type.names.join('|')}) ${param.description} ${param.optional ? '(optional)' : ''}`).join('\n')}

Returns ${doc.returns[0].type.names.join('|')}, ${doc.returns[0].description}`
        };
    }
    return {
        value: doc.description
    };
};

const bakeCompletions = () =>
    jsdocx.parse({
        files: './app/data/ct.release/**/*.js',
        excludePattern: '(DragonBones|pixi)',
        undocumented: false,
        allowUnknownTags: true
    })
    .then(docs => {
        const registry = [];
        for (const doc of docs) {
            console.log(doc);
            if (doc.params) {
                for (const param of doc.params) {
                    console.log(param);
                }
            }
            const item = {
                label: doc.name,
                insertText: doc.autocomplete || getAutocompletion(doc),
                documentation: getDocumentation(doc),
                kind: kindMap[doc.kind] || 'Property'
            };
            registry.push(item);
        }
        fs.outputJSON('./app/data/node_requires/codeEditor/autocompletions.json', registry, {
            spaces: 2
        });
    });
const bakeCtTypedefs = cb => {
    spawnise.spawn(npm, ['run', 'ctTypedefs'])
    .then(cb);
};
const concatTypedefs = () =>
    gulp.src(['./src/typedefs/ct.js/types.d.ts', './src/typedefs/ct.js/**/*.ts', './src/typedefs/default/**/*.ts'])
    .pipe(concat('global.d.ts'))
    // patch the generated output so ct classes allow custom properties
    .pipe(replace('declare class Copy extends PIXI.AnimatedSprite {', `
        declare class Copy extends PIXI.AnimatedSprite {
            [key: string]: any
        `))
    .pipe(replace('declare class Room extends PIXI.Container {', `
        declare class Room extends PIXI.Container {
            [key: string]: any
        `))
    // also, remove JSDOC's @namespace flags so the popups in ct.js become more clear
    .pipe(replace(`
 * @namespace
 */
declare namespace`, `
 */
declare namespace`))
    .pipe(replace(`
     * @namespace
     */
    namespace`, `
     */
    namespace`))
    .pipe(gulp.dest('./app/data/typedefs/'));

// electron-builder ignores .d.ts files no matter how you describe your app's contents.
const copyPixiTypedefs = () => gulp.src('./app/node_modules/pixi.js/pixi.js.d.ts')
    .pipe(gulp.dest('./app/data/typedefs'));

const bakeJSDocJson = cb =>
    spawnise.spawn(npm, ['run', 'ctJSDocJson'])
    .then(cb);

const bakeTypedefs = gulp.series([bakeCtTypedefs, concatTypedefs, copyPixiTypedefs, bakeJSDocJson]);

const build = gulp.parallel([
    gulp.series(icons, compilePug),
    compileStylus,
    compileScripts,
    processRequires,
    copyInEditorDocs,
    bakeTypedefs
]);

const bakePackages = async () => {
    const NwBuilder = require('nw-builder');
    // Use the appropriate icon for each release channel
    if (nightly) {
        await fs.copy('./buildAssets/nightly.png', './app/ct_ide.png');
    } else {
        await fs.copy('./buildAssets/icon.png', './app/ct_ide.png');
    }
    await fs.remove(path.join('./build', `ctjs - v${pack.version}`));
    const nw = new NwBuilder({
        files: nwFiles,
        platforms: platforms.filter(x => x !== 'osxarm'),
        version: nwVersion,
        flavor: 'sdk',
        buildType: 'versioned',
        // forceDownload: true,
        zip: false,
        macIcns: nightly ? './buildAssets/nightly.icns' : './buildAssets/icon.icns'
    });
    await nw.build();

    if (platforms.indexOf('osxarm') > -1) {
        try {
            const NwBuilderArm = require('nw-builder-arm');
            const nwarm = new NwBuilderArm({
                files: nwFiles,
                platforms: ['osxarm'],
                version: nwVersion,
                flavor: 'sdk',
                buildType: 'versioned',
                // forceDownload: true,
                zip: false,
                macIcns: nightly ? './buildAssets/nightly.icns' : './buildAssets/icon.icns'
            });
            await nwarm.build();
        } catch (err) {
            console.error(`
    ╭──────────────────────────────────────────╮
    │                                          ├──╮
    │    Mac OS X (arm64) build failed! D:     │  │
    │                                          │  │
    │  The arm64 architecture on Mac OS X      │  │
    │  relies upon unofficial builds. Thus it  │  │
    │  may not always succeed. Other builds    │  │
    │  will proceed.                           │  │
    │                                          │  │
    ╰─┬────────────────────────────────────────╯  │
    ╰───────────────────────────────────────────╯
    `);
            platforms.splice(platforms.indexOf('osxarm'), 1);
        }
    }

    // Copy .itch.toml files for each target platform
    await Promise.all(platforms.map(platform => {
        if (platform.indexOf('win') === 0) {
            return fs.copy(
                './buildAssets/windows.itch.toml',
                path.join(`./build/ctjs - v${pack.version}`, platform, '.itch.toml')
            );
        }
        if (platform === 'osx64' || platform === 'osxarm') {
            return fs.copy(
                './buildAssets/mac.itch.toml',
                path.join(`./build/ctjs - v${pack.version}`, platform, '.itch.toml')
            );
        }
        return fs.copy(
            './buildAssets/linux.itch.toml',
            path.join(`./build/ctjs - v${pack.version}`, platform, '.itch.toml')
        );
    }));
    console.log('Built to this location:', path.join('./build', `ctjs - v${pack.version}`));
};

const abortOnWindows = done => {
    if ((/^win/).test(process.platform) && platforms.indexOf('osx64') !== -1) {
        throw new Error('Sorry, but building ct.js for mac is not possible on Windows due to Windows\' specifics. You can edit `platforms` at gulpfile.js if you don\'t need a package for mac.');
    }
    done();
};
let zipPackages;
if ((/^win/).test(process.platform)) {
    const zipsForAllPlatforms = platforms.map(platform => () =>
        gulp.src(`./build/ctjs - v${pack.version}/${platform}/**`)
        .pipe(zip(`ct.js v${pack.version} for ${platform}.zip`))
        .pipe(gulp.dest(`./build/ctjs - v${pack.version}/`)));
    zipPackages = gulp.parallel(zipsForAllPlatforms);
} else {
    const execute = require('./node_requires/execute');
    zipPackages = async () => {
        for (const platform of platforms) {
            // eslint-disable-next-line no-await-in-loop
            await execute(({exec}) => exec(`
                cd "./build/ctjs - v${pack.version}/"
                zip -rqy "ct.js v${pack.version} for ${platform}.zip" "./${platform}"
                rm -rf "./${platform}"
            `));
        }
    };
}


const examples = () => gulp.src('./src/examples/**/*')
    .pipe(gulp.dest('./app/examples'));

const templates = () => gulp.src('./src/projectTemplates/**/*')
    .pipe(gulp.dest('./app/templates'));

const gallery = () => gulp.src('./bundledAssets/**/*')
    .pipe(gulp.dest('./app/bundledAssets'));
const packages = gulp.series([
    lint,
    abortOnWindows,
    gulp.parallel([
        build,
        docs,
        examples,
        templates,
        gallery
    ]),
    bakePackages
]);

/* eslint-disable no-await-in-loop */
const deployItchOnly = async () => {
    console.log(`For channel ${channelPostfix}`);
    for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        if (nightly) {
            await spawnise.spawn('./butler', ['push', `./build/ctjs - v${pack.version}/${platform}`, `comigo/ct-nightly:${platform}${channelPostfix ? '-' + channelPostfix : ''}`, '--userversion', buildNumber]);
        } else {
            await spawnise.spawn('./butler', ['push', `./build/ctjs - v${pack.version}/${platform}`, `comigo/ct:${platform}${channelPostfix ? '-' + channelPostfix : ''}`, '--userversion', pack.version]);
        }
    }
};
/* eslint-enable no-await-in-loop */
const sendGithubDraft = async () => {
    if (nightly) {
        return; // Do not create github releases for nightlies
    }
    const readySteady = (await import('readysteady')).default;
    const draftData = await readySteady({
        owner: 'ct-js',
        repo: 'ct-js',
        // eslint-disable-next-line id-blacklist
        tag: `v${pack.version}`,
        force: true,
        files: platforms.map(platform => `./build/ctjs - v${pack.version}/ct.js v${pack.version} for ${platform}.zip`)
    });
    console.log(draftData);
};

const deploy = gulp.series([packages, deployItchOnly, zipPackages, sendGithubDraft]);

const launchDevMode = done => {
    watch();
    launchApp();
    done();
};
const launchDevModeNoNW = done => {
    watch();
    done();
};
const defaultTask = gulp.series(build, launchDevMode);
const devNoNW = gulp.series(build, launchDevModeNoNW);

exports.lintJS = lintJS;
exports.lintTags = lintTags;
exports.lintStylus = lintStylus;
exports.lintI18n = lintI18n;
exports.lint = lint;
exports.packages = packages;
exports.nwbuild = bakePackages;
exports.docs = docs;
exports.build = build;
exports.deploy = deploy;
exports.zipPackages = zipPackages;
exports.deployItchOnly = deployItchOnly;
exports.sendGithubDraft = sendGithubDraft;
exports.default = defaultTask;
exports.dev = devNoNW;
exports.bakeCompletions = bakeCompletions;
exports.bakeTypedefs = bakeTypedefs;
exports.bakeJSDocJson = bakeJSDocJson;

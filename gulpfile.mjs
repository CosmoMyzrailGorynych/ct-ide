/* eslint-disable no-process-env */
'use strict';

/* eslint no-console: 0 */
import path from 'path';
import gulp from 'gulp';
import log from 'gulplog';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import minimist from 'minimist';
import gulpTs from '@ct.js/gulp-typescript';
import {build as esbuild} from 'esbuild';
import stylus from 'gulp-stylus';
import riot from 'gulp-riot';
import pug from 'gulp-pug';
import sprite from 'gulp-svgstore';
import zip from 'gulp-zip';

import stylelint from 'stylelint';
import eslint from 'gulp-eslint-new';

import replaceExt from 'gulp-ext-replace';
import fs from 'fs-extra';

import i18n from './buildScripts/i18n/index.js';

import resedit from 'resedit-cli';

import {$} from 'execa';

console.log(`
 ╭──────────────────────────────────────────╮
 │                                          ├──╮
 │  If you have recently pulled changes     │  │
 │  or have just cloned the repo, run this  │  │
 │  command in your console:                │  │
 │                                          │  │
 │  $ gulp -f devSetup.gulpfile.mjs         │  │
 │                                          │  │
 ╰─┬────────────────────────────────────────╯  │
   ╰───────────────────────────────────────────╯
`);

// eslint-disable-next-line max-len
/** @type {{os: 'windows' | 'linux' | 'darwin', name: string, itchChannel: string}[]} */
const platforms = [{
    os: 'linux',
    name: 'Linux arm64',
    itchChannel: 'linuxArm64'
}, {
    os: 'linux',
    name: 'Linux x64',
    itchChannel: 'linux64'
}, {
    os: 'darwin',
    name: 'MacOS arm64 App',
    itchChannel: 'osxArm64'
}, {
    os: 'darwin',
    name: 'MacOS x64 App',
    itchChannel: 'osx64'
}, {
    os: 'windows',
    name: 'Windows x64',
    itchChannel: 'win64'
}];

const argv = minimist(process.argv.slice(2));

const neutralinoConfig = fs.readJsonSync('./neutralino.config.json');

var channelPostfix = argv.channel || false,
    fixEnabled = argv.fix || false,
    nightly = argv.nightly || false,
    buildNumber = argv.buildNum || false;
var verbose = argv.verbose || false;

if (nightly) {
    channelPostfix = 'nightly';
}

const colorGreen = '\x1b[32m';
const colorYellow = '\x1b[33m';
const colorTeal = '\x1b[36m';
const colorReset = '\x1b[0m';

export const help = () => {
    console.log(`
Start a dev session:
    ${colorGreen}gulp${colorReset}
Lint sources:
    ${colorGreen}gulp lint${colorReset}
Bake packages:
    ${colorGreen}gulp packages${colorReset}
Build everything and publish packages:
    ${colorGreen}gulp deploy${colorReset}

For the list of all tasks, run ${colorGreen}gulp --tasks-simple${colorReset}.

Additional CLI args:

    ${colorYellow}--channel${colorReset} ${colorTeal}sausage${colorReset}
        Channel postfix when pushing to itch.io.
    ${colorYellow}--fix${colorReset}
        Attempts to fix issues during linting.
    ${colorYellow}--nightly${colorReset}
        Forces the channel postfix to \`nightly\` and bundles a different app icon.
    ${colorYellow}--buildNum${colorReset} ${colorTeal}0.3.0${colorReset}
        Sets the build number for itch.io and Github builds.
    ${colorYellow}--verbose${colorReset}
        More logging when applicable.
    `);
    return Promise.resolve();
};

// // --------------------------------------------- // //
// // Building the ct.IDE part served by Neutralino // //
// // --------------------------------------------- // //

const compileStylus = () =>
    gulp.src('./src/styles/theme*.styl')
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
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/'));

const riotSettings = {
    compact: false,
    template: 'pug',
    modular: true
};
export const compileRiot = () =>
    gulp.src('./src/riotTags/**/*.tag')
    .pipe(riot(riotSettings))
    .pipe(concat('riotTags.js'))
    .pipe(gulp.dest('./temp/'));

const concatScripts = () =>
    gulp.src('./src/js/**/*.js')
    .pipe(sourcemaps.init({
        largeFile: true
    }))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./temp/'));


const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/language/css/css.worker.js',
    'vs/language/html/html.worker.js',
    'vs/language/typescript/ts.worker.js',
    'vs/editor/editor.worker.js'
];
/**
 * Bundles language workers and the editor's worker for monaco-editor.
 * It is needed to be packaged this way to actually work with worker threads.
 * The workers are then linked in src/js/3rdParty/mountMonaco.js
 * @see https://github.com/microsoft/monaco-editor/blob/b400f83fe3ac6a1780b7eed419dc4d83dbf32919/samples/browser-esm-esbuild/build.js
 */
const bundleMonacoWorkers = () => esbuild({
    entryPoints: workerEntryPoints.map((entry) => `node_modules/monaco-editor/esm/${entry}`),
    bundle: true,
    format: 'iife',
    outbase: 'node_modules/monaco-editor/esm/',
    outdir: './app/data/monaco-workers/'
});


const builtinModules = JSON.parse(fs.readFileSync('./builtinModules.json'));
builtinModules.push(...builtinModules.map(m => `node:${m}`));
/**
 * Bundles all the JS scripts into a single bundle.js file.
 * This file is then loaded with a regular <script> in ct.IDE.
 */
const bundleIdeScripts = async () => {
    const result = await esbuild({
        entryPoints: ['./temp/bundle.js'],
        bundle: true,
        minify: true,
        legalComments: 'inline',
        platform: 'browser',
        format: 'iife',
        outfile: './app/data/bundle.js',
        sourcemap: true,
        loader: {
            '.ttf': 'file'
        },
        alias: {
            path: 'path-browserify',
            'node:path': 'path-browserify',
            // Drop references to Node.js built-in modules in Civet code
            'node:fs': 'src/lib/noopModule.ts',
            'node:vm': 'src/lib/noopModule.ts',
            'node:module': 'src/lib/noopModule.ts'
        },
        plugins: [{
            name: 'dedupe-buntralino-client',
            setup({onResolve}) {
                const fileProtocolPattern = process.platform === 'win32' ? 'file:///' : 'file://';
                const buntralinoClient = import.meta.resolve('buntralino-client').replace(fileProtocolPattern, '');
                onResolve({
                    filter: /^buntralino-client$/
                }, () => ({
                    path: buntralinoClient
                }));
            }
        }],
        metafile: argv.metafile
    });
    if (argv.metafile) {
        await fs.outputJson('metafile.json', result.metafile);
    }
};

// Ct.js client library typedefs to be consumed by ct.IDE's code editors.
export const bakeTypedefs = () =>
    gulp.src('./src/typedefs/default/**/*.ts')
    .pipe(concat('global.d.ts'))
    .pipe(gulp.dest('./app/data/typedefs/'));
export const bakeCtTypedefs = () => {
    const tsProject = gulpTs.createProject('./src/ct.release/tsconfig.json');
    return gulp.src('./src/ct.release/index.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('./app/data/typedefs'));
};

const baseEsbuildConfig = {
    entryPoints: ['./src/ct.release/index.ts'],
    bundle: true,
    minify: false,
    legalComments: 'inline'
};
export const buildCtJsLib = () => {
    const processes = [];
    // Ct.js client library for exporter's consumption
    processes.push(esbuild({
        ...baseEsbuildConfig,
        outfile: './app/data/ct.release/ct.js',
        platform: 'browser',
        format: 'iife',
        external: [
            'node_modules/pixi.js',
            'node_modules/pixi-spine',
            'node_modules/@pixi/particle-emitter',
            'node_modules/@pixi/sound'
        ]
    }));
    // Pixi.js dependencies
    processes.push(esbuild({
        ...baseEsbuildConfig,
        entryPoints: ['./src/ct.release/index.pixi.ts'],
        tsconfig: './src/ct.release/tsconfig.json',
        sourcemap: 'linked',
        minify: true,
        outfile: './app/data/ct.release/pixi.js'
    }));
    // Convert debugger's client to JS
    processes.push(esbuild({
        ...baseEsbuildConfig,
        tsconfig: './src/ct.release/tsconfig.json',
        entryPoints: ['./src/ct.release/index.debugger.ts'],
        outfile: './app/data/ct.release/debugger.js',
        sourcemap: false
    }));
    // Copy other game library's files
    processes.push(gulp.src([
        './src/ct.release/**',
        '!./src/ct.release/*.ts',
        '!./src/ct.release/changes.txt',
        '!./src/ct.release/tsconfig.json'
    ]).pipe(gulp.dest('./app/data/ct.release')));
    return Promise.all(processes);
};
const watchCtJsLib = () => {
    gulp.watch([
        './src/ct.release/**/*',
        '!./src/ct.release/changes.txt'
    ], buildCtJsLib);
};

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

export const fetchNeutralino = async () => {
    await $({
        preferLocal: true
    })`neu update`;
    await $({
        preferLocal: true,
        cwd: './src/bun/lib/packForDesktop/'
    })`neu update`;
};
export const copyNeutralinoClient = async () => {
    await Promise.all([
        fs.copy('./neutralinoClient/neutralino.js', './app/data/neutralino.js'),
        fs.copy('./neutralinoClient/neutralino.js', './app/data/ct.release/desktopPack/game/neutralino.js')
    ]);
};

const assets = async () => {
    const outputDir = './app/assets';
    await fs.copy('./bundledAssets/', outputDir);
    await Promise.all([
        fs.remove(path.join(outputDir, '.git')),
        fs.remove(path.join(outputDir, '.gitignore')),
        fs.remove(path.join(outputDir, 'lint.bat')),
        fs.remove(path.join(outputDir, 'lint.mjs'))
    ]);
};

export const build = gulp.parallel([
    bundleMonacoWorkers,
    gulp.series(icons, compilePug),
    compileStylus,
    gulp.series(
        compileScripts,
        bundleIdeScripts
    ),
    buildCtJsLib,
    bakeTypedefs,
    bakeCtTypedefs,
    copyNeutralinoClient,
    assets
]);

// // ---------------------- // //
// // Dev mode, watch server // //
// // ---------------------- // //

const watchScripts = () => {
    gulp.watch('./src/js/**/*', gulp.series(compileScripts, bundleIdeScripts));
};
const watchRiot = () => {
    gulp.watch('./src/riotTags/**/*.tag', gulp.series(compileScripts, bundleIdeScripts));
};
const watchStylus = () => {
    gulp.watch('./src/styles/**/*', compileStylus);
};
const watchPug = () => {
    gulp.watch('./src/pug/**/*.pug', compilePug);
};
const watchRequires = () => {
    gulp.watch('./src/lib/**/*', bundleIdeScripts);
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
    watchCtJsLib();
    watchIcons();
};

const launchApp = () => $({
    stderr: 'inherit',
    stdout: 'inherit',
    preferLocal: true
})`buntralino run src/bun/index.ts`;

const launchDevMode = async () => {
    watch();
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        await launchApp();
    }
};


// // --------------- // //
// // Linting & tests // //
// // --------------- // //

export const lintStylus = () => stylelint.lint({
    files: [
        './src/styles/**/*.styl',
        '!./src/styles/3rdParty/**/*.styl'
    ],
    formatter: 'string'
}).then(lintResults => {
    if (lintResults.errored) {
        console.log(lintResults.output);
    } else {
        console.log('✔ Cheff\'s kiss! 😙👌');
    }
});

export const lintJS = () => gulp.src([
    './src/js/**/*.js',
    '!./src/js/3rdparty/**/*.js',
    './src/lib/**/*.js',
    './src/lib/**/*.ts',
    './src/ct.release/**/*.ts',
    './src/pug/**/*.pug'
])
.pipe(eslint({
    fix: fixEnabled
}))
.pipe(eslint.format())
.pipe(eslint.failAfterError());

export const lintTags = () => gulp.src(['./src/riotTags/**/*.tag'])
.pipe(replaceExt('.pug')) // rename so that it becomes edible for eslint-plugin-pug
.pipe(eslint()) // ESLint-pug cannot automatically fix issues
.pipe(eslint.format())
.pipe(eslint.failAfterError());

export const lintI18n = () => i18n(verbose).then(console.log);

export const lintTS = () => {
    const tsProject = gulpTs.createProject('tsconfig.json');
    return gulp.src('./src/lib/**/*.ts')
        .pipe(tsProject());
};

export const lint = gulp.series(lintJS, lintTS, lintTags, lintStylus, lintI18n);


//  // -------------------------------- // //
//  // Baking production-ready packages // //
//  // -------------------------------- // //

export const getBuiltPackagePath = (pf) => path.join('./build', pf.name);

// -------------------------------------------------- //
// Additionally bundled files for production packages //
// -------------------------------------------------- //

import {bakeDocs} from './devSetup.gulpfile.mjs';

export const patronsCache = async () => {
    const file = await fetch('https://ctjs.rocks/staticApis/patrons.json').then(res => res.text());
    await fs.outputFile('./app/data/patronsCache.json', file);
};

const backupRegexp = /\.backup\d+$/i;
/**
 * @param {string} src
 */
const prodFilesFilter = src => {
    if (src.includes('/.') || src.includes('\\.')) { // skip git files and other hidden files
        return false;
    }
    if (src.includes('/trash/') || src.includes('/prev/') ||
        src.includes('\\trash\\') || src.includes('\\prev\\')) { // Don't bundle preview files
        return false;
    }
    if (src.endsWith('.recovery')) { // Skip project recovery files
        return false;
    }
    if (backupRegexp.test(src)) { // Skip project backup files
        return false;
    }
    return true;
};
const catmods = () => Promise.all(platforms.map(async pf => {
    const outputDir = path.join(getBuiltPackagePath(pf), 'catmods');
    await fs.copy('./src/builtinCatmods/', outputDir, {
        filter: prodFilesFilter
    });
}));
const translations = () => Promise.all(platforms.map(async pf => {
    const outputDir = path.join(getBuiltPackagePath(pf), 'translations');
    await fs.copy('./src/i18n/', outputDir, {
        filter: prodFilesFilter
    });
}));

export const buildBun = async () => {
    const $$ = $({
        cwd: './src/bun'
    });
    await Promise.all(platforms.map(pf =>
        // Packaged bun applications for Windows silently crash if minified normally,
        // use weaker minification flags for now for Windows.
        $$`bun build ./index.ts --compile --target=${pf.bunTarget} --external original-fs ${pf.os === 'windows' ? '' : '--minify --sourcemap'}  --outfile ../../build/bun/ct-${pf.bunTarget}`));
};

export const buildNeutralino = () => $`neu build --release`;


export const sortIntoPackages = async () => {
    await Promise.all(platforms.map(async pf => {
        const packagePath = getBuiltPackagePath(pf);
        await fs.ensureDir(packagePath);
        const execExtension = pf.os === 'windows' ? '.exe' : '';
        await Promise.all([
            // Copy Neutralino resources archive and the executable
            fs.copy('./build/ctjs/resources.neu', path.join(packagePath, 'resources.neu')),
            fs.copy(`./build/ctjs/ctjs-${pf.neutralinoPostfix}${execExtension}`, path.join(packagePath, `neutralino${execExtension}`)),
            // Copy the bun executable
            fs.copy(`./build/bun/ct-${pf.bunTarget}${execExtension}`, path.join(packagePath, `ctjs${execExtension}`))
        ]);
    }));
};

export const updateNightlyIcon = async () => {
    // Use the appropriate icon for each release channel
    if (nightly) {
        await fs.copy('./buildAssets/nightly.png', './app/ct_ide.png');
        await fs.writeFile('./app/nightly', '😝');
    } else {
        await fs.copy('./buildAssets/icon.png', './app/ct_ide.png');
        await fs.remove('./app/nightly');
    }
};

export const copyItchToml = () => Promise.all(platforms.map(pf => {
    const {os} = pf;
    const packagedPath = getBuiltPackagePath(pf);
    if (os === 'windows') {
        return fs.copy(
            './buildAssets/windows.itch.toml',
            path.join(packagedPath, '.itch.toml')
        );
    }
    if (os === 'darwin') {
        return fs.copy(
            './buildAssets/mac.itch.toml',
            path.join(packagedPath, '.itch.toml')
        );
    }
    return fs.copy(
        './buildAssets/linux.itch.toml',
        path.join(packagedPath, '.itch.toml')
    );
}));

export const dumpPfx = () => {
    if (!process.env.SIGN_PFX) {
        log.warn('❔ \'dumpPfx\': Cannot find PFX certificate in environment variables. Provide it as a local file at ./CoMiGoGames.pfx or set the environment variable SIGN_PFX.');
        return Promise.resolve();
    }
    return fs.writeFile(
        './CoMiGoGames.pfx',
        Buffer.from(process.env.SIGN_PFX, 'base64')
    );
};

export const patchWindowsExecutables = async () => {
    const exePatchMain = {
        icon: [`IDR_MAINFRAME,./buildAssets/${nightly ? 'nightly' : 'icon'}.ico`],
        'product-name': 'ct.js',
        'product-version': neutralinoConfig.version.split('-')[0] + '.0',
        'file-description': 'Ct.js game engine',
        'file-version': neutralinoConfig.version.split('-')[0] + '.0',
        'company-name': 'CoMiGo Games',
        'original-filename': 'ctjs.exe',
        sign: true,
        p12: './CoMiGoGames.pfx'
    };
    if (process.env.SIGN_PASSWORD) {
        exePatchMain.password = process.env.SIGN_PASSWORD.replace(/_/g, '');
    }

    if (!(await fs.pathExists(exePatchMain.p12))) {
        log.warn('⚠️  \'patchWindowsExecutables\': Cannot find PFX certificate. Continuing without signing.');
        delete exePatchMain.p12;
        exePatchMain.sign = false;
    } else if (!process.env.SIGN_PASSWORD) {
        log.warn('⚠️  \'patchWindowsExecutables\': Cannot find PFX password in the SIGN_PASSWORD environment variable. Continuing without signing.');
        delete exePatchMain.p12;
        exePatchMain.sign = false;
    }

    const exePatchNeutralino = {
        ...exePatchMain,
        icon: false,
        'product-name': 'ct.js\' Neutralino service',
        'original-filename': 'neutralino.exe',
        'file-description': 'Ct.js game engine'
    };
    await Promise.all(platforms.map(async (pf) => {
        if (pf.os !== 'windows') {
            return;
        }
        const packagedPath = getBuiltPackagePath(pf);
        // Make sure both bun and main executables are signed and have a nice icon
        const mainExePath = path.join(packagedPath, 'ctjs.exe');
        const neutralinoExePath = path.join(packagedPath, 'neutralino.exe');
        await Promise.all([
            resedit({
                in: mainExePath,
                out: mainExePath,
                ...exePatchMain
            }),
            resedit({
                in: neutralinoExePath,
                out: neutralinoExePath,
                ...exePatchNeutralino
            })
        ]);
    }));
};

export const buildBuntralino = () => $({
    stderr: 'inherit',
    stdout: 'inherit'
})`buntralino build src/bun/index.ts -- --external original-fs`;

export const bakePackages = gulp.series([
    updateNightlyIcon,
    buildBuntralino,
    gulp.parallel([
        copyItchToml,
        catmods,
        translations
    ])
]);

export const packages = gulp.series([
    fetchNeutralino,
    lint,
    gulp.parallel([
        build,
        bakeDocs,
        dumpPfx,
        patronsCache
    ]),
    bakePackages,
    patchWindowsExecutables
]);

// TODO: remove when close to merging
export const packagesNoLint = gulp.series([
    fetchNeutralino,
    gulp.parallel([
        build,
        bakeDocs,
        dumpPfx
    ]),
    bakePackages
]);

// ------------------ //
// Deploying packages //
// ------------------ //

const installButler = async () => {
    await $`curl -L -o butler.zip https://broth.itch.ovh/butler/linux-amd64/LATEST/archive/default`;
    await $`unzip butler.zip`;
    await $`chmod +x ./butler`;
    await $`rm butler.zip`;
    await $({
        stderr: 'pipe',
        stdout: 'pipe'
    })`./butler -v`; // Make sure butler works
};

/* eslint-disable no-await-in-loop */
export const deployItchOnly = async () => {
    log.info(`'deployItchOnly': Deploying to channel ${channelPostfix}…`);
    for (const platform of platforms) {
        if (nightly) {
            await $`./butler
                push
                ./build/${platform.name}${platform.os === 'darwin' ? ' App' : ''}
                ctjs/ct-nightly:${platform.itchChannel}${channelPostfix ? '-' + channelPostfix : ''}
                --userversion ${buildNumber}`;
        } else {
            await $`./butler
                push
                ./build/${platform.name}${platform.os === 'darwin' ? ' App' : ''}
                ctjs/ct:${platform.itchChannel}${channelPostfix ? '-' + channelPostfix : ''}
                --userversion ${neutralinoConfig.version}`;
        }
    }
};

export const deployItch = gulp.series([
    installButler,
    deployItchOnly
]);

// Contrary to itch.io, GitHub requires to upload individual files for the releases
// so we zip each build into its own archive.
// Use system's zip package if running on Linux/MacOS
// Use gulp-zip on Windows
export let zipPackages;
if (process.platform === 'win32') {
    const zipsForAllPlatforms = platforms.map(platform => () =>
        gulp.src(`./build/ctjs - v${neutralinoConfig.version}/${platform.name}/**`)
        .pipe(zip(`ct.js v${neutralinoConfig.version} for ${platform.name}.zip`))
        .pipe(gulp.dest(`./build/ctjs - v${neutralinoConfig.version}/`)));
    zipPackages = gulp.parallel(zipsForAllPlatforms);
} else {
    zipPackages = async () => {
        if (nightly) {
            return; // Do not create archives on github releases for Nightly builds
        }
        for (const platform of platforms) {
            // eslint-disable-next-line no-await-in-loop
            await $`
                cd "./build/ctjs - v${neutralinoConfig.version}/"
                zip -rqy "ct.js v${neutralinoConfig.version} for ${platform.name}.zip" "./${platform.name}"
                rm -rf "./${platform.name}"
            `;
        }
    };
}

export const sendGithubDraft = async () => {
    if (nightly) {
        return; // Do not create github releases for Nightly builds
    }
    const readySteady = (await import('readysteady')).default;
    const v = neutralinoConfig.version;
    const draftData = await readySteady({
        owner: 'ct-js',
        repo: 'ct-js',
        // eslint-disable-next-line id-blacklist
        tag: `v${neutralinoConfig.version}`,
        force: true,
        files: platforms.map(platform => `./build/ctjs - v${v}/ct.js v${v} for ${platform.name}.zip`)
    });
    console.log(draftData);
};
export const deploy = gulp.series([packages, deployItch, zipPackages, sendGithubDraft]);

// TODO: Remove when close to release
export const deployNoLint = gulp.series([packagesNoLint, deployItch, zipPackages, sendGithubDraft]);


// Default task — dev mode
export default gulp.series(build, launchDevMode);

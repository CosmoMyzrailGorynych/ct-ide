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

import streamQueue from 'streamqueue';
import replaceExt from 'gulp-ext-replace';
import notifier from 'node-notifier';
import fs from 'fs-extra';

import spawnise from './buildScripts/spawnise/index.js';
import execute from './buildScripts/execute.js';
import i18n from './buildScripts/i18n/index.js';

import resedit from 'resedit-cli';

import {$} from 'execa';

// TODO: update to match neutralino's output
const neutralinoPlatforms = [
    ['linux', 'ia32', 'linux32'],
    ['linux', 'x64', 'linux64'],
    ['osx', 'x64', 'osx64'],
    // ['osx', 'arm64', 'osxarm'],
    ['win', 'ia32', 'win32'],
    ['win', 'x64', 'win64']
];
const bunPlatforms = ['bun-linux-x64', 'bun-linux-arm64', 'bun-windows-x64', 'bun-darwin-x64', 'bun-darwin-arm64'];

const argv = minimist(process.argv.slice(2));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const neutralinoConfig = fs.readJsonSync('./neutralino.config.json');

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
        icon: path.join(process.cwd(), 'error.png'),
        sound: true,
        wait: false
    };
};

const fileChangeNotifier = p => {
    notifier.notify({
        title: `Updating ${path.basename(p)}`,
        message: `${p}`,
        icon: path.join(process.cwd(), 'cat.png'),
        sound: false,
        wait: false
    });
};

// ---------------- //
// Building the app //
// ---------------- //

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
    .on('error', err => {
        console.error('[pug error]', err);
        notifier.notify(makeErrorObj('Pug failure', err));
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
    .pipe(gulp.dest('./temp/'));

const concatScripts = () =>
    streamQueue(
        {
            objectMode: true
        },
        // PIXI.js is used as window.PIXI
        gulp.src('./src/js/exposeGlobalNodeModules.js'),
        gulp.src('./temp/riotTags.js'),
        gulp.src(['./src/js/**/*.js', '!./src/js/exposeGlobalNodeModules.js'])
    )
    .pipe(sourcemaps.init({
        largeFile: true
    }))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./temp/'))
    .on('error', err => {
        console.error('[scripts error]', err);
        notifier.notify({
            title: 'Scripts error',
            message: err.toString(),
            icon: path.join(process.cwd(), 'error.png'),
            sound: true,
            wait: true
        });
    })
    .on('change', fileChangeNotifier);


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
const bundleIdeScripts = () => esbuild({
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
        path: 'path-browserify'
    }
});

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
        sourcemap: 'inline'
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
    ], buildCtJsLib)
    .on('change', fileChangeNotifier)
    .on('error', err => {
        console.error('[Ct.js game library error]', err);
        notifier.notify(makeErrorObj('Ct.js game library failure', err));
    });
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
    await $`neu update`;
    await $({
        preferLocal: true,
        localDir: './app/node_modules/',
        cwd: './src/ct.release/desktopPack/'
    })`neu update`;
    // Patch the .d.ts file until https://github.com/neutralinojs/neutralino.js/pull/117 is merged
    const ideClient = await fs.readFile('./neutralinoClient/neutralino.d.ts', 'utf8');
    await fs.writeFile('./neutralinoClient/neutralino.d.ts', ideClient.replaceAll('export ', ''));
    const gameClient = await fs.readFile('./src/ct.release/desktopPack/game/neutralino.d.ts', 'utf8');
    await fs.writeFile('./src/ct.release/desktopPack/game/neutralino.d.ts', gameClient.replaceAll('export ', ''));
};
export const copyNeutralinoClient = async () => {
    await fs.copy('./neutralinoClient/neutralino.js', './app/data/neutralino.js');
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
    copyNeutralinoClient
]);

// ---------------------- //
// Dev mode, watch server //
// ---------------------- //

const watchScripts = () => {
    gulp.watch('./src/js/**/*', gulp.series(compileScripts, bundleIdeScripts))
    .on('error', err => {
        console.error('[scripts error]', err);
        notifier.notify(makeErrorObj('General scripts error', err));
    })
    .on('change', fileChangeNotifier);
};
const watchRiot = () => {
    const watcher = gulp.watch('./src/riotTags/**/*.tag', compileRiot);
    watcher.on('error', err => {
        console.error('[pug error]', err);
        notifier.notify(makeErrorObj('Riot failure', err));
    });
    watcher.on('change', gulp.series(compileScripts, bundleIdeScripts));
};
const watchStylus = () => {
    gulp.watch('./src/styles/**/*', compileStylus)
    .on('error', err => {
        console.error('[styl error]', err);
        notifier.notify(makeErrorObj('Stylus failure', err));
    })
    .on('change', fileChangeNotifier);
};
const watchPug = () => {
    gulp.watch('./src/pug/**/*.pug', compilePug)
    .on('change', fileChangeNotifier)
    .on('error', err => {
        console.error('[pug error]', err);
        notifier.notify(makeErrorObj('Pug failure', err));
    });
};
const watchRequires = () => {
    gulp.watch('./src/lib/**/*', bundleIdeScripts)
    .on('change', fileChangeNotifier)
    .on('error', err => {
        notifier.notify(makeErrorObj('Failure of lib scripts', err));
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
    watchCtJsLib();
    watchIcons();
};

const launchApp = () => $`neu run`;

const launchDevMode = done => {
    watch();
    launchApp();
    done();
};


// --------------- //
// Linting & tests //
// --------------- //

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


// -------------------------------------------------- //
// Additionally bundled files for production packages //
// -------------------------------------------------- //

export const docs = async () => {
    try {
        await fs.remove('./app/data/docs/');
        await spawnise.spawn(npm, ['run', 'build'], {
            cwd: './docs',
            shell: true
        });
        await fs.copy('./docs/docs/.vuepress/dist', './app/data/docs/');
    } catch (e) {
        showErrorBox();
        throw e;
    }
};

export const patronsCache = async () => {
    const file = await fetch('https://ctjs.rocks/staticApis/patrons.json').then(res => res.text());
    await fs.outputFile('./app/data/patronsCache.json', file);
};

const examples = () => gulp.src('./src/examples/**/*')
    .pipe(gulp.dest('./app/examples'));

const templates = () => gulp.src('./src/projectTemplates/**/*')
    .pipe(gulp.dest('./app/templates'));

const gallery = () => gulp.src('./bundledAssets/**/*')
    .pipe(gulp.dest('./app/bundledAssets'));

// -------------------------------- //
// Baking production-ready packages //
// -------------------------------- //

export const bakePackages = async () => {
    // Use the appropriate icon for each release channel
    if (nightly) {
        await fs.copy('./buildAssets/nightly.png', './app/ct_ide.png');
        await fs.writeFile('./app/nightly', '😝');
    } else {
        await fs.copy('./buildAssets/icon.png', './app/ct_ide.png');
        await fs.remove('./app/nightly');
    }
    await fs.remove(path.join('./build', `ctjs - v${neutralinoConfig.version}`));
    await $`neu build --release`;

    // TODO: Update
    // Copy .itch.toml files for each target platform
    log.info('\'bakePackages\': Copying appropriate .itch.toml files to built apps.');
    await Promise.all(neutralinoPlatforms.map(pf => {
        const [platform, /* arch */, itchChannel] = pf;
        if (platform === 'win') {
            return fs.copy(
                './buildAssets/windows.itch.toml',
                path.join(`./build/ctjs - v${neutralinoConfig.version}`, itchChannel, '.itch.toml')
            );
        }
        if (platform === 'osx') {
            return fs.copy(
                './buildAssets/mac.itch.toml',
                path.join(`./build/ctjs - v${neutralinoConfig.version}`, itchChannel, '.itch.toml')
            );
        }
        return fs.copy(
            './buildAssets/linux.itch.toml',
            path.join(`./build/ctjs - v${neutralinoConfig.version}`, itchChannel, '.itch.toml')
        );
    }));
    log.info('\'bakePackages\': Built to this location:', path.resolve(path.join('./build', `ctjs - v${neutralinoConfig.version}`)));
};

// Building the bun sidekick for all supported platforms
export const buildBunRelease = () => Promise.all(bunPlatforms.map(platform => $({
    cwd: './backend'
})`bun build index.ts --compile  --minify --sourcemap --target=${platform} --outfile ../extensions/bun/main-app-${platform}`));

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
const exePatch = {
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
    exePatch.password = process.env.SIGN_PASSWORD.replace(/_/g, '');
}
export const patchWindowsExecutables = async () => {
    // TODO: update
    if (!(await fs.pathExists(exePatch.p12))) {
        log.warn('⚠️  \'patchWindowsExecutables\': Cannot find PFX certificate. Continuing without signing.');
        delete exePatch.p12;
        exePatch.sign = false;
    } else if (!process.env.SIGN_PASSWORD) {
        log.warn('⚠️  \'patchWindowsExecutables\': Cannot find PFX password in the SIGN_PASSWORD environment variable. Continuing without signing.');
        delete exePatch.p12;
        exePatch.sign = false;
    }
    if (neutralinoPlatforms.some(p => p[0] === 'win' && p[1] === 'x64')) {
        await resedit({
            in: `./build/ctjs - v${neutralinoConfig.version}/win64/ctjs.exe`,
            out: `./build/ctjs - v${neutralinoConfig.version}/win64/ctjs.exe`,
            ...exePatch
        });
    }
    if (neutralinoPlatforms.some(p => p[0] === 'win' && p[1] === 'ia32')) {
        await resedit({
            in: `./build/ctjs - v${neutralinoConfig.version}/win32/ctjs.exe`,
            out: `./build/ctjs - v${neutralinoConfig.version}/win32/ctjs.exe`,
            ...exePatch
        });
    }
};

export let zipPackages;
if (process.platform === 'win32') {
    const zipsForAllPlatforms = neutralinoPlatforms.map(platform => () =>
        gulp.src(`./build/ctjs - v${neutralinoConfig.version}/${platform[2]}/**`)
        .pipe(zip(`ct.js v${neutralinoConfig.version} for ${platform[2]}.zip`))
        .pipe(gulp.dest(`./build/ctjs - v${neutralinoConfig.version}/`)));
    zipPackages = gulp.parallel(zipsForAllPlatforms);
} else {
    zipPackages = async () => {
        // TODO: update
        for (const platform of neutralinoPlatforms) {
            // eslint-disable-next-line no-await-in-loop
            await execute(({exec}) => exec(`
                cd "./build/ctjs - v${neutralinoConfig.version}/"
                zip -rqy "ct.js v${neutralinoConfig.version} for ${platform[2]}.zip" "./${platform[2]}"
                rm -rf "./${platform[2]}"
            `));
        }
    };
}

export const packages = gulp.series([
    lint,
    gulp.parallel([
        build,
        docs,
        examples,
        fetchNeutralino,
        templates,
        gallery,
        dumpPfx,
        patronsCache
    ]),
    bakePackages,
    patchWindowsExecutables
]);

// ------------------ //
// Deploying packages //
// ------------------ //

/* eslint-disable no-await-in-loop */
export const deployItchOnly = async () => {
    // TODO: Update
    log.info(`'deployItchOnly': Deploying to channel ${channelPostfix}…`);
    for (const platform of neutralinoPlatforms) {
        if (nightly) {
            await spawnise.spawn('./butler', [
                'push',
                `./build/ctjs - v${neutralinoConfig.version}/${platform[2]}`,
                `comigo/ct-nightly:${platform[2]}${channelPostfix ? '-' + channelPostfix : ''}`,
                '--userversion',
                buildNumber
            ]);
        } else {
            await spawnise.spawn('./butler', [
                'push',
                `./build/ctjs - v${neutralinoConfig.version}/${platform[2]}`,
                `comigo/ct:${platform[2]}${channelPostfix ? '-' + channelPostfix : ''}`,
                '--userversion',
                neutralinoConfig.version
            ]);
        }
    }
};
/* eslint-enable no-await-in-loop */
export const sendGithubDraft = async () => {
    // TODO: Update
    if (nightly) {
        return; // Do not create github releases for nightlies
    }
    const readySteady = (await import('readysteady')).default;
    const v = neutralinoConfig.version;
    const draftData = await readySteady({
        owner: 'ct-js',
        repo: 'ct-js',
        // eslint-disable-next-line id-blacklist
        tag: `v${neutralinoConfig.version}`,
        force: true,
        files: neutralinoPlatforms.map(platform => `./build/ctjs - v${v}/ct.js v${v} for ${platform[2]}.zip`)
    });
    console.log(draftData);
};
export const deploy = gulp.series([packages, deployItchOnly, zipPackages, sendGithubDraft]);


// Default task — dev mode
export default gulp.series(build, launchDevMode);

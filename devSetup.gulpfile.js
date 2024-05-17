'use strict';

const versions = require('./versions');

/* eslint no-console: 0 */
const spawnise = require('./node_requires/spawnise'),
      gulp = require('gulp'),
      minimist = require('minimist');


const fs = require('fs-extra');

const argv = minimist(process.argv.slice(2));

spawnise.logs = argv.logs || false; // gulp --logs

const cleanup = () => {
    const fs = require('fs-extra');
    return Promise.all([
        fs.remove('./app/data/node_requires'),
        fs.remove('./app/data/docs')
    ]);
};

const npmInstall = path => done => {
    console.log(`Running 'npm install' for ${path}…`);
    spawnise.spawn((/^win/).test(process.platform) ? 'npm.cmd' : 'npm', ['install'], {
        cwd: path || './',
        shell: true
    })
    .then(done)
    .catch(err => {
        console.error(`'npm install' failed for ${path}`);
        done(err);
    });
};

const bakeDocs = async () => {
    const npm = (/^win/).test(process.platform) ? 'npm.cmd' : 'npm';
    await fs.remove('./app/data/docs/');
    await spawnise.spawn(npm, ['run', 'build'], {
        cwd: './docs',
        shell: true
    });
    await fs.copy('./docs/docs/.vuepress/dist', './app/data/docs/');
};

const updateGitSubmodules = () =>
    spawnise.spawn('git', ['submodule', 'update', '--init', '--recursive']);

const makeVSCodeLaunchJson = () => {
    const template = require('./.vscode/launch-template.json');
    template.configurations.find(c => c.type === 'nwjs').nwjsVersion = versions.nwjs;
    return fs.outputJson('./.vscode/launch.json', template, {
        spaces: 4
    });
};

const fetchNeutralino = async () => (await import('./gulpfile.mjs')).fetchNeutralino();

const defaultTask = gulp.series([
    updateGitSubmodules,
    gulp.parallel([
        npmInstall('./'),
        npmInstall('./app'),
        npmInstall('./docs')
    ]),
    cleanup,
    gulp.parallel([
        bakeDocs,
        makeVSCodeLaunchJson,
        fetchNeutralino
    ])
]);

gulp.task('default', defaultTask);

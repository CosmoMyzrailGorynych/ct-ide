'use strict';

/* eslint no-console: 0 */
const spawnise = require('./node_requires/spawnise'),
      gulp = require('gulp'),
      minimist = require('minimist');

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
        cwd: path || './'
    })
    .then(done)
    .catch(err => {
        console.error(`'npm install' failed for ${path}`);
        done(err);
    });
};

const bakeDocs = async () => {
    const npm = (/^win/).test(process.platform) ? 'npm.cmd' : 'npm';
    const fs = require('fs-extra');
    await fs.remove('./app/data/docs/');
    await spawnise.spawn(npm, ['run', 'build'], {
        cwd: './docs'
    });
    await fs.copy('./docs/docs/.vuepress/dist', './app/data/docs/');
};

const updateGitSubmodules = () =>
    spawnise.spawn('git', ['submodule', 'update', '--init', '--recursive']);

const defaultTask = gulp.series([
    updateGitSubmodules,
    gulp.parallel([
        npmInstall('./'),
        npmInstall('./app'),
        npmInstall('./docs')
    ]),
    cleanup,
    bakeDocs
]);

gulp.task('default', defaultTask);

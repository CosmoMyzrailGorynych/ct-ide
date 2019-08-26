'use strict';

/* eslint no-console: 0 */
const spawnise = require('./node_requires/spawnise'),
      gulp = require('gulp'),
      minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

spawnise.logs = argv.logs || false; // gulp --logs

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

const updateGitSubmodules = () =>
    spawnise.spawn('git', ['submodule', 'update', '--init', '--recursive']);

const defaultTask = gulp.series([
    updateGitSubmodules,
    gulp.parallel([
        npmInstall('./'),
        npmInstall('./app'),
        npmInstall('./docs')
    ])
]);

gulp.task('default', defaultTask);

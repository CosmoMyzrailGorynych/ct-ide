(function () {
    'use strict';

    const notifier = require('node-notifier'),
        path = require('path'),
        gulp = require('gulp'),
        concat = require('gulp-concat'),
        sourcemaps = require('gulp-sourcemaps'),
        stylus = require('gulp-stylus'),
        riot = require('gulp-riot'),
        pug = require('gulp-pug'),
        streamQueue = require('streamqueue'),
        closureCompiler = require('gulp-closure-compiler'),
        fs = require('fs-extra');

    var args = require('get-gulp-args')();
    var isMakingAReselase = args.indexOf('release') !== -1;

    var fileChangeNotifier = e => {
        notifier.notify({
            title: `Обновляем ${path.basename(e.path)}`,
            message: `${e.path}`,
            icon: path.join(__dirname, 'cat.png'),
            sound: false,
            wait: false
        });
    };


    gulp.task('riot', function() {
        return gulp.src('./tags/**')
        .pipe(riot({
            compact: false,
            template: 'pug'
        }))
        .pipe(concat('riot.js'))
        .pipe(gulp.dest('./temp'));
    });
    gulp.task('watchRiot', function() {
        return gulp.watch('./tags/**', ['scripts'])
        .on('error', err => {
            notifier.notify({
                title: 'Ошибка Riot',
                message: err.toString(),
                icon: path.join(__dirname, 'error.png'),
                sound: true,
                wait: true
            });
            console.error('[riot error]', err);
        })
        .on('change', fileChangeNotifier);
    });


    gulp.task('scripts', ['riot'], function () {
        streamQueue({objectMode: true},
            gulp.src('./js/**'),
            gulp.src('./temp/riot.js')
        )
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/'))
        /* .pipe(closureCompiler({
            compilerPath: 'bower_components/closure-compiler/closure-compiler-v20170626.jar',
            maxBuffer: 100500,
            continueWithWarnings: true,
            compilerFlags: {
                'language_in': 'ECMASCRIPT6',
                // 'third_party': 'true',
                'warning_level': 'QUIET'
            },
            define: [
                'goog.DEBUG=false'
            ],
            fileName: 'bundle.js'
        }))
        .pipe(gulp.dest('./app/'))*/
        .on('error', err => {
            notifier.notify({
                title: 'Ошибка скриптов',
                message: err.toString(),
                icon: path.join(__dirname, 'error.png'),
                sound: true,
                wait: true
            });
            console.error('[scripts error]', err);
        })
        .on('change', fileChangeNotifier);
    });

    gulp.task('watchScripts', function() {
        return gulp.watch('./js/**', ['scripts'])
            .on('error', err => {
                notifier.notify({
                    title: 'Общая ошибка скриптов',
                    message: err.toString(),
                    icon: path.join(__dirname, 'error.png'),
                    sound: true,
                    wait: true
                });
                console.error('[scripts error]', err);
            })
            .on('change', fileChangeNotifier);
    });
    gulp.task('watchStyl', function() {
        return gulp.watch('./styl/**', ['stylus'])
            .on('error', err => {
                notifier.notify({
                    title: 'Ошибка Stylus',
                    message: err.toString(),
                    icon: path.join(__dirname, 'error.png'),
                    sound: true,
                    wait: true
                });
                console.error('[styl error]', err);
            })
            .on('change', fileChangeNotifier);
    });
    gulp.task('watchPug', function() {
        return gulp.watch('./pug/**/*.pug', ['pug'])
            .on('change', fileChangeNotifier)
            .on('error', err => {
                notifier.notify({
                    title: 'Ошибка Pug',
                    message: err.toString(),
                    icon: path.join(__dirname, 'error.png'),
                    sound: true,
                    wait: true
                });
                console.error('[pug error]', err);
            });
    });

    gulp.task('stylus', function () {
        return gulp.src('./styl/_index.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: false
        }))
        .pipe(concat('bundle.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/'));
    });
    gulp.task('pug', function () {
        return gulp.src('./pug/*.pug')
        .pipe(pug({
            pretty: false
        }))
        .on('error', err => {
            notifier.notify({
                title: 'Ошибка pug',
                message: err.toString(),
                icon: path.join(__dirname, 'error.png'),
                sound: true,
                wait: true
            });
            console.error('[pug error]', err);
        })
        .pipe(gulp.dest('./app/'));
    });

    gulp.task('default', isMakingAReselase?
        ['pug', 'stylus', 'scripts'] :
        ['pug', 'stylus', 'watchScripts', 'watchStyl', 'watchPug', 'scripts', 'watchRiot']
    );
})();

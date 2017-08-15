(function () {
    'use strict'

    const notifier = require('node-notifier'),
        path = require('path'),
        gulp = require('gulp'),
        concat = require('gulp-concat'),
        stylus = require('gulp-stylus'),
        pug = require('gulp-pug'),
        streamQueue = require('streamqueue'),
        closureCompiler = require('gulp-closure-compiler');

    var fileChangeNotifier = e => {
        notifier.notify({
            title: `Обновляем ${path.basename(e.path)}`,
            message: `${e.path}`,
            icon: path.join(__dirname, 'cat.png'),
            sound: false,
            wait: false
        });
    };

    gulp.task('scripts', [], function () {
        streamQueue({objectMode: true},
            gulp.src('./js/**')
        )
        .pipe(concat('bundle.js'))
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
        .pipe(stylus({
            compress: true
        }))
        .pipe(concat('bundle.css'))
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

    gulp.task('default', ['pug', 'stylus', 'watchScripts', 'watchStyl', 'watchPug', 'scripts']);
})();

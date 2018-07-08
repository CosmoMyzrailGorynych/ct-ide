'use strict';

const notifier = require('node-notifier'),
      path = require('path'),
      {spawn} = require('child_process'),
      gulp = require('gulp'),
      concat = require('gulp-concat'),
      sourcemaps = require('gulp-sourcemaps'),
      stylus = require('gulp-stylus'),
      riot = require('gulp-riot'),
      pug = require('gulp-pug'),
      streamQueue = require('streamqueue'),
//      closureCompiler = require('gulp-closure-compiler'),
      fs = require('fs-extra'),
      eslint = require('gulp-eslint'),
      stylint = require('gulp-stylint'),
      NwBuilder = require('nw-builder');

const makeErrorObj = (title, err) => ({
    title,
    message: err.toString(),
    icon: path.join(__dirname, 'error.png'),
    sound: true,
    wait: true
});

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
    gulp.src('./src/styl/_index.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
        compress: true
    }))
    .pipe(concat('bundle.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/'));

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

const compileScripts = gulp.series(compileRiot, () =>
    streamQueue({objectMode: true},
        gulp.src('./src/js/**'),
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
    .on('change', fileChangeNotifier)
);

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

const watch = () => {
    watchScripts();
    watchStylus();
    watchPug();
    watchRiot();
};

const build = gulp.parallel([compilePug, compileStylus, compileScripts]);

const lintStylus = () => gulp.src(['./src/styl/**/*.styl', '!./src/styl/3rdParty/**/*.styl'])
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylint.reporter('fail'));

const lintJS = () => gulp.src(['./src/js/**/*.js', '!./src/js/3rdparty/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

const lint = gulp.series(lintJS, lintStylus);

const launchNw = () => {
    var nw = new NwBuilder({
        files: './app/**',
        version: '0.31.2',
        platforms: ['osx64', 'win32', 'win64', 'linux32', 'linux64'],
        flavor: 'sdk'
    });
    return nw.run().catch(function (error) {
        console.error(error);
    })
    .then(launchNw);
};

const docs = done => {
    fs.remove('./app/docs/')
    .then(spawn('hexo', ['generate']).on('close', () => {
            fs.copy('./docs/public/', './app/docs/', {
                overwrite: true,
                recursive: true
            })
            .then(fs.copy('./docs/jquery-3.2.1.min.js', './app/docs/jquery-3.2.1.min.js'))
            .then(fs.copy('./docs/lunr.min.js', './app/docs/lunr.min.js'))
            .then(done);
        })
    );
};

const release = gulp.series([build, lint, docs, done => {
    var nw = new NwBuilder({
        files: './app/**',
        platforms: ['osx64', 'win32', 'win64', 'linux32', 'linux64'],
        version: '0.31.2',
        flavor: 'normal',
        buildType: 'versioned'
    });
    nw.build().then(done)
    .catch(function (error) {
        console.error(error);
    });
}]);


const defaultTask = gulp.series(build, done => {
    watch();
    launchNw();
    done();
});


gulp.task('lint', lint);
gulp.task('release', release);
gulp.task('docs', docs);
gulp.task('build', build);
gulp.task('default', defaultTask);

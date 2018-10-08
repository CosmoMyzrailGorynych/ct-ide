'use strict';

const path = require('path'),
      {spawn} = require('child_process'),
      
      gulp = require('gulp'),
      concat = require('gulp-concat'),
      sourcemaps = require('gulp-sourcemaps'),
      stylus = require('gulp-stylus'),
      riot = require('gulp-riot'),
      pug = require('gulp-pug'),
      gulpif = require('gulp-if'),
      eslint = require('gulp-eslint'),
      stylint = require('gulp-stylint'),
      
      streamQueue = require('streamqueue'),
      notifier = require('node-notifier'),
      fs = require('fs-extra'),
      NwBuilder = require('nw-builder');

const closureCompiler = require('google-closure-compiler-js').gulp();

var releasing = false;

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

const spawnise = (app, attrs) => new Promise((resolve, reject) => {
    var process = spawn(app, attrs);
    process.on('exit', code => {
        if (!code) {
            resolve();
        } else {
            reject(code);
        }
    });
    process.stderr.on('data', data => {
        console.error(data.toString());
    });
    process.stdout.on('data', data => {
        console.log(data.toString());
    });
});

const compileStylus = () =>
    gulp.src('./src/styl/theme*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
        compress: true
    }))
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
    .pipe(gulpif(releasing, sourcemaps.init()))
    .pipe(concat('bundle.js'))
    .pipe(gulpif(releasing, sourcemaps.write()))
    .pipe(gulpif(releasing, closureCompiler({
        compilation_level: 'SIMPLE',
        language_in: 'ECMASCRIPT_NEXT',
        language_out: 'ECMASCRIPT5',
        js_output_file: 'bundle.js',
        output_wrapper: '(function(){\n%output%\n}).call(this)',
        warning_level: 'QUIET'
        //error_format: 'JSON'
    }, {
        platform: ['native', 'java', 'javascript']
    })))
    .pipe(gulp.dest('./app/'))
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
    .then(spawnise('npm', ['run', 'docs:build']))
    .then(done);
};

const release = gulp.series([done => {
    releasing = true;
    done();
}, build, lint, done => {
    var nw = new NwBuilder({
        files: ['./app/**', '!./app/export'],
        platforms: [/*'osx64', 'win32', */'win64'/*, 'linux32', 'linux64'*/],
        version: '0.33.4',
        flavor: 'sdk',
        buildType: 'versioned',
        forceDownload: true,
        zip: false,
        macIcns: './app/ct.ide.icns'
    });
    nw.build()
    .then(() => {
        console.log('Binaries done');
        done();
    })
    .catch(function (error) {
        console.error(error);
        done(error);
    });
}]);

const deployOnly = done => {
    var pack = require('./app/package.json');
    spawnise('./butler', ['push', `./build/ctjs - v${pack.version}/linux32`, 'comigo/ct:linux32', '--userversion', pack.version])
    .then(() => spawnise('./butler', ['push', `./build/ctjs - v${pack.version}/linux64`, 'comigo/ct:linux64', '--userversion', pack.version]))
    .then(() => spawnise('./butler', ['push', `./build/ctjs - v${pack.version}/osx64`, 'comigo/ct:osx64', '--userversion', pack.version]))
    .then(() => spawnise('./butler', ['push', `./build/ctjs - v${pack.version}/win32`, 'comigo/ct:win32', '--userversion', pack.version]))
    .then(() => spawnise('./butler', ['push', `./build/ctjs - v${pack.version}/win64`, 'comigo/ct:win64', '--userversion', pack.version]))
    .then(() => {
        done();
    })
    .catch(done);
};

const deploy = gulp.series([release, deployOnly]);


const defaultTask = gulp.series(build, done => {
    watch();
    launchNw();
    done();
});


gulp.task('lint', lint);
gulp.task('release', release);
gulp.task('docs', docs);
gulp.task('build', build);
gulp.task('deploy', deploy);
gulp.task('deployOnly', deployOnly);
gulp.task('default', defaultTask);

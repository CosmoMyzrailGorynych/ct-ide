(function () {
    try {
        const gulp = require('gulp');
        gulp.task('reload', function () {
            /* global nw */
            nw.Window.get().reload();
        });
        gulp.watch(['./bundle.*', './**/index.html'], ['reload']);
    } catch (e) {
        console.error(e);
    }
})();

(function () {
    try {
        var reloading = false;
        const gulp = require('gulp');
        const reload = () => {
            /* global nw */
            if (!reloading) {
                reloading = true;
                nw.App.quit();
            }
        };
        gulp.watch(['./theme*.css', './index.html', './bundle.js', './js/**.js'], reload);
    } catch (e) { void 0; }
})();

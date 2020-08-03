(function gulpWatch() {
    try {
        var reloading = false;
        const gulp = require('gulp');
        const reload = () => {
            if (!reloading) {
                reloading = true;
                if (nw.App.fullArgv.find(arg => arg.indexOf('--remote-debugging-port') !== -1)) {
                    // Seems that we have an external debugger attached. Reload.
                    nw.Window.get().reload();
                } else {
                    // Quit and let gulp handle the reload.
                    nw.App.quit();
                }
            }
        };
        gulp.watch(['./data/theme*.css', './index.html', './data/bundle.js', './data/js/**.js', './data/node_requires/**/*.js'], reload);
    } catch (e) {
        void 0;
    }
})();

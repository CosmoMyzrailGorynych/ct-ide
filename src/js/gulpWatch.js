(function gulpWatch() {
    try {
        var reloading = false;
        const gulp = require('gulp');
        const path = require('path');
        const getTagName = src => path.basename(src, path.extname(src));
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

        const tagWatcher = gulp.watch(['./data/hotLoadTags/**/*.js']);
        const onChange = src => {
            const fs = require('fs-extra');
            const riotTag = getTagName(src);
            fs.readFile(src, 'utf8')
            .then(script => {
                // eslint-disable-next-line no-console
                console.log(`[riot] Updating ${riotTag} tag…`);
                try {
                    // eslint-disable-next-line no-eval
                    eval(script);
                    riot.reload(riotTag);
                    alertify.success(`Updated ${riotTag} tag.`);
                } catch (err) {
                    alertify.error(`Could not update ${riotTag} tag. See the console for details.`);
                    throw err;
                }
            });
        };
        tagWatcher.on('change', onChange);
        tagWatcher.on('add', onChange);
    } catch (e) {
        void 0;
    }
})();

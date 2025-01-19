import fs from './neutralino-fs-extra';

(() => {
    if (NL_RESMODE !== 'directory') {
        return;
    }

    const appDataPath = NL_CWD + '/app/data';
    fs.createWatcher(appDataPath);

    const criticalFiles: string[] = ['index.html', 'bundle.js'];

    Neutralino.events.on('watchFile', (e) => {
        const {action, dir, filename} = e.detail as {
            action: 'modified' | 'add' | 'delete';
            dir: string;
            filename: string;
        };

        if (action !== 'modified') {
            return;
        }

        if (criticalFiles.includes(filename) && dir === appDataPath) {
            location.reload();
        } else if (filename === `theme${localStorage.UItheme}.css`) {
            const link = document.getElementById('themeCSS') as HTMLLinkElement;
            link.href = '/data/theme' + localStorage.UItheme + '.css?q=' + Date.now();
            alertify.log('Theme reloaded');
        }
    });
})();

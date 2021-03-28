ct.desktop = {
    isNw: window.nw && window.nw.App,
    isElectron: null,
    quit() {
        if (ct.desktop.isNw) {
            if (window.iAmInCtIdeDebugger) {
                // eslint-disable-next-line no-console
                console.warn('We don\'t quit because ct.js would quit as well. Let\'s imagine that the game has exited! :D');
            } else {
                nw.App.quit();
            }
        } else if (ct.desktop.isElectron) {
            require('electron').remote.getCurrentWindow().close();
        } else {
            console.error('[ct.desktop/quit] Unknown environment :c Are we in a browser?');
        }
    }
};

try {
    require('electron');
    ct.desktop.isElectron = true;
} catch (e) {
    ct.desktop.isElectron = false;
}

ct.desktop.isDesktop = ct.desktop.isNw || ct.desktop.isElectron;

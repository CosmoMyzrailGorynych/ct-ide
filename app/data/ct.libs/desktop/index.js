/* global nw */
ct.desktop = {
    quit() {
        if (window.nw && window.nw.App) {
            if (window.iAmInCtIdeDebugger) {
                nw.Window.get().close();
            } else {
                nw.App.quit();
            }
            return true;
        }
        try {
            require('electron').remote.getCurrentWindow().close();
            return true;
        } catch (e) {
            console.error('Could not exit the game :c Are we in a browser?');
            return false;
        }
    }
};

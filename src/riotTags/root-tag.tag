root-tag(class="{pride: localStorage.prideMode === 'on'}")
    app-view(if="{projectOpened}")
    project-selector(if="{!projectOpened}")
    writable-folder-prompt(if="{showWritableFolderPrompt}" onsuccess="{onWritableSelected}")
    script.
        this.projectOpened = false;
        window.id = Math.random();
        window.signals.on('resetAll', () => {
            const glob = require('./data/node_requires/glob');
            for (const script of window.currentProject.scripts) {
                if (glob.scriptTypings[script.name]) {
                    const [deleteTypingsTS, deleteTypingsJS] = glob.scriptTypings[script.name];
                    if (deleteTypingsTS) {
                        deleteTypingsTS.dispose();
                    }
                    if (deleteTypingsJS) {
                        deleteTypingsJS.dispose();
                    }
                }
            }
            glob.scriptTypings = {};
            global.currentProject = false;
            require('./data/node_requires/glob').modified = false;
            this.projectOpened = false;
            riot.update();
        });
        window.signals.on('projectLoaded', () => {
            require('./data/node_requires/glob').modified = false;
            this.projectOpened = true;
            this.update();
        });

        require('./data/node_requires/platformUtils')
        .getWritableDir()
        .catch(e => {
            console.error(e);
            this.showWritableFolderPrompt = true;
            this.update();
        });

        this.onWritableSelected = () => {
            this.showWritableFolderPrompt = false;
            this.update();
        };

        const stylesheet = document.createElement('style');
        document.head.appendChild(stylesheet);
        const updateStylesheet = () => {
            const css = `
                code, pre {
                    font-family: ${localStorage.fontFamily || 'Iosevka, monospace'};
                    font-variant-ligatures: ${localStorage.codeLigatures === 'off' ? 'none' : 'normal'};
                }
                .monaco-editor .aView-lines.aView-lines {
                    line-height: ${localStorage.codeDense === 'on' ? 1.5 : 1.75};
                }
            `;
            stylesheet.innerHTML = css;
        };
        updateStylesheet();
        window.signals.on('codeFontUpdated', updateStylesheet);
        window.signals.on('prideModeUpdated', () => {
            this.update();
        });

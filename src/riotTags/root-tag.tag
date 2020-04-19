root-tag
    main-menu(if="{!selectorVisible}")
    notepad-panel(if="{!selectorVisible}")
    project-selector(if="{selectorVisible}")
    script.
        this.selectorVisible = true;
        window.signals.on('resetAll', () => {
            global.currentProject = false;
            this.selectorVisible = true;
            riot.update();
        });

        const stylesheet = document.createElement('style');
        document.head.appendChild(stylesheet);
        const updateStylesheet = () => {
            stylesheet.innerHTML = `
                code, pre {
                    font-family: ${localStorage.fontFamily || 'Iosevka, monospace'};
                    font-variant-ligatures: ${localStorage.codeLigatures === 'off'? 'none' : 'normal'};
                }
                .monaco-editor .view-lines.view-lines {
                    line-height: ${localStorage.codeDense === 'on'? 1.5 : 1.75};
                }
            `;
        };
        updateStylesheet();
        window.signals.on('codeFontUpdated', updateStylesheet);
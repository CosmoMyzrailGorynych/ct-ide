root-tag
    main-menu
    notepad-panel
    project-selector(if="{selectorVisible}")
    script.
        this.selectorVisible = true;
        window.signals.on('resetAll', () => {
            window.currentProject = false;
            this.selectorVisible = true;
            riot.update();
        });

        const stylesheet = document.createElement('style');
        document.head.appendChild(stylesheet);
        const updateStylesheet = () => {
            stylesheet.innerHTML = `
                code, pre, .ace_editor.ace_editor {
                    font-family: ${localStorage.fontFamily || 'Iosevka, monospace'};
                    font-variant-ligatures: ${localStorage.codeLigatures === 'off'? 'none' : 'normal'};
                }
                .ace_editor.ace_editor {
                    line-height: ${localStorage.codeDense === 'on'? 1.5 : 1.75};
                }
            `;
        };
        updateStylesheet();
        window.signals.on('codeFontUpdated', updateStylesheet);
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

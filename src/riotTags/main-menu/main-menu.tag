main-menu
    .main-menu-aGrid
        main-menu-project.main-menu-aDoubleSection
        main-menu-deploy.main-menu-aSection
        main-menu-latest-projects.main-menu-aTripleSection
        main-menu-settings.main-menu-aQuadrupleSection
        main-menu-meta.main-menu-aTripleSection
        main-menu-troubleshooting.main-menu-aDoubleSection
    script.
        this.namespace = 'mainMenu';
        this.mixin(window.riotVoc);

        this.openIcons = () => {
            this.parent.tab = 'icons';
            this.parent.update();
        };

main-menu
    .main-menu-aGrid
        main-menu-project.main-menu-aDoubleSection
        main-menu-deploy.main-menu-aSection
        main-menu-latest-projects.main-menu-aTripleSection
        main-menu-settings.main-menu-aQuadrupleSection(ref="settings")
        main-menu-meta.main-menu-aQuadrupleSection(ref="meta")
        main-menu-troubleshooting.main-menu-aDoubleSection
    script.
        this.namespace = 'mainMenu';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.openIcons = () => {
            this.parent.tab = 'icons';
            this.parent.update();
        };

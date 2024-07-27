main-menu-deploy
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{exportForWeb}")
            svg.feather
                use(xlink:href="#globe-alt")
            span {voc.zipExport}
        li(onclick="{toggleDesktopExporter}")
            svg.feather
                use(xlink:href="#monitor")
            span {voc.exportDesktop}
        li(onclick="{toggleMobileExporter}" title="{vocGlob.experimentalFeature}")
            svg.feather
                use(xlink:href="#smartphone")
            span {voc.exportAndroid}
            svg.feather.dim
                use(xlink:href="#test-tube")
    export-desktop-panel(show="{showDesktopExporter}" onclose="{hideDesktopExporter}")
    export-mobile-panel(show="{showMobileExporter}" onclose="{hideMobileExporter}")
    script.
        this.namespace = 'mainMenu.deploy';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        this.exportForWeb = async () => {
            const {exportForWeb} = require('src/node_requires/exporter/packagers/web');
            try {
                const exportFile = await exportForWeb();
                const {showFile} = require('src/node_requires/platformUtils');
                showFile(exportFile);
                alertify.success(this.voc.successZipExport.replace('{0}', exportFile));
            } catch (e) {
                alertify.error(e);
                throw e;
            }
        };

        this.showDesktopExporter = false;
        this.toggleDesktopExporter = () => {
            this.showDesktopExporter = !this.showDesktopExporter;
            this.update();
        };
        this.hideDesktopExporter = () => {
            this.showDesktopExporter = false;
            this.update();
        };

        this.showMobileExporter = false;
        this.toggleMobileExporter = () => {
            this.showMobileExporter = !this.showMobileExporter;
            this.update();
        };
        this.hideMobileExporter = () => {
            this.showMobileExporter = false;
            this.update();
        };

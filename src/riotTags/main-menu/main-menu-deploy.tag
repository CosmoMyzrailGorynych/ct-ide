main-menu-deploy
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{!exportingWeb && exportForWeb}" class="{loading: exportingWeb}")
            svg.feather(if="{!exportingWeb}")
                use(xlink:href="#globe-alt")
            svg.feather.rotate(if="{exportingWeb}")
                use(xlink:href="#loader")
            span {voc.zipExport}
        li(onclick="{toggleDesktopExporter}")
            svg.feather
                use(xlink:href="#monitor")
            span {voc.exportDesktop}
        //- li(onclick="{toggleMobileExporter}" title="{vocGlob.experimentalFeature}")
        //-     svg.feather
        //-         use(xlink:href="#smartphone")
        //-     span {voc.exportAndroid}
        //-     svg.feather.dim
        //-         use(xlink:href="#test-tube")
    export-desktop-panel(show="{showDesktopExporter}" onclose="{hideDesktopExporter}")
    export-mobile-panel(show="{showMobileExporter}" onclose="{hideMobileExporter}")
    script.
        this.namespace = 'mainMenu.deploy';
        this.mixin(require('src/lib/riotMixins/voc').default);

        this.exportForWeb = async () => {
            this.exportingWeb = true;
            this.update();
            const {exportForWeb} = require('src/lib/exporter/packagers/web');
            try {
                const exportFile = await exportForWeb();
                const {showFile} = require('src/lib/platformUtils');
                showFile(exportFile);
                alertify.success(this.voc.successZipExport.replace('{0}', exportFile));
            } catch (e) {
                alertify.error(e.message ? e.message : e);
                alertify.error(this.vocFull.exportPanel.errorOpenedFilesHint);
                throw e;
            }
            this.exportingWeb = false;
            this.update();
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

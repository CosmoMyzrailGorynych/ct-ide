main-menu-deploy
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{exportForWeb}")
            svg.feather
                use(xlink:href="#globe-alt")
            span {voc.zipExport}
        li(onclick="{toggleDesktopExporter}")
            svg.feather
                use(xlink:href="#package")
            span {voc.exportDesktop}
        li(onclick="{toggleMobileExporter}")
            svg.feather
                use(xlink:href="#smartphone")
            span {voc.exportAndroid}
    export-panel(show="{showDesktopExporter}" onclose="{hideDesktopExporter}")
    export-mobile-panel(show="{showMobileExporter}" onclose="{hideMobileExporter}")
    script.
        this.namespace = 'mainMenu.deploy';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.exportForWeb = async () => {
            const fs = require('fs-extra'),
                  path = require('path');
            const {getBuildDir, getExportDir} = require('./data/node_requires/platformUtils');
            const buildFolder = await getBuildDir();
            const runCtExport = require('./data/node_requires/exporter').exportCtProject;
            const exportFile = path.join(
                buildFolder,
                `${global.currentProject.settings.authoring.title || 'ct.js game'}.zip`
            );
            const inDir = await getExportDir();
            await fs.remove(exportFile);
            runCtExport(global.currentProject, global.projdir, true)
            .then(() => {
                const archiver = require('archiver');
                const archive = archiver('zip'),
                      output = fs.createWriteStream(exportFile);

                output.on('close', () => {
                    nw.Shell.showItemInFolder(exportFile);
                    alertify.success(this.voc.successZipExport.replace('{0}', exportFile));
                });

                archive.pipe(output);
                archive.directory(inDir, false);
                archive.finalize();
            })
            .catch(alertify.error);
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

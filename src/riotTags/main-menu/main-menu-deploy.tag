main-menu-deploy
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{exportForWeb}")
            svg.feather
                use(xlink:href="#globe-alt")
            span {voc.zipExport}
        li(onclick="{toggleExporter}")
            svg.feather
                use(xlink:href="#package")
            span {voc.exportDesktop}
    export-panel(show="{showExporter}" onclose="{hideExporter}")
    script.
        this.namespace = 'mainMenu.deploy';
        this.mixin(window.riotVoc);

        this.exportForWeb = async () => {
            const fs = require('fs-extra'),
                  path = require('path');
            const {getBuildDir, getExportDir} = require('./data/node_requires/platformUtils');
            const buildFolder = await getBuildDir();
            const runCtExport = require('./data/node_requires/exporter');
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

        this.showExporter = false;
        this.toggleExporter = () => {
            this.showExporter = !this.showExporter;
            this.update();
        };
        this.hideExporter = () => {
            this.showExporter = false;
            this.update();
        };

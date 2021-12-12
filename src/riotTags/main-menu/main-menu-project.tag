main-menu-project
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{saveProject}")
            svg.feather
                use(xlink:href="#save")
            span {vocGlob.save}
        li(onclick="{zipProject}")
            svg.feather
                use(xlink:href="#package")
            span {voc.zipProject}
        li(onclick="{openIncludeFolder}")
            .spacer
            span {voc.openIncludeFolder}
    ul.aMenu
        li(onclick="{openProject}")
            svg.feather
                use(xlink:href="#folder")
            span {voc.openProject}
        li(onclick="{openExample}")
            .spacer
            span {voc.openExample}
        li(onclick="{toStartScreen}")
            .spacer
            span {voc.startScreen}
    script.
        this.namespace = 'mainMenu.project';
        this.mixin(window.riotVoc);

        this.saveProject = () => {
            window.signals.trigger('saveProject');
        };

        this.openIncludeFolder = () => {
            const fs = require('fs-extra'),
                  path = require('path');
            fs.ensureDir(path.join(global.projdir, '/include'))
            .then(() => {
                nw.Shell.openItem(path.join(global.projdir, '/include'));
            });
        };

        this.zipProject = async () => {
            try {
                const os = require('os'),
                      path = require('path'),
                      fs = require('fs-extra');
                const {getWritableDir} = require('./data/node_requires/platformUtils');

                const writable = await getWritableDir();
                const inDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ctZipProject-')),
                      outName = path.join(writable, `/${sessionStorage.projname}.zip`);

                await this.saveProject();
                await fs.remove(outName);
                await fs.remove(inDir);
                await fs.copy(global.projdir + '.ict', path.join(inDir, sessionStorage.projname));
                await fs.copy(global.projdir, path.join(inDir, sessionStorage.projname.slice(0, -4)));

                const archiver = require('archiver');
                const archive = archiver('zip'),
                      output = fs.createWriteStream(outName);

                output.on('close', () => {
                    nw.Shell.showItemInFolder(outName);
                    alertify.success(this.voc.successZipProject.replace('{0}', outName));
                    fs.remove(inDir);
                });

                archive.pipe(output);
                archive.directory(inDir, false);
                archive.finalize();
            } catch (e) {
                alertify.error(e);
            }
        };

        this.openProjectSelector = path => {
            alertify.confirm(window.languageJSON.common.reallyexit, () => {
                window.showOpenDialog({
                    defaultPath: path,
                    title: window.languageJSON.mainMenu.project.openProject,
                    filter: '.ict'
                })
                .then(projFile => {
                    if (!projFile) {
                        return;
                    }
                    window.signals.trigger('resetAll');
                    window.loadProject(projFile);
                });
            });
        };

        this.openProject = async () => {
            this.openProjectSelector(await require('./data/node_requires/resources/projects').getDefaultProjectDir());
        };

        this.openExample = async () => {
            this.openProjectSelector(await require('./data/node_requires/resources/projects').getExamplesDir());
        };

        this.toStartScreen = () => {
            alertify.confirm(window.languageJSON.common.reallyexit, e => {
                if (e) {
                    window.signals.trigger('resetAll');
                }
            });
        };
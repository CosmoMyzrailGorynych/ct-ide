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
            .aSpacer
            span {voc.openIncludeFolder}
    ul.aMenu
        li(onclick="{openProject}")
            svg.feather
                use(xlink:href="#folder")
            span {voc.openProject}
        li(onclick="{openExample}")
            .aSpacer
            span {voc.openExample}
        li(onclick="{startNewWindow}")
            .aSpacer
            span {voc.startNewWindow}
        li(onclick="{toStartScreen}")
            .aSpacer
            span {voc.startScreen}
    ul.aMenu(if="{window.currentProject.language === 'coffeescript'}")
        li(onclick="{convertToJs}")
            svg.icon
                use(xlink:href="#javascript")
            span {voc.convertToJs}
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
                const {openProject} = require('./data/node_requires/resources/projects');
                openProject(projFile);
            });
        };

        this.openProject = async () => {
            const glob = require('./data/node_requires/glob');
            const projects = require('./data/node_requires/resources/projects');
            if (!glob.modified) {
                this.openProjectSelector(await projects.getDefaultProjectDir());
            } else {
                alertify.confirm(this.vocGlob.reallyExitConfirm)
                .then(async e => {
                    if (e.buttonClicked === 'ok') {
                        this.openProjectSelector(await projects.getDefaultProjectDir());
                    }
                });
            }
        };

        this.openExample = async () => {
            const glob = require('./data/node_requires/glob');
            const projects = require('./data/node_requires/resources/projects');
            if (!glob.modified) {
                this.openProjectSelector(await projects.getExamplesDir());
            } else {
                alertify.confirm(this.vocGlob.reallyExitConfirm)
                .then(async e => {
                    if (e.buttonClicked === 'ok') {
                        this.openProjectSelector(await projects.getExamplesDir());
                    }
                });
            }
        };

        this.startNewWindow = () => {
            const windowSettings = require('./package.json').window;
            nw.Window.open('index.html', windowSettings);
            window.updateWindowMenu();
        };

        this.toStartScreen = () => {
            const glob = require('./data/node_requires/glob');
            if (!glob.modified) {
                window.signals.trigger('resetAll');
            } else {
                alertify.confirm(this.vocGlob.reallyExitConfirm, e => {
                    if (e) {
                        window.signals.trigger('resetAll');
                    }
                });
            }
        };

        this.convertToJs = () => {
            alertify.confirm(this.voc.confirmationConvertToJs, e => {
                if (!e) {
                    return;
                }
                const {convertCoffeeToJs} = require('./data/node_requires/resources/projects/convertLanguage');
                convertCoffeeToJs();
                this.update();
            });
        };

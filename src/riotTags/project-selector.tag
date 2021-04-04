project-selector
    #bg.stretch.flexcol
        .spacer
        #intro.panel.flexfix.nogrow
            ul.nav.tabs.flexfix-header.nb
                li(class="{active: tab === 'projects'}" onclick="{changeTab('projects')}")
                    span {voc.latest}
                li(class="{active: tab === 'examples'}" onclick="{changeTab('examples')}")
                    span {voc.examples}
            .flexfix-body.pad(show="{tab === 'projects'}")
                .flexrow
                    h2.nmt {voc.latest}
                    label.file.nm.nogrow
                        button.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="data/icons.svg#folder")
                            span {voc.browse}
                .clear
                ul.Cards.largeicons.nmb
                    li.aCard(
                        each="{project in latestProjects}"
                        onclick="{loadRecentProject}"
                        title="{project}"
                    )
                        img(src="{getProjectThumbnail(project)}")
                        span {getProjectName(project)}
                        .aCard-Actions(onclick="{forgetProject}" title="{voc.forgetProject}")
                            button.tiny
                                svg.feather
                                    use(xlink:href="data/icons.svg#x")
            .flexfix-body.pad(show="{tab === 'examples'}")
                .flexrow
                    h2.nmt {voc.examples}
                    label.file.nm.nogrow
                        button.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="data/icons.svg#folder")
                            span {voc.browse}
                .clear
                ul.Cards.largeicons.nmb
                    li.aCard(
                        each="{project in exampleProjects}"
                        onclick="{loadRecentProject}"
                        title="{project}"
                    )
                        img(src="{getProjectThumbnail(project)}")
                        span {getProjectName(project)}
            #newProject.inset.flexfix-footer.flexrow
                h3.nm.inline {voc.newProject.text}
                input(
                    type='text'
                    placeholder='{voc.newProject.input}'
                    pattern='[a-zA-Z_0-9]\\{1,\\}'
                    ref="projectname"
                )
                button.nm.inline(onclick="{openProjectFolder}") {voc.newProject.button}
        .spacer
        .aVersionNumber.nogrow
            a(href="https://comigo.itch.io/ct" title="{voc.itch}" onclick="{openExternal('https://comigo.itch.io/ct')}")
                svg.icon
                    use(xlink:href="data/icons.svg#itch-dot-io")
            a(href="https://discord.gg/CggbPkb" title="{voc.discord}" onclick="{openExternal('https://discord.gg/CggbPkb')}")
                svg.icon
                    use(xlink:href="data/icons.svg#discord")
            a(href="https://twitter.com/ctjsrocks" title="{voc.twitter}" onclick="{openExternal('https://twitter.com/ctjsrocks')}")
                svg.icon
                    use(xlink:href="data/icons.svg#twitter")
            a(href="https://vk.com/ctjsrocks" title="{voc.vkontakte}" onclick="{openExternal('https://vk.com/ctjsrocks')}")
                svg.icon
                    use(xlink:href="data/icons.svg#vk")
            a(href="https:/patreon.com/comigo" title="{voc.patreon}" onclick="{openExternal('https:/patreon.com/comigo')}")
                svg.icon
                    use(xlink:href="data/icons.svg#patreon")
            .inlineblock v{ctjsVersion}.
            |
            |
            // as itch releases are always in sync with the fetched version number, let's route users to itch.io page
            a.inlineblock(if="{newVersion}" href="https://comigo.itch.io/ct#download" onclick="{openExternal}")
                | {newVersion}
                img(src="data/img/partycarrot.gif" if="{newVersion}").aPartyCarrot
    script.
        const fs = require('fs-extra'),
              path = require('path');
        this.ctjsVersion = process.versions.ctjs;
        this.requirePath = path;
        this.namespace = 'intro';
        this.mixin(window.riotVoc);

        this.tab = 'projects';
        this.changeTab = tab => () => {
            this.tab = tab;
        };
        this.getProjectName = project => path.basename(project, path.extname(project));

        this.visible = true;
        var hideProjectSelector = () => {
            this.visible = false;
            this.parent.selectorVisible = false;
            this.update();
        };
        window.signals.on('hideProjectSelector', hideProjectSelector);
        this.on('unmount', () => {
            window.signals.off('hideProjectSelector', hideProjectSelector);
        });
        this.projectSplash = 'data/img/notexture.png';
        this.newVersion = false;

        // Loads recently opened projects
        if (('lastProjects' in localStorage) &&
            (localStorage.lastProjects !== '')) {
            this.latestProjects = localStorage.lastProjects.split(';');
            let removedNonexistent = false;
            Promise.all(this.latestProjects.map(proj => fs.pathExists(proj)
                .then(exists => {
                    if (!exists) {
                        this.latestProjects.splice(this.latestProjects.indexOf(proj), 1);
                        removedNonexistent = true;
                    }
                })
                .catch(err => {
                    alertify.log(`Got a strange error while trying to access ${proj}. See the console for more details.`);
                    console.error(err);
                })))
            .then(() => {
                if (removedNonexistent) {
                    alertify.log('Removed some projects from the list, as they no longer exist.');
                    localStorage.lastProjects = this.latestProjects.join(';');
                }
                this.update();
            });
        } else {
            this.latestProjects = [];
        }
        const projects = require('./data/node_requires/resources/projects');
        this.exampleProjects = [];
        // Loads examples
        fs.readdir(projects.getExamplesDir(), {
            withFileTypes: true
        })
        .then(entries => entries.filter(entry => entry.isFile() && (/\.ict$/i).test(entry.name)))
        .then(entries => entries.map(entry => path.join(projects.getExamplesDir(), entry.name)))
        .then(projects => {
            this.exampleProjects = projects;
            this.update();
        });

        this.getProjectThumbnail = projects.getProjectThumbnail;
        /**
         * Update a splash image of a selected project
         */
        this.updatePreview = projectPath => () => {
            this.projectSplash = 'file://' + path.dirname(projectPath) + '/' + path.basename(projectPath, '.ict') + '/img/splash.png';
        };
        /**
         * Creates a new project.
         * Technically it creates an empty project in-memory, then saves it to a directory.
         * Creates basic directories for sounds and textures.
         */
        this.newProject = async (way, codename) => {
            sessionStorage.showOnboarding = true;
            const defaultProject = require('./data/node_requires/resources/projects/defaultProject').get();
            const YAML = require('js-yaml');
            const projectYAML = YAML.safeDump(defaultProject);
            fs.outputFile(path.join(way, codename + '.ict'), projectYAML)
            .catch(e => {
                alertify.error(this.voc.unableToWriteToFolders + '\n' + e);
                throw e;
            });
            global.projdir = path.join(way, codename);
            sessionStorage.projname = codename + '.ict';
            await fs.ensureDir(path.join(global.projdir, '/img'));
            fs.ensureDir(path.join(global.projdir, '/snd'));
            fs.ensureDir(path.join(global.projdir, '/include'));
            setTimeout(() => { // for some reason, it must be done through setTimeout; otherwise it fails
                fs.copy('./data/img/notexture.png', path.join(global.projdir + '/img/splash.png'), e => {
                    if (e) {
                        alertify.error(e);
                        console.error(e);
                    }
                });
            }, 0);
            window.loadProject(path.join(way, codename + '.ict'));
        };

        /**
         * Opens a recent project when an item in the Recent Project list is double-clicked
         */
        this.loadRecentProject = e => {
            const projectPath = e.item.project;
            window.loadProject(projectPath);
        };
        /**
         * Removes a project from the recents list
         */
        this.forgetProject = e => {
            const {project} = e.item;
            this.latestProjects.splice(this.latestProjects.indexOf(project), 1);
            localStorage.lastProjects = this.latestProjects.join(';');
            e.stopPropagation();
        };

        /**
         * Handler for a manual search for a project folder, triggered by an input[type="file"]
         */
        this.chooseProjectFolder = async () => {
            const {getProjectsDir} = require('./data/node_requires/platformUtils');
            const defaultProjectDir = await getProjectsDir() + '/';
            const projPath = await window.showOpenDialog({
                title: this.voc.newProject.selectProjectFolder,
                defaultPath: defaultProjectDir,
                buttonLabel: this.voc.newProject.saveProjectHere,
                openDirectory: true
            });
            if (projPath) {
                this.newProject(projPath, this.refs.projectname.value.trim());
            }
        };

        this.openProjectFolder = () => {
            const codename = this.refs.projectname.value.trim();
            if (codename.length === 0) {
                alertify.error(this.voc.newProject.nameerr);
                return;
            }
            this.chooseProjectFolder();
        };

        /**
         * Handler for a manual search for a project, triggered by an input[type="file"]
         */
        this.openProjectFind = async () => {
            const defaultProjectDir = require('./data/node_requires/resources/projects').getDefaultProjectDir();
            const proj = await window.showOpenDialog({
                filter: '.ict',
                defaultPath: await defaultProjectDir
            });
            if (!proj) {
                return;
            }
            if (path.extname(proj).toLowerCase() === '.ict') {
                window.loadProject(proj);
                sessionStorage.projname = path.basename(proj);
                global.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
            } else {
                alertify.error(window.languageJSON.common.wrongFormat);
            }
        };

        // Checking for updates
        setTimeout(() => {
            const {isWin, isLinux} = require('./data/node_requires/platformUtils.js');
            let channel = 'osx64';
            if (isWin) {
                channel = 'win64';
            } else if (isLinux) {
                channel = 'linux64';
            }
            fetch(`https://itch.io/api/1/x/wharf/latest?target=comigo/ct&channel_name=${channel}`)
            .then(response => response.json())
            .then(json => {
                if (!json.errors) {
                    if (this.ctjsVersion !== json.latest) {
                        this.newVersion = this.voc.latestVersion.replace('$1', json.latest);
                        this.update();
                    }
                } else {
                    console.error('Update check failed:');
                    console.error(json.errors);
                }
            });
        }, 0);

        this.openExternal = link => e => {
            nw.Shell.openExternal(link);
            e.stopPropagation();
            e.preventDefault();
        };

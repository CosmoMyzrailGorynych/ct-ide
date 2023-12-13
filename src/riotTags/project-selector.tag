//-
    This tag shows the list of latest projects, examples, and templates.
    This is the tag you see after starting ct.js.
project-selector
    #theIntroBg.stretch.flexcol
        .pad.left.nogrow.flexrow
            button.inline.nogrow(onclick="{toggleLanguageSelector}")
                svg.feather
                    use(xlink:href="#translate")
                span {window.languageJSON.mainMenu.settings.language}
            .aSpacer
            .nogrow.project-selector-aPatronsLine(if="{featuredPatron}")
                svg.feather
                    use(xlink:href="#heart")
                span(if="{featuredSponsor}") {voc.sponsoredBy.replace('$1', featuredPatron)}
                span(if="{!featuredSponsor}") {voc.supportedBy.replace('$1', featuredPatron)}
        .aSpacer
        #intro.aPanel.flexfix.nogrow
            ul.aNav.tabs.flexfix-header.nb
                li(class="{active: tab === 'projects'}" onclick="{changeTab('projects')}")
                    svg.feather
                        use(xlink:href="#folder")
                    span {voc.latest}
                li(class="{active: tab === 'examples'}" onclick="{changeTab('examples')}")
                    svg.feather
                        use(xlink:href="#book-open")
                    span {voc.examples}
                li(class="{active: tab === 'templates'}" onclick="{changeTab('templates')}")
                    svg.feather
                        use(xlink:href="#platformer")
                    span {voc.templates}
            .flexfix-body.pad(show="{tab === 'projects'}")
                .flexrow
                    h2.nmt {voc.latest}
                    label.file.nm.nogrow
                        button.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="#folder")
                            span {voc.browse}
                .clear
                ul.Cards.largeicons.nmb
                    li.aCard(
                        each="{project in latestProjects}"
                        onclick="{loadProjectByPath}"
                        title="{project}"
                    )
                        .aCard-aThumbnail
                            img(src="{getProjectThumbnail(project)}")
                        .aCard-Properties
                            span {getProjectName(project)}
                        .aCard-Actions
                            button.tiny.forcebackground(onclick="{cloneProject}" title="{voc.cloneProject}")
                                svg.feather
                                    use(xlink:href="#copy")
                            button.tiny.forcebackground(onclick="{forgetProject}" title="{voc.forgetProject}")
                                svg.feather
                                    use(xlink:href="#x")
            .flexfix-body.pad(show="{tab === 'examples'}")
                .flexrow
                    h2.nmt {voc.examples}
                    label.file.nm.nogrow
                        button.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="#folder")
                            span {voc.browse}
                .clear
                ul.Cards.largeicons.nmb
                    li.aCard(
                        each="{project in exampleProjects}"
                        onclick="{isMac ? cloneProject : loadProjectByPath}"
                        title="{project}"
                    )
                        .aCard-aThumbnail
                            img(src="{getProjectThumbnail(project)}")
                        .aCard-Properties
                            span {getProjectName(project)}
                        .aCard-Actions
                            button.tiny(onclick="{cloneProject}" title="{voc.cloneProject}")
                                svg.feather
                                    use(xlink:href="#copy")
            .flexfix-body.pad(show="{tab === 'templates'}")
                .flexrow
                    h2.nmt {voc.templates}
                    label.file.nm.nogrow
                        button.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="#folder")
                            span {voc.browse}
                p.nmt {voc.templatesInfo}
                .clear
                ul.Cards.largeicons.nmb
                    li.aCard(
                        each="{project in templateProjects}"
                        onclick="{cloneProject}"
                        title="{project}"
                    )
                        .aCard-aThumbnail
                            img(src="{getProjectThumbnail(project)}")
                        .aCard-Properties
                            span {getProjectName(project)}
                        .aCard-Actions
                            button.tiny(onclick="{cloneProject}" title="{voc.cloneProject}")
                                svg.feather
                                    use(xlink:href="#copy")
            #theNewProjectField.inset.flexfix-footer.flexrow
                h3.nm.inline {voc.newProject.text}
                input(
                    type='text'
                    placeholder='{voc.newProject.input}'
                    pattern='[a-zA-Z_0-9]\\{1,\\}'
                    ref="projectname"
                )
                button.nm.inline(onclick="{showCodeLanguageSelector}") {voc.newProject.button}
        .aSpacer
        .aVersionNumber.nogrow
            a(href="https://github.com/orgs/ct-js/" title="{voc.github}" onclick="{openExternal('https://github.com/orgs/ct-js/')}")
                svg.icon
                    use(xlink:href="#github")
            a(href="https://comigo.itch.io/ct" title="{voc.itch}" onclick="{openExternal('https://comigo.itch.io/ct')}")
                svg.icon
                    use(xlink:href="#itch-dot-io")
            a(href="https://discord.gg/CggbPkb" title="{voc.discord}" onclick="{openExternal('https://discord.gg/CggbPkb')}")
                svg.icon
                    use(xlink:href="#discord")
            a(href="https://twitter.com/ctjsrocks" title="{voc.twitter}" onclick="{openExternal('https://twitter.com/ctjsrocks')}")
                svg.icon
                    use(xlink:href="#twitter")
            a(href="https://vk.com/ctjsrocks" title="{voc.vkontakte}" onclick="{openExternal('https://vk.com/ctjsrocks')}")
                svg.icon
                    use(xlink:href="#vk")
            //
                a(href="https:/patreon.com/comigo" title="{voc.patreon}" onclick="{openExternal('https:/patreon.com/comigo')}")
                    svg.icon
                        use(xlink:href="#patreon")
            a(href="https://boosty.to/comigo" title="{voc.boosty}" onclick="{openExternal('https://boosty.to/comigo')}")
                svg.icon
                    use(xlink:href="#boosty")
            .inlineblock v{ctjsVersion}.
            |
            |
            // as itch releases are always in sync with the fetched version number, let's route users to itch.io page
            a.inlineblock(if="{newVersion}" href="https://comigo.itch.io/ct#download" onclick="{openExternal}")
                | {newVersion}
                img(src="data/img/partycarrot.gif" if="{newVersion}").aPartyCarrot
    context-menu(menu="{languagesSubmenu}" ref="languageslist")
    coding-language-selector(
        if="{codeLanguageSelector}"
        oncancelled="{hideCodeLanguageSelector}"
        onselected="{applyCodeLanguage}"
    )
    script.
        const fs = require('fs-extra'),
              path = require('path');
        this.isMac = require('./data/node_requires/platformUtils').isMac;
        const {openProject} = require('./data/node_requires/resources/projects');
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
        this.getProjectThumbnail = projects.getProjectThumbnail;

        this.exampleProjects = [];
        this.templateProjects = [];
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
        fs.readdir(projects.getTemplatesDir(), {
            withFileTypes: true
        })
        .then(entries => entries.filter(entry => entry.isFile() && (/\.ict$/i).test(entry.name)))
        .then(entries => entries.map(entry => path.join(projects.getTemplatesDir(), entry.name)))
        .then(projects => {
            this.templateProjects = projects;
            this.update();
        });

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
            defaultProject.language = this.projectLanguage;
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
            openProject(path.join(way, codename + '.ict'));
        };

        /**
         * Opens a recent project when an item in the Recent Project list is double-clicked
         */
        this.loadProjectByPath = e => {
            const projectPath = e.item.project;
            openProject(projectPath);
        };
        /**
         * Prompts user to clone a project into a different folder/under a different name.
         */
        this.cloneProject = e => {
            e.stopPropagation();
            // Should create a separate async function; otherwise e.stopPropagation(); won't work
            (async () => {
                const {getProjectsDir} = require('./data/node_requires/platformUtils');
                const defaultProjectDir = await getProjectsDir() + '/';
                const {project} = e.item;
                let newIctLocation = await window.showSaveDialog({
                    defaultPath: defaultProjectDir,
                    buttonLabel: this.voc.newProject.saveProjectHere,
                    filter: '.ict'
                });
                if (!newIctLocation.endsWith('.ict')) {
                    newIctLocation += '.ict';
                }
                await fs.copy(project, newIctLocation);
                await fs.copy(project.slice(0, -4), newIctLocation.slice(0, -4));
                openProject(newIctLocation);
            })();
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
               // openDirectory: true,
                saveAs: this.refs.projectname.value.trim()
            });
            if (projPath) {
                const tmpProjPath = projPath.trim();
                const directory = path.dirname(tmpProjPath);
                const file = path.basename(tmpProjPath);
                this.newProject(directory, file);
                // this.newProject(projPath, this.refs.projectname.value.trim());
            }
        };

        this.codeLanguageSelector = false;
        this.showCodeLanguageSelector = () => {
            const codename = this.refs.projectname.value.trim();
            if (codename.length === 0) {
                alertify.error(this.voc.newProject.nameError);
                return;
            }
            this.codeLanguageSelector = true;
        };
        this.hideCodeLanguageSelector = () => {
            this.codeLanguageSelector = false;
            this.update();
        };
        this.applyCodeLanguage = selection => {
            this.projectLanguage = selection;
            this.codeLanguageSelector = false;
            this.update();
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
                openProject(proj);
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

        this.languagesSubmenu = {
            items: []
        };
        const i18nAPI = require('./data/node_requires/i18n');
        i18nAPI.getLanguages().then(languages => {
            for (const language of languages) {
                if (language.filename === 'Debug.json') {
                    continue;
                }
                this.languagesSubmenu.items.push({
                    label: `${language.meta.native} (${language.meta.eng})`,
                    icon: () => localStorage.appLanguage === language.filename.slice(0, -5) && 'check',
                    click: () => {
                        this.switchLanguage(language.filename.slice(0, -5));
                    }
                });
            }
        })
        .catch(e => {
            console.error(e);
            alertify.error(`Error while finding i18n files: ${e}`);
        });
        this.switchLanguage = name => {
            const i18n = require('./data/node_requires/i18n.js');
            try {
                window.languageJSON = i18n.loadLanguage(name);
                localStorage.appLanguage = name;
                window.signals.trigger('updateLocales');
                window.riot.update();
            } catch (e) {
                alertify.alert('Could not open a language file: ' + e);
            }
        };
        this.toggleLanguageSelector = e => {
            this.refs.languageslist.popup(e.clientX, e.clientY);
        };


        this.importPatronData = async () => {
            const fs = require('fs-extra');
            const YAML = require('js-yaml');
            const raw = await fs.readFile('./data/boosters.yaml', 'utf8');
            const patronsYaml = YAML.load(raw);
            this.patrons = patronsYaml;
            const {sponsors, businessCats, cats} = this.patrons;
            if (sponsors.length && Math.random() < 0.5) { // sponsors get priority over other tiers
                this.featuredPatron = sponsors[Math.floor(Math.random() * sponsors.length)];
                this.featuredSponsor = true;
            } else if (businessCats.length && Math.random() < 0.5) {
                this.featuredPatron = businessCats[Math.floor(Math.random() * businessCats.length)];
            } else {
                this.featuredPatron = cats[Math.floor(Math.random() * cats.length)];
            }
            this.update();
        };
        this.importPatronData();

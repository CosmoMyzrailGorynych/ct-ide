project-selector
    #bg.stretch.middle
        #intro.panel.middleinner
            div.flexrow
                .c4.np
                .c8.npt.npb
                    h2 {voc.latest}
            div.flexrow
                .c4.npl.npt.project-selector-aPreview.center
                    img(src="{projectSplash}")
                .c8.npr.npt.npl.flexfix
                    ul.menu.flexfix-body
                        li(
                            each="{project in lastProjects}" title="{requirePath.basename(project,'.json')}"
                            onclick="{updatePreview(project)}"
                            ondblclick="{loadRecentProject}"
                        )
                            .toright(onclick="{forgetProject}" title="{voc.forgetProject}")
                                svg.feather
                                    use(xlink:href="data/icons.svg#x")
                            span {project}
                    label.file.flexfix-footer.nmb
                        button.wide.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="data/icons.svg#folder")
                            span {voc.browse}
            #newProject.inset.flexrow.flexmiddle
                .c4.npl.npt.npb
                    h3.nm.right {voc.newProject.text}
                .c5.np
                    input(
                        type='text'
                        placeholder='{voc.newProject.input}'
                        pattern='[a-zA-Z_0-9]\\{1,\\}'
                        ref="projectname"
                    ).wide
                .c3.npr.npt.npb
                    button.nm.wide.inline(onclick="{openProjectFolder}") {voc.newProject.button}
    .aVersionNumber
        a(href="https://discord.gg/CggbPkb" title="{voc.discord}" onclick="{openExternal('https://discord.gg/CggbPkb')}")
            svg.icon
                use(xlink:href="data/icons.svg#discord")
        a(href="https://twitter.com/ctjsrocks" title="{voc.twitter}" onclick="{openExternal('https://twitter.com/ctjsrocks')}")
            svg.icon
                use(xlink:href="data/icons.svg#twitter")
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
        this.ctjsVersion = require('electron').remote.app.getVersion();
        this.requirePath = path;
        this.namespace = 'intro';
        this.mixin(window.riotVoc);
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
            this.lastProjects = localStorage.lastProjects.split(';');
        } else {
            this.lastProjects = [];
        }

        /**
         * Update a splash image of a selected project
         */
        this.updatePreview = projectPath => e => {
            this.projectSplash = 'file://' + path.dirname(projectPath) + '/' + path.basename(projectPath, '.ict') + '/img/splash.png';
        };
        /**
         * Creates a mew project.
         * Technically it creates an empty project in-memory, then saves it to a directory.
         * Creates basic directories for sounds and textures.
         */
        this.newProject = async (way, codename) => {
            sessionStorage.showOnboarding = true;
            var projectData = {
                ctjsVersion: this.ctjsVersion,
                notes: '/* empty */',
                libs: {
                    place: {
                        gridX: 512,
                        gridY: 512
                    },
                    fittoscreen: {
                        mode: "scaleFit"
                    },
                    mouse: {},
                    keyboard: {},
                    'keyboard.polyfill': {},
                    'sound.howler': {},
                    akatemplate: {
                        csscss: "body {\n    background: #000;\n}"
                    }
                },
                textures: [],
                skeletons: [],
                types: [],
                sounds: [],
                styles: [],
                rooms: [],
                actions: [],
                starting: 0,
                settings: {
                    minifyhtmlcss: false,
                    minifyjs: false,
                    fps: 30,
                    version: [0, 0, 0],
                    versionPostfix: '',
                    export: {
                        windows64: true,
                        windows32: true,
                        linux64: true,
                        linux32: true,
                        mac64: true,
                        debug: false
                    }
                }
            };
            fs.writeJSON(path.join(way, codename + '.ict'), projectData, function(e) {
                if (e) {
                    alertify.error(this.voc.unableToWriteToFolders + '\n' + e);
                    throw e;
                }
            });
            sessionStorage.projdir = path.join(way, codename);
            sessionStorage.projname = codename + '.ict';
            await fs.ensureDir(sessionStorage.projdir + '/img');
            fs.ensureDir(sessionStorage.projdir + '/snd');
            fs.ensureDir(sessionStorage.projdir + '/include');
            setTimeout(() => { // for some reason, it must be done through setTimeout; otherwise it fails
                fs.copy('./data/img/notexture.png', path.join(sessionStorage.projdir + '/img/splash.png'), e => {
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
            var projectPath = e.item.project;
            window.loadProject(projectPath);
        };
        /**
         * Removes a project from the recents list
         */
        this.forgetProject = e => {
            var project = e.item.project;
            this.lastProjects.splice(this.lastProjects.indexOf(project), 1);
            localStorage.lastProjects = this.lastProjects.join(';');
            e.stopPropagation();
        }

        /**
         * Handler for a manual search for a project folder, triggered by an input[type="file"]
         */
        this.chooseProjectFolder = e => {
            const {dialog, BrowserWindow} = require('electron').remote;
            const [path] = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
                title: this.voc.newProject.selectProjectFolder,
                defaultPath: 'projects/',
                buttonLabel: this.voc.newProject.saveProjectHere,
                properties: ['openDirectory']
            }) || [];
            if (path) {
                this.newProject(path, this.refs.projectname.value);
            }
        };

        this.openProjectFolder = e => {
            const codename = this.refs.projectname.value;
            if (codename.length === 0) {
                alertify.error(this.voc.newProject.nameerr);
                return;
            }
            this.chooseProjectFolder();
        };

        /**
         * Handler for a manual search for a project, triggered by an input[type="file"]
         */
        this.openProjectFind = e => {
            const {dialog, BrowserWindow} = require('electron').remote;
            const [proj] = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
                filters: [{
                    name: 'Ct.js project',
                    extensions: ['ict']
                }],
                defaultPath: 'projects/',
                properties: ['openFile']
            }) || [];
            if (!proj) {
                return;
            }
            if (path.extname(proj).toLowerCase() === '.ict') {
                window.loadProject(proj);
                sessionStorage.projname = path.basename(proj);
                sessionStorage.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
            } else {
                alertify.error(languageJSON.common.wrongFormat);
            }
        };

        // Checking for updates
        setTimeout(() => {
            const {isWin, isLinux} = require('./data/node_requires/platformUtils.js');
            const channel = isWin? 'win64' : (isLinux? 'linux64': 'osx64');
            fetch(`https://itch.io/api/1/x/wharf/latest?target=comigo/ct&channel_name=${channel}`)
            .then(data => data.json())
            .then(json => {
                if (!json.errors) {
                    if (this.ctjsVersion != json.latest) {
                        this.newVersion = this.voc.latestVersion.replace('$1', json.latest);
                        this.update();
                    }
                } else {
                    console.error('Update check failed:');
                    console.log(json.errors);
                }
            });
        }, 0);

        this.openExternal = link => e => {
            const {shell} = require('electron');
            shell.openExternal(link);
            e.stopPropagation();
            e.preventDefault();
        };

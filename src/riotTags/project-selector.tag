project-selector
    #bg.stretch
    #intro.modal
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
                        .toright
                            i.icon-x(onclick="{forgetProject}" title="{voc.forgetProject}")
                        span {project}
                label.file.flexfix-footer
                    input(type="file" ref="fileexternal" accept=".ict" onchange="{openProjectFind}")
                    .button.wide.inline
                        i.icon.icon-folder
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
                button.nm.wide.inline(onclick="{newProject}") {voc.newProject.button}
    .aVersionNumber 
        a(href="https://discord.gg/CggbPkb" title="{voc.discord}" onclick="{openExternal('https://discord.gg/CggbPkb')}")
            i.icon-discord
        a(href="https://twitter.com/ctjsrocks" title="{voc.twitter}" onclick="{openExternal('https://twitter.com/ctjsrocks')}")
            i.icon-twitter
        .inlineblock v{nw.App.manifest.version}.  
        a(href="https://ctjs.rocks/" onclick="{openExternal}")   {voc.homepage}.  
        .inlineblock(if="{newVersion}")   {newVersion}
    script.
        const fs = require('fs-extra'),
              path = require('path');
        this.requirePath = path;
        this.namespace = 'intro';
        this.mixin(window.riotVoc);
        this.visible = true;
        window.signals.on('hideProjectSelector', () => {
            this.visible = false;
            this.parent.selectorVisible = false;
            this.update();
        })
        this.projectSplash = '/data/img/nograph.png';
        this.newVersion = false;
        
        // Загрузка списка последних проектов из локального хранилища
        if (('lastProjects' in localStorage) && 
            (localStorage.lastProjects !== '')) {
            this.lastProjects = localStorage.lastProjects.split(';');
        } else {
            this.lastProjects = [];
        }
        
        /**
         * При нажатии на проект в списке последних проектов обновляет сплэш проекта
         */
        this.updatePreview = projectPath => e => {
            this.projectSplash = 'file://' + path.dirname(projectPath) + '/' + path.basename(projectPath, '.ict') + '/img/splash.png';
        };
        
        /**
         * Создаёт в памяти пустой проект, а затем открывает его. 
         * Также записывает файл пустого проекта в папку с проектами рядом с исполняемым файлом ctjs
         * и делает основные директории.
         */
        this.newProject = function() {
            const way = path.dirname(process.execPath).replace(/\\/g,'/') + '/projects';
            var codename = this.refs.projectname.value;
            var projectData = {
                ctjsVersion: nw.App.manifest.version,
                notes: '/* empty */',
                libs: {},
                graphs: [],
                types: [],
                sounds: [],
                styles: [],
                rooms: [],
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
                    throw e;
                }
            });
            sessionStorage.projdir = path.join(way, codename);
            sessionStorage.projname = codename + '.ict';
            fs.ensureDir(sessionStorage.projdir);
            fs.ensureDir(sessionStorage.projdir + '/img');
            fs.ensureDir(sessionStorage.projdir + '/snd');
            fs.ensureDir(sessionStorage.projdir + '/include');
            setTimeout(() => { // почему-то это нужно делать через setTimeout, иначе функция просто не выполняется.
                window.megacopy('./data/img/nograph.png', path.join(sessionStorage.projdir + '/img/splash.png'), e => {
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
         * Событие открытия файла через проводник
         */
        this.openProjectFind = e => {
            var fe = this.refs.fileexternal,
                proj = fe.value;
            if (path.extname(proj).toLowerCase() === '.ict') {
                window.loadProject(proj);
                sessionStorage.projname = path.basename(proj);
                sessionStorage.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
            } else {
                alertify.error(languageJSON.common.wrongFormat);
            }
            fe.value = '';
        };

        // Checking for updates
        setTimeout(() => {
            fetch('https://itch.io/api/1/x/wharf/latest?target=comigo/ct&channel_name=linux32')
            .then(data => data.json())
            .then(json => {
                if (!json.errors) {
                    if (nw.App.manifest.version != json.latest) {
                        this.newVersion = this.voc.latestVersion.replace('$1', json.latest);
                        this.update();
                    }
                }
            });
        }, 0);

        this.openExternal = link => e => {
            nw.Shell.openExternal(link);
            e.stopPropagation();
            e.preventDefault();
        };
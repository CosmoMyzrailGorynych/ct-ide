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
                    ) {project}
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
        | v{nw.App.manifest.version}.  
        a(href="https://ctjs.rocks/") {voc.homepage}.  
        span(if="{newVersion}") {newVersion}
    script.
        const fs = require('fs-extra'),
              path = require('path');
        this.requirePath = path;
        this.namespace = 'intro';
        this.mixin(window.riotVoc);
        this.visible = true;
        this.projectSplash = '/img/nograph.png';
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
                notes: '/* empty */',
                libs: {},
                graphs: [],
                types: [],
                sounds: [],
                styles: [],
                rooms: [],
                graphtick: 0,
                soundtick: 0,
                roomtick: 0,
                typetick: 0,
                styletick: 0,
                starting: 0,
                settings: {
                    minifyhtmlcss: false,
                    minifyjs: false
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
                window.megacopy('./img/nograph.png', path.join(sessionStorage.projdir + '/img/splash.png'), e => {
                    if (e) {
                        alertify.error(e);
                        console.error(e);
                    }
                });
            }, 0);
            this.loadProject(projectData);
        };
        
        /**
         * Открывает проект из списка последних проектов при двойном щелчке
         */
        this.loadRecentProject = e => {
            var projectPath = e.item.project;
            fs.readJSON(projectPath, (err, projectData) => {
                if (err) {
                    alertify.error(languageJSON.common.notfoundorunknown);
                    return;
                }
                sessionStorage.projdir = path.dirname(projectPath) + path.sep + path.basename(projectPath, '.ict');
                sessionStorage.projname = path.basename(projectPath);
                this.loadProject(projectData);
            });
        };
        
        /**
         * Открывает проект и вызывает обновление всего приложения
         */
        this.loadProject = projectData => {
            window.currentProject = projectData;
            fs.ensureDir(sessionStorage.projdir);
            fs.ensureDir(sessionStorage.projdir + '/img');
            fs.ensureDir(sessionStorage.projdir + '/snd');

            if (this.lastProjects.indexOf(path.normalize(sessionStorage.projdir + '.ict')) !== -1) {
                this.lastProjects.splice(this.lastProjects.indexOf(path.normalize(sessionStorage.projdir + '.ict')), 1);
            }
            this.lastProjects.unshift(path.normalize(sessionStorage.projdir + '.ict'));
            if (this.lastProjects.length > 15) {
                this.lastProjects.pop();
            }
            localStorage.lastProjects = this.lastProjects.join(';');
            glob.modified = false;
            
            this.parent.selectorVisible = false;
            setTimeout(() => {
                riot.update();
                this.parent.update();
            }, 0);
        };
        
        /**
         * Событие открытия файла через проводник
         */
        this.openProjectFind = e => {
            var fe = this.refs.fileexternal,
                proj = fe.value;
            if (path.extname(proj).toLowerCase() === '.ict') {
                fs.readJSON(proj, (err, projectData) => {
                    if (err) {
                        alertify.error(err);
                        return;
                    }
                    if (!projectData) {
                        alertify.error(languageJSON.common.wrongFormat);
                        return;
                    }
                    console.log(projectData);
                    sessionStorage.projname = path.basename(proj);
                    sessionStorage.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
                    this.loadProject(projectData);
                });
            } else {
                alertify.error(languageJSON.common.wrongFormat);
            }
            fe.value = '';
        };

        // Checking for updates
        setTimeout(() => {
            fetch('https://itch.io/api/1/x/wharf/latest?target=comigo/ct&channel_name=linux32')
            .then(data => data.json)
            .then(json => {
                if (!json.errors) {
                    if (nw.App.manifest.version != json.latest) {
                        this.newVersion = this.voc.latestVersion.replace('$1', json.latest);
                        this.update();
                    }
                }
            });
        }, 0);
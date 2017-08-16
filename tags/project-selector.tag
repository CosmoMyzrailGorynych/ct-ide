project-selector(show="{visible}")
    #bg.stretch
    #intro.modal
        div
            #previewProject.pt40
                img(src="{projectSplash}")
            .pt60
                h3.center {voc.latest}
                ul.menu
                    li(
                        each="{project in lastProjects}" title="{requirePath.basename(project,'.json')}"
                        onclick="{updatePreview(project)}"
                        ondblclick="{loadRecentProject(project)}"
                    ) {project}
                label.file
                    button.wide.inline
                        i.icon.icon-folder
                        span {voc.browse}
                    input(type="file" ref="fileexternal" accept=".ict" onchange="{openProjectFind}")
        #newProject.inset
            .pt40.center.nopadding
                h3 {voc.newProject.text}
            .pt60.nopadding
                input( 
                    type='text'
                    placeholder='{voc.newProject.input}'
                    pattern='[a-zA-Z_0-9]{1,}'
                    ref="projectname"
                )
                button#newproj.inline(onclick="{newProject}") {voc.newProject.button}
            .clear
    script.
        'use strict';
        const fs = require('fs-extra'),
              path = require('path');
        this.requirePath = path;
        this.voc = window.languageJSON.intro;
        this.visible = true;
        this.projectSplash = '/img/nograph.png';
        
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
            this.projectSplash = path.dirname(projectPath) + '/' + path.basename(projectPath, '.ict') + '/img/splash.png'
        };
        
        /**
         * Создаёт в памяти пустой проект, а затем открывает его. 
         * Также записывает файл пустого проекта в папку с проектами рядом с исполняемым файлом ctjs
         * и делает основные директории.
         */
        this.newProject = function() {
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
            fs.writeJSON(way + '/' + codename + '.ict', currentProject, function(e) {
                if (e) {
                    throw e;
                }
            });
            sessionStorage.projdir = way + '/' + codename;
            sessionStorage.projname = codename + '.ict';
            fs.ensureDir(sessionStorage.projdir);
            fs.ensureDir(sessionStorage.projdir + '/img');
            fs.ensureDir(sessionStorage.projdir + '/snd');
            fs.ensureDir(sessionStorage.projdir + '/include');
            window.megacopy('/img/nograph.png', sessionStorage.projdir + '/img/splash.png', function (e) {
                if (e) throw (e);
            });
            this.loadProject(projectData);
        };
        
        /**
         * Открывает проект из списка последних проектов при двойном щелчке
         */
        this.loadRecentProject = projectPath => {
            var me = $(this);
            fs.readFile(projectPath, function(err, data) {
                if (err) {
                    alertify.error(languageJSON.common.notfoundorunknown);
                    return false;
                }
                sessionStorage.projdir = path.dirname(projectPath) + path.sep + path.basename(projectPath, '.ict');
                sessionStorage.projname = path.basename(projectPath);
                var projectData = JSON.parse(data);
                this.loadProject(projectData);
            });
            return false;
        });
        
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
            
            this.visible = false;
            riot.update();
        };
        
        /**
         * Событие открытия файла через проводник
         */
        this.openProjectFind = e => {
            var fe = this.refs.fileexternal;
            if (path.extname(fe.value).toLowerCase() == '.ict') {
                fs.readFile(fe.value, function(err, data) {
                    if (err) {
                        throw err;
                    }
                    sessionStorage.projname = path.basename(fe.value);
                    sessionStorage.projdir = path.dirname(fe.value) + path.sep + path.basename(fe.value, '.ict');
                    fe.value = '';
                    var projectData = JSON.parse(data) || '';
                    if (projectData) {
                        this.loadProject(projectData);
                    } else {
                        alertify.error(languageJSON.common.wrongFormat);
                    }
                });
            } else {
                alertify.error(languageJSON.common.wrongFormat);
            }
        };

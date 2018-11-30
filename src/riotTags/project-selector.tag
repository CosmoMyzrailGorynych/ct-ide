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
        a(href="https://discord.gg/CggbPkb" title="{voc.discord}" onclick="{openExternal('https://discord.gg/CggbPkb')}")
            i.icon-discord
        a(href="https://twitter.com/ctjsrocks" title="{voc.twitter}" onclick="{openExternal('https://twitter.com/ctjsrocks')}")
            i.icon-twitter
        a(href="https://vk.com/ctjseditor" title="{voc.vkontakte}" onclick="{openExternal('https://vk.com/ctjseditor')}")
            i.icon-vkontakte
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
            this.loadProject(projectData);
        };
        
        /**
         * Открывает проект из списка последних проектов при двойном щелчке
         */
        this.loadRecentProject = e => {
            var projectPath = e.item.project;
            this.checkRecoveryAndLoad(projectPath);
        };
        this.adapter = project => {
            var version = project.ctjsVersion || '0.2.0';
            version = version.split('.').map(string => Number(string));
            if (version[0] < 1) {
                if (version[1] < 3) {
                    /* replace numerical IDs with RFC4122 version 4 UIDs */
                    let startingRoom,
                        graphmap = {},
                        typemap = {};
                    for (var graph of project.graphs) {
                        var oldId = graph.uid;
                        graph.uid = window.generateGUID();
                        graphmap[graph.origname] = graph.uid;
                    }
                    for (var sound of project.sounds) {
                        sound.uid = window.generateGUID();
                    }
                    for (var style of project.styles) {
                        style.uid = window.generateGUID();
                        if (style.fill && style.fill.type == 2) {
                            style.fill.pattern = project.graphs.find(gr => gr.name === style.fill.patname).uid;
                        }
                    }
                    for (var type of project.types) {
                        var oldId = type.uid;
                        type.uid = window.generateGUID();
                        typemap[oldId] = type.uid;
                        type.graph = graphmap[type.graph] || -1;
                    }
                    for (var room of project.rooms) {
                        var oldId = room.uid; 
                        room.thumbnail = room.uid;
                        room.uid = window.generateGUID();
                        if (project.startroom === oldId) {
                            startingRoom = room.uid;
                        }
                        if (room.layers && room.layers.length) {
                            for (var layer of room.layers) {
                                for (var i = 0, l = layer.copies.length; i < l; i++) {
                                    layer.copies[i].uid = typemap[layer.copies[i].uid];
                                }
                            }
                        }
                        if (room.backgrounds && room.backgrounds.length) {
                            for (bg of room.backgrounds) {
                                bg.graph = graphmap[bg.graph];
                            }
                        }
                    }
                    if (!startingRoom) {
                        startingRoom = project.rooms[0].uid;
                    }
                    project.startroom = startingRoom;
                }
                let ps = project.settings;
                if (version[1] < 5) {
                    // Модуль ct.place теперь с конфигами
                    if ('place' in project.libs) {
                        project.libs.place.gridX = project.libs.place.gridY = 512;
                    }
                }
                if (version[1] < 5 || (version[0] > 5 && !ps.version)) {
                    // Появилась настройка версии
                    ps.version = [0, 0, 0];
                    ps.versionPostfix = '';
                    // Появились настройки экспорта
                    ps.export = {
                        windows64: true,
                        windows32: true,
                        linux64: true,
                        linux32: true,
                        mac64: true,
                        debug: false
                    };
                }
            }
            project.ctjsVersion = nw.App.manifest.version;
        };
        
        /**
         * Открывает проект и вызывает обновление всего приложения
         */
        this.loadProject = projectData => {
            window.currentProject = projectData;
            this.adapter(projectData);

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

            if (currentProject.settings.title) {
                document.title = currentProject.settings.title + ' — ct.js';
            }

            setTimeout(() => {
                riot.update();
                this.parent.update();
            }, 0);
        };
        
        /**
         * Checks file format and loads it
         */
        this.loadProjectFile = proj => {
            fs.readJSON(proj, (err, projectData) => {
                if (err) {
                    alertify.error(err);
                    return;
                }
                if (!projectData) {
                    alertify.error(languageJSON.common.wrongFormat);
                    return;
                }
                this.loadProject(projectData);
            });
        };
        /**
         * Событие открытия файла через проводник
         */
        this.openProjectFind = e => {
            var fe = this.refs.fileexternal,
                proj = fe.value;
            if (path.extname(proj).toLowerCase() === '.ict') {
                this.checkRecoveryAndLoad(proj);
                sessionStorage.projname = path.basename(proj);
                sessionStorage.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
            } else {
                alertify.error(languageJSON.common.wrongFormat);
            }
            fe.value = '';
        };
        this.checkRecoveryAndLoad = proj => {
            sessionStorage.projname = path.basename(proj);
            sessionStorage.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
                    
            fs.stat(proj + '.recovery', (err, stat) => {
                if (!err && stat.isFile()) {
                    var targetStat = fs.statSync(proj);
                    alertify
                    .okBtn(this.voc.recovery.loadRecovery)
                    .cancelBtn(this.voc.recovery.loadTarget)
                    /* {0} — target file date
                       {1} — target file state (newer/older)
                       {2} — recovery file date
                       {3} — recovery file state (newer/older)
                    */
                    .confirm(this.voc.recovery.message
                        .replace('{0}', targetStat.mtime.toLocaleString())
                        .replace('{1}', targetStat.mtime < stat.mtime? this.voc.recovery.older : this.voc.recovery.newer)
                        .replace('{2}', stat.mtime.toLocaleString())
                        .replace('{3}', stat.mtime < targetStat.mtime? this.voc.recovery.older : this.voc.recovery.newer)
                    )
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            this.loadProjectFile(proj + '.recovery');
                        } else {
                            this.loadProjectFile(proj);
                        }
                        alertify
                        .okBtn(window.languageJSON.common.ok)
                        .cancelBtn(window.languageJSON.common.cancel);
                    });
                } else {
                    this.loadProjectFile(proj);
                }
            });
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
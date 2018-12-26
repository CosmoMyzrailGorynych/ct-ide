(function (window) {
    /* global nw */
    const fs = require('fs-extra'),
          path = require('path');

    var adapter03x = project => {
        /* replace numerical IDs with RFC4122 version 4 UIDs */
        let startingRoom;
        const graphmap = {},
              typemap = {};
        for (var graph of project.graphs) {
            graph.uid = window.generateGUID();
            graphmap[graph.origname] = graph.uid;
        }
        for (var sound of project.sounds) {
            sound.uid = window.generateGUID();
        }
        for (var style of project.styles) {
            style.uid = window.generateGUID();
            if (style.fill && Number(style.fill.type) === 2) {
                style.fill.pattern = project.graphs.find(gr => gr.name === style.fill.patname).uid;
            }
        }
        for (var type of project.types) {
            const oldId = type.uid;
            type.uid = window.generateGUID();
            typemap[oldId] = type.uid;
            type.graph = graphmap[type.graph] || -1;
        }
        for (var room of project.rooms) {
            const oldId = room.uid; 
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
                for (const bg of room.backgrounds) {
                    bg.graph = graphmap[bg.graph];
                }
            }
        }
        if (!startingRoom) {
            startingRoom = project.rooms[0].uid;
        }
        project.startroom = startingRoom;
    };
    
    var adapter = project => {
        var version = project.ctjsVersion || '0.2.0';
        version = version.split('.').map(string => Number(string));
        if (version[0] < 1) {
            if (version[1] < 3) {
                project = adapter03x(project);
            }
            const ps = project.settings;
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
     * Opens the project and refreshes the whole app.
     * 
     * @param {Object} projectData Loaded JSON file, in js object form
     * @returns {void}
     */
    var loadProject = projectData => {
        window.currentProject = projectData;
        adapter(projectData);

        fs.ensureDir(sessionStorage.projdir);
        fs.ensureDir(sessionStorage.projdir + '/img');
        fs.ensureDir(sessionStorage.projdir + '/snd');

        const lastProjects = localStorage.lastProjects? localStorage.lastProjects.split(';') : [];
        if (lastProjects.indexOf(path.normalize(sessionStorage.projdir + '.ict')) !== -1) {
            lastProjects.splice(lastProjects.indexOf(path.normalize(sessionStorage.projdir + '.ict')), 1);
        }
        lastProjects.unshift(path.normalize(sessionStorage.projdir + '.ict'));
        if (lastProjects.length > 15) {
            lastProjects.pop();
        }
        localStorage.lastProjects = lastProjects.join(';');
        window.glob.modified = false;
        window.signals.trigger('hideProjectSelector');

        if (window.currentProject.settings.title) {
            document.title = window.currentProject.settings.title + ' — ct.js';
        }

        setTimeout(() => {
            window.riot.update();
        }, 0);
    };

    /**
     * Checks file format and loads it
     * 
     * @param {String} proj The path to the file.
     * @returns {void}
     */
    var loadProjectFile = proj => {
        fs.readJSON(proj, (err, projectData) => {
            if (err) {
                window.alertify.error(err);
                return;
            }
            if (!projectData) {
                window.alertify.error(window.languageJSON.common.wrongFormat);
                return;
            }
            loadProject(projectData);
        });
    };

    window.loadProject = proj => {
        sessionStorage.projname = path.basename(proj);
        sessionStorage.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
                
        fs.stat(proj + '.recovery', (err, stat) => {
            if (!err && stat.isFile()) {
                var targetStat = fs.statSync(proj),
                    voc = window.languageJSON.intro.recovery;
                window.alertify
                .okBtn(voc.loadRecovery)
                .cancelBtn(voc.loadTarget)
                /* {0} — target file date
                   {1} — target file state (newer/older)
                   {2} — recovery file date
                   {3} — recovery file state (newer/older)
                */
                .confirm(voc.message
                    .replace('{0}', targetStat.mtime.toLocaleString())
                    .replace('{1}', targetStat.mtime < stat.mtime? voc.older : voc.newer)
                    .replace('{2}', stat.mtime.toLocaleString())
                    .replace('{3}', stat.mtime < targetStat.mtime? voc.older : voc.newer)
                )
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        loadProjectFile(proj + '.recovery');
                    } else {
                        loadProjectFile(proj);
                    }
                    window.alertify
                    .okBtn(window.languageJSON.common.ok)
                    .cancelBtn(window.languageJSON.common.cancel);
                });
            } else {
                loadProjectFile(proj);
            }
        });
    };
})(this);

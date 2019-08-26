(function (window) {
    window.migrationProcess = window.migrationProcess || [];
    window.applyMigrationCode = function (version) {
        const process = window.migrationProcess.find(process => process.version === version);
        if (!process) {
            throw new Error(`Cannot find migration code for version ${version}`);
        }
        process.process(window.currentProject)
        .then(() => window.alertify.success(`Applied migration code for version ${version}`, 'success', 3000));
    };

    /* global nw */
    const fs = require('fs-extra'),
          path = require('path');

    var adapter = async project => {

        // execute all the migration
        var version = (project.ctjsVersion || '0.2.0').replace('-next-', '.');

        const migrationToExecute = window.migrationProcess
            .sort((m1, m2) => {
                    const m1Version = m1.version.replace('-next-', '.').split('.');
                    const m2Version = m2.version.replace('-next-', '.').split('.');

                    for (let i = 0; i < m1Version.length; i++) {
                        if (m1Version[i] < m2Version[i]) {
                            return -1;
                        } else if (m1Version[i] > m2Version[i]) {
                            return 1;
                        }
                    }

                    return 0;
            })
            .filter((migration) => {
                const migrationVersion = migration.version.replace('-next-', '.').split('.');
                const currentVersion = version.split('.');

                for (let i = 0; i < migrationVersion.length; i++) {
                    if (migrationVersion[i] < currentVersion[i]) {
                        return false;
                    } else if (migrationVersion[i] > currentVersion[i]) {
                        return true;
                    }
                }

                return true;
            });

        for (const migration of migrationToExecute) {
            // eslint-disable-next-line no-console
            console.debug('Migrating project to version ' + migration.version);
            // We do need to apply updates in a sequence
            // eslint-disable-next-line no-await-in-loop
            await migration.process(project);
        }
        // Unfortunately, recent versions of eslint give false positives on this line
        // @see https://github.com/eslint/eslint/issues/11900
        // @see https://github.com/eslint/eslint/issues/11899
        // eslint-disable-next-line require-atomic-updates
        project.ctjsVersion = nw.App.manifest.version;
    };

    /**
     * Opens the project and refreshes the whole app.
     *
     * @param {Object} projectData Loaded JSON file, in js object form
     * @returns {void}
     */
    var loadProject = async projectData => {
        const glob = require('./data/node_requires/glob');
        window.currentProject = projectData;
        window.alertify.log(window.languageJSON.intro.loadingProject);
        glob.modified = false;

        try {
            await adapter(projectData);
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
            window.signals.trigger('hideProjectSelector');
            window.signals.trigger('projectLoaded');

            if (window.currentProject.settings.title) {
                document.title = window.currentProject.settings.title + ' — ct.js';
            }

            setTimeout(() => {
                window.riot.update();
            }, 0);
        } catch (err) {
            window.alertify.alert(window.languageJSON.intro.loadingProjectError + err);
        }
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
            try {
                loadProject(projectData);
            } catch (e) {
                window.alertify.error(e);
                console.error(e);
            }
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

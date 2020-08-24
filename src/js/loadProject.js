(function addLoadProjectMethod(window) {
    window.migrationProcess = window.migrationProcess || [];
    window.applyMigrationCode = function applyMigrationCode(version) {
        const process = window.migrationProcess.find(process => process.version === version);
        if (!process) {
            throw new Error(`Cannot find migration code for version ${version}`);
        }
        process.process(global.currentProject)
        .then(() => window.alertify.success(`Applied migration code for version ${version}`, 'success', 3000));
    };

    const fs = require('fs-extra'),
          path = require('path');
    // @see https://semver.org/
    const semverRegex = /(\d+)\.(\d+)\.(\d+)(-[A-Za-z.-]*(\d+)?[A-Za-z.-]*)?/;
    const semverToArray = string => {
        const raw = semverRegex.exec(string);
        return [
            raw[1],
            raw[2],
            raw[3],
            // -next- versions and other postfixes will count as a fourth component.
            // They all will apply before regular versions
            raw[4] ? raw[5] || 1 : null
        ];
    };

    var adapter = async project => {
        var version = semverToArray(project.ctjsVersion || '0.2.0');

        const migrationToExecute = window.migrationProcess
        // Sort all the patches chronologically
        .sort((m1, m2) => {
            const m1Version = semverToArray(m1.version);
            const m2Version = semverToArray(m2.version);

            for (let i = 0; i < 4; i++) {
                if (m1Version[i] < m2Version[i] || m1Version[i] === null) {
                    return -1;
                } else if (m1Version[i] > m2Version[i]) {
                    return 1;
                }
            }
            // eslint-disable-next-line no-console
            console.warn(`Two equivalent versions found for migration, ${m1.version} and ${m2.version}.`);
            return 0;
        })
        // Throw out patches for current and previous versions
        .filter((migration) => {
            const migrationVersion = semverToArray(migration.version);
            for (let i = 0; i < 3; i++) {
                // if any of the first three version numbers is lower than project's,
                // skip the patch
                if (migrationVersion[i] < version[i]) {
                    return false;
                }
                if (migrationVersion[i] > version[i]) {
                    return true;
                }
            }
            // a lazy check for equal base versions
            if (migrationVersion.slice(0, 3).join('.') === version.slice(0, 3).join('.')) {
                // handle the case with two postfixed versions
                if (migrationVersion[3] !== null && version[3] !== null) {
                    return migrationVersion[3] > version[3];
                }
                // postfixed source, unpostfixed patch
                if (migrationVersion[3] === null && version[3] !== null) {
                    return true;
                }
                return false;
            }
            return true;
        });

        if (migrationToExecute.length) {
            // eslint-disable-next-line no-console
            console.debug(`Applying migration sequence: patches ${migrationToExecute.map(m => m.version).join(', ')}.`);
        }
        for (const migration of migrationToExecute) {
            // eslint-disable-next-line no-console
            console.debug(`Migrating project from version ${project.ctjsVersion || '0.2.0'} to ${migration.version}`);
            // We do need to apply updates in a sequence
            // eslint-disable-next-line no-await-in-loop
            await migration.process(project);
        }

        // Unfortunately, recent versions of eslint give false positives on this line
        // @see https://github.com/eslint/eslint/issues/11900
        // @see https://github.com/eslint/eslint/issues/11899
        // eslint-disable-next-line require-atomic-updates
        project.ctjsVersion = process.versions.ctjs;
    };

    /**
     * Opens the project and refreshes the whole app.
     *
     * @param {Object} projectData Loaded JSON file, in js object form
     * @returns {void}
     */
    var loadProject = async projectData => {
        const glob = require('./data/node_requires/glob');
        global.currentProject = projectData;
        window.alertify.log(window.languageJSON.intro.loadingProject);
        glob.modified = false;

        try {
            await adapter(projectData);
            fs.ensureDir(global.projdir);
            fs.ensureDir(global.projdir + '/img');
            fs.ensureDir(global.projdir + '/snd');

            const lastProjects = localStorage.lastProjects ? localStorage.lastProjects.split(';') : [];
            if (lastProjects.indexOf(path.normalize(global.projdir + '.ict')) !== -1) {
                lastProjects.splice(lastProjects.indexOf(path.normalize(global.projdir + '.ict')), 1);
            }
            lastProjects.unshift(path.normalize(global.projdir + '.ict'));
            if (lastProjects.length > 15) {
                lastProjects.pop();
            }
            localStorage.lastProjects = lastProjects.join(';');

            if (global.currentProject.settings.title) {
                document.title = global.currentProject.settings.title + ' — ct.js';
            }

            glob.scriptTypings = {};
            for (const script of global.currentProject.scripts) {
                glob.scriptTypings[script.name] = [
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(script.code),
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(script.code)
                ];
            }

            const {loadAllTypedefs, resetTypedefs} = require('./data/node_requires/resources/modules/typedefs');
            resetTypedefs();
            loadAllTypedefs();

            window.signals.trigger('projectLoaded');
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
    var loadProjectFile = async proj => {
        const textProjData = await fs.readFile(proj, 'utf8');
        let projectData;
        // Before v1.3, projects were stored in JSON format
        try {
            if (textProjData.indexOf('{') === 0) { // First, make a silly check for JSON files
                projectData = JSON.parse(textProjData);
            } else {
                try {
                    const YAML = require('js-yaml');
                    projectData = YAML.load(textProjData);
                } catch (e) {
                    // whoopsie, wrong window
                    // eslint-disable-next-line no-console
                    console.warn(`Tried to load a file ${proj} as a YAML, but got an error (see below). Falling back to JSON.`);
                    console.error(e);
                    projectData = JSON.parse(textProjData);
                }
            }
        } catch (e) {
            window.alertify.error(e);
            throw e;
        }
        if (!projectData) {
            window.alertify.error(window.languageJSON.common.wrongFormat);
            return;
        }
        try {
            loadProject(projectData);
        } catch (e) {
            window.alertify.error(e);
            throw e;
        }
    };

    window.loadProject = async proj => {
        if (!proj) {
            const baseMessage = 'An attempt to open a project with an empty path.';
            alertify.error(baseMessage + ' See the console for the call stack.');
            const err = new Error(baseMessage);
            throw err;
        }
        sessionStorage.projname = path.basename(proj);
        global.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');

        let recoveryStat;
        try {
            recoveryStat = await fs.stat(proj + '.recovery');
        } catch (err) {
            // no recovery file found
            void 0;
        }
        if (recoveryStat && recoveryStat.isFile()) {
            const targetStat = await fs.stat(proj);
            const voc = window.languageJSON.intro.recovery;
            const userResponse = await window.alertify
            .okBtn(voc.loadRecovery)
            .cancelBtn(voc.loadTarget)
            /* {0} — target file date
                {1} — target file state (newer/older)
                {2} — recovery file date
                {3} — recovery file state (newer/older)
            */
            .confirm(voc.message
                .replace('{0}', targetStat.mtime.toLocaleString())
                .replace('{1}', targetStat.mtime < recoveryStat.mtime ? voc.older : voc.newer)
                .replace('{2}', recoveryStat.mtime.toLocaleString())
                .replace('{3}', recoveryStat.mtime < targetStat.mtime ? voc.older : voc.newer));
            window.alertify
            .okBtn(window.languageJSON.common.ok)
            .cancelBtn(window.languageJSON.common.cancel);
            if (userResponse.buttonClicked === 'ok') {
                return loadProjectFile(proj + '.recovery');
            }
            return loadProjectFile(proj);
        }
        return loadProjectFile(proj);
    };
})(this);

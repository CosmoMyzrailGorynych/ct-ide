import {populatePixiTextureCache, resetDOMTextureCache, resetPixiTextureCache, setPixelart} from '../textures';
import {loadAllTypedefs, resetTypedefs} from '../modules/typedefs';
import {loadScriptModels} from './scripts';
import {unloadAllEvents, loadAllModulesEvents} from '../../events';
import {loadAllBlocks} from '../../catnip';
import {buildAssetMap} from '..';
import {preparePreviews} from '../preview';
import {refreshFonts} from '../typefaces';
import {updateContentTypedefs} from '../content';
import {updateEnumsTs} from '../enums';
import {getLanguageJSON, getByPath} from '../../i18n';
import {isDev, getDirectories} from '../../platformUtils';
import {glob} from '../../glob';

import YAML from 'js-yaml';
import * as path from 'path';
import fs from '../../neutralino-fs-extra';
import {write} from '../../neutralino-storage';

import {gitignore} from './defaultGitignore';
import defaultProject from './defaultProject';

let currentProjectIctPath: string,
    currentProjectFilesDir: string,
    currentProject: IProject;

// @see https://semver.org/
const semverRegex = /(\d+)\.(\d+)\.(\d+)(-[A-Za-z.-]*(\d+)?[A-Za-z.-]*)?/;
const semverToArray = (string: string): [number, number, number, number | null] => {
    const raw = semverRegex.exec(string);
    if (!raw) {
        throw new Error(`Invalid semver string: ${string}`);
    }
    return [
        Number(raw[1]),
        Number(raw[2]),
        Number(raw[3]),
        // -next- versions and other postfixes will count as a fourth component.
        // They all will apply before regular versions
        raw[4] ? Number(raw[5]) || 1 : null
    ];
};

interface IMigrationPlan {
    version: string,
    process: (project: Partial<IProject>) => Promise<void>;
}

/**
* Applies migration scripts to older projects.
*/
const adapter = async (project: Partial<IProject>) => {
    var version = semverToArray(project.ctjsVersion || '0.2.0');
    const migrationToExecute = window.migrationProcess
    // Sort all the patches chronologically
    .sort((m1: IMigrationPlan, m2: IMigrationPlan) => {
        const m1Version = semverToArray(m1.version);
        const m2Version = semverToArray(m2.version);

        for (let i = 0; i < 4; i++) {
            if (m1Version[i] === null) {
                return -1;
            } else if (m2Version[i] === null) {
                return 1;
            } else if (m1Version[i]! < m2Version[i]!) {
                return -1;
            } else if (m1Version[i]! > m2Version[i]!) {
                return 1;
            }
        }
      // eslint-disable-next-line no-console
        console.warn(`Two equivalent versions found for migration, ${m1.version} and ${m2.version}.`);
        return 0;
    })
    // Throw out patches for current and previous versions
    .filter((migration: IMigrationPlan) => {
        const migrationVersion = semverToArray(migration.version);
        for (let i = 0; i < 3; i++) {
          // if any of the first three version numbers is lower than project's,
          // skip the patch
            if ((migrationVersion[i] || 0) < (version[i] || 0)) {
                return false;
            }
            if ((migrationVersion[i] || 0) > (version[i] || 0)) {
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
        console.debug(`Applying migration sequence: patches ${migrationToExecute.map((m: IMigrationPlan) => m.version).join(', ')}.`);
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
    project.ctjsVersion = window.ctjsVersion;
};
/**
 * Creates a new blank project in the specified directory,
 * and returns a promise that resolves to the path of the new project file.
 */
const createProject = async (name: string, parentDir: string, language: IProject['language']): Promise<string> => {
    if (!language || (typeof language !== 'string')) {
        throw new Error('Invalid language specified: ' + language);
    }
    const project = defaultProject.get();
    project.language = language;
    const projectYAML = YAML.dump(project);
    fs.outputFile(path.join(parentDir, name + '.ict'), projectYAML)
    .catch(e => {
        alertify.error(getByPath('intro.unableToWriteToFolders') + '\n' + e);
        throw e;
    });
    const projdir = path.join(parentDir, name);
    await fs.ensureDir(projdir);
    await Promise.all([
        fs.ensureDir(path.join(projdir, '/img')),
        fs.ensureDir(path.join(projdir, '/snd')),
        fs.ensureDir(path.join(projdir, '/include')),
        fs.outputFile(path.join(parentDir, '.gitignore'), gitignore)
    ]);
    await Neutralino.resources.extractFile('/app/data/img/notexture.png', path.join(projdir + '/img/splash.png'));
    return path.join(parentDir, name + '.ict');
};

export const getFilesDir = () => currentProjectFilesDir;
export const getIctPath = () => currentProjectIctPath;
export const getCurrentProject = () => currentProject;

/**
* Opens the project and refreshes the whole app.
*
* @param {IProject} projectData Loaded JSON file, in js object form
* @returns {Promise<void>}
*/
const loadProject = async (projectData: IProject): Promise<void> => {
    currentProject = projectData;
    window.currentProject = projectData;
    window.alertify.log(getByPath('intro.loadingProject') as string);
    glob.modified = false;

    try {
        await adapter(projectData);
        fs.ensureDir(currentProjectFilesDir);
        fs.ensureDir(currentProjectFilesDir + '/img');
        fs.ensureDir(currentProjectFilesDir + '/skel');
        fs.ensureDir(currentProjectFilesDir + '/snd');

        try {
            await Neutralino.server.unmount('/project');
        } catch (oO) {
            void oO;
        } finally {
            await Neutralino.server.mount('/project', currentProjectFilesDir);
        }

        const lastProjects: string[] = localStorage.lastProjects ? localStorage.lastProjects.split(';') : [];
        if (lastProjects.indexOf(path.normalize(currentProjectFilesDir + '.ict')) !== -1) {
            lastProjects.splice(lastProjects.indexOf(path.normalize(currentProjectFilesDir + '.ict')), 1);
        }
        lastProjects.unshift(path.normalize(currentProjectFilesDir + '.ict'));
        if (lastProjects.length > 15) {
            lastProjects.pop();
        }
        write('lastProjects', lastProjects.join(';'));

        buildAssetMap(projectData);

        loadScriptModels(projectData);
        resetTypedefs();
        loadAllTypedefs();
        updateEnumsTs();
        updateContentTypedefs(projectData);

        unloadAllEvents();
        resetPixiTextureCache();
        setPixelart(projectData.settings.rendering.pixelatedrender);
        refreshFonts();
        const recoveryExists = await fs.exists(currentProjectFilesDir + '.ict.recovery');
        await Promise.all([
            loadAllModulesEvents(),
            populatePixiTextureCache(),
            resetDOMTextureCache(),
            projectData.language === 'catnip' && loadAllBlocks(projectData)
        ]);
        await preparePreviews(projectData, !recoveryExists);

        window.signals.trigger('projectLoaded');
        setTimeout(() => {
            window.riot.update();
        }, 0);
    } catch (err) {
        let report = getLanguageJSON().intro.loadingProjectError;
        if (err.stack) {
            report += '<br><pre><code>' + err.stack + '</code></pre>';
        } else {
            report += '<br><pre><code>' + JSON.stringify(err, null, 2) + '</code></pre>';
        }
        window.alertify.alert(report);
    }
};

const statExists = async (toTest: string): Promise<false | [string, Awaited<ReturnType<typeof fs['stat']>>]> => {
    try {
        return [toTest, await fs.stat(toTest)];
    } catch (oO) {
        void oO;
        return false;
    }
};

export const saveProject = async (): Promise<void> => {
    const projectYAML = YAML.dump(currentProject);
    const basePath = currentProjectIctPath;
    // Make backup files
    const savedBefore = await (async () => {
        try {
            await fs.access(basePath);
            return true;
        } catch (oO) {
            void oO;
            return false;
        }
    })();
    const backups = currentProject.backups ?? 3;
    if (savedBefore && backups) {
        const backupFiles = [];
        // Fetch metadata about backup files, if they exist
        for (let i = 0; i < backups; i++) {
            backupFiles.push(statExists(basePath + '.backup' + i));
        }
        const backupStats = (await Promise.all(backupFiles)).filter(a => a) as [string, Awaited<ReturnType<typeof fs['stat']>>][];
        let backupTarget = '.backup0';
        if (backupStats.length) {
            // Find the name for a new backup file
            if (backupStats.length < backups) { // Assuming no backups were removed
                backupTarget = `.backup${backupStats.length}`;
            } else {
                // Oldest will be the first
                backupStats.sort((a, b) => a[1].mtimeMs - b[1].mtimeMs);
                backupTarget = path.extname(backupStats[0][0]);
            }
        }
        // Rename the old ict file
        await fs.move(basePath, basePath + backupTarget, {
            overwrite: true
        });
    }
    await fs.outputFile(basePath, projectYAML);
    fs.remove(basePath + '.recovery')
    .catch(console.error);
    glob.modified = false;
};

/**
* Checks file format and loads it
*
* @param {String} src The path to the file.
* @returns {void}
*/
const parseProjectFile = async (src: string) => {
    const textProjData = await fs.readFile(src, 'utf8');
    let projectData;
    // Before v1.3, projects were stored in JSON format
    try {
        if (textProjData.indexOf('{') === 0) { // First, make a silly check for JSON files
            projectData = JSON.parse(textProjData);
        } else {
            try {
                projectData = YAML.load(textProjData);
            } catch (e) {
              // whoopsie, wrong window
              // eslint-disable-next-line no-console
                console.warn(`Tried to load a file ${src} as a YAML, but got an error (see below). Falling back to JSON.`);
                console.error(e);
                projectData = JSON.parse(textProjData);
            }
        }
    } catch (e) {
        window.alertify.error(e);
        throw e;
    }
    if (!projectData) {
        window.alertify.error(getLanguageJSON().common.wrongFormat);
        return;
    }
    try {
        loadProject(projectData);
    } catch (e) {
        window.alertify.error(e);
        throw e;
    }
};

/**
 * Opens a project file, checking for recovery files and asking
 * a user about them if needed.
 * This is the method that should be used for opening ct.js projects
 * from within UI.
 */
const openProject = async (src: string): Promise<void | false | Promise<void>> => {
    if (!src) {
        const baseMessage = 'An attempt to open a project with an empty path.';
        window.alertify.error(baseMessage + ' See the console for the call stack.');
        const err = new Error(baseMessage);
        throw err;
    }

    // TODO: check which projects are currently opened,
    // perhaps by tracking them in `Neutralino.storage`.

    currentProjectIctPath = src;
    currentProjectFilesDir = path.dirname(src) + path.sep + path.basename(src, '.ict');

    // Check for recovery files
    let recoveryStat;
    try {
        recoveryStat = await fs.stat(src + '.recovery');
    } catch (err) {
        void err;
        // no recovery file found
    }
    if (recoveryStat && recoveryStat.isFile()) {
        // Make sure recovery and target files are not the same
        const [recoveryContent, targetContent] = await Promise.all([
            fs.readFile(src + '.recovery', 'utf8'),
            fs.readFile(src, 'utf8')
        ]);
        if (recoveryContent === targetContent) {
            // Files match, load as usual
            return parseProjectFile(src);
        }
        // Files differ, ask user if they want to load the recovery file
        const targetStat = await fs.stat(src);
        const voc = getLanguageJSON().intro.recovery;
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
            .okBtn(getLanguageJSON().common.ok)
            .cancelBtn(getLanguageJSON().common.cancel);
        if (userResponse.buttonClicked === 'ok') {
            return parseProjectFile(src + '.recovery');
        }
        return parseProjectFile(src);
    }
    return parseProjectFile(src);
};
/**
 * @returns {Promise<string>} A promise that resolves into the absolute path
 * to the projects' directory
 */
const getDefaultProjectDir = async (): Promise<string> => (await getDirectories()).projects;

const getExamplesDir = function (): string {
    if (isDev()) {
        return path.join(NL_CWD, 'app/examples');
    }
    return '/app/examples';
};

const getTemplatesDir = function (): string {
    if (isDev()) {
        return path.join(NL_CWD, 'app/templates');
    }
    return '/app/templates';
};

/**
 * Returns a path that does not end with `.ict`
 * @param  {string} projPath
 * @returns {string}
 */
const getProjectDir = function (projPath: string): string {
    return projPath.replace(/\.ict$/, '');
};

export const getProjectCodename = (projPath?: string): string =>
    path.basename(projPath || currentProjectIctPath, '.ict');

/**
 * Returns a path that ends with `.ict` file
 * @param  {string} projPath
 * @returns {string}
 */
const getProjectIct = function (projPath: string): string {
    if (!(/\.ict$/.test(projPath))) {
        return projPath + '.ict';
    }
    return projPath;
};

export {
    createProject,
    openProject,
    defaultProject,
    getDefaultProjectDir,
    getProjectIct,
    getProjectDir,
    getExamplesDir,
    getTemplatesDir
};

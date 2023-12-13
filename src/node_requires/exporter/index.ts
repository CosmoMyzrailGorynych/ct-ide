const fs = require('fs-extra'),
      path = require('path');
const basePath = './data/';

let currentProject: IProject;
let writeDir: string;

import {resetEventsCache, populateEventCache} from './scriptableProcessor';
import {ExporterError, highlightProblem} from './ExporterError';

import {packImages} from './textures';
import {packSkeletons} from './skeletons';
import {getSounds} from './sounds';
import {stringifyRooms, getStartingRoom} from './rooms';
import {stringifyStyles} from './styles';
const {stringifyTandems} = require('./emitterTandems');
import {stringifyTemplates} from './templates';
const {stringifyContent} = require('./content');
import {bundleFonts, bakeBitmapFonts} from './fonts';
import {bakeFavicons} from './icons';
const {getUnwrappedExtends, getCleanKey} = require('./utils');
import {revHash} from './../utils/revHash';
import {getGroups} from './groups';
import {substituteHtmlVars} from './html';
const typeScript = require('sucrase').transform;

const ifMatcher = (varName: string, symbol = '@') => new RegExp(`/\\* ?if +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*)(?:/\\* ?else +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*?))?/\\* ?endif +${symbol}${varName}${symbol} ?\\*/`, 'g');
const varMatcher = (varName: string, symbol = '@') => new RegExp(`/\\* ?${symbol}${varName}${symbol} ?\\*/`, 'g');

/**
 * A little home-brewn string templating function for JS and CSS.
 * Can't really add an example of its usage, as it is based on js comments
 * and they won't fit in the JSDoc comments ¯\_(ツ)_/¯
 * See ct.release files for examples.
 *
 * Supports if/else blocks. Empty arrays are treated as `false`.
 *
 * @param input The source string with template tags
 * @param vars The variables to substitute
 * @param injections Module-provided injections to substitute
 */
const template = (
    input: string,
    vars: Record<string, unknown>,
    injections: Record<string, string> = {}
) => {
    let output = input;
    for (const i in vars) {
        // .replace(stuff, () => string) prevents pattern substitution, notably
        // it doesn't break syntax around this.text = '$'
        // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
        output = output.replace(varMatcher(i), () => (typeof vars[i] === 'object' ? JSON.stringify(vars[i]) : String(vars[i])));
        output = output.replace(ifMatcher(i), (Array.isArray(vars[i]) ? (vars[i] as unknown[]).length : vars[i]) ? '$1' : '$2');
    }
    for (const i in injections) {
        output = output.replace(varMatcher(i, '%'), () => (typeof injections[i] === 'object' ? JSON.stringify(injections[i]) : injections[i]));
    }
    return output;
};

const getSubstitution = (value: unknown): unknown => {
    if (!value) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return value;
};
const parseKeys = function (catmod: ICatmodManifest, str: string, lib: string) {
    var str2 = str;
    if (catmod.fields) {
        const {fields} = catmod,
              values = getUnwrappedExtends(currentProject.libs[lib] || {});

        for (const field of fields) {
            if (!field.key) {
                // Skip invalid/decorative fields
                continue;
            }
            const cleanKey = getCleanKey(field.key);
            const val = values[cleanKey];
            if (field.type === 'checkbox' && !val) {
                str2 = str2.replace(RegExp('(/\\*)?%' + cleanKey + '%(\\*/)?', 'g'), 'false');
            } else {
                str2 = str2.replace(RegExp('(/\\*)?%' + cleanKey + '%(\\*/)?', 'g'), () => String(getSubstitution(val)));
            }
        }
    }
    return str2;
};

const removeBrokenModules = async function removeBrokenModules(project: IProject) {
    await Promise.all(Object.keys(project.libs).map(async key => {
        const moduleJSONPath = path.join(basePath + 'ct.libs/', key, 'module.json');
        if (!(await fs.pathExists(moduleJSONPath))) {
            const message = `Removing an absent catmod ${key} from the project.`;
            window.alertify.log(message);
            // eslint-disable-next-line no-console
            console.warn(message);
            delete project.libs[key];
        }
    }));
};

const addModules = async () => { // async
    const pieces = await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const moduleJSONPath = path.join(basePath + 'ct.libs/', lib, 'module.json');
        const moduleJSON = await fs.readJSON(moduleJSONPath, {
            encoding: 'utf8'
        });
        if (await fs.pathExists(path.join(basePath + 'ct.libs/', lib, 'index.js'))) {
            return parseKeys(moduleJSON, await fs.readFile(path.join(basePath + 'ct.libs/', lib, 'index.js'), {
                encoding: 'utf8'
            }), lib);
        }
        return false;
    }));
    return pieces.filter(t => t).join('\n');
};

const enum Injections {
    load,
    start,
    switch,
    onbeforecreate,
    oncreate,
    ondestroy,
    beforedraw,
    beforestep,
    afterdraw,
    afterstep,
    beforeframe,
    beforeroomoncreate,
    roomoncreate,
    roomonleave,
    afterroomdraw,
    beforeroomdraw,
    beforeroomstep,
    afterroomstep,
    css,
    res,
    resload,
    templates,
    rooms,
    styles,
    htmltop,
    htmlbottom
}
type InjectionName = keyof typeof Injections;

const getInjections = async () => {
    const injections: Record<InjectionName, string> = {
        load: '',
        start: '',
        switch: '',

        onbeforecreate: '',
        oncreate: '',
        ondestroy: '',

        beforedraw: '',
        beforestep: '',
        afterdraw: '',
        afterstep: '',

        beforeframe: '',
        beforeroomoncreate: '',
        roomoncreate: '',
        roomonleave: '',
        afterroomdraw: '',
        beforeroomdraw: '',
        beforeroomstep: '',
        afterroomstep: '',

        css: '',
        res: '',
        resload: '',
        templates: '',
        rooms: '',
        styles: '',
        htmltop: '',
        htmlbottom: ''
    };
    await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const libData = await fs.readJSON(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            encoding: 'utf8'
        });
        if (await fs.pathExists(path.join(basePath + 'ct.libs/', lib, 'injections'))) {
            const injectFiles: string[] = await fs.readdir(path.join(basePath + 'ct.libs/', lib, 'injections')),
                  injectKeys = injectFiles.map(fname => path.basename(fname, path.extname(fname)));
            await Promise.all(injectKeys.map(async (key: InjectionName, ind) => {
                if (key in injections) {
                    const injection = await fs.readFile(path.join(basePath + 'ct.libs/', lib, 'injections', injectFiles[ind]), {
                        encoding: 'utf8'
                    });
                    // false positive??
                    // eslint-disable-next-line require-atomic-updates
                    injections[key] += parseKeys(libData, injection, lib);
                }
            }));
        }
    }));
    return injections;
};

// eslint-disable-next-line max-lines-per-function, complexity
const exportCtProject = async (
    project: IProject,
    projdir: string,
    production: boolean
): Promise<string> => {
    window.signals.trigger('exportProject');
    currentProject = project;
    await removeBrokenModules(project);
    resetEventsCache();

    const {languageJSON} = require('./../i18n');
    const {settings} = project;
    const {getExportDir} = require('./../platformUtils');
    writeDir = await getExportDir();

    if (project.rooms.length < 1) {
        throw new Error(languageJSON.common.noRooms);
    }

    if (localStorage.forceProductionForDebug === 'yes') {
        production = true;
    }
    const noMinify = currentProject.settings.export.codeModifier === 'none';

    await fs.remove(writeDir);
    await Promise.all([
        fs.ensureDir(path.join(writeDir, '/img/')),
        fs.ensureDir(path.join(writeDir, '/snd/'))
    ]);

    const injections = await getInjections();
    let cssBundleFilename = 'ct.css',
        jsBundleFilename = 'ct.js';

    /* Pixi.js */
    if (settings.rendering.usePixiLegacy) {
        await fs.copyFile('./node_modules/pixi.js-legacy/dist/pixi-legacy.min.js', path.join(writeDir, '/pixi.min.js'));
        await fs.copyFile('./node_modules/pixi.js-legacy/dist/pixi-legacy.min.js.map', path.join(writeDir, '/pixi-legacy.min.js.map'));
    } else {
        await fs.copyFile('./node_modules/pixi.js/dist/pixi.min.js', path.join(writeDir, '/pixi.min.js'));
        await fs.copyFile('./node_modules/pixi.js/dist/pixi.min.js.map', path.join(writeDir, '/pixi.min.js.map'));
    }
    if (project.emitterTandems && project.emitterTandems.length) {
        await fs.copyFile('./node_modules/pixi-particles/dist/pixi-particles.min.js', path.join(writeDir, '/pixi-particles.min.js'));
        await fs.copyFile('./node_modules/pixi-particles/dist/pixi-particles.min.js.map', path.join(writeDir, '/pixi-particles.min.js.map'));
    }

    const startroom = getStartingRoom(project);

    /* Load source files in parallel */
    const sources: Record<string, Promise<string>> = {};
    const sourcesList = [
        'backgrounds.js',
        'camera.js',
        'content.js',
        'ct.css',
        'emitters.js',
        'index.html',
        'inputs.js',
        'main.js',
        'res.js',
        'rooms.js',
        'styles.js',
        'templates.js',
        'tilemaps.js',
        'timer.js'
    ];
    for (const file of sourcesList) {
        sources[file] = fs.readFile(path.join(basePath, 'ct.release', file), {
            encoding: 'utf8'
        });
    }
    /* assets — run in parallel */
    const texturesTask = packImages(project, writeDir, production);
    const skeletonsTask = packSkeletons(project, projdir, writeDir);
    const bitmapFontsTask = bakeBitmapFonts(project, projdir, writeDir);
    const favicons = bakeFavicons(project, writeDir, production);
    /* Run event cache population in parallel as well */
    const cacheHandle = populateEventCache(project);

    let buffer = template(await sources['main.js'], {
        startwidth: startroom.width,
        startheight: startroom.height,
        transparent: Boolean(settings.rendering.transparent),
        pixelatedrender: Boolean(settings.rendering.pixelatedrender),
        highDensity: Boolean(settings.rendering.highDensity),
        maxfps: Number(settings.rendering.maxFPS),
        ctversion: process.versions.ctjs,
        projectmeta: {
            name: settings.authoring.title,
            author: settings.authoring.author,
            site: settings.authoring.site,
            version: settings.authoring.version.join('.') + settings.authoring.versionPostfix
        }
    }, injections);
    buffer += '\n';

    let actionsSetup = '';
    for (const action of project.actions) {
        actionsSetup += `ct.inputs.addAction('${action.name}', ${JSON.stringify(action.methods)});\n`;
    }
    // This section is synchronous to the possible extent, no race conditions possible here
    /* eslint-disable require-atomic-updates */
    buffer += template(await sources['inputs.js'], {
        actions: actionsSetup
    }, injections);
    buffer += '\n';

    // Process all the scriptables to get combined code for root rooms
    await cacheHandle;

    const rooms = stringifyRooms(project);
    const templates = stringifyTemplates(project);
    const rootRoomOnCreate = rooms.rootRoomOnCreate + '\n' + templates.rootRoomOnCreate;
    const rootRoomOnStep = rooms.rootRoomOnStep + '\n' + templates.rootRoomOnStep;
    const rootRoomOnDraw = rooms.rootRoomOnDraw + '\n' + templates.rootRoomOnDraw;
    const rootRoomOnLeave = rooms.rootRoomOnLeave + '\n' + templates.rootRoomOnLeave;
    buffer += template(await sources['rooms.js'], {
        startroom: startroom.name,
        rooms: rooms.libCode,
        rootRoomOnCreate,
        rootRoomOnStep,
        rootRoomOnDraw,
        rootRoomOnLeave
    }, injections);
    buffer += '\n';

    const styles = stringifyStyles(project);
    buffer += template(await sources['styles.js'], {
        styles
    }, injections);
    buffer += '\n';

    if (project.emitterTandems && project.emitterTandems.length) {
        const tandems = stringifyTandems(project);
        buffer += template(await sources['emitters.js'], {
            tandemTemplates: tandems
        }, injections);
    }

    buffer += template(await sources['templates.js'], {
        templates: templates.libCode
    }, injections);

    // Add four files in a sequence, without additional transforms
    buffer += (
        await Promise.all(['backgrounds.js', 'tilemaps.js', 'camera.js', 'timer.js']
            .map(source => sources[source]))
    ).join('\n');

    const fonts = await bundleFonts(project, projdir, writeDir);
    buffer += fonts.js;
    /* eslint-enable require-atomic-updates */

    /* Add catmods */
    buffer += await addModules();

    /* ct.res goes after all the code, but before user-defined scripts */
    const {atlases, tiledImages} = await texturesTask;
    const skeletons = await skeletonsTask;
    const bitmapFonts = await bitmapFontsTask;
    const sounds = getSounds(project);
    buffer += template(await sources['res.js'], {
        atlases,
        tiledImages,
        bitmapFonts,
        dbSkeletons: skeletons.skeletonsDB,
        sounds,
        groups: JSON.stringify(getGroups(project))
    }, injections);
    buffer += '\n';

    const content = stringifyContent(project);
    buffer += (await sources['content.js']).replace('/*@contentTypes@*/', `"${content}"`);
    buffer += '\n';

    /* User-defined scripts */
    for (const script of project.scripts) {
        try {
            buffer += typeScript(script.code, {
                transforms: ['typescript']
            }).code + ';\n';
        } catch (e) {
            const errorMessage = `${e.name || 'An error'} occured while compiling a custom script ${script.name}`;
            const exporterError = new ExporterError(errorMessage, {
                problematicCode: highlightProblem(script.code, e.location || e.loc),
                clue: 'syntax'
            }, e);
            throw exporterError;
        }
    }
    /* passthrough copy of files in the `include` folder */
    if (await fs.pathExists(projdir + '/include/')) {
        await fs.copy(projdir + '/include/', writeDir);
    }
    await Promise.all(Object.keys(project.libs).map(async lib => {
        if (await fs.pathExists(path.join(basePath, `./ct.libs/${lib}/includes/`))) {
            await fs.copy(path.join(basePath, `./ct.libs/${lib}/includes/`), writeDir);
        }
    }));

    /* CSS styles for rendering settings and branding */
    let preloaderColor1 = project.settings.branding.accent,
        preloaderColor2 = (global.brehautColor(preloaderColor1).getLuminance() < 0.5) ? '#ffffff' : '#000000';
    if (project.settings.branding.invertPreloaderScheme) {
        [preloaderColor1, preloaderColor2] = [preloaderColor2, preloaderColor1];
    }
    let css = template(await sources['ct.css'], {
        pixelatedrender: project.settings.rendering.pixelatedrender,
        hidecursor: project.settings.rendering.hideCursor,
        hidemadewithctjs: project.settings.branding.hideLoadingLogo,
        preloaderforeground: preloaderColor1,
        preloaderbackground: preloaderColor2,
        fonts: fonts.css
    }, injections);
    if (!noMinify) {
        const csswring = require('csswring');
        ({css} = csswring.wring(css));
    }

    // Various JS protection measures
    // JS minify
    if (production && currentProject.settings.export.codeModifier === 'minify') {
        buffer = await (await require('terser').minify(buffer, {
            mangle: {
                reserved: ['ct']
            },
            format: {
                comments: '/^! Made with ct.js /'
            }
        })).code;
    }
    // JS obfuscator
    if (production && currentProject.settings.export.codeModifier === 'obfuscate') {
        buffer = require('javascript-obfuscator')
            .obfuscate(buffer)
            .getObfuscatedCode();
    }
    // Wrap in a self-calling function
    if (production && currentProject.settings.export.functionWrap) {
        buffer = `(function() {\n${buffer}\n})();`;
    }

    // Calculate hashes to prevent caching for changed files
    if (production) {
        const jsHash = revHash(buffer);
        const cssHash = revHash(css);
        jsBundleFilename = `ct.${jsHash}.js`;
        cssBundleFilename = `ct.${cssHash}.css`;
    }

    // Output HTML, JS and CSS files
    const iconRevision = await favicons;
    const html = substituteHtmlVars(
        await sources['index.html'],
        project,
        injections, {
            cssBundle: cssBundleFilename,
            jsBundle: jsBundleFilename,
            iconRevision
        }
    );
    const htmlMinify = noMinify ? (void 0) : require('html-minifier').minify;
    await Promise.all([
        fs.writeFile(
            path.join(writeDir, '/index.html'),
            noMinify ?
                html :
                htmlMinify(html, {
                    removeComments: true,
                    collapseWhitespace: true
                })
        ),
        fs.writeFile(path.join(writeDir, cssBundleFilename), css),
        fs.writeFile(path.join(writeDir, jsBundleFilename), buffer)
    ]);

    await Promise.all(project.sounds.map(async (sound: ISound) => {
        const ext = sound.origname.slice(-4);
        await fs.copy(path.join(projdir, '/snd/', sound.origname), path.join(writeDir, '/snd/', sound.uid + ext));
    }));

    return path.join(writeDir, '/index.html');
};

export {exportCtProject};

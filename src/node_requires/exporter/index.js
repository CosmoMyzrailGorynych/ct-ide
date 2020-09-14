const fs = require('fs-extra'),
      path = require('path');
const basePath = './data/';

let currentProject, writeDir;

const {packImages} = require('./textures');
const {packSkeletons} = require('./skeletons');
const {getSounds} = require('./sounds');
const {stringifyRooms, getStartingRoom} = require('./rooms');
const {stringifyStyles} = require('./styles');
const {stringifyTandems} = require('./emitterTandems');
const {stringifyTypes} = require('./types');
const {bundleFonts, bakeBitmapFonts} = require('./fonts');
const {bakeFavicons} = require('./icons');

const ifMatcher = (varName, symbol = '@') => new RegExp(`/\\* ?if +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*)(?:/\\* ?else +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*?))?/\\* ?endif +${symbol}${varName}${symbol} ?\\*/`, 'g');
const varMatcher = (varName, symbol = '@') => new RegExp(`/\\* ?${symbol}${varName}${symbol} ?\\*/`, 'g');

const ifHTMLMatcher = (varName, symbol = '@') => new RegExp(`<!-- ?if +${symbol}${varName}${symbol} ?-->([\\s\\S]*)(?:<!-- ?else +${symbol}${varName}${symbol} ?-->([\\s\\S]*?))?<!-- ?endif +${symbol}${varName}${symbol} ?-->`, 'g');
const varHTMLMatcher = (varName, symbol = '@') => new RegExp(`<!-- ?${symbol}${varName}${symbol} ?-->`, 'g');

/**
 * A little home-brewn string templating function for JS and CSS.
 * Can't really add an example of its usage, as it is based on js comments
 * and they won't fit in the JSDoc comments ¯\_(ツ)_/¯
 * See ct.release files for examples.
 *
 * Supports if/else blocks. Empty arrays are treated as `false`.
 *
 * @param {string} input The source string with template tags
 * @param {object<string,string|Array|object>} vars The variables to substitute
 * @param {object<string,string|Array|object>} injections Module-provided injections to substitute
 */
const template = (input, vars, injections = {}) => {
    let output = input;
    for (const i in vars) {
        output = output.replace(varMatcher(i), typeof vars[i] === 'object' ? JSON.stringify(vars[i]) : vars[i]);
        output = output.replace(ifMatcher(i), (Array.isArray(vars[i]) ? vars[i].length : vars[i]) ? '$1' : '$2');
    }
    for (const i in injections) {
        output = output.replace(varMatcher(i, '%'), typeof injections[i] === 'object' ? JSON.stringify(injections[i]) : injections[i]);
    }
    return output;
};
/**
 * A little home-brewn string templating function for HTML.
 * Example of a variable mark: <!-- @variable@ --> and <!-- %variable% --> for injections.
 *
 * Example of if/else:
 * <!-- if @variable@ -->
 *    (code)
 * <!-- else @variable@ -->
 *    (code)
 * <!-- endif @variable@ -->
 *
 * Injections use %variable% instead of @variable@.
 * In if/else blocks, empty arrays are treated as `false`.
 *
 * @param {string} input The source string with template tags
 * @param {object<string,string|Array|object>} vars The variables to substitute
 * @param {object<string,string|Array|object>} injections Module-provided injections to substitute
 */
const templateHTML = (input, vars, injections = {}) => {
    let output = input;
    for (const i in vars) {
        output = output.replace(varHTMLMatcher(i), typeof vars[i] === 'object' ? JSON.stringify(vars[i]) : vars[i]);
        output = output.replace(ifHTMLMatcher(i), (Array.isArray(vars[i]) ? vars[i].length : vars[i]) ? '$1' : '$2');
    }
    for (const i in injections) {
        output = output.replace(varHTMLMatcher(i, '%'), typeof injections[i] === 'object' ? JSON.stringify(injections[i]) : injections[i]);
    }
    return output;
};

const parseKeys = function (catmod, str, lib) {
    var str2 = str;
    if (catmod.fields) {
        for (const field in catmod.fields) {
            const val = currentProject.libs[lib][catmod.fields[field].key];
            if (catmod.fields[field].type === 'checkbox' && !val) {
                str2 = str2.replace(RegExp('(/\\*)?%' + catmod.fields[field].key + '%(\\*/)?', 'g'), 'false');
            } else {
                str2 = str2.replace(RegExp('(/\\*)?%' + catmod.fields[field].key + '%(\\*/)?', 'g'), val || '');
            }
        }
    }
    return str2;
};

const removeBrokenModules = async function removeBrokenModules(project) {
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

const getInjections = async () => {
    const injections = {
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
        types: '',
        rooms: '',
        styles: '',
        htmltop: '',
        htmlbottom: ''
    };
    await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const libData = await fs.readJSON(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            encoding: 'utf8'
        });
        if (await fs.pathExists(path.join(basePath + 'ct.libs/', lib, 'injects'))) {
            const injectFiles = await fs.readdir(path.join(basePath + 'ct.libs/', lib, 'injects')),
                  injectKeys = injectFiles.map(fname => path.basename(fname, path.extname(fname)));
            await Promise.all(injectKeys.map(async (key, ind) => {
                if (key in injections) {
                    const injection = await fs.readFile(path.join(basePath + 'ct.libs/', lib, 'injects', injectFiles[ind]), {
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

// eslint-disable-next-line max-lines-per-function
const exportCtProject = async (project, projdir) => {
    currentProject = project;
    await removeBrokenModules(project);

    const {languageJSON} = require('./../i18n');
    const {settings} = project;
    const {getExportDir} = require('./../platformUtils');
    writeDir = await getExportDir();

    if (project.rooms.length < 1) {
        throw new Error(languageJSON.common.norooms);
    }

    await fs.remove(writeDir);
    await Promise.all([
        fs.ensureDir(path.join(writeDir, '/img/')),
        fs.ensureDir(path.join(writeDir, '/snd/'))
    ]);

    const injections = await getInjections();

    /* Pixi.js */
    if (settings.rendering.usePixiLegacy) {
        await fs.copyFile(basePath + 'ct.release/pixi-legacy.min.js', path.join(writeDir, '/pixi.min.js'));
    } else {
        await fs.copyFile(basePath + 'ct.release/pixi.min.js', path.join(writeDir, '/pixi.min.js'));
    }
    if (project.emitterTandems && project.emitterTandems.length) {
        await fs.copyFile(basePath + 'ct.release/pixi-particles.min.js', path.join(writeDir, '/pixi-particles.min.js'));
    }

    const startroom = getStartingRoom(project);

    /* Load source files in parallel */
    const sources = {};
    const sourcesList = [
        'camera.js',
        'ct.css',
        'emitters.js',
        'index.html',
        'inputs.js',
        'main.js',
        'res.js',
        'rooms.js',
        'sound.js',
        'styles.js',
        'types.js',
        'timer.js'
    ];
    for (const file of sourcesList) {
        sources[file] = fs.readFile(path.join(basePath, 'ct.release', file), {
            encoding: 'utf8'
        });
    }

    /* assets — run in parallel */
    const texturesTask = packImages(project, writeDir);
    const skeletonsTask = packSkeletons(project, projdir, writeDir);
    const bitmapFontsTask = bakeBitmapFonts(project, projdir, writeDir);
    const favicons = bakeFavicons(project, writeDir);

    let buffer = template(await sources['main.js'], {
        startwidth: startroom.width,
        startheight: startroom.height,
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

    const roomsCode = stringifyRooms(project);
    buffer += template(await sources['rooms.js'], {
        startroom: startroom.name,
        rooms: roomsCode
    }, injections);

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

    const types = stringifyTypes(project);
    buffer += template(await sources['types.js'], {
        types
    }, injections);

    buffer += await sources['camera.js'];
    buffer += '\n';

    buffer += await sources['sound.js'];
    buffer += '\n';

    buffer += await sources['timer.js'];
    buffer += '\n';

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
    console.log(bitmapFonts);
    buffer += template(await sources['res.js'], {
        atlases,
        tiledImages,
        bitmapFonts,
        dbSkeletons: skeletons.skeletonsDB,
        sounds
    }, injections);
    buffer += '\n';

    /* User-defined scripts */
    for (const script of project.scripts) {
        buffer += script.code + ';\n';
    }

    /* passthrough copy of files in the `include` folder */
    if (await fs.exists(projdir + '/include/')) {
        await fs.copy(projdir + '/include/', writeDir);
    }
    await Promise.all(Object.keys(project.libs).map(async lib => {
        if (await fs.exists(path.join(basePath, `./ct.libs/${lib}/includes/`))) {
            await fs.copy(path.join(basePath, `./ct.libs/${lib}/includes/`), writeDir);
        }
    }));

    /* HTML & CSS */
    const html = templateHTML(await sources['index.html'], {
        gametitle: project.settings.authoring.title || 'ct.js game',
        accent: project.settings.branding.accent || '#446adb',
        particleEmitters: project.emitterTandems,
        includeDragonBones: project.skeletons.some(s => s.from === 'dragonbones')
    }, injections);

    let preloaderColor1 = project.settings.branding.accent,
        preloaderColor2 = (global.brehautColor(preloaderColor1).getLuminance() < 0.5) ? '#ffffff' : '#000000';
    if (project.settings.branding.invertPreloaderScheme) {
        [preloaderColor1, preloaderColor2] = [preloaderColor2, preloaderColor1];
    }
    const css = template(await sources['ct.css'], {
        pixelatedrender: project.settings.rendering.pixelatedrender,
        hidecursor: project.settings.rendering.hideCursor,
        preloaderforeground: preloaderColor1,
        preloaderbackground: preloaderColor2,
        fonts: fonts.css
    }, injections);

    await favicons;

    // Output minified HTML & CSS
    const csswring = require('csswring');
    const htmlMinify = require('html-minifier').minify;
    await Promise.all([
        fs.writeFile(
            path.join(writeDir, '/index.html'),
            htmlMinify(html, {
                removeComments: true,
                collapseWhitespace: true
            })
        ),
        fs.writeFile(path.join(writeDir, '/ct.css'), csswring.wring(css).css),
        fs.writeFile(path.join(writeDir, '/ct.js'), buffer)
    ]);

    await Promise.all(project.sounds.map(async sound => {
        const ext = sound.origname.slice(-4);
        await fs.copy(path.join(projdir, '/snd/', sound.origname), path.join(writeDir, '/snd/', sound.uid + ext));
    }));

    return path.join(writeDir, '/index.html');
};

module.exports = exportCtProject;

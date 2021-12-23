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
const {stringifyTemplates} = require('./templates');
const {stringifyContent} = require('./content');
const {bundleFonts, bakeBitmapFonts} = require('./fonts');
const {bakeFavicons} = require('./icons');
const {getUnwrappedExtends, getCleanKey} = require('./utils');

const ifMatcher = (varName, symbol = '@') => new RegExp(`/\\* ?if +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*)(?:/\\* ?else +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*?))?/\\* ?endif +${symbol}${varName}${symbol} ?\\*/`, 'g');
const varMatcher = (varName, symbol = '@') => new RegExp(`/\\* ?${symbol}${varName}${symbol} ?\\*/`, 'g');

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
        // .replace(stuff, () => string) prevents pattern substitution, notably
        // it doesn't break syntax around this.text = '$'
        // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
        output = output.replace(varMatcher(i), () => (typeof vars[i] === 'object' ? JSON.stringify(vars[i]) : vars[i]));
        output = output.replace(ifMatcher(i), (Array.isArray(vars[i]) ? vars[i].length : vars[i]) ? '$1' : '$2');
    }
    for (const i in injections) {
        output = output.replace(varMatcher(i, '%'), () => (typeof injections[i] === 'object' ? JSON.stringify(injections[i]) : injections[i]));
    }
    return output;
};

const getSubstitution = value => {
    if (!value) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return value;
};
const parseKeys = function (catmod, str, lib) {
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
                str2 = str2.replace(RegExp('(/\\*)?%' + cleanKey + '%(\\*/)?', 'g'), () => getSubstitution(val));
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
const exportCtProject = async (project, projdir, production) => {
    currentProject = project;
    await removeBrokenModules(project);

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

    await fs.remove(writeDir);
    await Promise.all([
        fs.ensureDir(path.join(writeDir, '/img/')),
        fs.ensureDir(path.join(writeDir, '/snd/'))
    ]);

    const injections = await getInjections();

    /* Pixi.js */
    await fs.copyFile(basePath + 'ct.release/pixi.min.js', path.join(writeDir, '/pixi.min.js'));
    await fs.copyFile(basePath + 'ct.release/pixi.min.js.map', path.join(writeDir, '/pixi.min.js.map'));
    if (project.emitterTandems && project.emitterTandems.length) {
        await fs.copyFile(basePath + 'ct.release/pixi-particles.min.js', path.join(writeDir, '/pixi-particles.min.js'));
    }

    const startroom = getStartingRoom(project);

    /* Load source files in parallel */
    const sources = {};
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

    const templates = stringifyTemplates(project);
    buffer += template(await sources['templates.js'], {
        templates
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
        sounds
    }, injections);
    buffer += '\n';

    const content = stringifyContent(project);
    buffer += (await sources['content.js']).replace('/*@contentTypes@*/', `"${content}"`);
    buffer += '\n';

    /* User-defined scripts */
    for (const script of project.scripts) {
        buffer += script.code + ';\n';
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

    /* HTML & CSS */
    const {substituteHtmlVars} = require('./html');
    const html = substituteHtmlVars(await sources['index.html'], project, injections);

    let preloaderColor1 = project.settings.branding.accent,
        preloaderColor2 = (global.brehautColor(preloaderColor1).getLuminance() < 0.5) ? '#ffffff' : '#000000';
    if (project.settings.branding.invertPreloaderScheme) {
        [preloaderColor1, preloaderColor2] = [preloaderColor2, preloaderColor1];
    }
    const css = template(await sources['ct.css'], {
        pixelatedrender: project.settings.rendering.pixelatedrender,
        hidecursor: project.settings.rendering.hideCursor,
        hidemadewithctjs: project.settings.branding.hideLoadingLogo,
        preloaderforeground: preloaderColor1,
        preloaderbackground: preloaderColor2,
        fonts: fonts.css
    }, injections);

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

    // Wrap in function
    if (production && currentProject.settings.export.functionWrap) {
        buffer = `(function() {\n${buffer}\n})();`;
    }

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

    await favicons;

    return path.join(writeDir, '/index.html');
};

module.exports = exportCtProject;

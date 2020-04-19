const fs = require('fs-extra'),
      path = require('path');
const basePath = './data/';

let currentProject, writeDir;

const {packImages} = require('./textures');
const {packSkeletons} = require('./skeletons');
const {stringifySounds} = require('./sounds');
const {stringifyRooms, getStartingRoom} = require('./rooms');
const {stringifyStyles} = require('./styles');
const {stringifyTandems} = require('./emitterTandems');
const {stringifyTypes} = require('./types');
const {bundleFonts} = require('./fonts');
const {bakeFavicons} = require('./icons');

const parseKeys = function(data, str, lib) {
    var str2 = str;
    if (data.fields) {
        for (const field in data.fields) {
            const val = currentProject.libs[lib][data.fields[field].key];
            if (data.fields[field].type === 'checkbox' && !val) {
                str2 = str2.replace(RegExp('(/\\*)?%' + data.fields[field].key + '%(\\*/)?', 'g'), 'false');
            } else {
                str2 = str2.replace(RegExp('(/\\*)?%' + data.fields[field].key + '%(\\*/)?', 'g'), val || '');
            }
        }
    }
    return str2;
};

const addModules = async () => { // async
    const pieces = await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const data = await fs.readJSON(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            'encoding': 'utf8'
        });
        if (await fs.pathExists(path.join(basePath + 'ct.libs/', lib, 'index.js'))) {
            return parseKeys(data, await fs.readFile(path.join(basePath + 'ct.libs/', lib, 'index.js'), {
                'encoding': 'utf8'
            }), lib);
        }
        return '';
    }));
    return pieces.join('\n');
};

const injectModules = injects => // async
    Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const libData = await fs.readJSON(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            'encoding': 'utf8'
        });
        if (await fs.pathExists(path.join(basePath + 'ct.libs/', lib, 'injects'))) {
            const injectFiles = await fs.readdir(path.join(basePath + 'ct.libs/', lib, 'injects')),
                  injectKeys = injectFiles.map(fname => path.basename(fname, path.extname(fname)));
            await Promise.all(injectKeys.map(async (key, ind) => {
                if (key in injects) {
                    const injection = await fs.readFile(path.join(basePath + 'ct.libs/', lib, 'injects', injectFiles[ind]), {
                        encoding: 'utf8'
                    });
                    // false positive??
                    // eslint-disable-next-line require-atomic-updates
                    injects[key] += parseKeys(libData, injection, lib);
                }
            }));
        }
    }));

const makeWritableDir = async () => {
    const {getWritableDir} = require('./../platformUtils');
    writeDir = path.join(await getWritableDir(), 'export');
};
const exportCtProject = async (project, projdir) => {
    const {languageJSON} = require('./../i18n');
    currentProject = project;
    await makeWritableDir();

    if (currentProject.rooms.length < 1) {
        throw new Error(languageJSON.common.norooms);
    }

    await fs.remove(writeDir);
    await Promise.all([
        fs.ensureDir(path.join(writeDir, '/img/')),
        fs.ensureDir(path.join(writeDir, '/snd/'))
    ]);

    const injects = {
        load: '',
        start: '',
        'switch': '',

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

    await injectModules(injects);

    /* Pixi.js */
    if (currentProject.settings.usePixiLegacy) {
        await fs.copyFile(basePath + 'ct.release/pixi-legacy.min.js', path.join(writeDir, '/pixi.min.js'));
    } else {
        await fs.copyFile(basePath + 'ct.release/pixi.min.js', path.join(writeDir, '/pixi.min.js'));
    }
    if (currentProject.emitterTandems && currentProject.emitterTandems.length) {
        await fs.copyFile(basePath + 'ct.release/pixi-particles.min.js', path.join(writeDir, '/pixi-particles.min.js'));
    }

    const startroom = getStartingRoom(currentProject);

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
        'types.js'
    ];
    for (const file of sourcesList) {
        sources[file] = fs.readFile(path.join(basePath, 'ct.release', file), {
            'encoding': 'utf8'
        });
    }

    let buffer = (await sources['main.js'])
        .replace(/\/\*@startwidth@\*\//g, startroom.width)
        .replace(/\/\*@startheight@\*\//g, startroom.height)
        .replace(/\/\*@pixelatedrender@\*\//g, Boolean(currentProject.settings.pixelatedrender))
        .replace(/\/\*@highDensity@\*\//g, Boolean(currentProject.settings.highDensity))
        .replace(/\/\*@maxfps@\*\//g, Number(currentProject.settings.maxFPS))
        .replace(/\/\*@ctversion@\*\//g, require('package.json').version)
        .replace(/\/\*@projectmeta@\*\//g, JSON.stringify({
            name: currentProject.settings.title,
            author: currentProject.settings.author,
            site: currentProject.settings.site,
            version: currentProject.settings.version.join('.') + currentProject.settings.versionPostfix
        }));

    buffer += '\n';

    let actionsSetup = '';
    for (const action of currentProject.actions) {
        actionsSetup += `ct.inputs.addAction('${action.name}', ${JSON.stringify(action.methods)});\n`;
    }

    // This section is synchronous to the possible extent, no race conditions possible here
    /* eslint-disable require-atomic-updates */
    buffer += (await sources['inputs.js']).replace('/*@actions@*/', actionsSetup);
    buffer += '\n';
    buffer += await addModules(buffer);

    /* User-defined scripts */
    for (const script of currentProject.scripts) {
        buffer += script.code + ';\n';
    }

    const roomsCode = stringifyRooms(currentProject);

    buffer += (await sources['rooms.js'])
        .replace('@startroom@', startroom.name)
        .replace('/*@rooms@*/', roomsCode)
        .replace('/*%switch%*/', injects.switch)
        .replace('/*%beforeroomoncreate%*/', injects.beforeroomoncreate)
        .replace('/*%roomoncreate%*/', injects.roomoncreate)
        .replace('/*%roomonleave%*/', injects.roomonleave);
    buffer += '\n';

    const styles = stringifyStyles(currentProject);
    buffer += (await sources['styles.js'])
        .replace('/*@styles@*/', styles)
        .replace('/*%styles%*/', injects.styles);
    buffer += '\n';

    if (currentProject.emitterTandems && currentProject.emitterTandems.length) {
        const templates = stringifyTandems(currentProject);
        buffer += (await sources['emitters.js'])
            .replace('/*@tandemTemplates@*/', templates);
    }

    /* assets — run in parallel */
    const texturesTask = packImages(currentProject, writeDir);
    const skeletonsTask = packSkeletons(currentProject, projdir, writeDir);
    const favicons = bakeFavicons(currentProject, writeDir);
    const textures = await texturesTask;
    const skeletons = await skeletonsTask;
    await favicons;

    buffer += (await sources['res.js'])
        .replace('/*@sndtotal@*/', currentProject.sounds.length)
        .replace('/*@res@*/', textures.res + '\n' + skeletons.loaderScript)
        .replace('/*@textureregistry@*/', textures.registry)
        .replace('/*@textureatlases@*/', JSON.stringify(textures.atlases))
        .replace('/*@skeletonregistry@*/', skeletons.registry)
        .replace('/*%resload%*/', injects.resload + '\n' + skeletons.startScript)
        .replace('/*%res%*/', injects.res);
    buffer += '\n';

    const types = stringifyTypes(currentProject);

    buffer += (await sources['types.js'])
        .replace('/*%oncreate%*/', injects.oncreate)
        .replace('/*%types%*/', injects.types)
        .replace('/*@types@*/', types);

    buffer += (await sources['camera.js']);
    buffer += '\n';

    buffer += '\n';
    var sounds = stringifySounds(currentProject);
    buffer += (await sources['sound.js'])
        .replace('/*@sound@*/', sounds);

    const fonts = await bundleFonts(currentProject, projdir, writeDir);
    buffer += fonts.js;
    /* eslint-enable require-atomic-updates */

    /* passthrough copy of files in the `include` folder */
    if (await fs.exists(projdir + '/include/')) {
        await fs.copy(projdir + '/include/', writeDir);
    }
    await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        if (await fs.exists(path.join(basePath, `./ct.libs/${lib}/includes/`))) {
            await fs.copy(path.join(basePath, `./ct.libs/${lib}/includes/`), writeDir);
        }
    }));

    /* Global injects, provided by modules */
    for (const i in injects) {
        buffer = buffer.replace(`/*%${i}%*/`, injects[i]);
    }

    /* Final touches and script output */
    if (currentProject.settings.minifyjs) {
        const preamble = '/* Made with ct.js http://ctjs.rocks/ */\n';
        const ClosureCompiler = require('google-closure-compiler').jsCompiler;

        const compiler = new ClosureCompiler({
            /* eslint-disable camelcase */
            compilation_level: 'SIMPLE',
            use_types_for_optimization: false,
            jscomp_off: '*', // Disable warnings to not to booo users
            language_out: 'ECMASCRIPT3',
            language_in: 'ECMASCRIPT_NEXT',
            warning_level: 'QUIET'
            /* eslint-enable camelcase */
        });
        const out = await new Promise((resolve, reject) => {
            compiler.run([{
                path: path.join(writeDir, '/ct.js'),
                src: buffer
            }], (exitCode, stdout, stderr) => {
                if (stderr && !stdout) {
                    reject(stderr);
                    return;
                }
                resolve(stdout[0]);
                if (stderr) {
                    console.error(stderr);
                }
            });
        });
        await fs.writeFile(path.join(writeDir, '/ct.js'), preamble + out.src);
        await fs.writeFile(path.join(writeDir, '/ct.js.map'), out.sourceMap);
    } else {
        await fs.writeFile(path.join(writeDir, '/ct.js'), buffer);
    }

    /* HTML & CSS */
    const {substituteHtmlVars} = require('./html');
    const {substituteCssVars} = require('./css');
    const html = substituteHtmlVars(await sources['index.html'], currentProject, injects);

    let css = substituteCssVars(await sources['ct.css'], currentProject, injects);

    css += fonts.css;

    await Promise.all([
        fs.writeFile(path.join(writeDir, '/index.html'), html),
        fs.writeFile(path.join(writeDir, '/ct.css'), css)
    ]);

    if (currentProject.settings.minifyhtmlcss) {
        const csswring = require('csswring');
        const htmlMinify = require('html-minifier').minify;
        const htmlUnminified = fs.readFile(path.join(writeDir, '/index.html'), {
            'encoding': 'utf8'
        });
        const cssUnminified = fs.readFile(path.join(writeDir, '/ct.css'), {
            'encoding': 'utf8'
        });
        await Promise.all([
            fs.writeFile(
                path.join(writeDir, '/index.html'),
                htmlMinify(await htmlUnminified, {
                    removeComments: true,
                    collapseWhitespace: true
                })
            ),
            fs.writeFile(path.join(writeDir, '/ct.css'), csswring.wring(await cssUnminified).css)
        ]);
    }
    await Promise.all(currentProject.sounds.map(async sound => {
        const ext = sound.origname.slice(-4);
        await fs.copy(path.join(projdir, '/snd/', sound.origname), path.join(writeDir, '/snd/', sound.uid + ext));
    }));

    return path.join(writeDir, `/index.${currentProject.settings.minifyhtml? 'min.': ''}html`);
};

module.exports = exportCtProject;

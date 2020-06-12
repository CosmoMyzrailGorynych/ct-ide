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

const addModules = async () => { // async
    const pieces = await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const moduleJSON = await fs.readJSON(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            encoding: 'utf8'
        });
        if (await fs.pathExists(path.join(basePath + 'ct.libs/', lib, 'index.js'))) {
            return parseKeys(moduleJSON, await fs.readFile(path.join(basePath + 'ct.libs/', lib, 'index.js'), {
                encoding: 'utf8'
            }), lib);
        }
        return '';
    }));
    return pieces.join('\n');
};

const injectModules = injects => // async
    Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const libData = await fs.readJSON(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            encoding: 'utf8'
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
// eslint-disable-next-line max-lines-per-function
const exportCtProject = async (project, projdir) => {
    currentProject = project;

    const {languageJSON} = require('./../i18n');
    const {settings} = project;
    await makeWritableDir();

    if (project.rooms.length < 1) {
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
        switch: '',

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

    let buffer = (await sources['main.js'])
        .replace(/\/\*@startwidth@\*\//g, startroom.width)
        .replace(/\/\*@startheight@\*\//g, startroom.height)
        .replace(/\/\*@pixelatedrender@\*\//g, Boolean(settings.rendering.pixelatedrender))
        .replace(/\/\*@highDensity@\*\//g, Boolean(settings.rendering.highDensity))
        .replace(/\/\*@maxfps@\*\//g, Number(settings.rendering.maxFPS))
        .replace(/\/\*@ctversion@\*\//g, process.versions.ctjs)
        .replace(/\/\*@projectmeta@\*\//g, JSON.stringify({
            name: settings.authoring.title,
            author: settings.authoring.author,
            site: settings.authoring.site,
            version: settings.authoring.version.join('.') + settings.authoring.versionPostfix
        }));

    buffer += '\n';

    let actionsSetup = '';
    for (const action of project.actions) {
        actionsSetup += `ct.inputs.addAction('${action.name}', ${JSON.stringify(action.methods)});\n`;
    }

    // This section is synchronous to the possible extent, no race conditions possible here
    /* eslint-disable require-atomic-updates */
    buffer += (await sources['inputs.js']).replace('/*@actions@*/', actionsSetup);
    buffer += '\n';
    buffer += await addModules(buffer);

    /* User-defined scripts */
    for (const script of project.scripts) {
        buffer += script.code + ';\n';
    }

    const roomsCode = stringifyRooms(project);

    buffer += (await sources['rooms.js'])
        .replace('@startroom@', startroom.name)
        .replace('/*@rooms@*/', roomsCode)
        .replace('/*%switch%*/', injects.switch)
        .replace('/*%beforeroomoncreate%*/', injects.beforeroomoncreate)
        .replace('/*%roomoncreate%*/', injects.roomoncreate)
        .replace('/*%roomonleave%*/', injects.roomonleave);
    buffer += '\n';

    const styles = stringifyStyles(project);
    buffer += (await sources['styles.js'])
        .replace('/*@styles@*/', styles)
        .replace('/*%styles%*/', injects.styles);
    buffer += '\n';

    if (project.emitterTandems && project.emitterTandems.length) {
        const templates = stringifyTandems(project);
        buffer += (await sources['emitters.js'])
            .replace('/*@tandemTemplates@*/', templates);
    }

    /* assets — run in parallel */
    const texturesTask = packImages(project, writeDir);
    const skeletonsTask = packSkeletons(project, projdir, writeDir);
    const favicons = bakeFavicons(project, writeDir);
    const textures = await texturesTask;
    const skeletons = await skeletonsTask;
    await favicons;

    buffer += (await sources['res.js'])
        .replace('/*@sndtotal@*/', project.sounds.length)
        .replace('/*@res@*/', textures.res + '\n' + skeletons.loaderScript)
        .replace('/*@textureregistry@*/', textures.registry)
        .replace('/*@textureatlases@*/', JSON.stringify(textures.atlases))
        .replace('/*@skeletonregistry@*/', skeletons.registry)
        .replace('/*%resload%*/', injects.resload + '\n' + skeletons.startScript)
        .replace('/*%res%*/', injects.res);
    buffer += '\n';

    const types = stringifyTypes(project);

    buffer += (await sources['types.js'])
        .replace('/*%oncreate%*/', injects.oncreate)
        .replace('/*%types%*/', injects.types)
        .replace('/*@types@*/', types);

    buffer += (await sources['camera.js']);
    buffer += '\n';

    buffer += '\n';
    var sounds = stringifySounds(project);
    buffer += (await sources['sound.js'])
        .replace('/*@sound@*/', sounds);

    buffer += (await sources['timer.js']);
    buffer += '\n';

    const fonts = await bundleFonts(project, projdir, writeDir);
    buffer += fonts.js;
    /* eslint-enable require-atomic-updates */

    /* passthrough copy of files in the `include` folder */
    if (await fs.exists(projdir + '/include/')) {
        await fs.copy(projdir + '/include/', writeDir);
    }
    await Promise.all(Object.keys(project.libs).map(async lib => {
        if (await fs.exists(path.join(basePath, `./ct.libs/${lib}/includes/`))) {
            await fs.copy(path.join(basePath, `./ct.libs/${lib}/includes/`), writeDir);
        }
    }));

    /* Global injects, provided by modules */
    for (const i in injects) {
        buffer = buffer.replace(`/*%${i}%*/`, injects[i]);
    }


    /* HTML & CSS */
    const {substituteHtmlVars} = require('./html');
    const {substituteCssVars} = require('./css');
    const html = substituteHtmlVars(await sources['index.html'], project, injects);
    let css = substituteCssVars(await sources['ct.css'], project, injects);

    css += fonts.css;

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

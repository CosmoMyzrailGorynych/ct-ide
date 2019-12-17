const fs = require('fs-extra'),
      path = require('path');
const glob = require('./glob');
const basePath = './data/';

let currentProject, writeDir;

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
    /* Модули */
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

const getTextureShape = texture => {
    if (texture.shape === 'rect') {
        return {
            type: 'rect',
            top: texture.top,
            bottom: texture.bottom,
            left: texture.left,
            right: texture.right
        };
    }
    if (texture.shape === 'circle') {
        return {
            type: 'circle',
            r: texture.r
        };
    }
    if (texture.shape === 'strip') {
        return {
            type: 'strip',
            points: texture.stripPoints,
            closedStrip: texture.closedStrip
        };
    }
    return {
        type: 'point'
    };
};
const packImages = async () => {
    const blocks = [];
    const tiledImages = [];
    const keys = {}; // a collection of frame names for each texture name

    // Write functions will be run in parallel, and this array will block the finalization of the function
    const writePromises = [];

    for (const tex of currentProject.textures) {
        if (!tex.tiled) {
            keys[tex.origname] = [];
            for (var yy = 0; yy < tex.grid[1]; yy++) {
                for (var xx = 0; xx < tex.grid[0]; xx++) {
                    const key = `${tex.name}@frame${tex.grid[0] * yy + xx}`; // PIXI.Texture's name in a shared loader
                    // Put each frame individually, with 1px padding on each side
                    blocks.push({
                        data: {
                            name: tex.name,
                            tex,
                            frame: {// A crop from the source texture
                                x: tex.offx + xx * (tex.width + tex.marginx),
                                y: tex.offy + yy * (tex.height + tex.marginy),
                                width: tex.width,
                                height: tex.height
                            },
                            key,
                        },
                        width: tex.width + 2,
                        height: tex.height + 2,
                    });
                    keys[tex.origname].push(key);
                    // skip unnecessary frames when tex.untill is set
                    if (yy * tex.grid[0] + xx >= tex.untill && tex.untill > 0) {
                        break;
                    }
                }
            }
        } else {
            tiledImages.push({
                origname: tex.origname,
                tex
            });
        }
    }
    // eager sort
    blocks.sort((a, b) => Math.max(b.height, b.width) > Math.max(a.height, a.width));
    // this is the beginning of a resulting string that will be written to res.js
    let res = 'PIXI.Loader.shared';
    let registry = {};
    const atlases = []; // names of atlases' json files
    const Packer = require('maxrects-packer').MaxRectsPacker;
    const atlasWidth = 2048,
        atlasHeight = 2048;
    const pack = new Packer(atlasWidth, atlasHeight, 0);
    // pack all the frames
    pack.addArray(blocks);
    // get all atlases
    pack.bins.forEach((bin, binInd) => {
        const atlas = document.createElement('canvas');
        atlas.width = bin.width;
        atlas.height = bin.height;
        atlas.x = atlas.getContext('2d');

        const atlasJSON = {
            meta: {
                app: 'https://ctjs.rocks/',
                version: require('electron').remote.app.getVersion(),
                image: `a${binInd}.png`,
                format: 'RGBA8888',
                size: {
                    w: bin.width,
                    h: bin.height
                },
                scale: '1'
            },
            frames: {},
            animations: {}
        };
        for (const block of bin.rects) {
            const {tex} = block.data,
                {frame} = block.data,
                {key} = block.data,
                img = glob.texturemap[tex.uid];
            // draw the main crop rectangle
            atlas.x.drawImage(img,
                frame.x, frame.y, frame.width, frame.height,
                block.x+1, block.y+1, frame.width, frame.height
            );
            // repeat the left side of the image
            atlas.x.drawImage(img,
                frame.x, frame.y, 1, frame.height,
                block.x, block.y+1, 1, frame.height
            );
            // repeat the right side of the image
            atlas.x.drawImage(img,
                frame.x+frame.width-1, frame.y, 1, frame.height,
                block.x+frame.width+1, block.y+1, 1, frame.height
            );
            // repeat the top side of the image
            atlas.x.drawImage(img,
                frame.x, frame.y, frame.width, 1,
                block.x+1, block.y, frame.width, 1
            );
            // repeat the bottom side of the image
            atlas.x.drawImage(img,
                frame.x, frame.y+frame.height-1, frame.width, 1,
                block.x+1, block.y+frame.height+1, frame.width, 1
            );
            // A multi-frame sprite
            const keys = [];
            keys.push(key);
            atlasJSON.frames[key] = {
                frame: {
                    x: block.x+1,
                    y: block.y+1,
                    w: frame.width,
                    h: frame.height
                },
                rotated: false,
                trimmed: false,
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w: tex.width,
                    h: tex.height
                },
                sourceSize: {
                    w: tex.width,
                    h: tex.height
                },
                anchor: {
                    x: tex.axis[0] / tex.width,
                    y: tex.axis[1] / tex.height
                }
            };
        }
        writePromises.push(fs.outputJSON(`${writeDir}/img/a${binInd}.json`, atlasJSON));
        res += `\n.add('./img/a${binInd}.json')`;
        var data = atlas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        var buf = new Buffer(data, 'base64');
        writePromises.push(fs.writeFile(`${writeDir}/img/a${binInd}.png`, buf));
        atlases.push(`./img/a${binInd}.json`);
    });
    for (const tex of currentProject.textures) {
        registry[tex.name] = {
            frames: tex.untill > 0? Math.min(tex.untill, tex.grid[0]*tex.grid[1]) : tex.grid[0]*tex.grid[1],
            shape: getTextureShape(tex),
            anchor: {
                x: tex.axis[0] / tex.width,
                y: tex.axis[1] / tex.height
            }
        };
    }
    for (let i = 0, l = tiledImages.length; i < l; i++) {
        const atlas = document.createElement('canvas'),
                {tex} = tiledImages[i],
                img = glob.texturemap[tex.uid];
        atlas.x = atlas.getContext('2d');
        atlas.width = tex.width;
        atlas.height = tex.height;
        atlas.x.drawImage(img, 0, 0);
        var buf = new Buffer(atlas.toDataURL().replace(/^data:image\/\w+;base64,/, ''), 'base64');
        writePromises.push(fs.writeFile(`${writeDir}/img/t${i}.png`, buf));
        registry[tex.name] = {
            atlas: `./img/t${i}.png`,
            frames: 0,
            shape: getTextureShape(tex),
            anchor: {
                x: tex.axis[0] / tex.width,
                y: tex.axis[1] / tex.height
            }
        };
        res += `\n.add('./img/t${i}.png')`;
    }
    res += ';';
    registry = JSON.stringify(registry);

    await Promise.all(writePromises);
    return {
        res,
        registry,
        atlases
    };
};
const packSkeletons = async projdir => {
    const writePromises = [];

    const data = {
        loaderScript: 'PIXI.Loader.shared',
        startScript: 'const dbf = dragonBones.PixiFactory.factory;',
        registry: {},
        requiresDB: false
    };
    if (!currentProject.skeletons.length) {
        data.startScript = '';
        data.loaderScript = '';
        data.registry = JSON.stringify(data.registry);
        return data;
    }
    for (const skeleton of currentProject.skeletons) {
        const slice = skeleton.origname.replace('_ske.json', '');
        writePromises.push(fs.copy(`${projdir}/img/${slice}_ske.json`, `${writeDir}/img/${slice}_ske.json`));
        writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.json`, `${writeDir}/img/${slice}_tex.json`));
        writePromises.push(fs.copy(`${projdir}/img/${slice}_tex.png`, `${writeDir}/img/${slice}_tex.png`));

        data.loaderScript += `.add('${slice}_ske.json', './img/${slice}_ske.json')`;
        data.loaderScript += `.add('${slice}_tex.json', './img/${slice}_tex.json')`;
        data.loaderScript += `.add('${slice}_tex.png', './img/${slice}_tex.png')`;

        data.startScript += `dbf.parseDragonBonesData(PIXI.Loader.shared.resources['${slice}_ske.json'].data);\n`;
        data.startScript += `dbf.parseTextureAtlasData(PIXI.Loader.shared.resources['${slice}_tex.json'].data, PIXI.Loader.shared.resources['${slice}_tex.png'].texture);\n`;

        data.registry[skeleton.name] = {
            origname: slice,
            type: skeleton.from
        };
        if (skeleton.from === 'dragonbones') {
            data.requiresDB = true;
        }
    }
    data.loaderScript += ';';
    if (data.requiresDB) {
        writePromises.push(fs.copyFile(basePath + 'ct.release/DragonBones.min.js', writeDir + '/DragonBones.min.js'));
    }
    data.registry = JSON.stringify(data.registry);
    await Promise.all(writePromises);
    return data;
};

const {styleToTextStyle} = require('./styleUtils');
const stringifyStyles = () => {
    var styles = '';
    for (const styl in currentProject.styles) {
        var s = currentProject.styles[styl],
            o = styleToTextStyle(s);
        styles += `
ct.styles.new(
    "${s.name}",
    ${JSON.stringify(o, null, '    ')});
`;
    }
    return styles;
};

const stringifySounds = () => {
    var sounds = '';
    for (const k in currentProject.sounds) {
        const s = currentProject.sounds[k];
        if (!s.origname) {
            throw new Error(`The sound asset "${s.name}" does not have an actual sound file attached.`);
        }
        var wav = s.origname.slice(-4) === '.wav',
            mp3 = s.origname.slice(-4) === '.mp3',
            ogg = s.origname.slice(-4) === '.ogg';
        sounds += `
ct.sound.init('${s.name}', {
    wav: ${wav? '\'./snd/'+s.uid+'.wav\'' : false},
    mp3: ${mp3? '\'./snd/'+s.uid+'.mp3\'' : false},
    ogg: ${ogg? '\'./snd/'+s.uid+'.ogg\'' : false}
}, {
    poolSize: ${s.poolSize || 5},
    music: ${Boolean(s.isMusic)}
});`;
    }
    return sounds;
};

const getStartingRoom = () => {
    let [startroom] = currentProject.rooms; // picks the first room by default
    for (let i = 0; i < currentProject.rooms.length; i++) {
        if (currentProject.rooms[i].uid === currentProject.startroom) {
            startroom = currentProject.rooms[i];
            break;
        }
    }
    return startroom;
};
const stringifyRooms = () => {
    let roomsCode = '';
    for (const k in currentProject.rooms) {
        const r = currentProject.rooms[k];

        const roomCopy = JSON.parse(JSON.stringify(r.copies));
        const objs = [];
        for (const copy of roomCopy) {
            copy.type = currentProject.types[glob.typemap[copy.uid]].name;
            delete copy.uid;
            objs.push(copy);
        }
        const bgsCopy = JSON.parse(JSON.stringify(r.backgrounds));
        for (const bg in bgsCopy) {
            bgsCopy[bg].texture = glob.texturemap[bgsCopy[bg].texture].g.name;
            bgsCopy[bg].depth = Number(bgsCopy[bg].depth);
        }

        const tileLayers = [];
        /* eslint {max-depth: off} */
        if (r.tiles) {
            for (const tileLayer of r.tiles) {
                const layer = {
                    depth: tileLayer.depth,
                    tiles: []
                };
                for (const tile of tileLayer.tiles) {
                    for (let x = 0; x < tile.grid[2]; x++) {
                        for (let y = 0; y < tile.grid[3]; y++) {
                            const texture = glob.texturemap[tile.texture].g;
                            layer.tiles.push({
                                texture: texture.name,
                                frame: tile.grid[0] + x + (y+tile.grid[1])*texture.grid[0],
                                x: tile.x + x*(texture.width + texture.marginx),
                                y: tile.y + y*(texture.height + texture.marginy),
                                width: texture.width,
                                height: texture.height
                            });
                        }
                    }
                }
                tileLayers.push(layer);
            }
        }

        roomsCode += `
ct.rooms.templates['${r.name}'] = {
    name: '${r.name}',
    width: ${r.width},
    height: ${r.height},
    /* JSON.parse allows for a much faster loading of big objects */
    objects: JSON.parse('${JSON.stringify(objs)}'),
    bgs: JSON.parse('${JSON.stringify(bgsCopy)}'),
    tiles: JSON.parse('${JSON.stringify(tileLayers)}'),
    onStep() {
        ${currentProject.rooms[k].onstep}
    },
    onDraw() {
        ${currentProject.rooms[k].ondraw}
    },
    onLeave() {
        ${currentProject.rooms[k].onleave}
    },
    onCreate() {
        ${currentProject.rooms[k].oncreate}
    }
}`;
    }
    return roomsCode;
};

const stringifyFont = font => `
@font-face {
    font-family: '${font.typefaceName}';
    src: url('fonts/${font.origname}.woff') format('woff'),
         url('fonts/${font.origname}') format('truetype');
    font-weight: ${font.weight};
    font-style: ${font.italic? 'italic' : 'normal'};
}`;
const bundleFonts = async function(projdir) {
    let css = '',
        js = '';
    const writePromises = [];
    if (currentProject.fonts) {
        js += 'if (document.fonts) { for (const font of document.fonts) { font.load(); }}';
        await fs.ensureDir(writeDir + '/fonts');
        const ttf2woff = require('ttf2woff');
        await Promise.all(currentProject.fonts.map(async font => {
            const fontData = await fs.readFile(`${projdir}/fonts/${font.origname}`);
            var ttf = new Uint8Array(fontData);
            var woff = new Buffer(ttf2woff(ttf).buffer);
            writePromises.push(fs.copy(`${projdir}/fonts/${font.origname}` , writeDir + '/fonts/' + font.origname));
            writePromises.push(fs.writeFile(writeDir + '/fonts/' + font.origname + '.woff', woff));
            css += stringifyFont(font);
        }));
    }
    await Promise.all(writePromises);
    return {
        css,
        js
    };
};

const makeWritableDir = async () => {
    const {getWritableDir} = require('./platformUtils');
    writeDir = path.join(await getWritableDir(), 'export');
};
const runCtProject = async (project, projdir) => {
    const {languageJSON} = require('./i18n');
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

    const startroom = getStartingRoom();

    /* Load source files in parallel */
    const sources = {};
    const sourcesList = [
        'ct.css',
        'index.html',
        'main.js',
        'inputs.js',
        'rooms.js',
        'res.js',
        'types.js',
        'styles.js',
        'sound.js'
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
        .replace(/\/\*@maxfps@\*\//g, Number(currentProject.settings.maxFPS))
        .replace(/\/\*@ctversion@\*\//g, require('electron').remote.app.getVersion())
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

    const roomsCode = stringifyRooms();

    buffer += (await sources['rooms.js'])
        .replace('@startroom@', startroom.name)
        .replace('/*@rooms@*/', roomsCode)
        .replace('/*%switch%*/', injects.switch)
        .replace('/*%roomoncreate%*/', injects.roomoncreate)
        .replace('/*%roomonleave%*/', injects.roomonleave);
    buffer += '\n';

    const styles = stringifyStyles(projdir);
    buffer += (await sources['styles.js'])
        .replace('/*@styles@*/', styles)
        .replace('/*%styles%*/', injects.styles);
    buffer += '\n';

    /* assets — run in parallel */
    const texturesTask = packImages(projdir);
    const skeletonsTask = packSkeletons(projdir);
    const textures = await texturesTask;
    const skeletons = await skeletonsTask;

    buffer += (await sources['res.js'])
        .replace('/*@sndtotal@*/', currentProject.sounds.length)
        .replace('/*@res@*/', textures.res + '\n' + skeletons.loaderScript)
        .replace('/*@textureregistry@*/', textures.registry)
        .replace('/*@textureatlases@*/', JSON.stringify(textures.atlases))
        .replace('/*@skeletonregistry@*/', skeletons.registry)
        .replace('/*%resload%*/', injects.resload + '\n' + skeletons.startScript)
        .replace('/*%res%*/', injects.res);
    buffer += '\n';

    /* Stringify types */
    var types = '';
    for (const k in currentProject.types) {
        var type = currentProject.types[k];
        types += 'ct.types.templates["' + type.name + '"] = {\n';
        types += '    depth:' + type.depth + ',\n';

        if (type.texture !== -1) {
            types += '    texture: "' + glob.texturemap[type.texture].g.name + '",\n';
        }
        types += '    onStep: function () {\n' + type.onstep + '\n    },\n';
        types += '    onDraw: function () {\n' + type.ondraw + '\n    },\n';
        types += '    onDestroy: function () {\n' + type.ondestroy + '\n    },\n';
        types += '    onCreate: function () {\n' + type.oncreate + '\n    },\n';
        types += '    extends: ' + JSON.stringify(type.extends || {});
        types += '};\n';
        types += `ct.types.list['${type.name}'] = [];\n`;
    }
    buffer += (await sources['types.js'])
        .replace('/*%oncreate%*/', injects.oncreate)
        .replace('/*%types%*/', injects.types)
        .replace('/*@types@*/', types);

    buffer += '\n';
    var sounds = stringifySounds();
    buffer += (await sources['sound.js'])
        .replace('/*@sound@*/', sounds);

    const fonts = await bundleFonts(projdir);
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
    const html = (await sources['index.html'])
        .replace('<!-- %htmltop% -->', injects.htmltop)
        .replace('<!-- %htmlbottom% -->', injects.htmlbottom)
        .replace('<!-- %gametitle% -->', currentProject.settings.title || 'ct.js game')
        .replace('<!-- %dragonbones% -->', skeletons.requiresDB? '<script src="DragonBones.min.js"></script>' : '');

    let css = (await sources['ct.css'])
        .replace('/*@pixelatedrender@*/', currentProject.settings.pixelatedrender? 'canvas,img{image-rendering:optimizeSpeed;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:optimize-contrast;image-rendering:pixelated;ms-interpolation-mode:nearest-neighbor}' : '')
        .replace('/*%css%*/', injects.css);

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

module.exports = runCtProject;

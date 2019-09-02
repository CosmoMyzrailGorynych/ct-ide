const fs = require('fs-extra'),
      path = require('path');
const glob = require('./glob');
const basePath = './data/';

let ctlibs, currentProject, writeDir, projdir;

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

const addModules = buffer => {
    /* Модули */
    for (var lib in currentProject.libs) {
        const data = fs.readJSONSync(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            'encoding': 'utf8'
        });
        if (fs.pathExistsSync(path.join(basePath + 'ct.libs/', lib, 'index.js'))) {
            buffer += parseKeys(data, fs.readFileSync(path.join(basePath + 'ct.libs/', lib, 'index.js'), {
                'encoding': 'utf8'
            }), lib);
        }
        buffer += '\n';
    }
    return buffer;
};

const injectModules = (injects) => {
    for (const lib in currentProject.libs) {
        const libData = fs.readJSONSync(path.join(basePath + 'ct.libs/', lib, 'module.json'), {
            'encoding': 'utf8'
        });
        ctlibs[lib] = libData.main;
        if (fs.pathExistsSync(path.join(basePath + 'ct.libs/', lib, 'injects'))) {
            const injectFiles = fs.readdirSync(path.join(basePath + 'ct.libs/', lib, 'injects')),
                    injectKeys = injectFiles.map(fname => path.basename(fname, path.extname(fname)));
            for (var inj in injectKeys) {
                if (injectKeys[inj] in injects) {
                    injects[injectKeys[inj]] += parseKeys(libData, fs.readFileSync(path.join(basePath + 'ct.libs/', lib, 'injects', injectFiles[inj]), {
                        encoding: 'utf8'
                    }), lib);
                }
            }
        }
    }
};

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
            points: texture.stripPoints
        };
    }
    return {
        type: 'point'
    };
};
const packImages = () => {
    var blocks = [],
        tiledImages = [];
    for (let i = 0, li = currentProject.textures.length; i < li; i++) {
        if (!currentProject.textures[i].tiled) {
            blocks.push({
                data: {
                    origname: currentProject.textures[i].origname,
                    g: currentProject.textures[i]
                },
                width: currentProject.textures[i].imgWidth+2,
                height: currentProject.textures[i].imgHeight+2,
            });
        } else {
            tiledImages.push({
                origname: currentProject.textures[i].origname,
                g: currentProject.textures[i]
            });
        }
    }
    blocks.sort((a, b) => Math.max(b.height, b.width) > Math.max(a.height, a.width));
    let res = 'PIXI.Loader.shared';
    let registry = {};
    const Packer = require('maxrects-packer');
    const atlasWidth = 2048,
        atlasHeight = 2048;
    const pack = new Packer(atlasWidth, atlasHeight, 1);
    pack.addArray(blocks);
    pack.bins.forEach((bin, binInd) => {
        const atlas = document.createElement('canvas');
        atlas.width = bin.width;
        atlas.height = bin.height;
        atlas.x = atlas.getContext('2d');

        const atlasJSON = {
            meta: {
                app: 'http://ctjs.rocks/',
                version: nw.App.manifest.version,
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
        for (let i = 0, li = bin.rects.length; i < li; i++) {
            const block = bin.rects[i],
                    {g} = block.data,
                    img = glob.texturemap[g.uid];
                atlas.x.drawImage(img, block.x+1, block.y+1);
            // A multi-frame sprite
            const keys = [];
            for (var yy = 0; yy < g.grid[1]; yy++) {
                for (var xx = 0; xx < g.grid[0]; xx++) {
                    const key = `${g.name}_frame${g.grid[0] * yy + xx}`;
                    keys.push(key);
                    atlasJSON.frames[key] = {
                        frame: {
                            x: block.x+1 + g.offx + xx * (g.width + g.marginx),
                            y: block.y+1 + g.offy + yy * (g.height + g.marginy),
                            w: g.width,
                            h: g.height
                        },
                        rotated: false,
                        trimmed: false,
                        spriteSourceSize: {
                            x: 0,
                            y: 0,
                            w: g.width,
                            h: g.height
                        },
                        sourceSize: {
                            w: g.width,
                            h: g.height
                        },
                        anchor: {
                            x: g.axis[0] / g.width,
                            y: g.axis[1] / g.height
                        }
                    };
                    if (yy * g.grid[0] + xx >= g.grid.untill && g.grid.untill > 0) {
                        break;
                    }
                }
                registry[g.name] = {
                    atlas: `./img/a${binInd}.json`,
                    frames: g.grid.untill > 0? Math.min(g.grid.untill, g.grid[0]*g.grid[1]) : g.grid[0]*g.grid[1],
                    shape: getTextureShape(g),
                    anchor: {
                        x: g.axis[0] / g.width,
                        y: g.axis[1] / g.height
                    }
                };
                atlasJSON.animations[g.name] = keys;
            }
        }
        fs.outputJSONSync(`${writeDir}/img/a${binInd}.json`, atlasJSON);
        res += `\n.add('./img/a${binInd}.json')`;
        var data = atlas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        var buf = new Buffer(data, 'base64');
        fs.writeFileSync(`${writeDir}/img/a${binInd}.png`, buf);
    });
    for (let i = 0, l = tiledImages.length; i < l; i++) {
        const atlas = document.createElement('canvas'),
                {g} = tiledImages[i],
                img = glob.texturemap[g.uid];
        atlas.x = atlas.getContext('2d');
        atlas.width = g.width;
        atlas.height = g.height;
        atlas.x.drawImage(img, 0, 0);
        var buf = new Buffer(atlas.toDataURL().replace(/^data:image\/\w+;base64,/, ''), 'base64');
        fs.writeFileSync(`${writeDir}/img/t${i}.png`, buf);
        registry[g.name] = {
            atlas: `./img/t${i}.png`,
            frames: 0,
            shape: getTextureShape(g),
            anchor: {
                x: g.axis[0] / g.width,
                y: g.axis[1] / g.height
            }
        };
        res += `\n.add('./img/t${i}.png')`;
    }
    res += ';';
    registry = JSON.stringify(registry);
    return {
        res,
        registry
    };
};
const packSkeletons = (projdir) => {
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
        fs.copySync(`${projdir}/img/${slice}_ske.json`, `${writeDir}/img/${slice}_ske.json`);
        fs.copySync(`${projdir}/img/${slice}_tex.json`, `${writeDir}/img/${slice}_tex.json`);
        fs.copySync(`${projdir}/img/${slice}_tex.png`, `${writeDir}/img/${slice}_tex.png`);

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
        fs.copyFileSync(basePath + 'ct.release/DragonBones.min.js', writeDir + '/DragonBones.min.js');
    }
    data.registry = JSON.stringify(data.registry);
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
            mp3 = s.origname.slice(-4) === '.mp3';
        sounds += `ct.sound.init('${s.name}', ${wav? `'./snd/${s.uid}.wav'` : 'null'}, ${mp3? `'./snd/${s.uid}.mp3'` : 'null'}, {
    poolSize: ${s.poolSize || 5},
    music: ${Boolean(s.isMusic)}
});\n`;
    }
    return sounds;
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
    objects: ${JSON.stringify(objs)},
    bgs: ${JSON.stringify(bgsCopy)},
    tiles: ${JSON.stringify(tileLayers)},
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

const bundleFonts = function(projdir) {
    let css = '',
        js = '';
    if (currentProject.fonts) {
        fs.ensureDirSync(writeDir + '/fonts');
        const ttf2woff = require('ttf2woff');
        for (const font of currentProject.fonts) {
            fs.copySync(`${projdir}/fonts/${font.origname}` , writeDir + '/fonts/' + font.origname);
            const fontData = fs.readFileSync(`${projdir}/fonts/${font.origname}`);
            var ttf = new Uint8Array(fontData);
            var woff = new Buffer(ttf2woff(ttf).buffer);
            fs.writeFileSync(writeDir + '/fonts/' + font.origname + '.woff', woff);
            css += `
@font-face {
    font-family: '${font.typefaceName}';
    src: url('fonts/${font.origname}.woff') format('woff'),
         url('fonts/${font.origname}') format('truetype');
    font-weight: ${font.weight};
    font-style: ${font.italic? 'italic' : 'normal'};
}`;
        }
        js += 'if (document.fonts) { for (const font of document.fonts) { font.load(); }}';
    }
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
    currentProject = project;
    await makeWritableDir();
    return new Promise(resolve => {
        // glob.compileAudio = 0;
        if (currentProject.rooms.length < 1) {
            window.alertify.error(window.languageJSON.common.norooms);
            return;
        }
        document.body.style.cursor = 'wait';

        ctlibs = {
            CORE: {
                name: 'ct.js Game Framework',
                info: 'A game made with ct.js game framework and ct.IDE. Create your 2D games for free!',
                authors: [{
                    name: 'Cosmo Myzrail Gorynych',
                    site: 'https://ctjs.rocks/'
                }]
            }
        };
        fs.removeSync(writeDir);
        fs.ensureDirSync(writeDir);
        fs.ensureDirSync(path.join(writeDir, '/img/'));
        fs.ensureDirSync(path.join(writeDir, '/snd/'));
        var css = fs.readFileSync(basePath + 'ct.release/ct.css', {
                'encoding': 'utf8'
            }),
            html = fs.readFileSync(basePath + 'ct.release/index.html', {
                'encoding': 'utf8'
            });
        var injects = {
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

        injectModules(injects);
        // console.log(injects);

        /* Pixi.js */
        fs.copyFileSync(basePath + 'ct.release/pixi.min.js', path.join(writeDir, '/pixi.min.js'));

        var [startroom] = currentProject.rooms;
        for (let i = 0; i < currentProject.rooms.length; i++) {
            if (currentProject.rooms[i].uid === currentProject.startroom) {
                startroom = currentProject.rooms[i];
                break;
            }
        }
        /* global nw */
        var buffer = fs.readFileSync(basePath + 'ct.release/main.js', {
            'encoding': 'utf8'
        })
        .replace(/\/\*@startwidth@\*\//g, startroom.width)
        .replace(/\/\*@startheight@\*\//g, startroom.height)
        .replace(/\/\*@pixelatedrender@\*\//g, Boolean(currentProject.settings.pixelatedrender))
        .replace(/\/\*@maxfps@\*\//g, Number(currentProject.settings.maxFPS))
        .replace(/\/\*@libs@\*\//g, JSON.stringify(ctlibs, null, '    '))
        .replace(/\/\*@ctversion@\*\//g, nw.App.manifest.version)
        .replace(/\/\*@projectmeta@\*\//g, JSON.stringify({
            name: currentProject.settings.title,
            author: currentProject.settings.author,
            site: currentProject.settings.site,
            version: currentProject.settings.version.join('.') + currentProject.settings.versionPostfix
        }));

        buffer += '\n';

        var actionsSetup = '';
        for (const action of currentProject.actions) {
            actionsSetup += `ct.inputs.addAction('${action.name}', ${JSON.stringify(action.methods)});\n`;
        }
        buffer += fs.readFileSync(basePath + 'ct.release/inputs.js', {
            'encoding': 'utf8'
        }).replace('/*@actions@*/', actionsSetup);

        buffer += '\n';

        buffer = addModules(buffer);

        /* User-defined scripts */
        for (const script of currentProject.scripts) {
            buffer += script.code + ';\n';
        }

        var roomsCode = stringifyRooms();

        buffer += fs.readFileSync(basePath + 'ct.release/rooms.js', {
            'encoding': 'utf8'
        })
        .replace('@startroom@', startroom.name)
        .replace('/*@rooms@*/', roomsCode)
        .replace('/*%switch%*/', injects.switch)
        .replace('/*%roomoncreate%*/', injects.roomoncreate)
        .replace('/*%roomonleave%*/', injects.roomonleave);
        buffer += '\n';

        var styles = stringifyStyles(projdir);
        buffer += fs.readFileSync(basePath + 'ct.release/styles.js', {
            'encoding': 'utf8'
        })
        .replace('/*@styles@*/', styles)
        .replace('/*%styles%*/', injects.styles);
        buffer += '\n';

        /* assets */
        var textures = packImages(projdir);
        var skeletons = packSkeletons(projdir);

        buffer += fs.readFileSync(basePath + 'ct.release/res.js', {
            'encoding': 'utf8'
        })
        .replace('/*@sndtotal@*/', currentProject.sounds.length)
        .replace('/*@res@*/', textures.res + '\n' + skeletons.loaderScript)
        .replace('/*@textureregistry@*/', textures.registry)
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
        buffer += fs.readFileSync(basePath + 'ct.release/types.js', {
            'encoding': 'utf8'
        })
        .replace('/*%oncreate%*/', injects.oncreate)
        .replace('/*%types%*/', injects.types)
        .replace('/*@types@*/', types);

        buffer += '\n';
        var sounds = stringifySounds();
        buffer += fs.readFileSync(basePath + 'ct.release/sound.js', {
            'encoding': 'utf8'
        })
        .replace('/*@sound@*/', sounds);

        var fonts = bundleFonts(projdir);
        css += fonts.css;
        buffer += fonts.js;

        /* passthrough copy of files in the `include` folder */
        if (fs.existsSync(projdir + '/include/')) {
            fs.copySync(projdir + '/include/', writeDir);
        }
        for (const lib in currentProject.libs) {
            if (fs.existsSync(path.join(basePath, `./ct.libs/${lib}/includes/`))) {
                fs.copySync(path.join(basePath, `./ct.libs/${lib}/includes/`), writeDir);
            }
        }

        /* Global injects, provided by modules */
        for (const i in injects) {
            buffer = buffer.replace(`/*%${i}%*/`, injects[i]);
        }

        /* Final touches and script output */
        if (currentProject.settings.minifyjs) {
            const preamble = '/* Made with ct.js http://ctjs.rocks/ */\n';
            const {compile} = require('google-closure-compiler-js');

            const flags = {
                jsCode: [{src: buffer}],
            };
            const out = compile(flags);
            fs.writeFileSync(path.join(writeDir, '/ct.js'), preamble + out.compiledCode);
        } else {
            fs.writeFileSync(path.join(writeDir, '/ct.js'), buffer);
        }

        /* HTML & CSS */
        fs.writeFileSync(path.join(writeDir, '/index.html'), html
            .replace('<!-- %htmltop% -->', injects.htmltop)
            .replace('<!-- %htmlbottom% -->', injects.htmlbottom)
            .replace('<!-- %gametitle% -->', currentProject.settings.title || 'ct.js game')
            .replace('<!-- %dragonbones% -->', skeletons.requiresDB? '<script src="DragonBones.min.js"></script>' : ''));

        fs.writeFileSync(path.join(writeDir, '/ct.css'), css
            .replace('/*@pixelatedrender@*/', currentProject.settings.pixelatedrender? 'canvas,img{image-rendering:optimizeSpeed;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:optimize-contrast;image-rendering:pixelated;ms-interpolation-mode:nearest-neighbor}' : '')
            .replace('/*%css%*/', injects.css));

        if (currentProject.settings.minifyhtmlcss) {
            const csswring = require('csswring'),
                htmlMinify = require('html-minifier').minify;
            fs.writeFileSync(path.join(writeDir, '/index.html'), htmlMinify(
                fs.readFileSync(path.join(writeDir, '/index.html'), {
                    'encoding': 'utf8'
                })
            , {
                removeComments: true,
                collapseWhitespace: true
            }));
            fs.writeFileSync(path.join(writeDir, '/ct.css'), csswring.wring(
                fs.readFileSync(path.join(writeDir, '/ct.css'), {
                    'encoding': 'utf8'
                })
            ).css);
        }
        for (const k in currentProject.sounds) {
            var sound = currentProject.sounds[k],
                ext = sound.origname.slice(-4);
            fs.copySync(path.join(projdir, '/snd/', sound.origname), path.join(writeDir, '/snd/', sound.uid + ext));
        }

        /*
        glob.targetAudio = currentProject.sounds.length * 2;
        for (k in currentProject.sounds) {
            ffmpeg.mp3(projdir + '/sound/' + currentProject.sounds[k].origname, function (err, out, code) {
                if (err) {
                    console.log(err, out, code);
                    throw err;
                }
                events.compileAudio();
            });
        }
        */
        document.body.style.cursor = 'default';
        resolve(path.join(writeDir, `/index.${currentProject.settings.minifyhtml? 'min.': ''}html`));
    });
};

module.exports = runCtProject;

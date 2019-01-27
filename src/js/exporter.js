(window => {
    'use strict';

    const fs = require('fs-extra'),
          path = require('path');
    const basePath = './data/';

    const exec = path.dirname(process.execPath).replace(/\\/g,'/');

    var ctlibs;

    var parseKeys = function(data, str, lib) {
        var str2 = str;
        if (data.fields) {
            for (const field in data.fields) {
                const val = window.currentProject.libs[lib][data.fields[field].key];
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
        for (var lib in window.currentProject.libs) {
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

    var injectModules = (injects) => {
        for (const lib in window.currentProject.libs) {
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

    var getGraphicShape = graphic => {
        if (graphic.shape === 'rect') {
            return {
                type: 'rect',
                top: graphic.top,
                bottom: graphic.bottom,
                left: graphic.left,
                right: graphic.right
            };
        }
        if (graphic.shape === 'circle') {
            return {
                type: 'circle',
                r: graphic.r
            };
        }
        if (graphic.shape === 'strip') {
            return {
                type: 'strip',
                points: graphic.stripPoints
            };
        }
        return {
            type: 'point'
        };
    };
    var packImages = () => {
        var blocks = [],
            tiledImages = [];
        for (let i = 0, li = window.currentProject.graphs.length; i < li; i++) {
            if (!window.currentProject.graphs[i].tiled) {
                blocks.push({
                    data: {
                        origname: window.currentProject.graphs[i].origname,
                        g: window.currentProject.graphs[i]
                    },
                    width: window.currentProject.graphs[i].imgWidth+2,
                    height: window.currentProject.graphs[i].imgHeight+2,
                });
            } else {
                tiledImages.push({
                    origname: window.currentProject.graphs[i].origname,
                    g: window.currentProject.graphs[i]
                });
            }
        }
        blocks.sort((a, b) => Math.max(b.height, b.width) > Math.max(a.height, a.width));
        let res = 'PIXI.loader';
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
                      img = window.glob.graphmap[g.uid];
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
                        shape: getGraphicShape(g),
                        anchor: {
                            x: g.axis[0] / g.width,
                            y: g.axis[1] / g.height
                        }
                    };
                    atlasJSON.animations[g.name] = keys;
                }
            }
            fs.outputJSONSync(`${exec}/export/img/a${binInd}.json`, atlasJSON);
            res += `\n.add('./img/a${binInd}.json')`;
            var data = atlas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
            var buf = new Buffer(data, 'base64');
            fs.writeFileSync(`${exec}/export/img/a${binInd}.png`, buf);
        });
        for (let i = 0, l = tiledImages.length; i < l; i++) {
            const atlas = document.createElement('canvas'),
                  {g} = tiledImages[i],
                  img = window.glob.graphmap[g.uid];
            atlas.x = atlas.getContext('2d');
            atlas.width = g.width;
            atlas.height = g.height;
            atlas.x.drawImage(img, 0, 0);
            var buf = new Buffer(atlas.toDataURL().replace(/^data:image\/\w+;base64,/, ''), 'base64');
            fs.writeFileSync(`${exec}/export/img/t${i}.png`, buf);
            registry[g.name] = {
                atlas: `./img/t${i}.png`,
                frames: 0,
                shape: getGraphicShape(g),
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
    var packSkeletons = () => {
        const data = {
            loaderScript: 'PIXI.loader',
            startScript: 'const dbf = dragonBones.PixiFactory.factory;',
            registry: {},
            requiresDB: false
        };
        if (!window.currentProject.skeletons.length) {
            data.startScript = '';
            data.loaderScript = '';
            data.registry = JSON.stringify(data.registry);
            return data;
        }
        for (const skeleton of window.currentProject.skeletons) {
            const slice = skeleton.origname.replace('_ske.json', '');
            fs.copySync(`${sessionStorage.projdir}/img/${slice}_ske.json`, `${exec}/export/img/${slice}_ske.json`);
            fs.copySync(`${sessionStorage.projdir}/img/${slice}_tex.json`, `${exec}/export/img/${slice}_tex.json`);
            fs.copySync(`${sessionStorage.projdir}/img/${slice}_tex.png`, `${exec}/export/img/${slice}_tex.png`);

            data.loaderScript += `.add('${slice}_ske.json', './img/${slice}_ske.json')`;
            data.loaderScript += `.add('${slice}_tex.json', './img/${slice}_tex.json')`;
            data.loaderScript += `.add('${slice}_tex.png', './img/${slice}_tex.png')`;

            data.startScript += `dbf.parseDragonBonesData(PIXI.loader.resources['${slice}_ske.json'].data);\n`;
            data.startScript += `dbf.parseTextureAtlasData(PIXI.loader.resources['${slice}_tex.json'].data, PIXI.loader.resources['${slice}_tex.png'].texture);\n`;

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
            fs.copyFileSync(basePath + 'ct.release/DragonBones.min.js', exec + '/export/DragonBones.min.js');
        }
        data.registry = JSON.stringify(data.registry);
        return data;
    };

    var stringifyStyles = () => {
        var styles = '';
        for (const styl in window.currentProject.styles) {
            var s = window.currentProject.styles[styl],
                o = window.styleToTextStyle(s);
            styles += `
ct.styles.new(
    "${s.name}",
    ${JSON.stringify(o, null, '    ')});
`;
        }
        return styles;
    };

    var stringifySounds = () => {
        var sounds = '';
        for (const k in window.currentProject.sounds) {
            const s = window.currentProject.sounds[k];
            var wav = s.origname.slice(-4) === '.wav',
                mp3 = s.origname.slice(-4) === '.mp3';
            sounds += `ct.sound.init('${s.name}', ${wav? `'./snd/${s.uid}.wav'` : 'null'}, ${mp3? `'./snd/${s.uid}.mp3'` : 'null'}, {
                poolSize: ${s.poolSize || 5},
                music: ${Boolean(s.isMusic)}
            });\n`;
        }
        return sounds;
    };

    var stringifyRooms = () => {
        var roomsCode = '';
        for (const k in window.currentProject.rooms) {
            const r = window.currentProject.rooms[k];
            
            var roomCopy = JSON.parse(JSON.stringify(r.copies));
            var objs = [];
            for (const copy of roomCopy) {
                copy.type = window.currentProject.types[window.glob.typemap[copy.uid]].name;
                delete copy.uid;
                objs.push(copy);
            }
            var bgsCopy = JSON.parse(JSON.stringify(r.backgrounds));
            for (var bg in bgsCopy) {
                bgsCopy[bg].graph = window.glob.graphmap[bgsCopy[bg].graph].g.name;
                bgsCopy[bg].depth = Number(bgsCopy[bg].depth);
            }

            var tileLayers = [];
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
                                const graph = window.glob.graphmap[tile.graph].g;
                                layer.tiles.push({
                                    graph: graph.name,
                                    frame: tile.grid[0] + x + (y+tile.grid[1])*graph.grid[0],
                                    x: tile.x + x*(graph.width + graph.marginx),
                                    y: tile.y + y*(graph.height + graph.marginy),
                                    width: graph.width,
                                    height: graph.height
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
        ${window.currentProject.rooms[k].onstep}
    },
    onDraw() {
        ${window.currentProject.rooms[k].ondraw}
    },
    onLeave() {
        ${window.currentProject.rooms[k].onleave}
    },
    onCreate() {
        ${window.currentProject.rooms[k].oncreate}
    }
}`;
        }
        return roomsCode;
    };

    var bundleFonts = function() {
        var css = '',
            js = '';
        if (window.currentProject.fonts) {
            fs.ensureDirSync(exec + '/export/fonts');
            const ttf2woff = require('ttf2woff');
            for (const font of window.currentProject.fonts) {
                fs.copySync(`${sessionStorage.projdir}/fonts/${font.origname}` , exec + '/export/fonts/' + font.origname);
                const fontData = fs.readFileSync(`${sessionStorage.projdir}/fonts/${font.origname}`);
                var ttf = new Uint8Array(fontData);
                var woff = new Buffer(ttf2woff(ttf).buffer);
                fs.writeFileSync(exec + '/export/fonts/' + font.origname + '.woff', woff);
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

    window.runCtProject = () => new Promise((resolve) => {
        // glob.compileAudio = 0;
        if (window.currentProject.rooms.length < 1) {
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
        fs.removeSync(exec + '/export/');
        fs.ensureDirSync(exec + '/export/');
        fs.ensureDirSync(exec + '/export/img/');
        fs.ensureDirSync(exec + '/export/snd/');
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

        /* инъекции */
        injectModules(injects);
        // console.log(injects);

        /* Pixi.js */
        fs.copyFileSync(basePath + 'ct.release/pixi.min.js', exec + '/export/pixi.min.js');

        /* главный котэ */
        var [startroom] = window.currentProject.rooms;
        for (let i = 0; i < window.currentProject.rooms.length; i++) {
            if (window.currentProject.rooms[i].uid === window.currentProject.startroom) {
                startroom = window.currentProject.rooms[i];
                break;
            }
        }
        /* global nw */
        var buffer = fs.readFileSync(basePath + 'ct.release/main.js', {
            'encoding': 'utf8'
        })
        .replace(/\/\*@startwidth@\*\//g, startroom.width)
        .replace(/\/\*@startheight@\*\//g, startroom.height)
        .replace(/\/\*@pixelatedrender@\*\//g, Boolean(window.currentProject.settings.pixelatedrender))
        .replace(/\/\*@libs@\*\//g, JSON.stringify(ctlibs, null, '    '))
        .replace(/\/\*@ctversion@\*\//g, nw.App.manifest.version)
        .replace(/\/\*@projectmeta@\*\//g, JSON.stringify({
            name: window.currentProject.settings.title,
            author: window.currentProject.settings.author,
            site: window.currentProject.settings.site,
            version: window.currentProject.settings.version.join('.') + window.currentProject.settings.versionPostfix
        }));

        buffer += '\n';

        /* котомышь */
        buffer += fs.readFileSync(basePath + 'ct.release/mouse.js', {
            'encoding': 'utf8'
        });

        buffer += '\n';

        buffer = addModules(buffer);

        /* Пользовательские скрипты */
        for (const script of window.currentProject.scripts) {
            buffer += script.code + ';\n';
        }

        /* комнатный котэ */
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

        /* стильный котэ */
        var styles = stringifyStyles();
        buffer += fs.readFileSync(basePath + 'ct.release/styles.js', {
            'encoding': 'utf8'
        })
        .replace('/*@styles@*/', styles)
        .replace('/*%styles%*/', injects.styles);
        buffer += '\n';

        /* ресурсный котэ */
        var graphics = packImages();
        var skeletons = packSkeletons();

        buffer += fs.readFileSync(basePath + 'ct.release/res.js', {
            'encoding': 'utf8'
        })
        .replace('/*@sndtotal@*/', window.currentProject.sounds.length)
        .replace('/*@res@*/', graphics.res + '\n' + skeletons.loaderScript)
        .replace('/*@graphregistry@*/', graphics.registry)
        .replace('/*@skeletonregistry@*/', skeletons.registry)
        .replace('/*%resload%*/', injects.resload + '\n' + skeletons.startScript)
        .replace('/*%res%*/', injects.res);
        buffer += '\n';

        /* типичный котэ */
        var types = '';
        for (const k in window.currentProject.types) {
            var type = window.currentProject.types[k];
            types += 'ct.types.templates["' + type.name + '"] = {\n';
            types += '    depth:' + type.depth + ',\n';

            if (type.graph !== -1) {
                types += '    graph: "' + window.glob.graphmap[type.graph].g.name + '",\n';
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

        /* музыкальный котэ */
        var sounds = stringifySounds();
        buffer += fs.readFileSync(basePath + 'ct.release/sound.js', {
            'encoding': 'utf8'
        })
        .replace('/*@sound@*/', sounds);

        /* Шрифты */
        var fonts = bundleFonts(css); 
        css += fonts.css;
        buffer += fonts.js;

        /* инклюды */
        if (fs.existsSync(sessionStorage.projdir + '/include/')) {
            fs.copySync(sessionStorage.projdir + '/include/', exec + '/export/');
        }
        for (const lib in window.currentProject.libs) {
            if (fs.existsSync(path.join(basePath, `./ct.libs/${lib}/includes/`))) {
                fs.copySync(path.join(basePath, `./ct.libs/${lib}/includes/`), exec + `/export/${lib}/`);
            }
        }

        /* инъекции */
        for (const i in injects) {
            buffer = buffer.replace(`/*%${i}%*/`, injects[i]);
        }

        /* финализация скрипта */
        if (window.currentProject.settings.minifyjs) {
            const preamble = '/* Made with ct.js http://ctjs.rocks/ */\n';
            const {compile} = require('google-closure-compiler-js');

            const flags = {
                jsCode: [{src: buffer}],
            };
            const out = compile(flags);
            fs.writeFileSync(exec + '/export/ct.js', preamble + out.compiledCode);
        } else {
            fs.writeFileSync(exec + '/export/ct.js', buffer);
        }
        
        /* HTML & CSS */
        fs.writeFileSync(exec + '/export/index.html', html
            .replace('<!-- %htmltop% -->', injects.htmltop)
            .replace('<!-- %htmlbottom% -->', injects.htmlbottom)
            .replace('<!-- %gametitle% -->', window.currentProject.settings.title || 'ct.js game')
            .replace('<!-- %dragonbones% -->', skeletons.requiresDB? '<script src="DragonBones.min.js"></script>' : ''));

        fs.writeFileSync(exec + '/export/ct.css', css
            .replace('/*@pixelatedrender@*/', window.currentProject.settings.pixelatedrender? 'canvas,img{image-rendering:optimizeSpeed;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:optimize-contrast;image-rendering:pixelated;ms-interpolation-mode:nearest-neighbor}' : '')
            .replace('/*%css%*/', injects.css));

        if (window.currentProject.settings.minifyhtmlcss) {
            const csswring = require('csswring'),
                htmlMinify = require('html-minifier').minify;
            fs.writeFileSync(exec + '/export/index.html', htmlMinify(
                fs.readFileSync(exec + '/export/index.html', {
                    'encoding': 'utf8'
                })
            , {
                removeComments: true,
                collapseWhitespace: true
            }));
            fs.writeFileSync(exec + '/export/ct.css', csswring.wring(
                fs.readFileSync(exec + '/export/ct.css', {
                    'encoding': 'utf8'
                })
            ).css);
        }
        for (const k in window.currentProject.sounds) {
            var sound = window.currentProject.sounds[k],
                ext = sound.origname.slice(-4);
            fs.copySync(sessionStorage.projdir + '/snd/' + sound.origname, exec + '/export/snd/' + sound.uid + ext);
        }

        /*
        glob.targetAudio = window.currentProject.sounds.length * 2;
        for (k in window.currentProject.sounds) {
            ffmpeg.mp3(sessionStorage.projdir + '/sound/' + window.currentProject.sounds[k].origname, function (err, out, code) {
                if (err) {
                    console.log(err, out, code);
                    throw err;
                }
                events.compileAudio();
            });
        }
        */
        document.body.style.cursor = 'default';
        resolve(exec + `/export/index.${window.currentProject.settings.minifyhtml? 'min.': ''}html`);
    });
})(this);

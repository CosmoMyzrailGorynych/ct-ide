(window => {
    'use strict';

    const fs = require('fs-extra'),
          path = require('path');

    const exec = path.dirname(process.execPath).replace(/\\/g,'/');

    var ctlibs;

    var parseKeys = function(data, str, lib) {
        var str2 = str;
        if (data.fields) {
            for (const field in data.fields) {
                const val = window.currentProject.libs[lib][data.fields[field].key];
                if (data.fields[field].type === 'checkbox' && !val) {
                    str2 = str2.replace(RegExp('%' + data.fields[field].key + '%', 'g'), 'false');
                } else {
                    str2 = str2.replace(RegExp('%' + data.fields[field].key + '%', 'g'), val || '');
                }
            }
        }
        return str2;
    };

    var injectModules = (injects) => {
        for (const lib in window.currentProject.libs) {
            const libData = fs.readJSONSync(path.join('./ct.libs/', lib, 'module.json'), {
                'encoding': 'utf8'
            });
            ctlibs[lib] = libData.main;
            if (fs.pathExistsSync(path.join('./ct.libs/', lib, 'injects'))) {
                const injectFiles = fs.readdirSync(path.join('./ct.libs/', lib, 'injects')),
                      injectKeys = injectFiles.map(fname => path.basename(fname, path.extname(fname)));
                for (var inj in injectKeys) {
                    if (injectKeys[inj] in injects) {
                        injects[injectKeys[inj]] += parseKeys(libData, fs.readFileSync(path.join('./ct.libs/', lib, 'injects', injectFiles[inj]), {
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
        return {
            type: 'circle',
            r: graphic.r
        };
    };
    var packImages = () => {
        var blocks = [];
        for (let i = 0, li = window.currentProject.graphs.length; i < li; i++) {
            blocks[i] = {
                data: {
                    origname: window.currentProject.graphs[i].origname,
                    g: window.currentProject.graphs[i]
                },
                width: window.currentProject.graphs[i].imgWidth+2,
                height: window.currentProject.graphs[i].imgHeight+2,
            };
        }
        blocks.sort((a, b) => Math.max(b.height, b.width) > Math.max(a.height, a.width));
        var res = '',
            graphurls = '',
            graphtotal = 0;
        const Packer = require('maxrects-packer');
        const atlasWidth = 1024,
            atlasHeight = 1024; // TODO: make configurable
        const pack = new Packer(atlasWidth, atlasHeight, 1);
        pack.addArray(blocks);
        pack.bins.forEach((bin, binInd) => {
            const atlas = document.createElement('canvas');
            atlas.width = bin.width;
            atlas.height = bin.height;
            atlas.x = atlas.getContext('2d');
            for (let i = 0, li = bin.rects.length; i < li; i++) {
                const block = bin.rects[i],
                      {g} = block.data;
                atlas.x.drawImage(window.glob.graphmap[g.uid], block.x+1, block.y+1);
                var opts = {
                    x: block.x + 1,
                    y: block.y + 1,
                    w: g.width,
                    h: g.height,
                    xo: g.axis[0],
                    yo: g.axis[1],
                    cols: g.grid[0],
                    rows: g.grid[1],
                    untill: g.untill,
                    shape: getGraphicShape(g),
                    marginx: g.marginx,
                    marginy: g.marginy,
                    shiftx: g.offx,
                    shifty: g.offy
                };
                res += `
                ct.res.makeSprite('${g.name}', 'img/a${binInd}.png', ${JSON.stringify(opts, null, '    ')});`;
            }
            var data = atlas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
            var buf = new Buffer(data, 'base64');
            fs.writeFileSync(`${exec}/export/img/a${binInd}.png`, buf);
            graphurls += `'img/a${binInd}.png',`;
            graphtotal++;
        });
        graphurls = graphurls.slice(0, -1);
        return {
            res,
            graphurls,
            graphtotal
        };
    };

    var stringifyStyles = () => {
        var styles = '';
        for (const styl in window.currentProject.styles) {
            var o = {},
                s = window.currentProject.styles[styl];
            if (s.fill) {
                o.fill = {};
                if (Number(s.fill.type) === 0) {
                    o.fill.type = 'solid';
                    o.fill.color = s.fill.color;
                } else if (Number(s.fill.type) === 2) {
                    o.fill.type = 'pattern';
                    o.fill.name = s.fill.patId;
                } else if (Number(s.fill.type) === 1) {
                    o.fill.colors = [{
                        pos: 0,
                        color: s.fill.color1
                    }, {
                        pos: 1,
                        color: s.fill.color2
                    }];
                    if (Number(s.fill.gradtype) === 1) {
                        o.fill.type = 'grad';
                        o.fill.x1 = o.fill.y1 = o.fill.x2 = 0;
                        o.fill.y2 = s.fill.gradsize;
                    } else if (Number(s.fill.gradtype) === 2) {
                        o.fill.type = 'grad';
                        o.fill.x1 = o.fill.y1 = o.fill.y2 = 0;
                        o.fill.x2 = s.fill.gradsize;
                    } else {
                        o.fill.type = 'radgrad';
                        o.fill.r = s.fill.gradsize;
                    }
                }
            } else {
                o.fill = false;
            }
            o.border = s.stroke;
            o.text = s.font;
            o.shadow = s.shadow;
            styles += `
ct.styles.new(
    "${s.name}",
    ${JSON.stringify(o.fill, null, '    ')},
    ${JSON.stringify(o.border, null, '    ')},
    ${JSON.stringify(o.text, null, '    ')},
    ${JSON.stringify(o.shadow, null, '    ')});
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
            sounds += `ct.sound.init('${s.name}', ${wav? `'snd/${s.uid}.wav'` : 'null'}, ${mp3? `'snd/${s.uid}.mp3'` : 'null'}, {
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
            
            var roomCopy = JSON.parse(JSON.stringify(r.layers));
            var objs = [];
            for (var layer in roomCopy) {
                for (var copy in roomCopy[layer].copies) {
                    if (roomCopy[layer].copies[copy]) {
                        roomCopy[layer].copies[copy].type = window.currentProject.types[window.glob.typemap[roomCopy[layer].copies[copy].uid]].name;
                        delete roomCopy[layer].copies[copy].uid;
                        objs.push(roomCopy[layer].copies[copy]);
                    }
                }
            }
            var bgsCopy = JSON.parse(JSON.stringify(r.backgrounds));
            for (var bg in bgsCopy) {
                bgsCopy[bg].graph = window.glob.graphmap[bgsCopy[bg].graph].g.name;
                bgsCopy[bg].depth = Number(bgsCopy[bg].depth);
            }
            
            roomsCode += `
ct.rooms['${r.name}'] = {
    width: ${r.width},
    height: ${r.height},
    objects: ${JSON.stringify(objs, null, '    ')},
    bgs: ${JSON.stringify(bgsCopy, null, '    ')},
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

    window.runCtProject = () => new Promise((resolve, reject) => {
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

        /* главный котэ */
        var [startroom] = window.currentProject.rooms;
        for (let i = 0; i < window.currentProject.rooms.length; i++) {
            if (window.currentProject.rooms[i].uid === window.currentProject.startroom) {
                startroom = window.currentProject.rooms[i];
                break;
            }
        }
        var buffer = fs.readFileSync('./ct.release/main.js', {
            'encoding': 'utf8'
        });

        buffer = buffer
        .replace('/*@fps@*/', window.currentProject.settings.fps)
        .replace('/*@startwidth@*/', startroom.width)
        .replace('/*@startheight@*/', startroom.height)
        .replace('/*@libs@*/', JSON.stringify(ctlibs, null, '    '));

        buffer += '\n';

        /* котэ-художник */
        buffer += fs.readFileSync('./ct.release/draw.js', {
            'encoding': 'utf8'
        });

        buffer += '\n';

        /* котомышь */
        buffer += fs.readFileSync('./ct.release/mouse.js', {
            'encoding': 'utf8'
        });

        buffer += '\n';

        /* Модули */
        for (var lib in window.currentProject.libs) {
            const data = fs.readJSONSync(path.join('./ct.libs/', lib, 'module.json'), {
                'encoding': 'utf8'
            });
            if (fs.pathExistsSync(path.join('./ct.libs/', lib, 'index.js'))) {
                buffer += parseKeys(data, fs.readFileSync(path.join('./ct.libs/', lib, 'index.js'), {
                    'encoding': 'utf8'
                }), lib);
            }
            buffer += '\n';
        }

        /* Пользовательские скрипты */
        for (const script of window.currentProject.scripts) {
            buffer += script.code + ';\n';
        }

        /* комнатный котэ */
        var roomsCode = stringifyRooms();

        buffer += fs.readFileSync('./ct.release/rooms.js', {
            'encoding': 'utf8'
        })
        .replace('@startroom@', startroom.name)
        .replace('/*@rooms@*/', roomsCode)
        .replace('/*%switch%*/', injects.switch)
        .replace('/*%roomoncreate%*/', injects.roomoncreate)
        .replace('/*@pixelatedrender@*/', window.currentProject.settings.pixelatedrender? 'ct.x.mozImageSmoothingEnabled = false; ct.x.imageSmoothingEnabled = false;' : '')
        .replace('/*%roomonleave%*/', injects.roomonleave);
        buffer += '\n';

        /* стильный котэ */
        var styles = stringifyStyles();
        buffer += fs.readFileSync('./ct.release/styles.js', {
            'encoding': 'utf8'
        })
        .replace('/*@styles@*/', styles)
        .replace('/*%styles%*/', injects.styles);
        buffer += '\n';

        /* ресурсный котэ */
        var graphics = packImages();

        buffer += fs.readFileSync('./ct.release/res.js', {
            'encoding': 'utf8'
        })
        .replace('/*@graphsTotal@*/', graphics.graphtotal)
        .replace('/*@sndtotal@*/', window.currentProject.sounds.length)
        .replace('/*@graphUrls@*/', graphics.graphurls)
        .replace('/*@res@*/', graphics.res)
        .replace('/*%resload%*/', injects.resload)
        .replace('/*%res%*/', injects.res);
        buffer += '\n';

        /* типичный котэ */
        var types = '';
        for (const k in window.currentProject.types) {
            var type = window.currentProject.types[k];
            types += 'ct.types["' + type.name + '"] = {\n';
            types += '    depth:' + type.depth + ',\n';

            if (type.graph !== -1) {
                types += '    graph: "' + window.glob.graphmap[type.graph].g.name + '",\n';
            }
            types += '    onStep: function () {\n' + type.onstep + '\n    },\n';
            types += '    onDraw: function () {\n' + type.ondraw + '\n    },\n';
            types += '    onDestroy: function () {\n' + type.ondestroy + '\n    },\n';
            types += '    onCreate: function () {\n' + type.oncreate + '\n    }\n';
            types += '};\n';
            types += `ct.types.list['${type.name}'] = [];\n`;
        }
        buffer += fs.readFileSync('./ct.release/types.js', {
            'encoding': 'utf8'
        })
        .replace('/*%oncreate%*/', injects.oncreate)
        .replace('/*%types%*/', injects.types)
        .replace('/*@types@*/', types);

        buffer += '\n';

        /* музыкальный котэ */
        var sounds = stringifySounds();
        buffer += fs.readFileSync('./ct.release/sound.js', {
            'encoding': 'utf8'
        })
        .replace('/*@sound@*/', sounds);

        /* инклюды */
        if (fs.existsSync(sessionStorage.projdir + '/include/')) {
            fs.copySync(sessionStorage.projdir + '/include/', exec + '/export/');
        }
        for (const lib in window.currentProject.libs) {
            if (fs.existsSync(`./ct.libs/${lib}/includes/`)) {
                fs.copySync(`./ct.libs/${lib}/includes/`, exec + `/export/${lib}/`);
            }
        }

        /* инъекции */
        for (const i in injects) {
            buffer = buffer.replace(`/*%${i}%*/`, injects[i]);
        }

        /* финализация скрипта */
        const terser = require('terser');
        if (window.currentProject.settings.minifyjs) {
            var mini = terser.minify(buffer, {
                mangle: true,
                output: {
                    beautify: false,
                    preamble: '/* Made with ct.js http://ctjs.rocks/ */\n',
                    webkit: true
                }
            });
            if (mini.error) {
                console.error(mini.error);
                reject(mini.error);
            } else {
                fs.writeFileSync(exec + '/export/ct.js', mini.code);
            }
        } else {
            fs.writeFileSync(exec + '/export/ct.js', buffer);
        }
        
        /* HTML & CSS */
        fs.writeFileSync(exec + '/export/index.html', fs.readFileSync('./ct.release/index.html', {
            'encoding': 'utf8'
        })
        .replace('<!-- %htmltop% -->', injects.htmltop)
        .replace('<!-- %htmlbottom% -->', injects.htmlbottom));

        fs.writeFileSync(exec + '/export/ct.css', fs.readFileSync('./ct.release/ct.css', {
            'encoding': 'utf8'
        })
        .replace('/*@pixelatedrender@*/', window.currentProject.settings.pixelatedrender? 'canvas,img{image-rendering:optimizeSpeed;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:optimize-contrast;image-rendering:pixelated;ms-interpolation-mode:nearest-neighbor}' : '')
        .replace('/*%css%*/', injects.css));

        if (window.currentProject.settings.minifyhtml) {
            const csswring = require('csswring'),
                htmlMinify = require('html-minifier').minify;
            fs.writeFileSync(exec + '/export/index.min.html', htmlMinify(
                fs.readFileSync('./ct.release/index.min.html', {
                    'encoding': 'utf8'
                })
                .replace(/%htmltop%/, injects.htmltop)
                .replace(/%htmlbottom%/, injects.htmlbottom)
            , {
                removeComments: true,
                collapseWhitespace: true
            }));
            fs.writeFileSync(exec + '/export/ct.min.css', csswring.wring(fs.readFileSync(exec + '/export/ct.css', {
                'encoding': 'utf8'
            }).css));
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

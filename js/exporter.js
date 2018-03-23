(window => {
    'use strict';

    const fs = require('fs-extra'),
          path = require('path'),
          gui = require('nw.gui');
    const exec = path.dirname(process.execPath).replace(/\\/g,'/');

    var ctlibs, compiledAudio, targetAudio;

    var parseKeys = function(data, str, lib) {
        var str2 = str;
        if (data.fields) {
            for (const field in data.fields) {
                str2 = str2.replace(
                    RegExp('%' + data.fields[field].key + '%', 'g'),
                    window.currentProject.libs[lib][data.fields[field].key]
                );
            }
        }
        return str2;
    };

    var injectModules = (injects) => {
        for (const lib in window.currentProject.libs) {
            ctlibs += ' ' + lib;
            var libData = fs.readJSONSync('./ct.libs/' + lib + '.json', {
                'encoding': 'utf8'
            });
            if (libData.injects) {
                for (var inj in libData.injects) {
                    if (inj in injects) {
                        injects[inj] += parseKeys(libData, libData.injects[inj], lib);
                    }
                }
            }
        }
    };

    var compileAudio = () => {
        compiledAudio++;
        if (compiledAudio === targetAudio) {
            if (window.currentProject.settings.minifyhtml) {
                gui.Shell.openItem(exec + '/export/index.min.html');
            } else {
                gui.Shell.openItem(exec + '/export/index.html');
            }
        }
    };
    var getGraphicShape = graphic => {
        if (graphic.shape === 'rect') {
            return `{type: 'rect', top: ${graphic.top}, bottom: ${graphic.bottom}, left: ${graphic.left}, right: ${graphic.right}}`;
        }
        return `{type: 'circle', r:${graphic.r}}`;
    };
    var packImages = () => {
        var blocks = [];
        for (let i = 0, li = window.currentProject.graphs.length; i < li; i++) {
            blocks[i] = {
                data: {
                    origname: window.currentProject.graphs[i].origname,
                    g: i
                },
                width: window.currentProject.graphs[i].width,
                height: window.currentProject.graphs[i].height,
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
                      g = window.currentProject.graphs[block.data.g];
                atlas.x.drawImage(window.glob.graphmap[block.data.origname], block.x, block.y);
                res += `
        ct.res.makeSprite(
            '${window.currentProject.graphs[block.data.g].name}', 'img/a${binInd}.png',
            ${block.x + 1}, ${block.y + 1}, ${block.width - 2}, ${block.height - 2},
            ${g.axis[0]}, ${g.axis[1]}, ${g.grid[0]}, ${g.grid[1]}, ${g.untill},
            ${getGraphicShape(g)});`;

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
                if (s.fill.type == 0) {
                    o.fill.type = 'solid';
                    o.fill.color = s.fill.color;
                } else if (s.fill.type == 2) {
                    o.fill.type = 'pattern';
                    o.fill.name = s.fill.patname;
                } else if (s.fill.type == 1) {
                    o.fill.colors = [{
                        pos: 0,
                        color: s.fill.color1
                    }, {
                        pos: 1,
                        color: s.fill.color2
                    }];
                    if (s.fill.gradtype != 0) {
                        o.fill.type = 'grad';
                        o.fill.x1 = o.fill.y1 = o.fill.x2 = o.fill.y2 = 0;
                        if (s.fill.gradtype == 2) {
                            o.fill.x2 = s.fill.gradsize;
                        } else {
                            o.fill.y2 = s.fill.gradsize;
                        }
                    } else {
                        o.fill.type = 'radgrad';
                        o.fill.r = s.fill.gradsize;
                    }
                }
            } else {
                o.fill = false;
            }
            o.border = s.stroke; // TODO: fix catmods
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
            sounds += `ct.sound.init('${s.name}','snd/${s.uid}.wav','snd/${s.uid}.mp3');\n`;
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
    width: '${r.width}',
    height: '${r.height}',
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

    window.runCtProject = () => {
        try {
            // glob.compileAudio = 0;
            if (window.currentProject.rooms.length < 1) {
                window.alertify.error(window.languageJSON.common.norooms);
                return;
            }
            document.body.style.cursor = 'wait';

            ctlibs = 'CORE';
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

            /* главный котэ */
            var startroom;
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
            .replace('/*@startwidth@*/', startroom.width)
            .replace('/*@startheight@*/', startroom.height)
            .replace('/*@libs@*/', ctlibs);

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

            /* балласт */
            for (var lib in window.currentProject.libs) {
                ctlibs += ' ' + lib;
                const data = fs.readJSONSync('./ct.libs/' + lib + '.json', {
                    'encoding': 'utf8'
                });
                buffer += parseKeys(data, fs.readFileSync('./ct.libs/' + lib + '.js', {
                    'encoding': 'utf8'
                }), lib);
                buffer += '\n';
            }

            /* комнатный котэ */
            var roomsCode = stringifyRooms();

            var cp = window.currentProject;
            buffer += fs.readFileSync('./ct.release/rooms.js', {
                'encoding': 'utf8'
            })
            .replace('@startroom@', cp.rooms.find(room => cp.startroom === room.uid).name)
            .replace('/*@rooms@*/', roomsCode)
            .replace('/*%switch%*/', injects.switch)
            .replace('/*%roomoncreate%*/', injects.roomoncreate)
            .replace('/*%roomonleave%*/', injects.roomoncreate);
            console.log('rooms done');
            buffer += '\n';

            /* стильный котэ */
            var styles = stringifyStyles();
            buffer += fs.readFileSync('./ct.release/styles.js', {
                'encoding': 'utf8'
            })
            .replace('/*@styles@*/', styles)
            .replace('/*%styles%*/', injects.styles);
            buffer += '\n';
            console.log('styles done');

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
            console.log('graphics done');

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
            }
            buffer += fs.readFileSync('./ct.release/types.js', {
                'encoding': 'utf8'
            })
            .replace('/*%oncreate%*/', injects.oncreate)
            .replace('/*%types%*/', injects.types)
            .replace('/*@types@*/', types);

            buffer += '\n';
            console.log('types done');

            /* музыкальный котэ */
            var sounds = stringifySounds();
            buffer += fs.readFileSync('./ct.release/sound.js', {
                'encoding': 'utf8'
            })
            .replace('/*@sound@*/', sounds);
            console.log('sounds done');

            /* инклюды */
            if (fs.existsSync(sessionStorage.projdir + '/include/')) {
                fs.copySync(sessionStorage.projdir + '/include/', exec + '/export/');
            }

            /* инъекции */
            for (const i in injects) {
                buffer = buffer.replace(`/*%${i}%*/`, injects[i]);
            }

            /* финализация скрипта */
            const UglifyJS = require('uglify-js');
            fs.writeFileSync(exec + '/export/ct.js', buffer);
            if (window.currentProject.settings.minifyjs) {
                var mini = UglifyJS.minify(exec + '/export/ct.js', {
                    mangle: false
                });
                fs.writeFileSync(exec + '/export/ct.min.js', mini);
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
            .replace('/*%css%*/', injects.css));

            if (window.currentProject.settings.minifyhtml) {
                const csswring = require('csswring'),
                    htmlMinify = require('html-minifier');
                fs.writeFileSync(exec + '/export/index.min.html', htmlMinify(fs.readFileSync('./ct.release/index.min.html', {
                    'encoding': 'utf8'
                })
                .replace(/%htmltop%/, injects.htmltop)
                .replace(/%htmlbottom%/, injects.htmlbottom), {
                    removeAttributeQuotes: true,
                    removeComments: true,
                    collapseWhitespace: true
                }));
                fs.writeFileSync(exec + '/export/ct.min.css', csswring.wring(fs.readFileSync(exec + '/export/ct.css', {
                    'encoding': 'utf8'
                }).css));
            }
            for (const k in window.currentProject.sounds) {
                fs.copySync(sessionStorage.projdir + '/snd/' + window.currentProject.sounds[k].origname, exec + '/export/snd/' + window.currentProject.sounds[k].uid + '.mp3');
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
            const gui = require('nw.gui');
            if (window.currentProject.settings.minifyhtml) {
                gui.Shell.openItem(exec + '/export/index.min.html');
            } else {
                gui.Shell.openItem(exec + '/export/index.html');
            }
            document.body.style.cursor = 'default';
        } catch (e) {
            window.alertify.error(e);
            console.error(e);
        }
    };
})(this);

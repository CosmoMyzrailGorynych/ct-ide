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
            // console.log(data, data.fields, str, lib);
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

    window.runCtProject = () => {
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

        var inj = [
            'start',

            'oncreate',
            'ondestroy',

            'beforedraw',
            'beforestep',
            'afterdraw',
            'afterstep',

            'roomoncreate',
            'roomonleave',

            'beforeroomdraw',
            'beforeroomstep',
            'afterroomdraw',
            'afterroomcreate',
            'afterroomleave',
            'afterroomstep',
            'load'
        ];
        for (let i = 0; i < inj.length; i++) {
            buffer = buffer.replace(RegExp('%'+ inj[i] +'%', 'g'),injects[inj[i]]);
        }
        buffer = buffer
        .replace('@startwidth@', startroom.width)
        .replace('@startheight@', startroom.height)
        .replace('@libs@', ctlibs);

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
        var roomCode = '';
        for (const k in window.currentProject.rooms) {
            roomCode += 'ct.rooms["' + window.currentProject.rooms[k].name + '"] = {\n';
            roomCode += '    "width":' + window.currentProject.rooms[k].width + ',\n';
            roomCode += '    "height":' + window.currentProject.rooms[k].height + ',\n';
            var roomCopy = JSON.parse(JSON.stringify(window.currentProject.rooms[k].layers));
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
            var bgsCopy = JSON.parse(JSON.stringify(window.currentProject.rooms[k].backgrounds));
            for (var bg in bgsCopy) {
                bgsCopy[bg].graph = window.glob.graphmap[bgsCopy[bg].graph].g.name;
                bgsCopy[bg].depth = Number(bgsCopy[bg].depth);
            }
            roomCode += '    objects:' + JSON.stringify(objs) + ',\n';
            roomCode += '    bgs:' + JSON.stringify(bgsCopy) + ',\n';
            roomCode += '    onStep: function () {\n' + window.currentProject.rooms[k].onstep + '\n    },\n';
            roomCode += '    onDraw: function () {\n' + window.currentProject.rooms[k].ondraw + '\n    },\n';
            roomCode += '    onLeave: function () {\n' + window.currentProject.rooms[k].onleave + '\n    },\n';
            roomCode += '    onCreate: function () {\n' + window.currentProject.rooms[k].oncreate + '\n    }\n';
            roomCode += '};';
        }

        buffer += fs.readFileSync('./ct.release/rooms.js', {
            'encoding': 'utf8'
        })
        .replace('@startroom@', window.currentProject.rooms[window.currentProject.starting].name)
        .replace('@rooms@', roomCode)
        .replace(/%switch%/, injects.switch)
        .replace(/%roomoncreate%/, injects.roomoncreate)
        .replace(/%roomonleave%/, injects.roomoncreate);

        buffer += '\n';

        /* стильный котэ */
        var styles = '';
        for (const styl in window.currentProject.styles) {
            var o = {},
                s = window.currentProject.styles[styl];
            if (s.fill) {
                o.fill = {};
                if (s.fill.type === 0) {
                    o.fill.type = 'solid';
                    o.fill.color = s.fill.color;
                }
                if (s.fill.type === 2) {
                    o.fill.type = 'pattern';
                    o.fill.name = s.fill.patname;
                }
                if (s.fill.type === 1) {
                    if (s.fill.gradtype > 1) {
                        o.fill.type = 'grad';
                        o.fill.colors = [{
                            'pos': 0,
                            'color': s.fill.color1
                        }, {
                            'pos': 1,
                            'color': s.fill.color2
                        }];
                        o.fill.x1 = o.fill.y1 = o.fill.x2 = o.fill.y2 = 0;
                        if (s.fill.gradtype === 2) {
                            o.fill.x2 = s.fill.gradsize;
                        } else {
                            o.fill.y2 = s.fill.gradsize;
                        }
                    } else {
                        o.fill.type = 'radgrad';
                        o.fill.colors = [{
                            'pos': 0,
                            'color': s.fill.color1
                        }, {
                            'pos': 1,
                            'color': s.fill.color2
                        }];
                        o.fill.r = s.fill.gradsize;
                    }
                }
            } else {
                o.fill = false;
            }
            o.border = s.stroke; // TODO: fix catmods
            o.text = s.font;
            o.shadow = s.shadow;
            styles += 'ct.styles.new(\n    "' + s.name + '",\n    ' + JSON.stringify(o.fill,'    ') + ',\n    ' + JSON.stringify(o.border,'    ') + ',\n    ' + JSON.stringify(o.text,'    ') + ',\n    ' + JSON.stringify(o.shadow,'    ') + '\n);\n';
        }
        buffer += fs.readFileSync('./ct.release/styles.js', {
            'encoding': 'utf8'
        })
        .replace('@styles@', styles)
        .replace(/%styles%/, injects.styles);
        buffer += '\n';

        /* ресурсный котэ */
        /* pack images */
        var blocks = [];
        for (let i = 0; i < window.currentProject.graphs.length; i++) {
            blocks[i] = {
                origname: window.currentProject.graphs[i].origname,
                width: window.currentProject.graphs[i].width,
                height: window.currentProject.graphs[i].height,
                g: i
            };
        }
        blocks.sort(function(a,b) {
            return (Math.max(b.height,b.width) > Math.max(a.height,a.width));
        });
        var res = '';
        var graphurls = '';
        var graphtotal = 0;
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
            for (var i = 0; i < bin.rects.length; i++) {
                const block = bin.rects[i];
                atlas.x.drawImage(window.glob.graphmap[block.origname], block.fit.x, block.fit.y);
                res += 'ct.res.makesprite("{0}","img/{1}",{9},{10},{2},{3},{4},{5},{6},{7},{8},{11});\n'.f(
                    window.currentProject.graphs[block.g].nablock, // 0
                    'a{0}.png'.f(binInd),
                    block.width - 2,
                    block.height - 2,
                    window.currentProject.graphs[block.g].axis[0],
                    window.currentProject.graphs[block.g].axis[1], // 5
                    window.currentProject.graphs[block.g].grid[0],
                    window.currentProject.graphs[block.g].grid[1],
                    window.currentProject.graphs[block.g].untill,
                    block.fit.x + 1,
                    block.fit.y + 1, // 10
                    window.currentProject.graphs[block.g].shape ===
                        'rect' ?
                            '{"type": "rect", "top":{0},"bottom":{1},"left":{2},"right":{3}}'.f(
                                window.currentProject.graphs[block.g].top,
                                window.currentProject.graphs[block.g].bottom,
                                window.currentProject.graphs[block.g].left,
                                window.currentProject.graphs[block.g].right
                            )
                        :
                            '{"type":"circle","r":{0}}'.f(window.currentProject.graphs[block.g].r)
                );
                blocks.splice(i,1);
                i--;
            }
            var data = atlas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
            var buf = new Buffer(data, 'base64');
            fs.writeFileSync(exec + '/export/img/a{0}.png'.f(binInd), buf);
            graphurls += '"img/a{0}.png",'.f(binInd);
            graphtotal++;
        });

        graphurls = graphurls.slice(0, -1);
        buffer += fs.readFileSync('./ct.release/res.js', {
            'encoding': 'utf8'
        })
        .replace('@graphsTotal@', graphtotal)
        .replace('@sndtotal@', window.currentProject.sounds.length)
        .replace('@graphUrls@', graphurls)
        .replace('@res@', res)
        .replace(/%resload%/, injects.resload)
        .replace(/%res%/, injects.res);
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
        }
        buffer += fs.readFileSync('./ct.release/types.js', {
            'encoding': 'utf8'
        })
        .replace(/%oncreate%/, injects.oncreate)
        .replace(/%types%/, injects.types)
        .replace('@types@', types);

        buffer += '\n';

        /* музыкальный котэ */
        var sounds = '';
        for (const k in window.currentProject.sounds) {
            // TODO
            sounds += 'ct.sound.init("{0}","{1}","{2}","{3}");\n'.f(
                window.currentProject.sounds[k].name,
                'snd/' + window.currentProject.sounds[k].uid + '.wav',
                'snd/' + window.currentProject.sounds[k].uid + '.mp3',
                ''
            );
        }
        buffer += fs.readFileSync('./ct.release/sound.js', {
            'encoding': 'utf8'
        })
        .replace('@sound@', sounds);

        /* инклюды */
        if (fs.existsSync(sessionStorage.projdir + '/include/')) {
            fs.copySync(sessionStorage.projdir + '/include/', exec + '/export/');
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

        // here goes madness

        /* HTML & CSS */
        fs.writeFileSync(exec + '/export/index.html', fs.readFileSync('./ct.release/index.html', {
            'encoding': 'utf8'
        })
        .replace(/%htmltop%/, injects.htmltop)
        .replace(/%htmlbottom%/, injects.htmlbottom));

        fs.writeFileSync(exec + '/export/ct.css', fs.readFileSync('./ct.release/ct.css', {
            'encoding': 'utf8'
        })
        .replace(/%css%/, injects.css));

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
            fs.copySync(sessionStorage.projdir + '/snd/' + window.currentProject.sounds[k].origname, exec + '/export/snd/' + window.currentProject.sounds[k].uid + '.ogg');
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
            ffmpeg.ogg(sessionStorage.projdir + '/sound/' + window.currentProject.sounds[k].origname, function (err, out, code) {
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
    };
})(this);

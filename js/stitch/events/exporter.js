events = events || {};

events.parsekeys = function(data, str, lib) {
    var str2 = str;
    if (data.fields) {
        console.log(data, data.fields, str, lib);
        for (field in data.fields) {
            str2 = str2.replace(
                RegExp('%' + data.fields[field].key + '%', 'g'),
                currentProject.libs[lib][data.fields[field].key]
            );
        }
    }
    return str2;
};

events.run = function() {
    $('body').css('cursor', 'wait');
    //glob.compileAudio = 0;
    if (currentProject.rooms.length < 1) {
        alertify.error(languageJSON.common.norooms);
        return false;
    }

    var ctlibs = 'CORE';
    fs.removeSync(exec + '/export/');
    fs.ensureDirSync(exec + '/export/img');
    fs.ensureDirSync(exec + '/export/snd');
    injects = {
        load: '',
        start: '',
        switch: '',

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
    }

    /* инъекции */
    for (lib in currentProject.libs) {
        ctlibs += ' ' + lib;
        var data = fs.readJSONSync(exec + '/ct.libs/' + lib + '.json', {
            'encoding': 'utf8'
        });
        console.log(lib, data);
        if (data.injects) {
            for (var inj in data.injects) {
                if (injects[inj] !== undefined) {
                    injects[inj] += events.parsekeys(data, data.injects[inj], lib);
                }
            }
        }
    }

    /* главный котэ */
    var startroom;
    for (var i = 0; i < currentProject.rooms.length; i++) {
        if (currentProject.rooms[i].uid == currentProject.startroom) {
            startroom = currentProject.rooms[i];
            break;
        }
    }
    buffer = fs.readFileSync(assets + '/ct.release/main.js', {
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
    for (var i = 0; i < inj.length; i++) {
        buffer = buffer.replace(RegExp('%'+ inj[i] +'%', 'g'),injects[inj[i]]);
    }
    buffer = buffer
    .replace('@startwidth@', startroom.width)
    .replace('@startheight@', startroom.height)
    .replace('@libs@', ctlibs);

    buffer += '\n';

    /* котэ-художник */
    buffer += fs.readFileSync(assets + '/ct.release/draw.js', {
        'encoding': 'utf8'
    });

    buffer += '\n';

    /* котомышь */
    buffer += fs.readFileSync(assets + '/ct.release/mouse.js', {
        'encoding': 'utf8'
    });

    buffer += '\n';

    /* балласт */
    for (var lib in currentProject.libs) {
        ctlibs += ' ' + lib;
        data = fs.readJSONSync(exec + '/ct.libs/' + lib + '.json', {
            'encoding': 'utf8'
        });
        buffer += events.parsekeys(data, fs.readFileSync(exec + '/ct.libs/' + lib + '.js', {
            'encoding': 'utf8'
        }), lib);
        buffer += '\n';
    }

    /* комнатный котэ */
    room_code = '';
    for (var k in currentProject.rooms) {
        room_code += 'ct.rooms["' + currentProject.rooms[k].name + '"] = {\n';
        room_code += '    "width":' + currentProject.rooms[k].width + ',\n';
        room_code += '    "height":' + currentProject.rooms[k].height + ',\n';
        var room_copy = JSON.parse(JSON.stringify(currentProject.rooms[k].layers));
        tick = 0;
        objs = [];
        for (var layer in room_copy) {
            for (var copy in room_copy[layer].copies) {
                if (room_copy[layer].copies[copy]) {
                    room_copy[layer].copies[copy].type = currentProject.types[glob.typemap[room_copy[layer].copies[copy].uid]].name;
                    delete room_copy[layer].copies[copy].uid;
                    objs.push(room_copy[layer].copies[copy]);
                }
            }
        }
        var bgs_copy = JSON.parse(JSON.stringify(currentProject.rooms[k].backgrounds));
        for (var bg in bgs_copy) {
            bgs_copy[bg].graph = glob.graphmap[bgs_copy[bg].graph].g.name;
            bgs_copy[bg].depth = Number(bgs_copy[bg].depth);
        }
        room_code += '    "objs":' + JSON.stringify(objs) + ',\n';
        room_code += '    "bgs":' + JSON.stringify(bgs_copy) + ',\n';
        room_code += '    "onstep": function () {\n' + currentProject.rooms[k].onstep + '\n    },\n';
        room_code += '    "ondraw": function () {\n' + currentProject.rooms[k].ondraw + '\n    },\n';
        room_code += '    "onleave": function () {\n' + currentProject.rooms[k].onleave + '\n    },\n';
        room_code += '    "oncreate": function () {\n' + currentProject.rooms[k].oncreate + '\n    }\n';
        room_code += '};';
    }

    buffer += fs.readFileSync(assets + '/ct.release/rooms.js', {
        'encoding': 'utf8'
    })
    .replace('@startroom@', currentProject.rooms[currentProject.starting].name)
    .replace('@rooms@', room_code)
    .replace(/%switch%/, injects.switch)
    .replace(/%roomoncreate%/, injects.roomoncreate)
    .replace(/%roomonleave%/, injects.roomoncreate);

    buffer += '\n';

    /* стильный котэ */
    var styles = '';
    for (styl in currentProject.styles) {
        var o = {},
            s = currentProject.styles[styl];
        if (s.fill) {
            o.fill = {};
            if (s.fill.type == 0) {
                o.fill.type = 'solid';
                o.fill.color = s.fill.color;
            }
            if (s.fill.type == 2) {
                o.fill.type = 'pattern';
                o.fill.name = s.fill.patname;
            }
            if (s.fill.type == 1) {
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
                    if (s.fill.gradtype == 2) {
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
        o.text   = s.font;
        o.shadow = s.shadow;
        styles += 'ct.styles.new(\n    "' + s.name + '",\n    ' + JSON.stringify(o.fill,'    ') + ',\n    ' + JSON.stringify(o.border,'    ') + ',\n    ' + JSON.stringify(o.text,'    ') + ',\n    ' + JSON.stringify(o.shadow,'    ') + '\n);\n';
    }
    buffer += fs.readFileSync(assets + '/ct.release/styles.js', {
        'encoding': 'utf8'
    })
    .replace('@styles@', styles)
    .replace(/%styles%/, injects.styles);
    buffer += '\n';

    /* ресурсный котэ */
    /************ pack images **************/
    bins = [];
    blocks = [];
    for (var i = 0; i < currentProject.graphs.length; i++) {
        blocks[i] = {
            origname: currentProject.graphs[i].origname,
            width: currentProject.graphs[i].width + 2, // margin
            height: currentProject.graphs[i].height + 2,
            g: i
        };
    }
    blocks.sort(function(a,b) { 
        return (Math.max(b.height,b.width) > Math.max(a.height,a.width)); 
    });
    var atlasses = 0;
    res = '';
    graphurls = '';
    var graphtotal = 0;
    while (true) {
        bin = new Packer(1024, 1024); // TODO: make configurable
        bins.push(bin);
        bin.fit(blocks);
        if (bin.root.used) {
            canv = document.createElement('canvas');
            canv.width = canv.height = 1024; // TODO
            canv.x = canv.getContext('2d');
            for (var i = 0; i < blocks.length; i++) {
                me = blocks[i];
                if (me.fit) {
                    canv.x.drawImage(glob.graphmap[me.origname],me.fit.x+1,me.fit.y+1) // margins
                    res += 'ct.res.makesprite("{0}","img/{1}",{9},{10},{2},{3},{4},{5},{6},{7},{8},{11});\n'.f(
                        currentProject.graphs[me.g].name, //0
                        'a{0}.png'.f(atlasses+1),
                        me.width - 2,
                        me.height - 2,
                        currentProject.graphs[me.g].axis[0],
                        currentProject.graphs[me.g].axis[1], //5 
                        currentProject.graphs[me.g].grid[0],
                        currentProject.graphs[me.g].grid[1],
                        currentProject.graphs[me.g].untill,
                        me.fit.x + 1,
                        me.fit.y + 1, // 10
                        currentProject.graphs[me.g].shape == 
                            'rect' ? 
                                '{"type": "rect", "top":{0},"bottom":{1},"left":{2},"right":{3}}'.f(
                                    currentProject.graphs[me.g].top,
                                    currentProject.graphs[me.g].bottom,
                                    currentProject.graphs[me.g].left,
                                    currentProject.graphs[me.g].right
                                )
                            :
                                '{"type":"circle","r":{0}}'.f(currentProject.graphs[me.g].r)
                    );
                    blocks.splice(i,1);
                    i--;
                }
            }
            atlasses++;
            var data = canv.toDataURL().replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            fs.writeFileSync(exec + '/export/img/a{0}.png'.f(atlasses), buf); // TODO
            graphurls += '"img/a{0}.png",'.f(atlasses);
            graphtotal ++;
        } else {
            for (var k = 0; k < blocks.length; k++) {
                me = blocks[k];
                res += 'ct.res.makesprite("{0}","img/{1}",0,0,{2},{3},{4},{5},{6},{7},{8},{9});\n'.f(
                    currentProject.graphs[me.g].name, //0
                    me.origname,
                    me.width - 2,
                    me.height - 2,
                    currentProject.graphs[me.g].axis[0],
                    currentProject.graphs[me.g].axis[1], //5 
                    currentProject.graphs[me.g].grid[0],
                    currentProject.graphs[me.g].grid[1],
                    currentProject.graphs[me.g].untill,
                    currentProject.graphs[me.g].shape == 
                        'rect' ? 
                            '{"type": "rect", "top":{0},"bottom":{1},"left":{2},"right":{3}}'.f(
                                currentProject.graphs[me.g].top,
                                currentProject.graphs[me.g].bottom,
                                currentProject.graphs[me.g].left,
                                currentProject.graphs[me.g].right
                            )
                        :
                            '{"type":"circle","r":{0}}'.f(currentProject.graphs[me.g].r)
                );
                fs.copySync(projdir + '/img/' + currentProject.graphs[me.g].origname, exec + '/export/img/' + currentProject.graphs[me.g].origname);
                graphurls += '"img/' + currentProject.graphs[me.g].origname + '",';
                graphtotal ++;
            }
            break;
        }
    }
    graphurls = graphurls.slice(0, -1);
    buffer += fs.readFileSync(assets + '/ct.release/res.js', {
        'encoding': 'utf8'
    })
    .replace('@graphtotal@', graphtotal)
    .replace('@sndtotal@', currentProject.sounds.length)
    .replace('@graphurls@', graphurls).replace('@res@', res)
    .replace(/%resload%/, injects.resload).replace(/%res%/, injects.res);
    buffer += '\n';

    /* типичный котэ */
    var types = '';
    for (k in currentProject.types) {
        var type = currentProject.types[k];
        types += 'ct.types["' + type.name + '"] = {\n';
        types += '    "depth":' + type.depth + ',\n';
        shapa = '';
        if (type.graph != -1) {
            types += '    "graph": "' + glob.graphmap[type.graph].g.name + '",\n';
        }
        types += '    "onstep": function () {\n' + type.onstep + '\n    },\n';
        types += '    "ondraw": function () {\n' + type.ondraw + '\n    },\n';
        types += '    "ondestroy": function () {\n' + type.ondestroy + '\n    },\n';
        types += '    "oncreate": function () {\n' + type.oncreate + '\n    }\n';
        types += '};\n';
    }
    buffer += fs.readFileSync(assets + '/ct.release/types.js', {
        'encoding': 'utf8'
    })
    .replace(/%oncreate%/, injects.oncreate)
    .replace(/%types%/, injects.types)
    .replace('@types@', types);

    buffer += '\n';

    /* музыкальный котэ */
    var sounds = '';
    for (k in currentProject.sounds) {
        // TODO
        sounds += 'ct.sound.init("{0}","{1}","{2}","{3}");\n'.f(
            currentProject.sounds[k].name,
            'snd/' + currentProject.sounds[k].uid + '.wav',
            'snd/' + currentProject.sounds[k].uid + '.mp3',
            ''
        );
    }
    buffer += fs.readFileSync(assets + '/ct.release/sound.js', {
        'encoding': 'utf8'
    })
    .replace('@sound@', sounds);

    /* инклюды */
    if (fs.existsSync(projdir + '/include/')) {
        fs.copySync(projdir + '/include/', exec + '/export/');
    }

    /* финализация скрипта */
    fs.writeFileSync(exec + '/export/ct.js', buffer);
    if (currentProject.settings.minifyjs) {
        var mini = UglifyJS.minify(exec + '/export/ct.js', {
            mangle: false
        });
        fs.writeFileSync(exec + '/export/ct.min.js', mini);
    }

    // here goes madness

    /* HTML & CSS */
    fs.writeFileSync(exec + '/export/index.html', fs.readFileSync(assets + '/ct.release/index.html', {
        'encoding': 'utf8'
    })
    .replace(/%htmltop%/, injects.htmltop)
    .replace(/%htmlbottom%/, injects.htmlbottom));

    fs.writeFileSync(exec + '/export/ct.css', fs.readFileSync(assets + '/ct.release/ct.css', {
        'encoding': 'utf8'
    })
    .replace(/%css%/, injects.css));

    if (currentProject.settings.minifyhtml) {
        fs.writeFileSync(exec + '/export/index.min.html', htmlMinify(fs.readFileSync(assets + '/ct.release/index.min.html', {
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
    for (k in currentProject.sounds) {
        fs.copySync(projdir + '/snd/' + currentProject.sounds[k].origname, exec + '/export/snd/' + currentProject.sounds[k].uid + '.mp3');
        fs.copySync(projdir + '/snd/' + currentProject.sounds[k].origname, exec + '/export/snd/' + currentProject.sounds[k].uid + '.ogg');
    }
    /*
    glob.soundstoget = currentProject.sounds.length * 2;
    for (k in currentProject.sounds) {
        ffmpeg.mp3(projdir + '/sound/' + currentProject.sounds[k].origname, function (err, out, code) {
            if (err) {
                console.log(err, out, code);
                throw err;
            }
            events.compileAudio();
        });
        ffmpeg.ogg(projdir + '/sound/' + currentProject.sounds[k].origname, function (err, out, code) {
            if (err) {
                console.log(err, out, code);
                throw err;
            }
            events.compileAudio();
        });
    }
    */
    if (currentProject.settings.minifyhtml) {
        gui.Shell.openItem(exec + '/export/index.min.html');
    } else {
        gui.Shell.openItem(exec + '/export/index.html');
    }
    $('body').css('cursor', 'default');
};

events.compileAudio = function () {
    glob.compileAudio ++;
    if (glob.compileAudio == glob.soundstoget) {
        if (currentProject.settings.minifyhtml) {
            gui.Shell.openItem(exec + '/export/index.min.html');
        } else {
            gui.Shell.openItem(exec + '/export/index.html');
        }
    }
}

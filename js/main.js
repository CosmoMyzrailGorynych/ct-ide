//@prepros-append stitch/nw.js
//@prepros-append stitch/events.js
//@prepros-append stitch/cosmoui.js
//@prepros-append stitch/main.js
;//                  _                         _     _    _  _
//    _ _   ___  __| | ___  ___ __ __ __ ___ | |__ | |__(_)| |_ 
//   | ' \ / _ \/ _` |/ -_)|___|\ V  V // -_)| '_ \| / /| ||  _|
//   |_||_|\___/\__,_|\___|      \_/\_/ \___||_.__/|_\_\|_| \__|
//

// path resolving utilities
path = require('path');
// file system api
fs = require('fs-extra');
// chromium API
gui = require('nw.gui');
clipboard = gui.Clipboard.get();
win = gui.Window.get();
// OS matters
os = require('os');
// markdown renderer
md = require('markdown-it')({  
	html: false,  
	linkify: true,  
	typographer: true,
	breaks: true
});
// minifiers
// TODO: load on demand only
UglifyJS = require("uglify-js");
csswring = require('csswring');
htmlMinify = require('html-minifier').minify;


// get and normalize assets folder (usually unzipped app.nw)
assets = process.cwd().replace(/\\/g,'/'); 
// get and normalize .exe path
exec = path.dirname(process.execPath).replace(/\\/g,'/');
// get default folder for projects
way = exec + '/projects';
// create one if it doesn't exist
fs.mkdirs(way, function (e) {
	if (e) {
		throw e;
	}
});
// projdir = way + '/' + currentProject.codename
// see in events.js --> newProject
//        events.js --> openProject

// must be useful
//packageJSON = JSON.parse(fs.readFileSync(assets+'/package.json'));
packageJSON = gui.App.manifest;
// language pack
languageJSON = JSON.parse(fs.readFileSync(exec+'/locales/'+ $('body').attr('data-lang') +'.json'));

// OS type vars
isMac = false;
isWin = /win[0-9]+/.test(os.platform());
isX = os.platform() == 'linux';

// better copy
function megacopy(sf,df,callback) {
	var is = fs.createReadStream(sf)
	var os = fs.createWriteStream(df);
	is.on('end', callback);
	is.pipe(os);
}

/***********************************/

    RELEASE = 1000;

/***********************************/
;events = {};
// trololo
glob = {
    prev: {},
    findmylayer: function (a) {
        if (a.depth == currentProject.types[currentTypePick].depth) {
            glob.layer = a;
            return true;
        }
        return false;
    },
    grid: 0,
    mmodified: false,
    get modified () {
        return this.mmodified;
    },
    set modified (v) {
        if (v) {
            win.title = 'ct.ide — ' + projname + ' •';
        } else {
            win.title = 'ct.ide — ' + projname;
        }
        return this.mmodified = v;
    }
};
String.prototype.format = String.prototype.f = function () {
    var args = arguments;
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }
        if (m == "}}") { return "}"; }
        return args[n];
    });
};


//@prepros-append events/_main.js
//@prepros-append events/exporter.js
//@prepros-append events/graphs.js
//@prepros-append events/intro.js
//@prepros-append events/mainMenu.js
//@prepros-append events/modules.js
//@prepros-append events/notepad.js
//@prepros-append events/rooms.js
//@prepros-append events/settings.js
//@prepros-append events/sounds.js
//@prepros-append events/styles.js
//@prepros-append events/types.js
;/*
    ___                 _       
   | __|__ __ ___  _ _ | |_  ___
   | _| \ V // -_)| ' \|  _|(_-<
   |___| \_/ \___||_||_|\__|/__/

*/

function initdatainput (selector) {
    return $(selector + ' [data-input]').change(function() {
        try {
            // won't work with arrays...
            /*
            var me = $(this),
                arr = me.attr('data-input').split('.');
            context = window;
            for (var i = 0; i < arr.length - 1; i++) {
                context = context[arr[i]];
            }
            context[arr[arr.length - 1]] = me.val();
            */
            var me = $(this);
            if (me.attr('type') == 'text' || !me.attr('type') || me[0].tagName.toUpperCase() == 'TEXTAREA') {
                eval(me.attr('data-input') + ' = "' + me.val().replace(/\"/g, '\\"') + '"');
            } else {
                eval(me.attr('data-input') + ' = ' + me.val());
            }

            // bind events on graphview inputs
            me.filter('#graphx, #graphy, \
               #graphviewshaperound, \
               #graphviewshaperectangle, \
               #graphrad, \
               #graphtop, #graphleft, #graphright, #graphbottom, \
               #graphcols, #graphrows, \
               #graphframes')
            .change(events.refreshGraphCanvas);
            glob.modified = true;
        } catch (err) {
            console.error(err);
            document.getElementById('scream').play();
        }
    });
}
$(function() {
    initdatainput('body');
});

/* templates */

tmpl = {
    graph: '<li data-graph="{2}"><span>{0}</span><img src="{1}"/></li>',
    type: '<li data-type="{2}" data-graph="{3}"><span>{0}</span><img src="{1}"/></li>',
    sound: '<li data-sound="{2}" style="background-image: url({1});"><span>{0}</span><img src="{1}"/></li>',
    style: '<li data-style="{2}"><span>{0}</span><img src="{1}"/></li>',
    room: '<li data-room="{2}"><img src="{1}"/><span>{0}</span></li>',
    background: '<li class="bg" data-background="{2}"><img src="{0}" /><span>{1}</span></li>'
};


/* some patterns */
apatterns = {
    SymbolDigitUnderscore: /[^qwertyuiopasdfghjklzxcvbnm1234567890_]/gi
}
patterns = {
    images: /\.(jpg|gif|png|jpeg)/gi
}

/*
    temporary global objects for editing:
    
    currentGraphic = {};
    currentType = {};
    currentSound = {};
    currentRoom = {};
    currentStyle = {};
    currentMod = {};
    currentProject = {};
*/

function checkAntiPattern() {
    var me = $(this);
    if (apatterns[me.attr('data-apattern')].exec(me.val())) {
        passed = false;
        me.addClass('error');
    } else {
        me.removeClass('error');
    }
}

function checkPattern() {
    var me = $(this);
    if (!patterns[me.attr('data-pattern')].exec(me.val())) {
        passed = false;
        me.addClass('error');
    } else {
        me.removeClass('error');
    }
}

$(function() {
    // update check
    $.get('http://ctjs.ru/version.json',{},function (e,a,u) {
        if (a == 'success') {
            if (e.release > RELEASE) {
                $('#alliluya')[0].volume = 0.7;
                $('#alliluya')[0].play();
                alertify.confirm(md.render(languageJSON.common.newversion + e.desc), function (blurp) {
                    if (blurp) {
                        gui.Shell.openExternal(e.download);
                    }
                });
            }
        }
    });

    // init events
    $('[data-event]:not([type="file"])').click(function(e) {
        var me = $(this);
        passed = true;
        try {
            if (me.attr('data-check')) {
                var they = $(me.attr('data-check'));
                they.filter('[data-pattern]').each(function() {
                    checkPattern.apply(this);
                });
                they.filter('[data-apattern]').each(function() {
                    checkAntiPattern.apply(this);
                });
                they.filter('[data-required]').each(function() {
                    if (this.value == '') {
                        passed = false;
                        $(this).addClass('error');
                    } else {
                        $(this).removeClass('error');
                    }
                });
            }
            if (passed) {
                events[me.attr('data-event')].call(me[0], e);
            }
        } catch (err) {
            console.error(err);
            document.getElementById('scream').play();
        }
    });
    // wrapping [type="file"] in jQuery causes a DOM error?! O_o
    // the same is with console.log(input);
    $('[data-event][type="file"]').each(function() {
        this.onchange = function() { // we don't need validations, do we?
            var me = this;
            try {
                events[me.attributes['data-event'].value].call(me[0], ($(me)));
            } catch (err) {
                console.error(err);
                document.getElementById('scream').play();
            }
            // back to default
            //me.value = '';
        }
    });
    preparetext('body');
});
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
;
//-------------- events -------------------
events.fillGraphs = function() {
    $('#graphic ul').empty();
    for (var i = 0; i < currentProject.graphs.length; i++) {
        $('#graphic ul').append(tmpl.graph.f(
            currentProject.graphs[i].name,
            projdir + '/img/' + currentProject.graphs[i].origname + '_prev.png',
            i
        ));
    }
    events.fillGraphMap();
};
events.fillGraphMap = function () {
    delete glob.graphmap;
    glob.graphmap = {};
    currentProject.graphs.forEach(function (a) {
        var img = document.createElement('img');
        glob.graphmap[a.origname] = img;
        img.g = a;
        img.src = projdir + '/img/' + a.origname;
    });
    var img = document.createElement('img');
    glob.graphmap[-1] = img;
    img.src = assets + '/img/unknown.png';
};
events.launchGraphPreview = function() {
    if (glob.prev.time) {
        window.clearTimeout(glob.prev.time);
    }
    var kw, kh, w, h, k;

    glob.prev.pos = 0;

    kw = Math.min($('#preview').width() / (graphCanvas.img.width / currentGraphic.grid[0]), 1);
    kh = Math.min($('#preview').height() / (graphCanvas.img.height / currentGraphic.grid[1]), 1);
    k = Math.min(kw, kh);
    w = Math.floor(k * graphCanvas.img.width / currentGraphic.grid[0]);
    h = Math.floor(k * graphCanvas.img.height / currentGraphic.grid[1]);
    grprCanvas.width = w;
    grprCanvas.height = h;

    $('#graphplay i').removeClass('icon-play').addClass('icon-pause');
    glob.prev.playing = true;

    events.stepGraphPreview();
};
events.stopGraphPreview = function() {
    window.clearTimeout(glob.prev.time);
    $('#graphplay i').removeClass('icon-pause').addClass('icon-play');
    glob.prev.playing = false;
};
events.currentGraphicPreviewPlay = function() {
    if (glob.prev.playing) {
        events.stopGraphPreview();
    } else {
        events.launchGraphPreview();
    }
};
events.stepGraphPreview = function() {
    glob.prev.time = window.setTimeout(function() {
        var total = Math.min(currentGraphic.untill === 0 ? currentGraphic.grid[0] * currentGraphic.grid[1] : currentGraphic.untill, currentGraphic.grid[0] * currentGraphic.grid[1]);
        glob.prev.pos++;
        if (glob.prev.pos >= total) {
            glob.prev.pos = 0;
        }
        grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
        grprCanvas.x.drawImage(graphCanvas.img, (glob.prev.pos % currentGraphic.grid[0]) * graphCanvas.img.width / currentGraphic.grid[0], (~~(glob.prev.pos / currentGraphic.grid[0])) * graphCanvas.img.height / currentGraphic.grid[1],
            graphCanvas.img.width / currentGraphic.grid[0],
            graphCanvas.img.height / currentGraphic.grid[1],
            0,
            0,
            grprCanvas.width,
            grprCanvas.height);
        $('#graphviewframe').text('{0} / {1}'.f(glob.prev.pos, total));

        if (document.getElementById('graphiftoshowmask').checked) {
            var kw, kh, w, h, k, i;

            kw = Math.min(($('#atlas').width() - 40) / grprCanvas.img.width, 1);
            kh = Math.min(($('#atlas').height() - 40) / grprCanvas.img.height, 1);
            k = Math.min(kw, kh);
            w = Math.floor(k * grprCanvas.img.width);
            h = Math.floor(k * grprCanvas.img.height);

            grprCanvas.x.strokeStyle = "#f00";
            // horisontal
            grprCanvas.x.beginPath();
            grprCanvas.x.moveTo(0, currentGraphic.axis[1] * k);
            grprCanvas.x.lineTo(grprCanvas.img.width * k / currentGraphic.grid[0], currentGraphic.axis[1] * k);
            grprCanvas.x.stroke();
            // vertical
            grprCanvas.x.beginPath();
            grprCanvas.x.moveTo(currentGraphic.axis[0] * k, 0);
            grprCanvas.x.lineTo(currentGraphic.axis[0] * k, grprCanvas.img.height * k / currentGraphic.grid[1]);
            grprCanvas.x.stroke();
            // shape
            grprCanvas.x.globalAlpha = 0.5;
            grprCanvas.x.fillStyle = '#ff0';
            if (currentGraphic.shape == 'rect') {
                grprCanvas.x.fillRect((currentGraphic.axis[0] - currentGraphic.left) * k, (currentGraphic.axis[1] - currentGraphic.top) * k, (currentGraphic.right + currentGraphic.left) * k, (currentGraphic.bottom + currentGraphic.top) * k);
            } else {
                grprCanvas.x.beginPath();
                grprCanvas.x.arc(currentGraphic.axis[0] * k, currentGraphic.axis[1] * k, currentGraphic.r * k, 0, 2 * Math.PI);
                grprCanvas.x.fill();
            }
        }
        events.stepGraphPreview();
    }, ~~(1000 / $('#grahpspeed').val()));
};
events.currentGraphicPreviewBack = function() {
    glob.prev.pos--;
    var total = Math.min(currentGraphic.untill === 0 ? currentGraphic.grid[0] * currentGraphic.grid[1] : currentGraphic.untill, currentGraphic.grid[0] * currentGraphic.grid[1]);
    if (glob.prev.pos < 0) {
        glob.prev.pos = currentGraphic.untill === 0 ? currentGraphic.grid[0] * currentGraphic.grid[1] : total - 0;
    }
    grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
    grprCanvas.x.drawImage(graphCanvas.img, (glob.prev.pos % currentGraphic.grid[0]) * graphCanvas.img.width / currentGraphic.grid[0], (~~(glob.prev.pos / currentGraphic.grid[0])) * graphCanvas.img.height / currentGraphic.grid[1],
        graphCanvas.img.width / currentGraphic.grid[0],
        graphCanvas.img.height / currentGraphic.grid[1],
        0,
        0,
        grprCanvas.width,
        grprCanvas.height);
    $('#graphviewframe').text('{0} / {1}'.f(glob.prev.pos, total));
};
events.currentGraphicPreviewNext = function() {
    glob.prev.pos++;
    var total = Math.min(currentGraphic.untill === 0 ? currentGraphic.grid[0] * currentGraphic.grid[1] : currentGraphic.untill, currentGraphic.grid[0] * currentGraphic.grid[1]);
    if (glob.prev.pos >= total) {
        glob.prev.pos = 0;
    }
    grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
    grprCanvas.x.drawImage(graphCanvas.img, (glob.prev.pos % currentGraphic.grid[0]) * graphCanvas.img.width / currentGraphic.grid[0], (~~(glob.prev.pos / currentGraphic.grid[0])) * graphCanvas.img.height / currentGraphic.grid[1],
        graphCanvas.img.width / currentGraphic.grid[0],
        graphCanvas.img.height / currentGraphic.grid[1],
        0,
        0,
        grprCanvas.width,
        grprCanvas.height);
    $('#graphviewframe').text('{0} / {1}'.f(glob.prev.pos, total));
};
events.openGraph = function(graph) {
    $('#graphview').show();

    currentGraphic = currentProject.graphs[graph];
    currentGraphicId = graph;

    // map values
    $('#graphname').val(currentGraphic.name ? currentGraphic.name : '');

    $('#graphx').val(currentGraphic.axis[0] ? currentGraphic.axis[0] : 0);
    $('#graphy').val(currentGraphic.axis[1] ? currentGraphic.axis[1] : 0);
    $('#graphwidth').val(currentGraphic.width ? currentGraphic.width : 32);
    $('#graphheight').val(currentGraphic.height ? currentGraphic.height : 32);

    $('#graphcols').val(currentGraphic.grid[0] ? currentGraphic.grid[0] : 1);
    $('#graphrows').val(currentGraphic.grid[1] ? currentGraphic.grid[1] : 1);
    
    $('#graphframes').val(currentGraphic.frames ? currentGraphic.frames : 0);
    
    $('#graphrad').val(currentGraphic.r ? currentGraphic.r : 0);
    $('#graphtop').val(currentGraphic.top ? currentGraphic.top : 0);
    $('#graphleft').val(currentGraphic.left ? currentGraphic.left : 0);
    $('#graphright').val(currentGraphic.right ? currentGraphic.right : 0);
    $('#graphbottom').val(currentGraphic.bottom ? currentGraphic.bottom : 0);
    
    $('#graphmarginx').val(currentGraphic.grid[0] ? currentGraphic.margin[0] : 0);
    $('#graphmarginy').val(currentGraphic.grid[1] ? currentGraphic.margin[1] : 0);
    $('#graphoffx').val(currentGraphic.grid[0] ? currentGraphic.offset[0] : 0);
    $('#graphoffy').val(currentGraphic.grid[1] ? currentGraphic.offset[1] : 0);

    if (currentGraphic.shape == "rect") {
        $('#graphviewshaperectangle').click();
    } else {
        $('#graphviewshaperound')[0].click();
    }

    if (!currentGraphic.frames) {
        var img = document.createElement('img');
        img.src = projdir + '/img/' + currentGraphic.origname;
        img.onload = function() {
            events.splitImage(img,currentGraphic.grid[0],grid[1],0,0,0,0,currentGraphic.untill, currentGraphic.origname);
            currentGraphic.frames = currentGraphic.grid[0],grid[1];
            currentGraphic.width = img.width / currentGraphic.grid[0];
            currentGraphic.height = img.height / currentGraphic.grid[0];
            delete currentGraphic.grid;
            delete currentGraphic.untill;
        };
        img.onerror = function() {
            alertify.error(languageJSON.graphview.corrupted);
            events.graphicSave();
        };
    }

    if (currentGraphic.frames === 1) {
        $('#graphsplit').show();
    } else {
        $('#graphsplit').hide();
    }

    for (var i = 0; i < currentGraphic.frames; i++) {
        $('#graphviewframes > ul').append('<img data-id="{1}" scr="{0}_frame_{1}.png" />'.f(
            currentGraphic.origname,
            i
        ));
    }
    $('#graphviewframes > ul').attr('data-base',currentGraphic.origname);
    $('#graphviewframes > ul img:first').addClass('active');

    $('#grahpspeed').val(10);
    events.launchGraphPreview();
};

events.graphicShowCircle = function() {
    $('#graphviewround').show();
    $('#graphviewrect').hide();
    if (currentGraphic.r == 0 || !currentGraphic.r) {
        r = Math.min(Math.floor(currentGraphic.width / currentGraphic.grid[0] / 2),
            Math.floor(currentGraphic.height / currentGraphic.grid[1] / 2));
    }
};
events.graphicShowRect = function() {
    $('#graphviewround').hide();
    $('#graphviewrect').show();
};
events.graphicFillRect = function() {
    currentGraphic.left = ~~(currentGraphic.axis[0]);
    currentGraphic.top = ~~(currentGraphic.axis[1]);
    currentGraphic.right = ~~(currentGraphic.width / currentGraphic.grid[0] - currentGraphic.axis[0]);
    currentGraphic.bottom = ~~(currentGraphic.height / currentGraphic.grid[1] - currentGraphic.axis[1]);
    $('#graphtop').val(currentGraphic.top);
    $('#graphleft').val(currentGraphic.left);
    $('#graphright').val(currentGraphic.right);
    $('#graphbottom').val(currentGraphic.bottom);
    events.refreshGraphCanvas();
};
events.graphicCenter = function() {
    currentGraphic.axis[0] = Math.floor(currentGraphic.width / currentGraphic.grid[0] / 2);
    currentGraphic.axis[1] = Math.floor(currentGraphic.height / currentGraphic.grid[1] / 2);
    $('#graphx').val(currentGraphic.axis[0]);
    $('#graphy').val(currentGraphic.axis[1]);
    events.refreshGraphCanvas();
};
events.graphicSave = function() {
    events.graphGenPreview(true, projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev.png', 64);
    events.graphGenPreview(false, projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev@2.png', 128);
    events.fillGraphs();
    glob.modified = true;
    $('#graphview').hide();
};
events.refreshGraphCanvas = function() {
    var kw, kh, w, h, k, i;

    kw = Math.min(($('#atlas').width() - 40) / graphCanvas.img.width, 1);
    kh = Math.min(($('#atlas').height() - 40) / graphCanvas.img.height, 1);
    k = Math.min(kw, kh);
    w = Math.floor(k * graphCanvas.img.width);
    h = Math.floor(k * graphCanvas.img.height);
    graphCanvas.width = w;
    graphCanvas.height = h;
    graphCanvas.x.strokeStyle = "#0ff";
    graphCanvas.x.lineWidth = 1;
    graphCanvas.x.globalCompositeOperation = 'source-over';
    graphCanvas.x.clearRect(0, 0, w, h);
    graphCanvas.x.drawImage(graphCanvas.img, 0, 0, w, h);
    graphCanvas.x.globalAlpha = 0.5;

    // 0 - cols
    // 1 - rows

    // cols
    for (i = 0; i <= currentGraphic.grid[0]; i++) {
        graphCanvas.x.beginPath();
        graphCanvas.x.moveTo(i * graphCanvas.img.width * k / currentGraphic.grid[0], 0);
        graphCanvas.x.lineTo(i * graphCanvas.img.width * k / currentGraphic.grid[0], h);
        graphCanvas.x.stroke();
    }
    //rows
    for (i = 0; i <= currentGraphic.grid[1]; i++) {
        graphCanvas.x.beginPath();
        graphCanvas.x.moveTo(0, i * graphCanvas.img.height * k / currentGraphic.grid[1]);
        graphCanvas.x.lineTo(w, i * graphCanvas.img.height * k / currentGraphic.grid[1]);
        graphCanvas.x.stroke();
    }

    // unused frames
    if (currentGraphic.untill !== 0) {
        graphCanvas.x.globalAlpha = 0.5;
        graphCanvas.x.fillStyle = '#f00';
        for (var i = currentGraphic.untill; i < currentGraphic.grid[0] * currentGraphic.grid[1]; i++) {
            graphCanvas.x.fillRect(w / currentGraphic.grid[0] * (i % currentGraphic.grid[0]),
                h / currentGraphic.grid[1] * (~~(i / currentGraphic.grid[0])),
                w / currentGraphic.grid[0],
                h / currentGraphic.grid[1]);
        }
    }

    events.launchGraphPreview();
};
events.graphicImport = function(me) { // input[type="file"]
    var i;
    files = me.val().split(';');
    for (i = 0; i < files.length; i++) {
        if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
            console.log(i, files[i], 'passed');
            currentProject.graphtick++;
            events.loadImg(
                i,
                files[i],
                projdir + '/img/i' + currentProject.graphtick + path.extname(files[i]),
                true
            );
        } else {
            console.log(i, files[i], 'NOT passed');
        }
    }
};
events.graphReplace = function (me) {
    if (/\.(jpg|gif|png|jpeg)/gi.test(me.val())) {
        console.log(me.val(), 'passed');
        events.loadImg(
            0,
            me.val(),
            projdir + '/img/i' + parseInt(currentGraphic.origname.slice(1)) + path.extname(me.val()),
            false
        );
    } else {
        alertify.error(languageJSON.common.wrongFormat);
        console.log(me.val(), 'NOT passed');
    }
};
events.loadImg = function(myi, filename, dest, imprt) {
    console.log(myi, filename, 'copying');
    megacopy(filename, dest, function(e) {
        console.log(myi, filename, 'copy finished');
        if (e) throw e;
        imga = document.createElement('img');
        if (imprt) {
            imga.onload = function() {
                var obj = {
                    name: path.basename(filename).replace(patterns.images, '').replace(/\s/g, '_'),
                    untill: 0,
                    grid: [1, 1],
                    axis: [0, 0],
                    origname: path.basename(dest),
                    shape: "rect",
                    left: 0,
                    right: this.width,
                    top: 0,
                    bottom: this.height
                };
                $('#graphic .cards').append(tmpl.graph.f(
                    obj.name,
                    projdir + '/img/' + obj.origname + '?' + Math.random(),
                    currentProject.graphs.length
                ));
                this.id = currentProject.graphs.length;
                currentProject.graphs.push(obj);
                events.imgGenPreview(dest, dest + '_prev.png', 64, function() {
                    console.log(myi, filename, 'preview generated');
                    $('#graphic .cards li[data-graph="{0}"] img'.f(this.id)).attr('src', dest + '_prev.png?{0}'.f(Math.random()));
                });
                events.imgGenPreview(dest, dest + '_prev@2.png', 128, function() {
                    console.log(myi, filename, 'hdpi preview generated');
                });
            }
        } else {
            imga.onload = function() {
                currentGraphic.width = this.width;
                currentGraphic.height = this.height;
                currentGraphic.origname = path.basename(dest);
                graphCanvas.img = this;
                events.refreshGraphCanvas();
                events.imgGenPreview(dest, dest + '_prev.png', 64, function() {
                    console.log(myi, filename, 'preview generated');
                    $('#graphic .cards li[data-graph="{0}"] img'.f(this.id)).attr('src', dest + '_prev.png?{0}'.f(Math.random()));
                });
                events.imgGenPreview(dest, dest + '_prev@2.png', 128, function() {
                    console.log(myi, filename, 'hdpi preview generated');
                });
            }
        }
        imga.onerror = function(e) {
            console.log('ERROR');
        }
        imga.src = dest + '?' + Math.random();
    });
};
events.imgGenPreview = function(source, name, size, cb) {
    var imga = document.createElement('img');
    imga.onload = function() {
        var c = document.createElement('canvas'), w, h, k;
        c.x = c.getContext('2d');
        c.width = c.height = size;
        c.x.clearRect(0, 0, size, size);
        w = size, this.width;
        h = size, this.height;
        if (w > h) {
            k = size / w;
        } else {
            k = size / h;
        }
        if (k > 1) k = 1;
        c.x.drawImage(
            this,
            (size - this.width*k)/2,
            (size - this.height*k)/2,
            this.width*k,
            this.height*k
        );
        console.log(
            this,
            (size - this.width*k)/2,
            (size - this.height*k)/2,
            this.width*k,
            this.height*k,
            size, this.width, this.height, k
        );
        // strip off the data: url prefix to get just the base64-encoded bytes
        var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs.writeFile(name, buf, function(err) {
            if (err) {
                console.log(err);
            } else {
                cb();
            }
        });
        $(c).remove(); // is needed?
    }
    imga.src = source;
};
events.graphGenPreview = function(replace, nam, size) {
    // nam = projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev.png'
    var c = document.createElement('canvas'), w, h, k;
    c.x = c.getContext('2d');
    c.width = c.height = size;
    c.x.clearRect(0, 0, size, size);
    w = graphCanvas.img.width / currentGraphic.grid[0];
    h = graphCanvas.img.height / currentGraphic.grid[1];
    if (w > h) {
        k = size / w;
    } else {
        k = size / h;
    }
    if (k > 1) k = 1;
    c.x.drawImage(graphCanvas.img,
        0,
        0,
        graphCanvas.img.width / currentGraphic.grid[0],
        graphCanvas.img.height / currentGraphic.grid[1], 
        (size - graphCanvas.img.width*k)/2, 
        (size - graphCanvas.img.height*k)/2, 
        graphCanvas.img.width*k, 
        graphCanvas.img.height*k
    );
    var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile(nam, buf, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('upd thumbnail', nam);
            if (replace) {
                $('#graphic .cards li[data-graph="{0}"] img'.f(currentGraphicId)).attr('src', '').attr('src', nam + '?{0}'.f(Math.random()));
                $('#types .cards li[data-graph="{0}"] img'.f(currentGraphic.name)).attr('src', '').attr('src', nam + '?{0}'.f(Math.random()));
            }
        }
    });
    $(c).remove(); // is needed?
};
events.currentGraphicPreviewColor = function () {
    $('#previewbgcolor').focus();
};




/********************* editing ***************************/
events.graphReplace = function () {

};
events.graphicDeleteFrame = function () {

};
events.graphicDuplicateFrame = function () {

};
events.graphicAddFrame = function () {

};
events.graphicShift = function () {

};
events.graphicFlipVertical = function () {

};
events.graphicFlipHorizontal = function () {

};
events.graphicRotate = function () {

};
events.graphicResize = function () {

};
events.graphicCrop = function () {

};
//------------ menus ----------------------




graphMenu = new gui.Menu();
graphMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function (e) {
        $('#graphic .cards li[data-graph="{0}"]'.f(currentGraphicId)).click();
    }
}));
graphMenu.append(new gui.MenuItem({
    label: languageJSON.common.duplicate,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
    click: function (e) {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    var gr = JSON.parse(JSON.stringify(currentGraphic));
                    gr.name = nam;
                    currentProject.graphtick ++;
                    gr.origname = 'i' + currentProject.graphtick + path.extname(currentGraphic.origname);
                    megacopy(projdir + '/img/' + currentGraphic.origname, projdir + '/img/i' + currentProject.graphtick + path.extname(currentGraphic.origname), function () {
                        currentProject.graphs.push(gr);
                        events.fillGraphs();
                    });
                }
            }
        }, currentGraphic.name + '_dup');
    }
}));
graphMenu.append(new gui.MenuItem({
    label: languageJSON.common.rename,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
    click: function (e) {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    currentGraphic.name = nam;
                    events.fillGraphs();
                }
            }
        }, currentGraphic.name);
    }
}));
graphMenu.append(new gui.MenuItem({
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function (e) {
        alertify.confirm(languageJSON.common.confirmDelete.f(currentGraphic.name), function (e) {
            if (e) {
                currentProject.graphs.splice(currentGraphicId,1);
                events.fillGraphs();
            }
        });
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on graph cards
    $('#graphic .cards').delegate('li', 'click', function() {
        events.openGraph($(this).attr('data-graph'));
    }).delegate('li', 'contextmenu', function(e) {
        console.log(e);
        var me = $(this);
        currentGraphicId = me.attr('data-graph');
        currentGraphic = currentProject.graphs[me.attr('data-graph')];
        graphMenu.popup(e.clientX, e.clientY);
    });

    // frames
    $('#graphviewframes > ul').delegate('img', 'click', function () {
        var me = $(this);
        me.parent().children().removeClass('active');
        me.addClass('active');
    });
});

//-------------- events -------------------

events.newProject = function() {
    var codename = $('#id').val();
    currentProject = {
        notes: '/* empty */',
        libs: {},
        graphs: [],
        types: [],
        sounds: [],
        styles: [],
        rooms: [],
        graphtick: 0,
        soundtick: 0,
        roomtick: 0,
        typetick: 0,
        styletick: 0,
        starting: 0,
        settings: {
            minifyhtmlcss: false,
            minifyjs: false
        }
    };
    fs.writeJSON(way + '/' + codename + '.ict', currentProject, function(e) {
        if (e) {
            throw e;
        }
    });
    projdir = way + '/' + codename;
    projname = codename + '.ict';
    fs.ensureDir(projdir);
    fs.ensureDir(projdir + '/img');
    fs.ensureDir(projdir + '/snd');
    fs.ensureDir(projdir + '/include');
    megacopy(assets + '/img/nograph.png', projdir + '/img/splash.png', function (e) {
        if (e) throw (e);
    });
    events.loadProject();
};
events.loadProject = function() {
    $('#rooms ul, #types ul, #graphs ul, #styles ul, #sounds ul, #modulelist, #moduleincluded').empty();

    fs.ensureDir(projdir);
    fs.ensureDir(projdir + '/img');
    fs.ensureDir(projdir + '/snd');

    events.fillProjectSettings();
    events.fillModuleList();
    events.fillGraphs();
    events.fillTypes();
    events.fillSounds();
    events.fillStyles();
    events.fillRooms();
    document.getElementById('acernotepadlocal').acer.setValue(currentProject.notes);

    if (glob.lastProjects.indexOf(path.normalize(projdir + '.ict')) !== -1) {
        glob.lastProjects.splice(glob.lastProjects.indexOf(path.normalize(projdir + '.ict')), 1);
    }
    glob.lastProjects.unshift(path.normalize(projdir + '.ict'));
    if (glob.lastProjects.length > 15) {
        glob.lastProjects.pop();
    }
    localStorage.lastProjects = glob.lastProjects.join(';');
    glob.modified = false;

    $('#intr').fadeOut(350);
};
events.previewProject = function(src) {
    $('#previewProject').html('<img src="{0}" />'.f(src))
        .find('img').hide().fadeIn(350);
};
// 'change' event at input[type="file"] field
events.openProjectFind = function(me) {
    if (path.extname(me.val()).toLowerCase() == '.ict') {
        fs.readFile(me.val(), function(err, data) {
            if (err) {
                throw err;
            }
            projname = path.basename(me.val());
            projdir = path.dirname(me.val()) + path.sep + path.basename(me.val(), '.ict');
            currentProject = JSON.parse(data);
            me.val('');
            events.loadProject();
        });
    } else {
        alertify.error(languageJSON.common.wrongFormat);
    }
};


//-------------- UI links -----------------
$(function () {
    if (localStorage.lastProjects != '') {
        glob.lastProjects = localStorage.lastProjects.split(';');
    } else {
        glob.lastProjects = [];
    }
    if (glob.lastProjects[0] != '') {
        for (var i = 0; i < glob.lastProjects.length; i++) {
            $('#recent').append('<li title="{1}" data-path="{1}"><span>{0}</span></li>'.f(
                path.basename(glob.lastProjects[i],'.json'),
                glob.lastProjects[i]
            ));
        }
    }
})

//-------------- UI links -----------------

$(function () {
    // bind events on items in "recent projects" list
    $('#recent').delegate('li', 'dblclick', function() {
        var me = $(this);
        fs.readFile(me.attr('data-path'), function(err, data) {
            if (err) {
                alertify.error(languageJSON.common.notfoundorunknown);
                return false;
            }
            projdir = path.dirname(me.attr('data-path')) + path.sep + path.basename(me.attr('data-path'), '.ict');
            projname = path.basename(me.attr('data-path'));
            currentProject = JSON.parse(data);
            events.loadProject();
        });
        return false; // block 'click' event
    }).delegate('li', 'click', function() {
        var me = $(this);
        events.previewProject(path.dirname(me.attr('data-path')) + '/' + path.basename(me.attr('data-path'), '.ict') + '/img/splash.png');
    });
});

//-------------- events -------------------

events.fullscreen = function() {
    win.toggleFullscreen();
    $('#fullscreen .icon').toggleClass('icon-minimize').toggleClass('icon-maximize');
};
// cat
events.ct = function(e) {
    catMenu.popup(e.clientX, e.clientY);
};
events.save = function() {
    fs.outputJSON(projdir + '.ict', currentProject, function(e) {
        if (e) {
            throw e;
        }
        alertify.log(languageJSON.common.savedcomm, "success", 3000);
        glob.modified = false;
    })
};
events.checkSave = function () {
    if (window.currentProject) {
        $('#graphview:visible #graphviewdone,\
           #styleview:visible button:last,\
           #soundview:visible button:last,\
           #typeview:visible #typedone,\
           #roomview:visible #roomviewdone').click();
    }
};

//------------ menus ----------------------

catMenu = new gui.Menu();
catMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function (e) {
        $('#findProject').click();
    }
}));
catMenu.append(new gui.MenuItem({
    label: languageJSON.common.save,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'save.png',
    click: events.save
}));
catMenu.append(new gui.MenuItem({
    label: languageJSON.intro.newProject.text,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'star.png',
    click: function (e) {
        alertify.prompt(languageJSON.intro.newProject.input, function (e,r) {
            if (e) {
                console.log(e,r);
                if (!apatterns.SymbolDigitUnderscore.test(r)) {
                    $('#id').val(r);
                    events.newProject();
                } else {
                    alertify.error(languageJSON.intro.newProject.nameerr);
                }
            }
        });
    }
}));

catMenu.append(new gui.MenuItem({type: 'separator'}));

catMenu.append(new gui.MenuItem({
    label: languageJSON.common.ctsite,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'arrow.png',
    click: function () {
        gui.Shell.openExternal('http://ctjs.ru/');
    }
}));

catMenu.append(new gui.MenuItem({type: 'separator'}));

catMenu.append(new gui.MenuItem({
    label: languageJSON.common.exit,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'exit.png',
    click: function (e) {
        alertify.confirm(languageJSON.common.exitconfirm, function (e) {
            if (e) {
                gui.App.quit();
            }
        });
    }
}));

//------------ UI links ------------------- 
$(function () {
    $('#mainnav [data-tab]').click(function () {
        events.checkSave();
    });
});

//-------------- events -------------------

events.fillModuleList = function() {
    fs.readdir(exec + '/ct.libs', function(err, files) {
        if (err) {
            throw err;
        }
        $('#modulelist, #moduleincluded').empty();
        for (var i = 0; i < files.length; i++) {
            if (path.extname(files[i]) == '.json') {
                var q = path.basename(files[i], '.json');
                if (currentProject.libs[q]) {
                    $('#modulelist').append('<li><i class="icon icon-confirm" /><span>{0}</span></li>'.f(q));
                    $('#moduleincluded').append('<li><i class="icon icon-confirm" /><span>{0}</span></li>'.f(q));
                } else {
                    $('#modulelist').append('<li><i class="icon icon-share" /><span>{0}</span></li>'.f(q));
                }
            }
        }
    });
};
events.openModules = function() {
    $('#modules .borderright li:eq(0)').click();
};
events.toggleModule = function() {
    if (currentProject.libs[currentModName]) {
        delete currentProject.libs[currentModName];
    } else {
        currentProject.libs[currentModName] = {};
    }
    events.renderMod(currentModName);
    glob.modified = true;
    events.fillModuleList();
};
events.renderMod = function(name) {
    fs.readFile(exec + '/ct.libs/' + name + '.json', function(err, data) {
        if (err) {
            throw err;
        }
        currentMod = JSON.parse(data);
        currentModName = name;

        // super-duper button
        if (currentProject.libs[currentModName]) {
            $('#moduleinfo .bigpower').removeClass('off');
        } else {
            $('#moduleinfo .bigpower').addClass('off');
        }

        // 'Info' page
        $('#modname span:eq(0)').text(currentMod.main.name);
        $('#modname span:eq(1)').text(currentMod.main.version);
        $('#modauthor').text(currentMod.info.author);
        $('#modsite').attr('href', currentMod.info.site);
        if (currentMod.injects) {
            $('#modinjects').show();
        } else {
            $('#modinjects').hide();
        }
        if (currentMod.fields) {
            $('#modconfigurable').show();
        } else {
            $('#modconfigurable').hide();
        }
        $('#modinfohtml').children().remove();
        //description
        if (currentMod.main.help) {
            $('#modinfohtml').append('<p>{0}</p>'.f(md.render(currentMod.main.help)));
        }
        if (currentMod.main.license) {
            $('#modinfohtml').append('<h1>{1}</h1><p>{0}</p>'.f(md.render(currentMod.main.license), languageJSON.modules.license));
        }
        preparetext('#modinfohtml');

        // 'Settings' page
        $('#modulesettings').empty();
        if (currentMod.fields && currentProject.libs[name]) {
            for (var k in currentMod.fields) {
                if (!currentProject.libs[name][currentMod.fields[k].key]) {
                    if (currentMod.fields[k].default) {
                        currentProject.libs[name][currentMod.fields[k].key] = currentMod.fields[k].default;
                    } else {
                        if (currentMod.fields[k].type == 'number') {
                            currentProject.libs[name][currentMod.fields[k].key] = 0;
                        } else if (currentMod.fields[k].type == 'checkbox') {
                            currentProject.libs[name][currentMod.fields[k].key] = false;
                        } else {
                            currentProject.libs[name][currentMod.fields[k].key] = '';
                        }
                    }
                }
                if (currentMod.fields[k].type == 'textfield') {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><textarea data-input="{1}"></textarea><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings textarea:last').val(currentProject.libs[name][currentMod.fields[k].key]);
                } else if (currentMod.fields[k].type == 'number') {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><input type="number" data-input="{1}" /><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings input:last').val(currentProject.libs[name][currentMod.fields[k].key]);
                } else if (currentMod.fields[k].type == 'checkbox') {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><input type="checkbox" data-input="{1}" /><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings input:last').prop('checked', currentProject.libs[name][currentMod.fields[k].key]);
                } else {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><input type="text" data-input="{1}" /><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings input:last').val(currentProject.libs[name][currentMod.fields[k].key]);
                }
            }
            preparetext('#modulesettings');
            $('#modsettings').show();
        } else {
            $('#modsettings').hide();
        }

        // 'Reference' page
        var html = '', i = 0;
        if (currentMod.methods) {
            html += '<h1>{0}</h1>'.f(languageJSON.modules.methods);
            i = 0;
            for (i in currentMod.methods) {
                // TODO: escape
                html += '<h2 class="copyme">ct.{0}.{1}</h2>'.f(name, i);
                if (currentMod.methods[i].exp) html += '<p>{0}</p>'.f(md.render(currentMod.methods[i].exp));
            }
            if (i == 0) {
                html += languageJSON.modules.nomethods;
            }
        }
        if (currentMod.params) {
            html += '<h1>{0}</h1>'.f(languageJSON.modules.parameters);
            i = 0;
            for (i in currentMod.params) {
                // TODO: escape
                html += '<h2 class="copyme">ct.{0}.{1}</h2>'.f(name, i);
                if (currentMod.params[i].exp) html += '<p>{0}</p>'.f(md.render(currentMod.params[i].exp));
            }
            if (i == 0) {
                html += languageJSON.modules.noparameters;
            }
        }
        $('#modulehelp').empty();
        $('#modulehelp').append(html);
        if (!(currentMod.params || currentMod.methods)) {
            $('#modhelp').hide();
        } else {
            $('#modhelp').show();
        }

        // 'Logs' page
        if (currentMod.main.logs) {
            $('#modulelogs').html(md.render(currentMod.main.logs));
            $('#modlogs').show();
        } else {
            $('#modlogs').hide();
        }
        $('#modinfo').click();
    });
};

//------------ menus ----------------------

// copyme 
copymeMenu = new gui.Menu();
copymeMenu.append(new gui.MenuItem({
    label: languageJSON.common.copy,
    click: function (e) {
        clipboard.set(currentFragment,'text');
    }
}));
copymeMenu.append(new gui.MenuItem({
    label: languageJSON.common.addtonotes,
    click: function (e) {
        var editor = $('#notepaglobal .acer')[0].acer;
        editor.setValue(editor.getValue() + '\n' + currentFragment);
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on module lists
    $('#moduleincluded, #modulelist').delegate('li', 'click', function() {
        me = $(this);
        events.renderMod(me.text());
    });
});

//-------------- events -------------------

events.notepadToggle = function() {
    var pad = $('#notepad');
    if (pad.hasClass('opened')) {
        pad.children('button').find('i').removeClass('icon-next').addClass('icon-back');
        pad.css('left', (window.innerWidth + 'px'));
        pad.removeClass('opened');
    } else {
        pad.children('button').find('i').removeClass('icon-back').addClass('icon-next');
        pad.css('left', (window.innerWidth - pad.width()) + 'px');
        pad.addClass('opened');
    }
};

//-------------- ace ----------------------
$(function () {$(function() {
    notepadlocal.getSession().on('change', function(e) {
        currentProject.notes = notepadlocal.getValue();
        glob.modified = true;
    });
    notepadglobal.getSession().on('change', function(e) {
        localStorage.notes = notepadglobal.getValue();
    });
})});
//-------------- onload -------------------
$(function () {$(function() {
    notepadglobal.setValue(localStorage.notes);
})});

$(function () {
    $('#helppages iframe').prop('src', exec + '/docs/index.html');
});

//-------------- events -------------------

events.fillRooms = function() {
    $('#rooms ul').empty();
    for (var i = 0; i < currentProject.rooms.length; i++) {
        $('#rooms ul').append(tmpl.room.f(
            currentProject.rooms[i].name,
            projdir + '/img/r' + currentProject.rooms[i].uid + '.png',
            i
        ));
    }
};
events.roomCreate = function () {
    currentProject.roomtick ++;
    var obj = {
        name: "room" + currentProject.roomtick,
        oncreate: '',
        onstep: '',
        ondraw: '',
        onleave: '',
        width: 800,
        height: 600,
        backgrounds: [],
        layers: [],
        uid: currentProject.roomtick
    };
    $('#rooms .cards').append(tmpl.room.f(
        obj.name,
        assets + '/img/nograph.png',
        currentProject.rooms.length
    ));
    currentProject.rooms.push(obj);
    if (currentProject.rooms.length == 1) {
        currentProject.startroom = obj.uid;
        $('#rooms .cards li:last').addClass('starting');
    }
    $('#rooms .cards li:last').click();
};
events.openRoom = function (num) {
    currentRoomId = num;
    currentRoom = currentProject.rooms[num];
    roomoncreate.setValue(currentRoom.oncreate);
    roomonstep.setValue(currentRoom.onstep);
    roomondraw.setValue(currentRoom.ondraw);
    roomonleave.setValue(currentRoom.onleave);
    $('#roomname').val(currentRoom.name);
    $('#roomwidth').val(currentRoom.width);
    $('#roomheight').val(currentRoom.height);
    $('#roomview .tabs > li:eq(0)').click();

    $('#roomcopies')
    .children()
        .remove();
    $('#types .cards li')
    .clone()
        .appendTo("#roomcopies");
    $("#roomcopies").prepend(tmpl.type.f(languageJSON.common.none,assets + '/img/nograph.png',-1,-1));
    $("#roomcopies li:first").click();

    $('#roomzoom100').click();
    events.roomRefillBg();

    glob.roomx = 0;
    glob.roomy = 0;

    $('#roomview').show();
    events.refreshRoomCanvas();
};
// костыли для ace
events.roomoncreate = function () {
    // При запуске триггерится жмак первых табов в навигациях.
    // Здесь есть предохранитель.
    if (window.currentRoom) {
        roomoncreate.moveCursorTo(0,0);
        roomoncreate.clearSelection();
        roomoncreate.focus();
    }
}
events.roomonstep = function () {
    roomonstep.moveCursorTo(0,0);
    roomonstep.clearSelection();
    roomonstep.focus();
}
events.roomondraw = function () {
    roomondraw.moveCursorTo(0,0);
    roomondraw.clearSelection();
    roomondraw.focus();
}
events.roomonleave = function () {
    roomonleave.moveCursorTo(0,0);
    roomonleave.clearSelection();
    roomonleave.focus();
}

events.roomToggleZoom = function () {
    var me = $(this)
    glob.roomzoom = Number(me.attr('data-zoom'));
    $('#roomview .zoom button').removeClass('selected');
    me.addClass('selected');
    events.refreshRoomCanvas();
};
events.roomRefillBg = function () {
    $('#roombgstack').children().remove();
    for (var i = 0; i < currentRoom.backgrounds.length; i++) {
        $('#roombgstack').append(tmpl.background.f(projdir + '/img/' + currentRoom.backgrounds[i].graph,currentRoom.backgrounds[i].depth,i));
    }
};
events.roomEvents = function () {
    $('#roomevents').show();
};
events.roomSaveEvents = function () {
    glob.modified = true;
    $('#roomevents').hide();
}; // hehe
events.refreshRoomCanvas = function () {
    if (document.getElementById('roomview').style.display != 'flex') {
        return;
    }
    if (roomCanvas.width != $('#roomview .editor').width() || roomCanvas.height != $('#roomeditor .editor').height()) {
        roomCanvas.width = $('#roomview .editor').width();
        roomCanvas.height = $('#roomview .editor').height();
    }
    roomCanvas.x.setTransform(1,0,0,1,0,0);
    roomCanvas.x.globalAlpha = 1;
    roomCanvas.x.clearRect(0,0,roomCanvas.width,roomCanvas.height);
    roomCanvas.x.translate(-glob.roomx,-glob.roomy);
    roomCanvas.x.translate(~~(roomCanvas.width / 2),~~(roomCanvas.height / 2));
    roomCanvas.x.translate(~~(-currentRoom.width / 2), ~~(-currentRoom.height / 2));
    roomCanvas.x.scale(glob.roomzoom,glob.roomzoom);


    var i, j, l, c, w, h, xx, yy, hybrid = [];
    
    hybrid = currentRoom.layers.concat(currentRoom.backgrounds);
    hybrid.sort(function (a,b) {
        if (a.depth - b.depth != 0) {
            return a.depth - b.depth;
        } else {
            if (a.copies) {
                return 1;
            } else {
                return -1;
            }
        }
        return 0;
    });
    if (hybrid.length > 0) {
        // копии
        for (i = 0; i < hybrid.length; i++) {
            if (hybrid[i].copies) {
                l = hybrid[i];
                for (j = 0; j < l.copies.length; j++) {
                    c = l.copies[j];
                    ct = currentProject.types[glob.typemap[c.uid]];
                    if (ct.graph != -1) {
                        graph = glob.graphmap[currentProject.types[glob.typemap[c.uid]].graph];
                        w = glob.graphmap[ct.graph].width / glob.graphmap[ct.graph].g.grid[0];
                        h = glob.graphmap[ct.graph].height / glob.graphmap[ct.graph].g.grid[1];
                        grax = glob.graphmap[ct.graph].g.axis[0];
                        gray = glob.graphmap[ct.graph].g.axis[1];
                    } else {
                        graph = glob.graphmap[-1];
                        w = h = 32;
                        grax = gray = 16;
                    }
                    roomCanvas.x.drawImage(graph,
                                           0,0,w,h,
                                           c.x - grax, c.y - gray,w,h);
                }
            } else {
                // фон
                roomCanvas.x.fillStyle = roomCanvas.x.createPattern(glob.graphmap[hybrid[i].graph],"repeat");
                roomCanvas.x.fillRect(
                    glob.roomx/glob.roomzoom + ((~~(currentRoom.width - roomCanvas.width) / 2)/glob.roomzoom),
                    glob.roomy/glob.roomzoom + ((~~(currentRoom.height - roomCanvas.height) / 2)/glob.roomzoom),
                    roomCanvas.width / glob.roomzoom,
                    roomCanvas.height / glob.roomzoom
                );
            }
        }
    }
    
    roomCanvas.x.lineJoin = "round"; 
    roomCanvas.x.strokeStyle = "#446adb";
    roomCanvas.x.lineWidth = 3;
    roomCanvas.x.strokeRect(-1.5,-1.5,currentRoom.width+3,currentRoom.height+3);
    roomCanvas.x.strokeStyle = "#fff";
    roomCanvas.x.lineWidth = 1;
    roomCanvas.x.strokeRect(-1.5,-1.5,currentRoom.width+3,currentRoom.height+3);
};
events.roomAddBg = function () {
    $('#roombgstack').append(tmpl.background.f(assets + '/img/nograph.png',0,currentRoom.backgrounds.length));
    currentBackground = currentRoom.backgrounds.length;
    currentRoom.backgrounds.push({
        depth: 0,
        graph: -1
    });
    $('#tempgraphic .cards')
    .undelegate('li','click')
    .children()
    .remove();
    $('#graphic .cards li')
    .clone()
        .appendTo("#tempgraphic .cards");
    $('#tempgraphic .cards').delegate('li','click', function () {
        var me = $(this);
        currentRoom.backgrounds[currentBackground].graph = currentProject.graphs[me.attr('data-graph')].origname;
        currentRoom.backgrounds.sort(function (a, b) {
            return a.depth - b.depth;
        });
        events.roomRefillBg();
        events.refreshRoomCanvas();
        $('#tempgraphic').hide();
    });
    $('#tempgraphic').show();
};
events.roomToggleGrid = function () {
    if (glob.grid == 0) {
        alertify.prompt(languageJSON.roomview.gridsize, function (e,r) {
            if (e) {
                if (Number(r) > 1) {
                    glob.grid = Number(r);
                    $('#roomgrid').text(languageJSON.roomview.gridoff);
                }
            }
        });
    } else {
        glob.grid = 0;
        $('#roomgrid').text(languageJSON.roomview.grid);
    }
};
events.roomShift = function () {
    alertify.custom('{0}<br/><br/><label>X: <input id="roomshiftx" type="number" value="32" /></label> <label>Y: <input id="roomshifty" type="number" value="32" /></label>'.f(languageJSON.roomview.shifttext), function (e) {
        if (e) {
            var dx = Number($('#roomshiftx').val()) || 0,
                dy = Number($('#roomshifty').val()) || 0;
            for (i = 0; i < currentRoom.layers.length; i++) {
                l = currentRoom.layers[i];
                for (j = 0; j < l.copies.length; j++) {
                    currentRoom.layers[i].copies[j].x += dx;
                    currentRoom.layers[i].copies[j].y += dy;
                }
            }
        }
    });
};
events.roomToCenter = function () {
    glob.roomx = glob.roomy = 0;
    events.refreshRoomCanvas();
};
events.roomUnpickType = function () {
    $('#roomcopies li:eq(0)').click();
};
events.roomSave = function () {
    events.roomGenSplash();
    events.fillRooms();
    glob.modified = true;
    $('#roomview, #roomevents').hide();
};
events.roomGenSplash = function() {
    var c = document.createElement('canvas'), w, h, k, size;
    c.x = c.getContext('2d');
    c.width = c.height = size = 256;
    c.x.clearRect(0, 0, size, size);
    w = roomCanvas.width;
    h = roomCanvas.height;
    if (w > h) {
        k = size / w;
    } else {
        k = size / h;
    }
    if (k > 1) k = 1;
    c.x.drawImage(roomCanvas,
        0,
        0,
        roomCanvas.width,
        roomCanvas.height, 
        (size - roomCanvas.width*k)/2, 
        (size - roomCanvas.height*k)/2, 
        roomCanvas.width*k, 
        roomCanvas.height*k
    );
    var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    nam = projdir + '/img/r' + currentRoom.uid + '.png';
    fs.writeFile(nam, buf, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('upd room thumbnail', nam);
            $('#rooms .cards li[data-room="{0}"] img'.f(currentRoomId)).attr('src', '').attr('src', nam + '?{0}'.f(Math.random()));
        }
    });
    nam2 = projdir + '/img/splash.png';
    fs.writeFile(nam2, buf, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('upd splash', nam2);
        }
    });
    $(c).remove(); // is needed?
};

//-------------- canvas -------------------

$(function () {$(function () {
    $(roomCanvas).on('click', function (e) {
        var yeah = false,
            layerid;
        if (currentTypePick != -1) {
            if (currentRoom.layers.length !== 0) {
                if (!currentRoom.layers.some(glob.findmylayer)) {
                    // если нет нашего слоя, создадим его...
                    currentRoom.layers.push({
                        depth: currentProject.types[currentTypePick].depth,
                        copies: []
                    });
                    // отсортируем слои по глубине...
                    currentRoom.layers.sort(function (a, b) {
                        return a.depth - b.depth;
                    });
                }
            } else {
                // если слоёв нет вообще, создадим один и получим указатель
                currentRoom.layers.push({
                    depth: currentProject.types[currentTypePick].depth,
                    copies: []
                });
            }
            // Найдём на наш слой указатель glob.layer
            currentRoom.layers.some(glob.findmylayer);

            if (glob.grid == 0) {
                glob.layer.copies.push({
                    x: ~~((e.offsetX - (roomCanvas.width - currentRoom.width) / 2 + glob.roomx) / glob.roomzoom),
                    y: ~~((e.offsetY - (roomCanvas.height - currentRoom.height) / 2 + glob.roomy) / glob.roomzoom),
                    uid: currentProject.types[currentTypePick].uid
                });
            } else {
                var x = ~~((e.offsetX - (roomCanvas.width - currentRoom.width) / 2 + glob.roomx) / glob.roomzoom),
                    y = ~~((e.offsetY - (roomCanvas.height - currentRoom.height) / 2 + glob.roomy) / glob.roomzoom);
                glob.layer.copies.push({
                    x: x - (x % glob.grid),
                    y: y - (y % glob.grid),
                    uid: currentProject.types[currentTypePick].uid
                });
            }
            events.refreshRoomCanvas();
        }
    }).on('mousedown', function (e) {
        if (currentTypePick == -1) {
            glob.dragging = true;
        }
    }).on('mousemove', function (e) {
        if (glob.dragging) {
            // перетаскивание
            glob.roomx -= e.originalEvent.movementX;
            glob.roomy -= e.originalEvent.movementY;
            events.refreshRoomCanvas();
        } else {
            if (currentTypePick != -1) {
                var graph, w, h, grax, gray;
                // превью вставки 
                events.refreshRoomCanvas();
                roomCanvas.x.globalAlpha = 0.5;
                ct = currentProject.types[currentTypePick];
                if (currentProject.types[currentTypePick].graph != -1) {
                    graph = glob.graphmap[currentProject.types[currentTypePick].graph];
                    w = glob.graphmap[ct.graph].width / glob.graphmap[ct.graph].g.grid[0];
                    h = glob.graphmap[ct.graph].height / glob.graphmap[ct.graph].g.grid[1];
                    grax = glob.graphmap[ct.graph].g.axis[0];
                    gray = glob.graphmap[ct.graph].g.axis[1];
                } else {
                    graph = glob.graphmap[-1];
                    w = h = 32;
                    grax = gray = 16;
                }

                if (glob.grid == 0) {
                    roomCanvas.x.setTransform(glob.roomzoom,0,0,glob.roomzoom,0,0);
                    roomCanvas.x.drawImage(graph,
                                           0,0,w,h,
                                           e.offsetX / glob.roomzoom - grax/glob.roomzoom, e.offsetY / glob.roomzoom - gray / glob.roomzoom,w,h);
                } else {
                    // если есть сетка
                    dx = (e.offsetX + glob.roomx - (roomCanvas.width - currentRoom.width) / 2) / glob.roomzoom;
                    dy = (e.offsetY + glob.roomy - (roomCanvas.height - currentRoom.height) / 2) / glob.roomzoom;
                    w = glob.graphmap[ct.graph].width / glob.graphmap[ct.graph].g.grid[0];
                    h = glob.graphmap[ct.graph].height / glob.graphmap[ct.graph].g.grid[1];
                    roomCanvas.x.drawImage(graph,
                                           0,0,w,h,
                                           dx - dx % glob.grid - grax, dy - dy % glob.grid - gray,w,h);
                }
            }
        }
    }).on('mouseout', function () {
        events.refreshRoomCanvas();
    }).on('contextmenu', function (e) {
        if (currentRoom.layers.length == 0) return false;
        var closest = currentRoom.layers[0].copies[0],
            layer = 0,
            pos = 0,
            length = Infinity,
            l, xp, yp, i, j;
        for (i = 0; i < currentRoom.layers.length; i++) {
            for (j = 0; j < currentRoom.layers[i].copies.length; j++) {
                xp = currentRoom.layers[i].copies[j].x * glob.roomzoom + (roomCanvas.width - currentRoom.width) / 2 - glob.roomx - e.offsetX;
                yp = currentRoom.layers[i].copies[j].y * glob.roomzoom + (roomCanvas.height - currentRoom.height) / 2 - glob.roomy - e.offsetY;
                l = Math.sqrt(xp*xp+yp*yp);
                console.log(xp,yp,l,length);
                if (l < length) {
                    length = l;
                    layer = i;
                    pos = j;
                }
            }
        }

        glob.roomclosestlayer = layer;
        glob.roomclosestpos = pos;
        var copy = currentRoom.layers[layer].copies[pos],
            type = currentProject.types[glob.typemap[copy.uid]],
            graph = glob.graphmap[type.graph].g;

        glob.roomclosesttype = type.name;

        // рисовка выделения
        roomCanvas.x.lineJoin = "round"; 
        roomCanvas.x.strokeStyle = "#446adb";
        roomCanvas.x.lineWidth = 3;
        var left = copy.x - graph.axis[0] - 1.5,
            top = copy.y - graph.axis[1] - 1.5,
            height = graph.width / graph.grid[0] + 3,
            width = + graph.height / graph.grid[1] + 3;
        roomCanvas.x.strokeRect(left,top,height,width);
        roomCanvas.x.strokeStyle = "#fff";
        roomCanvas.x.lineWidth = 1;
        roomCanvas.x.strokeRect(left,top,height,width);

        roomcanvasMenu.items[0].label = languageJSON.roomview.deletecopy.f(glob.roomclosesttype);
        roomcanvasMenu.popup(e.clientX, e.clientY);
        return false;
    }).on('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta > 0) {
            // in
            if (glob.roomzoom === 1) {
                $('#roomzoom200').click();
            } else if (glob.roomzoom === 0.5) {
                $('#roomzoom100').click();
            }  else if (glob.roomzoom === 0.25) {
                $('#roomzoom50').click();
            }
        } else {
            // out
            if (glob.roomzoom === 2) {
                $('#roomzoom100').click();
            } else if (glob.roomzoom === 1) {
                $('#roomzoom50').click();
            }  else if (glob.roomzoom === 0.5) {
                $('#roomzoom25').click();
            }
        }
    });
    $(window).on('mouseup', function () {
         glob.dragging = false;
    });
});});

//-------------- adaptive -----------------

$(function () {
    win.on('resize', function (w,h) {
        roomCanvas.width = w - $('#roomview .toolbar').width();
        roomCanvas.height = h - $('#mainnav').height();
        if ($('#roomview').css('display') != 'none') {
            events.refreshRoomCanvas();
        }
    });
    $(function () {
        roomCanvas.width = window.innerWidth - $('#roomview .toolbar').width();
        roomCanvas.height = window.innerHeight - $('#mainnav').height();
    });
});

//-------------- ace ----------------------

$(function () {$(function() {
    roomoncreate.sess.on('change', function(e) {
        currentRoom.oncreate = roomoncreate.getValue();
    });
    roomonstep.sess.on('change', function(e) {
        currentRoom.onstep = roomonstep.getValue();
    });
    roomondraw.sess.on('change', function(e) {
        currentRoom.ondraw = roomondraw.getValue();
    });
    roomonleave.sess.on('change', function(e) {
        currentRoom.onleave = roomonleave.getValue();
    });
})});

//-------------- UI links -----------------

$(function () {
    // delegate events on room cards
    $('#rooms .cards').delegate('li', 'click', function() {
        events.openRoom($(this).attr('data-room'));
    }).delegate('li', 'contextmenu', function(e) {
        console.log(e);
        var me = $(this);
        currentRoom = currentProject.rooms[me.attr('data-room')];
        currentRoomId = me.attr('data-room');
        roomMenu.popup(e.clientX, e.clientY);
    });

    // types palette
    $('#roomcopies').delegate('li','click', function () {
        var me = $(this),
            blah;
        currentTypePick = me.attr('data-type');
        $('#roomcopies li').removeClass('selected');
        me.addClass('selected');
    });
    // bg stack
    $('#roombackgrounds').delegate('li img','click', function () {
        currentBackground = $(this).parent().attr('data-background');
        $('#tempgraphic .cards')
        .undelegate('li','click')
        .children()
        .remove();
        $('#graphic .cards li')
        .clone()
            .appendTo("#tempgraphic .cards");
        $('#tempgraphic .cards').delegate('li','click', function () {
            var me = $(this);
            currentRoom.backgrounds[currentBackground].graph = currentProject.graphs[me.attr('data-graph')].origname;
            $('#roombgstack li:eq({0}) img'.f(currentBackground)).attr('src', projdir + '/img/' + currentProject.graphs[me.attr('data-graph')].origname);
            $('#tempgraphic').hide();
            events.refreshRoomCanvas();
        });
        $('#tempgraphic').show();
    }).delegate('li span','click', function () {
        currentBackground = $(this).parent().attr('data-background');
        alertify.prompt(languageJSON.roomview.newdepth, function (e,r) {
            if (e) {
                if (Number(r)) {
                    currentRoom.backgrounds[currentBackground].depth = r;
                    currentRoom.backgrounds.sort(function (a, b) {
                        return a.depth - b.depth;
                    });
                    events.roomRefillBg();
                }
            }
        });
    });

    //bg stack delegation
    $('#roombgstack').delegate('.bg', 'contextmenu', function (e) {
        glob.bgid = Number($(this).attr('data-background'));
        roombgMenu.popup(e.clientX, e.clientY);
    });
});

//------------ menus ----------------------

roomcanvasMenu = new gui.Menu();
roomcanvasMenu.append(new gui.MenuItem({
    label: languageJSON.roomview.deletecopy.f(glob.roomclosesttype),
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        console.log(glob.roomclosestlayer,glob.roomclosestpos);
        currentRoom.layers[glob.roomclosestlayer].copies.splice(glob.roomclosestpos,1);
        if (currentRoom.layers[glob.roomclosestlayer].copies.length == 0) {
            currentRoom.layers.splice(glob.roomclosestlayer,1);
        }
        events.refreshRoomCanvas();
    }
}));

roombgMenu = new gui.Menu();
roombgMenu.append(new gui.MenuItem({
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        currentRoom.backgrounds.splice(glob.bgid,1);
        events.refreshRoomCanvas();
        events.roomRefillBg();
    }
}));

roomMenu = new gui.Menu();
roomMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function () {
        $('#rooms .cards li[data-room="{0}"]'.f(currentRoomId)).click();
    }
}));
roomMenu.append(new gui.MenuItem({
    label: languageJSON.common.duplicate,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r,
                        rm = JSON.parse(JSON.stringify(currentRoom));
                    currentProject.roomtick ++;
                    rm.name = nam;
                    currentProject.rooms.push(rm);
                    currentRoomId = currentProject.rooms.length - 1;
                    currentRoom = currentProject.rooms[currentRoomId];
                    fs.linkSync(projdir + '/img/r' + rm.uid + '.png', projdir + '/img/r' + currentProject.roomtick + '.png')
                    rm.uid = currentProject.roomtick;
                    events.fillRooms();
                }
            }
        }, currentRoom.name + '_dup');
    }
}));
roomMenu.append(new gui.MenuItem({
    label: languageJSON.common.rename,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    currentRoom.name = nam;
                    events.fillRooms();
                }
            }
        }, currentRoom.name);
    }
}));
roomMenu.append(new gui.MenuItem({
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        alertify.confirm(languageJSON.common.confirmDelete.f(currentRoom.name), function (e) {
            if (e) {
                currentProject.rooms.splice(currentRoomId,1);
                events.fillRooms();
            }
        });
    }
}));

//-------------- events -------------------

events.fillProjectSettings = function() {
    $('#settings [data-input]:not([type="checkbox"], [type="radio"])').each(function() {
        me = $(this);
        try {
            me.val(eval(me.attr('data-input'))); // D:
        } catch(e) {
            console.log(e);
        }
    });
    $('#settings [data-input]').filter('[type="checkbox"], [type="radio"]').each(function() {
        me = $(this);
        try {
            me.prop("checked", eval(me.attr('data-input'))); // D:
        } catch(e) {
            console.log(e);
        }
    });
};

//-------------- events -------------------

events.fillSounds = function() {
    $('#sounds ul').empty();
    for (var i = 0; i < currentProject.sounds.length; i++) {
        $('#sounds ul').append(tmpl.sound.f(
            currentProject.sounds[i].name,
            //projdir + '/sounds/s' + currentProject.sounds[i].uid + '.png',
            assets + '/img/wave.png',
            i
        ));
    }
};
events.soundNew = function () {
    var obj = {
        name: 'sound' + currentProject.soundtick,
        uid: currentProject.soundtick
    };
    $('#sounds ul').append(tmpl.sound.f(
        'sound' + currentProject.soundtick,
        assets + '/img/wave.png',
        currentProject.sounds.length
    ));
    currentProject.soundtick ++;
    currentProject.sounds.push(obj);
    $('#sounds .cards li:last').click();
    $('#inputsound').click();
};
events.openSound = function (sound) {
    currentSound = currentProject.sounds[sound];
    $('#soundname').val(currentSound.name);
    $('#soundview').show();
    if (currentSound.origname) {
        $('#soundaudio').attr('src', projdir + '/snd/' + currentSound.origname);
    }
};
events.soundPlay = function () {
    if (glob.playing) {
        glob.playing = false;
        document.getElementById('soundaudio').pause();
//        $('#listen div').css('width',0);
    } else {
        glob.playing = true;
        document.getElementById('soundaudio').play();
/*        glob.soundplayinterval = setInterval(function () {
            $('#listen div').css('width',document.getElementById('soundaudio').position / document.getElementById('soundaudio').duration);
        }, 100);*/
    }
}

events.soundSave = function () {
    if (glob.playing) {
        events.soundPlay();
    }
    events.fillSounds();
    $('#soundview').hide();
};

//------------ menus ----------------------

soundMenu = new gui.Menu(); // +
soundMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function () {
        $('#sounds .cards li[data-sound="{0}"]'.f(currentSoundId)).click();
    }
}));
soundMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.rename,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    currentSound.name = nam;
                    events.fillSounds();
                }
            }
        }, currentSound.name);
    }
}));
soundMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        alertify.confirm(languageJSON.common.confirmDelete.f(currentSound.name), function (e) {
            if (e) {
                currentProject.sounds.splice(currentSoundId,1);
                events.fillSounds();
            }
        });
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on sound cards
    $('#sounds .cards').delegate('li', 'click', function() {
        events.openSound($(this).attr('data-sound'));
    }).delegate('li', 'contextmenu', function (e) {
        var me = $(this);
        currentSound = currentProject.sounds[me.attr('data-sound')];
        currentSoundId = me.attr('data-sound');
        soundMenu.popup(e.clientX, e.clientY);
    });
    $('#inputsound').change(function () {
        me = $(this);
        currentSound.origname = 's' + currentSound.uid + path.extname(me.val());
        megacopy(me.val(),projdir + '/snd/' + currentSound.origname, function () {
            $('#soundaudio').attr('src', projdir + '/snd/' + currentSound.origname);
        });
        me.val('');
    });
    $('#soundaudio').on('play', function () {
        glob.playing = true;
    });
});

//-------------- events -------------------

events.fillStyles = function() {
    $('#styles ul').empty();
    for (var i = 0; i < currentProject.styles.length; i++) {
        $('#styles ul').append(tmpl.style.f(
            currentProject.styles[i].name,
            projdir + '/img/s' + currentProject.styles[i].uid + '.png',
            i
        ));
    }
};
events.openStyle = function(style) {
    currentStyle = currentProject.styles[style];
    currentStyleId = style;
    $('#iftochangefont')[0].checked = !!currentStyle.font;
    $('#iftochangefill')[0].checked = !!currentStyle.fill;
    $('#iftochangestroke')[0].checked = !!currentStyle.stroke;
    $('#iftochangeshadow')[0].checked = !!currentStyle.shadow;
    if (currentStyle.fill) {
        $('#stylefillinner [name="filltype"][value="{0}"]'.f(currentStyle.fill.type)).click().change();
        if (currentStyle.fill.type == 1) {
            $('#stylefillinner [name="fillgradtype"][value="{0}"]'.f(currentStyle.fill.gradtype)).click().change();
        }
    }
    $('#styleview [data-input]:not([type="radio"])').each(function() {
        me = $(this);
        if (me.hasClass('color')) {
            me.val(eval(me.attr('data-input')) == undefined ? '#000000' : eval(me.attr('data-input')));
        } else if (me.attr('type') == 'number') {
            me.val(eval(me.attr('data-input')) == undefined ? 0 : eval(me.attr('data-input')));
        } else {
            me.val(eval(me.attr('data-input')) == undefined ? '' : eval(me.attr('data-input')));
        }
    });
    events.refreshStyleGraphic();

    $('#styleview .pattern, \
       #styleview .solidfill, \
       #styleview .gradientfill').hide();

    $('#styleview .align button').removeClass('selected');
    if (currentStyle.font) {
        $('#styleview .align button[value="{0} {1}"]'.f(currentStyle.font.valign, currentStyle.font.halign)).removeClass('selected');
    }

    opening = true;
    events.styleToggleFont.apply(document.getElementById('iftochangefont'));
    events.styleToggleFill.apply(document.getElementById('iftochangefill'));
    events.styleToggleShadow.apply(document.getElementById('iftochangeshadow'));
    events.styleToggleStroke.apply(document.getElementById('iftochangestroke'));
    opening = false;

    $('#styleview').show();
};
events.styleToggleFont = function() {
    if (this.checked) {
        $('#stylefontinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.font = {
                family: 'sans-serif',
                size: 12
            };
            $('#fontsize').val(12);
            $('#fontfamily').val('sans-serif');
            $('#stylefontinner .align button').removeClass('selected');
        }
    } else {
        $('#stylefontinner').attr('disabled', 'disabled');
        currentStyle.font = false;
    }
};
events.styleToggleFill = function() {
    if (this.checked) {
        $('#stylefillinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.fill = {};
            $('#stylefillinner [name="filltype"]:eq(0)').click();
        }
    } else {
        $('#stylefillinner').attr('disabled', 'disabled');
        currentStyle.fill = false;
    }
};
events.styleToggleStroke = function() {
    if (this.checked) {
        $('#stylestrokeinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.stroke = {
                color: '#000000',
                weight: 1
            };
            $('#strokecolor').val('#000000');
            $('#strokeweight').val(1);
        }
    } else {
        $('#stylestrokeinner').attr('disabled', 'disabled');
        currentStyle.stroke = false;
    }
};
events.styleToggleShadow = function() {
    if (this.checked) {
        $('#styleshadowinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.shadow = {
                color: '#000000',
                x: 0,
                y: 0,
                blur: 0
            };
            $('#shadowcolor').val('#000000');
            $('#shadowblur, #shadowx, #shadowy').val(0);
        }
    } else {
        $('#styleshadowinner').attr('disabled', 'disabled');
        currentStyle.shadow = false;
    }
};
events.styleShowSolid = function () {
    if (!currentStyle.fill.color) {
        currentStyle.fill.color = '#000';
        $('#fillcolor').val('#000000');
    }
    $('#styleview .pattern, #styleview .gradientfill').hide();
    $('#styleview .solidfill').show();
};
events.styleShowGrad = function () {
    if (!currentStyle.fill.gradsize) {
        currentStyle.fill.color1 = '#fff';
        currentStyle.fill.color2 = '#000';
        $('#fillgradsize').val(50);
        currentStyle.fill.gradsize = 50;
        $('#fillcolor1').val('#ffffff');
        $('#fillcolor2').val('#000000');
        currentStyle.fill.gradtype = 2;
        $('#stylefillinner [name="fillgradtype"][value="{0}"]'.f(currentStyle.fill.gradtype)).click().change();
    }
    $('#styleview .pattern, #styleview .solidfill').hide();
    $('#styleview .gradientfill').show();
};
events.styleShowPattern = function () {
    if (!currentStyle.fill.patname) {
        $('#fillpatname').val('');
    }
    $('#styleview .gradientfill, #styleview .solidfill').hide();
    $('#styleview .pattern').show();
};
events.refreshStyleGraphic = function() {
    styleCanvas.x.strokeStyle = '#000000'; // обводка
    styleCanvas.x.globalAlpha = 1; // непрозрачность
    styleCanvas.x.font = '12px sans-serif'; // шрифт
    styleCanvas.x.fillStyle = '#000000'; // заливка
    styleCanvas.x.shadowBlur = 0; // размытие тени
    styleCanvas.x.shadowColor = 'none'; // цвет тени
    styleCanvas.x.shadowOffsetX = 0; // смещение тени по горизонтали
    styleCanvas.x.shadowOffsetY = 0; // смещение тени по вертикали
    styleCanvas.x.lineWidth = 0; // толщина линий для обводки
    styleCanvas.x.textBaseline = 'alphabet'; // способ выравнивания текста по вертикали
    styleCanvas.x.textAlign = 'left';

    styleCanvas.x.clearRect(0, 0, styleCanvas.width, styleCanvas.height);
    events.styleSet(styleCanvas.x);

    styleCanvas.x.save();
    styleCanvas.x.translate(100,100);
    styleCanvas.x.beginPath();
    styleCanvas.x.rect(0, 0, 100, 100);
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }
    styleCanvas.x.restore();

    styleCanvas.x.save();
    styleCanvas.x.translate(300,100);
    styleCanvas.x.beginPath();
    styleCanvas.x.arc(50, 50, 50, 0, 2 * Math.PI);
    styleCanvas.x.closePath();
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }
    styleCanvas.x.restore();


    styleCanvas.x.save();
    styleCanvas.x.translate(styleCanvas.width / 2, 300);
    styleCanvas.x.fillText(languageJSON.styleview.testtext, 0, 0);
    if (currentStyle.stroke) {
        styleCanvas.x.strokeText(languageJSON.styleview.testtext, 0, 0);
    }
    styleCanvas.x.restore();
};
events.styleSet = function (cx) {
    if (currentStyle.font) {
        cx.font = currentStyle.font.size + 'px ' + currentStyle.font.family;
        cx.textBaseline = currentStyle.font.valign;
        cx.textAlign = currentStyle.font.halign;
    }
    if (currentStyle.fill) {
        if (currentStyle.fill.type == 0) {
            cx.fillStyle = currentStyle.fill.color;
        } else if (currentStyle.fill.type == 1) {
            var grad;
            if (!currentStyle.fill.gradsize) {
                currentStyle.fill.gradsize = 50;
                currentStyle.fill.color1 = '#fff';
                currentStyle.fill.color2 = '#000';
            }
            if (currentStyle.fill.gradtype == 0) {
                grad = styleCanvas.x.createRadialGradient(
                    currentStyle.fill.gradsize,
                    currentStyle.fill.gradsize,
                    0,
                    currentStyle.fill.gradsize,
                    currentStyle.fill.gradsize,
                    currentStyle.fill.gradsize);
            } else if (currentStyle.fill.gradtype == 1) {
                grad = styleCanvas.x.createLinearGradient(0, 0, 0, currentStyle.fill.gradsize);
            } else {
                grad = cx.createLinearGradient(0, 0, currentStyle.fill.gradsize, 0);
            }
            grad.addColorStop(0, currentStyle.fill.color1);
            grad.addColorStop(1, currentStyle.fill.color2);
            cx.fillStyle = grad;
        } else if (currentStyle.fill.type == 2) {
            if (currentStyle.fill.patname != '') {
                var imga = document.createElement('img');
                imga.onload = function () {
                    events.styleRedrawPreview();
                }
                for (var i = 0; i < currentProject.graphs.length; i++) {
                    if (currentProject.graphs[i].name == currentStyle.fill.patname) {
                        cx.img = imga;
                        imga.src = projdir + '/img/' + currentProject.graphs[i].origname;
                        break;
                    }
                }
            }
            cx.fillStyle = '#fff';
        }
    }
    if (currentStyle.stroke) {
        cx.strokeStyle = currentStyle.stroke.color;
        cx.lineWidth = currentStyle.stroke.weight;
    }
    if (currentStyle.shadow) {
        cx.shadowColor = currentStyle.shadow.color;
        cx.shadowBlur = currentStyle.shadow.blur;
        cx.shadowOffsetX = currentStyle.shadow.x;
        cx.shadowOffsetY = currentStyle.shadow.y;
    }
};
events.styleRedrawPreview = function () {
    styleCanvas.x.fillStyle = styleCanvas.x.createPattern(styleCanvas.x.img,"repeat");
    styleCanvas.x.clearRect(0, 0, styleCanvas.width, styleCanvas.height);

    styleCanvas.x.beginPath();
    styleCanvas.x.rect(100, 100, 100, 100);
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }

    styleCanvas.x.beginPath();
    styleCanvas.x.arc(350, 150, 50, 0, 2 * Math.PI);
    styleCanvas.x.closePath();
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }

    styleCanvas.x.fillText(languageJSON.styleview.testtext, styleCanvas.width / 2, 300);
    if (currentStyle.stroke) {
        styleCanvas.x.strokeText(languageJSON.styleview.testtext, styleCanvas.width / 2, 300);
    }
};

events.styleCreate = function() {
    currentProject.styletick ++;
    var obj = {
        name: "style" + currentProject.styletick,
        shadow: false,
        stroke: false,
        fill: false,
        font: false,
        uid: currentProject.styletick
    };
    $('#styles .cards').append(tmpl.style.f(
        obj.name,
        assets + '/img/nograph.png',
        currentProject.styles.length
    ));
    currentProject.styles.push(obj);
    $('#styles .cards li:last').click();
};
events.styleSave = function() {
    events.styleGenPreview();
    events.fillStyles();
    $('#styleview').hide();
};
events.styleSetAlign = function () {
    var arr = this.value.split(' ');
    currentStyle.font.valign = arr[0];
    currentStyle.font.halign = arr[1];
    events.refreshStyleGraphic();
};
events.styleGenPreview = function () {
    var c = document.createElement('canvas');
    c.x = c.getContext('2d');
    c.width = c.height = 64;
    c.x.clearRect(0, 0, 64, 64);
    events.styleSet(c.x);
    styleCanvas.x.textBaseline = 'middle';
    styleCanvas.x.textAlign = 'center';
    c.x.fillText('Aa',32,32);
    if (currentStyle.stroke) {
        c.x.strokeText('Aa',32,32);
    }
    var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile(projdir + '/img/s' + currentStyle.uid + '.png', buf, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('new thumbnail', projdir + '/img/s' + currentStyle.uid + '.png');
        $('#styles .cards li[data-style="{0}"] img'.f(currentStyleId)).attr('src', '')
        .attr('src', projdir + '/img/s' + currentProject.styles[currentStyleId].uid + '.png?{0}'.f(Math.random()));
    });
    $(c).remove(); // is needed?
};

events.styleFindPattern = function () {
    $('#tempgraphic .cards')
    .undelegate('li','click')
    .children()
    .remove();
    $('#graphic .cards li')
    .clone()
        .appendTo("#tempgraphic .cards");
    $('#tempgraphic .cards').delegate('li','click', function () {
        var me = $(this);
        $('#fillpatname').val(currentProject.graphs[me.attr('data-graph')].name).change();
        $('#tempgraphic').hide();
    });
    $('#tempgraphic').show();
};

//------------ menus ----------------------

styleMenu = new gui.Menu(); // +
styleMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function () {
        $('#styles .cards li[data-style="{0}"]'.f(currentStyleId)).click();
    }
}));
styleMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.duplicate,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r,
                        st = JSON.parse(JSON.stringify(currentStyle));
                    currentProject.styletick ++;
                    st.name = nam;
                    st.uid = currentProject.styletick;
                    currentProject.styles.push(st);
                    currentStyleId = currentProject.styles.length - 1;
                    currentStyle = currentProject.styles[currentStyleId];
                    events.styleGenPreview();
                    events.fillStyles();
                }
            }
        }, currentStyle.name + '_dup');
    }
}));
styleMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.rename,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    currentStyle.name = nam;
                    events.fillStyles();
                }
            }
        }, currentStyle.name);
    }
}));
styleMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        alertify.confirm(languageJSON.common.confirmDelete.f(currentStyle.name), function (e) {
            if (e) {
                currentProject.styles.splice(currentStyleId,1);
                events.fillStyles();
            }
        });
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on style cards
    $('#styles .cards').delegate('li', 'click', function() {
        events.openStyle($(this).attr('data-style'));
    }).delegate('li', 'contextmenu', function(e) {
        var me = $(this);
        currentStyle = currentProject.styles[me.attr('data-style')];
        currentStyleId = me.attr('data-style');
        styleMenu.popup(e.clientX, e.clientY);
    });
    // styleview events
    $('#styleview').delegate('input', 'change', events.refreshStyleGraphic);
    $('#styleview .align button').click(function () {
        $('#styleview .align button').removeClass('selected');
        $(this).addClass('selected');
    })
});

//-------------- events -------------------

events.fillTypes = function() {
    $('#types ul').empty();
    for (var i = 0; i < currentProject.types.length; i++) {
        var erm;
        erm = assets + '/img/nograph.png';
        if (currentProject.types[i].graph != -1) {
            for (var j = 0; j < currentProject.graphs.length; j++) {
                if (currentProject.graphs[j].origname == currentProject.types[i].graph) {
                    erm = projdir + '/img/' + currentProject.types[i].graph + '_prev.png';
                    break;
                }
            }
        }
        $('#types .cards').append(tmpl.type.f(
            currentProject.types[i].name,
            erm,
            i,
            currentProject.types[i].graph
        ));
    }
    events.fillTypeMap();
};
events.fillTypeMap = function () {
    delete glob.typemap;
    glob.typemap = {};
    for (var i = 0; i < currentProject.types.length; i++) {
        glob.typemap[currentProject.types[i].uid] = i;
    }
};
events.typeCreate = function () {
    currentProject.typetick ++;
    var obj = {
        name: "type" + currentProject.typetick,
        depth: 0,
        oncreate: '',
        onstep: '',
        ondraw: 'ct.draw(this);',
        ondestroy: '',
        uid: currentProject.typetick,
        graph: -1
    };
    $('#types .cards').append(tmpl.type.f(
        obj.name,
        assets + '/img/nograph.png',
        currentProject.types.length
    ));
    currentProject.types.push(obj);
    $('#types .cards li:last').click();
};

events.openType = function (num) {
    currentTypeId = num;
    currentType = currentProject.types[num];
    if (currentType.graph != -1) {
        var blah = $('#types [data-type="{0}"] img'.f(currentTypeId)).attr('src');
        $('#typegraph img').attr('src', path.dirname(blah) + '/' + path.basename(blah,'.png')+'@2.png?'+Math.random());
    } else {
        $('#typegraph img').attr('src', assets + '/img/nograph.png');
    }
    typeoncreate.setValue(currentType.oncreate);
    typeonstep.setValue(currentType.onstep);
    typeondraw.setValue(currentType.ondraw);
    typeondestroy.setValue(currentType.ondestroy);

    $('#typename').val(currentType.name);
    $('#typedepth').val(currentType.depth);
    $('#typeview').show();
    $('#typeview .tabs > li:eq(0)').click();
};
// костыли для ace
events.typeoncreate = function () {
    // При запуске триггерится жмак первых табов в навигациях.
    // Здесь есть предохранитель.
    if (window.currentType) {
        typeoncreate.moveCursorTo(0,0);
        typeoncreate.clearSelection();
        typeoncreate.focus();
    }
}
events.typeonstep = function () {
    typeonstep.moveCursorTo(0,0);
    typeonstep.clearSelection();
    typeonstep.focus();
}
events.typeondraw = function () {
    typeondraw.moveCursorTo(0,0);
    typeondraw.clearSelection();
    typeondraw.focus();
}
events.typeondestroy = function () {
    typeondestroy.moveCursorTo(0,0);
    typeondestroy.clearSelection();
    typeondestroy.focus();
}

events.typeChangeSprite = function () {
    $('#tempgraphic .cards')
    .undelegate('li','click')
    .children()
    .remove();
    $('#graphic .cards li')
    .clone()
        .appendTo("#tempgraphic .cards");
    $("#tempgraphic .cards").prepend(tmpl.graph.f(languageJSON.common.none,assets + '/img/nograph.png',-1));
    $('#tempgraphic .cards').delegate('li','click', function () {
        var me = $(this),
            blah;
        if (me.attr('data-graph') != -1) {
            currentType.graph = currentProject.graphs[me.attr('data-graph')].origname;
            blah = me.find('img').attr('src');
            $('#typegraph img').attr('src', path.dirname(blah) + '/' + path.basename(blah,'.png')+'@2.png');
            $('#types .cards [data-type="{0}"] img'.f(currentTypeId)).attr('src', blah);
            $('#types .cards [data-type="{0}"]').attr('data-graph',currentProject.graphs[me.attr('data-graph')].origname);
        } else {
            currentType.graph = -1;
            $('#types .cards [data-type="{0}"]').attr('data-graph',-1);
            $('#typegraph img').attr('src', assets + '/img/nograph.png');
        }
        $('#tempgraphic').hide();
    });
    $('#tempgraphic').show();
};
events.typeSave = function () {
    events.fillTypes();
    glob.modified = true;
    $('#typeview').hide();
};

//-------------- ace ----------------------
$(function () {$(function() {
    typeoncreate.sess.on('change', function(e) {
        currentType.oncreate = typeoncreate.getValue();
    });
    typeonstep.sess.on('change', function(e) {
        currentType.onstep = typeonstep.getValue();
    });
    typeondraw.sess.on('change', function(e) {
        currentType.ondraw = typeondraw.getValue();
    });
    typeondestroy.sess.on('change', function(e) {
        currentType.ondestroy = typeondestroy.getValue();
    });
})});

//------------ menus ----------------------

typeMenu = new gui.Menu(); // +
typeMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function () {
        $('#types .cards li[data-type="{0}"]'.f(currentTypeId)).click();
    }
}));
typeMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.duplicate,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r,
                        tp = JSON.parse(JSON.stringify(currentType));
                    currentProject.typetick ++;
                    tp.name = nam;
                    tp.uid = currentProject.typetick;
                    currentProject.types.push(tp);
                    currentTypeId = currentProject.types.length - 1;
                    currentType = currentProject.types[currentTypeId];
                    events.fillTypes();
                }
            }
        }, currentType.name + '_dup');
    }
}));
typeMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.rename,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    currentType.name = nam;
                    events.fillTypes();
                }
            }
        }, currentType.name);
    }
}));
typeMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        alertify.confirm(languageJSON.common.confirmDelete.f(currentType.name), function (e) {
            if (e) {
                currentProject.types.splice(currentTypeId,1);
                events.fillTypes();
            }
        });
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on type cards
    $('#types .cards').delegate('li', 'click', function() {
        events.openType($(this).attr('data-type'));
    }).delegate('li', 'contextmenu', function(e) {
        console.log(e);
        var me = $(this);
        currentType = currentProject.types[me.attr('data-type')];
        currentTypeId = me.attr('data-type');
        typeMenu.popup(e.clientX, e.clientY);
    });
});

//   ___					   _   _  ___ 
//  / __| ___  ___ _ __   ___ | | | ||_ _|
// | (__ / _ \(_-<| '  \ / _ \| |_| | | | 
//  \___|\___//__/|_|_|_|\___/ \___/ |___|
//


$(function() {
	// ---------- Меню --------------------------------------------------------------------
	
	//Табы
	$('.tabs').delegate('[data-tab]', 'click', function() {
		var me = $(this),
			cont = me.closest('.tabs'),
			tabs = cont.next().children();
		tabs.hide().removeClass('show');
		cont.find('[data-tab]').removeClass('active');
		me.addClass('active');
		tabs.filter(me.attr('data-tab')).show().addClass('show');
	}).find('[data-tab-default]').click();
	
	// -------------------------------------------------------------------------------------
	

	// инпуты файлов
	$('.file button').click(function() {
		$(this).closest('.file').find('[type="file"]').click();
		return false;
	});

	//селекты
	var selectTransform = function() {
		var me = $(this);
		if (this.tagName.toUpperCase() == 'OPTION') {
			verst += '<li data-value="' + me.val() + '" ' + (me.attr('selected') ? 'data-selected ' : '') + 'class="option">' + me.html() + '</li>';
		} else if (this.tagName.toUpperCase() == 'OPTGROUP') {
			verst += '<ul class="optgroup>'
			me.children().each(selectTransform);
			verst += '</ul>';
		}
	}
	$('select.select').each(function() {
		verst = '<ul class="menu">';
		var me = $(this);
		me.hide().after('<div class="selectbox inline"><span></span><i class="icon icon-next"/></div>')
			.children().each(selectTransform);
		me.next().append(verst).find('[data-selected], .option:first').eq(0).each(function() {
			var me = $(this);
			me.closest('.selectbox').attr('data-value', me.attr('data-value'))
				.children('span').html(me.html());
		});
		me.next().delegate('li', 'click', function() {
			var me = $(this);
			me.closest('.selectbox').removeClass('focus').attr('data-value', me.attr('data-value'))
				.children('span').html(me.html());
			return false;
		}).click(function() {
			$(this).toggleClass('focus');
			return false;
		});
		verst += '</ul>';
	});
	$('body').on('click', function () {
	// TODO: make select blur in some other way
		$('select.select').removeClass('focus'); // почему оно не работает?!
	});

});


//    __  __        _       
//   |  \/  | __ _ (_) _ _  
//   | |\/| |/ _` || || ' \ 
//   |_|  |_|\__,_||_||_||_|
//                          

/*******************************************

 [data-event] --> onClick events. Declared in events.js
 This schecks some other attributes:
     [data-check] - required fields/fields with patterns etc... CSS selector
         [data-apattern] - requires RegExpr pattern to be false
         [data-pattern] - requires RegExpr pattern to be true
         [data-required] - must be non-empty

 [data-tab]   --> tabs component; this attribute is a css selector of elements to display.
 [data-input] --> onChange events (usually - may be triggered by jQuery). Attributes are pointing to JavaScript global variables.
    common variables:
        - currentGraphic
        - currentGraphicId

        - currentType
        - currentTypeId

        - currentSound
        - currentSoundId

        - currentRoom
        - currentRoomId

        - currentStyle
        - currentStyleId

        - currentMod
        - currentModName

        - currentProject

        - currentFragment – not used in currentProject; just a temp variable for copying text
        - currentTypePick – currently selected type in room editor
        - currentBackground

    try to save JSON-structures of projects.

 [data-mode]  --> ace.io language mode. Requires .acer class.

 // Maps

 glob.typemap:  uid      --> type index
 glob.graphmap: origname --> image
                             .g --> graph object

*******************************************/

/* 
   String.f (String.format - alias)
   Super-duper basic templating function.
   "I have {0} apples".f(3)
   ==> 'I have 3 apples'
   use double curly braces to get single ones
*/

preparetext = function(selector) {
    $(selector + ' a').click(function() {
        gui.Shell.openExternal($(this).attr('href'));
        return false;
    });
    $(selector).undelegate('contextmenu','.copyme')
    .delegate('contextmenu','.copyme', function (e) {
        currentFragment = $(this).text();
        copymeMenu.popup(e.clientX, e.clientY);
    });
    initdatainput(selector);
};


/********************************/

// first-launch setup
if (!localStorage.fontSize) {
    localStorage.fontSize = 18;
    localStorage.lastProjects = '';
    localStorage.notes = '';
}



// ace hotkeys
// decrease and increase font size
function extend_hotkeys (editor) {
    editor.commands.addCommand({
        name: 'increaseFontSize',
        bindKey: {win: 'Ctrl-+',  mac: 'Command-+'},
        exec: function(editor) {
            var num = Number(localStorage.fontSize);
            if (num < 48) {
                num ++;
                localStorage.fontSize = num;
                editor.style.fontSize = num+'px';
            }
            return false;
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'decreaseFontSize',
        bindKey: {win: 'Ctrl-minus',  mac: 'Command-minus'},
        exec: function(editor) {
            var num = Number(localStorage.fontSize);
            if (num > 6) {
                num --;
                localStorage.fontSize = num;
                editor.style.fontSize = num+'px';
            }
            return false;
        },
        readOnly: true
    });
}

// bind f1
key('f1', function () {
    gui.Shell.openItem(exec + '/docs/index.html')
});
key('ctrl + S', function () {
    events.save();
});

$(function () {
    graphCanvas = $('#atlas canvas')[0];
    graphCanvas.x = graphCanvas.getContext('2d');
    grprCanvas = $('#preview canvas')[0];
    grprCanvas.x = grprCanvas.getContext('2d');
    styleCanvas = $('#stylepreview canvas')[0];
    styleCanvas.x = styleCanvas.getContext('2d');
    roomCanvas = $('#roomview .editor canvas')[0];
    roomCanvas.x = roomCanvas.getContext('2d');
    roomCanvas.x.imageSmoothingEnabled = false;

    // ace
    acers = []; // скрытая реклама хохо
    langTools = ace.require("ace/ext/language_tools");
    $('.acer').each(function () {
        // [ace] == textarea/editor wrap
        // [ace].acer == ace instance (`editor`)
        // [ace].acer.sess == ace session
        jq = $(this);
        var me = ace.edit(this);
        extend_hotkeys(me);
        me.setTheme('ace/theme/tomorrow');
        this.acer = me;
        me.sess = me.getSession();
        this.style.fontSize = localStorage.fontSize + 'px';
        window[jq.attr('data-acervar')] = me;
        me.sess.setMode("ace/mode/" + jq.attr('data-mode'));
        me.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        acers.push(me);
    });

    // intro
    if (localStorage.lastProjects != '') {
        glob.lastProjects = localStorage.lastProjects.split(';');
    } else {
        glob.lastProjects = [];
    }
    if (glob.lastProjects[0] != '') {
        for (var i = 0; i < glob.lastProjects.length; i++) {
            $('#recent').append('<li data-name="{1}"><span>{0}</span></li>'.f(
                glob.lastProjects[i],
                path.basename(glob.lastProjects[i],'.json')
            ));
        }
    }


    alertify.set({ 
        labels: {
            ok: languageJSON.common.ok,
            cancel: languageJSON.common.cancel
        } 
    });

    // Run IDE
    $(function () { $(function () {
        $('#loading').fadeOut(200);
    })});

    // catch exir
    win.on('close', function () {
        if (glob.modified) {
            if (!confirm(languageJSON.common.reallyexit)) {
                return false;
            } else {
                this.close(true);
            }
        } else {
            this.close(true);
        }
    });
});

//setup ui components
$(function () {
    // styleview sliders
    $('#shadowblurslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [0,1],
            '20%': [10,1],
            '50%': [50,1],
            'max': [300,1]
        },
        step: 1
    }).on(function () {
        $('#shadowblur').change();
    }).Link('lower').to($('#shadowblur'));

    $('#strokeweightslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [1],
            'max': [30]
        },
        step: 1
    }).on('change',function () {
        $('#strokeweight').change();
    }).Link('lower').to($('#strokeweight'));

    $('#gradsizeslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [0,1],
            '5%': [10,1],
            '40%': [50,1],
            '80%': [300,1],
            'max': [1024,1]
        },
        step: 1
    }).on('change',function () {
        $('#fillgradsize').change();
    }).Link('lower').to($('#fillgradsize'));

    $('#fontsizeslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [6,1],
            '70%': [72,1],
            'max': [300,1]
        },
        step: 1
    }).on('change', function () {
        $('#fontsize').change();
    }).Link('lower').to($('#fontsize'));

    // colorpickers
    $('input.color:not(.rgb):not(#previewbgcolor)').val('#000').colorPicker({
        actionCallback: function (e,a) {
            var me = $(this.input);
            //console.log(e,a,this,this.input);
            if (me.attr('data-input')) {
                if (me.attr('type') == 'text' || !me.attr('type') || me[0].tagName.toUpperCase() == 'TEXTAREA') {
                    eval(me.attr('data-input') + ' = "' + me.val().replace(/\"/g, '\\"') + '"');
                } else {
                    eval(me.attr('data-input') + ' = ' + me.val());
                }
            }
            me.change();
        }
    });
    $('input.color.rgb:not(#previewbgcolor)').val('#000').colorPicker({
        noAlpha: true,
        customBG: '#222',
        actionCallback: function (e,a) {
            var me = $(this);
            console.log(e,a,this);
            if (me.attr('data-input')) {
                if (me.attr('type') == 'text' || !me.attr('type') || me[0].tagName.toUpperCase() == 'TEXTAREA') {
                    eval(me.attr('data-input') + ' = "' + me.val().replace(/\"/g, '\\"') + '"');
                } else {
                    eval(me.attr('data-input') + ' = ' + me.val());
                }
            }
            me.change();
        }
    });
    $('#previewbgcolor').val('#000').colorPicker({
        noAlpha: true,
        customBG: '#222',
        actionCallback: function () {
            $('#preview').css('background',$('#previewbgcolor').val());
        }
    });
});

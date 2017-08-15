
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
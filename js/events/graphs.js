window.events = window.events || {};
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

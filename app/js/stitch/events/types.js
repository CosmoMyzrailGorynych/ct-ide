
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
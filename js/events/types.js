window.events = window.events || {};
//-------------- events -------------------

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

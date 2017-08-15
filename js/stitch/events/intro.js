
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
events = events || {};
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

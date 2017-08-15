window.events = window.events || {};
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

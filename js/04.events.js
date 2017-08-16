window.events = window.events || {};
// trololo
var gui = require('nw.gui');
var win = gui.Window.get();
var glob = {
    prev: {},
    findmylayer(a) {
        if (a.depth === window.currentProject.types[currentTypePick].depth) {
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
            win.title = 'ct.ide — ' + sessionStorage.projname + ' •';
        } else {
            win.title = 'ct.ide — ' + sessionStorage.projname;
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

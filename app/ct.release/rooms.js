/***************************************
          [ rooms cotomod ]
***************************************/

ct.rooms = {
    addBg: function (graph,depth) {
        var canv = document.createElement('canvas'),
            g = ct.graphs[graph];
        canv.width = g.width * g.cols;
        canv.height = g.height * g.rows;
        canv.x = canv.getContext('2d');
        canv.x.drawImage(g.atlas, g.ax, g.ay, g.width * g.cols,  g.height * g.rows, 0, 0, g.width * g.cols, g.height * g.rows);
        var pat = ct.x.createPattern(canv, 'repeat');
        var copy = ct.types.Copy('BACKGROUND');
        copy.pattern = pat;
        ct.room.backgrounds.push(copy);
        ct.stack.push(copy);
    },
    make: function () { // utility: not for use
        for (var i = 0; i < this.bgs.length; i++) {
            ct.rooms.addBg(this.bgs[i].graph, this.bgs[i].depth);
        }
        for (var i = 0; i < this.objects.length; i++) {
            ct.types.make(this.objects[i].type, this.objects[i].x, this.objects[i].y);
        }
    },
    clear: function () {
        ct.stack = [];
        ct.types.list = { };
    },
    'switch': function (room) {
        %switch%
        if (ct.room) {
//            ct.room.onLeave.apply(ct.room); // wha?
            ct.room.onLeave();
            ct.rooms.onLeave.apply(ct.room);
        }
        ct.stack = [];
        ct.types.list = { };
        ct.rooms.current = ct.room = ct.rooms[room];
        ct.room.backgrounds = [];
        ct.room.uid = 0;
        ct.rooms.make.apply(ct.room);
        ct.setAttribute('width', ct.room.width);
        ct.setAttribute('height', ct.room.height);
        ct.room.x = ct.room.y = ct.room.follow = ct.room.borderX = ct.room.borderY = 0;
        ct.room.onCreate();
        ct.rooms.onCreate.apply(ct.room)
    },
    onCreate: function () {
        %roomoncreate%
    },
    onLeave: function () {
        %roomonleave%
    },
    starting: '@startroom@'
}

/** rooms */
@rooms@
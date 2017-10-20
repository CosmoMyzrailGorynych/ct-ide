ct.rooms = {
    addBg(graph, depth) {
        var canv = document.createElement('canvas'),
            g = ct.res.graphs[graph];
        canv.width = g.width;
        canv.height = g.height;
        canv.x = canv.getContext('2d');
        canv.x.drawImage(g.atlas, g.frames[0][0], g.frames[0][1], g.width, g.height, 0, 0, g.width, g.height);
        var pat = ct.x.createPattern(canv, 'repeat');
        var copy = ct.types.Copy('BACKGROUND');
        copy.pattern = pat;
        copy.depth = depth;
        ct.room.backgrounds.push(copy);
        ct.stack.push(copy);
    },
    make() { // utility: not for regular use
        for (let i = 0, li = this.bgs.length; i < li; i++) {
            ct.rooms.addBg(this.bgs[i].graph, this.bgs[i].depth);
        }
        for (let i = 0, li = this.objects.length; i < li; i++) {
            ct.types.make(this.objects[i].type, this.objects[i].x, this.objects[i].y);
        }
    },
    clear() {
        ct.stack = [];
        ct.types.list = { };
    },
    'switch'(room) {
        /*%switch%*/
        if (ct.room) {
            // ct.room.onLeave.apply(ct.room); // wha?
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
        ct.rooms.onCreate.apply(ct.room);
    },
    onCreate() {
        /*%roomoncreate%*/
    },
    onLeave() {
        /*%roomonleave%*/
    },
    starting: '@startroom@'
};

/*@rooms@*/

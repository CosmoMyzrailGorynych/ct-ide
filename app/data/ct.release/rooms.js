(function () {
    class Room extends PIXI.Container {
        constructor(template) {
            super();
            this.x = this.y = 0;
            this.uid = 0;
            this.follow = this.borderx = this.bordery = 0;
            this.tileLayers = [];
            this.backgrounds = [];
            if (!ct.room) {
                ct.room = ct.rooms.current = this;
            }
            if (template) {
                this.onCreate = template.onCreate;
                this.onStep = template.onStep;
                this.onDraw = template.onDraw;
                this.onLeave = template.onLeave;
                this.template = template;
                this.name = template.name;
                for (let i = 0, li = template.bgs.length; i < li; i++) {
                    const bg = new ct.types.Background(template.bgs[i].graph, null, template.bgs[i].depth);
                    this.backgrounds.push(bg);
                    ct.stack.push(bg);
                    this.addChild(bg);
                }
                for (let i = 0, li = template.tiles.length; i < li; i++) {
                    const tl = ct.rooms.addTileLayer(template.tiles[i]);
                    this.tileLayers.push(tl);
                    this.addChild(tl);
                }
                for (let i = 0, li = template.objects.length; i < li; i++) {
                    const copy = ct.types.make(template.objects[i].type, template.objects[i].x, template.objects[i].y, this);
                    if (template.objects[i].tx || template.objects[i].ty) {
                        copy.scale.set(template.objects[i].tx || 1, template.objects[i].ty || 1);
                    }
                }
                ct.pixiApp.renderer.resize(template.width, template.height);
            }
            return this;
        }
        get x () {
            return -this.position.x;
        }
        set x (value) {
            this.position.x = -value;
            return value;
        }
        get y () {
            return -this.position.y;
        }
        set y (value) {
            this.position.y = -value;
            return value;
        }
    }
    var nextRoom;
    ct.rooms = {
        templates: {},
        addBg(graph, depth) {
            const bg = new ct.types.Background(graph, null, depth);
            ct.room.addChild(bg);
            return bg;
        },
        addTileLayer(layer) {
            return new ct.types.Tileset(layer);
        },
        clear() {
            ct.stage.children = [];
            ct.stack = [];
            for (var i in ct.types.list) {
                ct.types.list[i] = [];
            }
        },
        'switch'(room) {
            nextRoom = room;
            ct.rooms.switching = true;
        },
        switching: false,
        load(roomName) {
            const room = new Room(ct.rooms.templates[roomName]);
            ct.stage.addChild(ct.room);
            return room;
        },
        forceSwitch(roomName) {
            if (nextRoom) {
                roomName = nextRoom;
            }
            if (ct.room) {
                ct.room.onLeave();
                ct.rooms.onLeave.apply(ct.room);
                ct.room = void 0;
            }
            ct.rooms.clear();
            ct.rooms.current = ct.room = new Room(ct.rooms.templates[roomName]);
            ct.room.onCreate();
            ct.rooms.onCreate.apply(ct.room);
            /*%switch%*/
            ct.rooms.switching = false;
            ct.stage.addChild(ct.room);
            nextRoom = void 0;
        },
        onCreate() {
            /*%roomoncreate%*/
        },
        onLeave() {
            /*%roomonleave%*/
        },
        starting: '@startroom@'
    };
})();

ct.rooms.beforeStep = function () {
    /*%beforeroomstep%*/
};
ct.rooms.afterStep = function () {
    /*%afterroomstep%*/
};
ct.rooms.beforeDraw = function () {
    /*%beforeroomdraw%*/
};
ct.rooms.afterDraw = function () {
    /*%afterroomdraw%*/
};

/*@rooms@*/

class Room extends PIXI.Container {
    constructor(template) {
        super();
        this.x = this.y = 0;
        this.uid = 0;
        this.follow = this.borderX = this.borderY = this.followShiftX = this.followShiftY = this.followDrift = 0;
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
                const bg = new ct.types.Background(template.bgs[i].texture, null, template.bgs[i].depth, template.bgs[i].extends);
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
                ct.types.make(template.objects[i].type, template.objects[i].x, template.objects[i].y, {
                    tx: template.objects[i].tx,
                    ty: template.objects[i].ty
                }, this);
            }
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
(function () {
    /* global deadPool */
    var nextRoom;
    /**
     * @namespace
     */
    ct.rooms = {
        templates: {},
        /**
         * Creates and adds a background to the current room, at the given depth.
         * @param {string} texture The name of the texture to use
         * @param {number} depth The depth of the new background
         * @returns {Background} The created background
         */
        addBg(texture, depth) {
            const bg = new ct.types.Background(texture, null, depth);
            ct.room.addChild(bg);
            return bg;
        },
        /**
         * Adds a new empty tile layer to the room, at the given depth
         * @param {number} layer The depth of the layer
         * @returns {Tileset} The created tile layer
         */
        addTileLayer(layer) {
            return new ct.types.Tileset(layer);
        },
        /**
         * Clears the current room
         * @return {void}
         */
        clear() {
            ct.stage.children = [];
            ct.stack = [];
            for (var i in ct.types.list) {
                ct.types.list[i] = [];
            }
        },
        /*
         * Switches to the given room. Note that this transition happens at the end
         * of the frame, so the name of a new room may be overridden.
         */
        'switch'(room) {
            if (ct.rooms.templates[room]){
                nextRoom = room;
                ct.rooms.switching = true;
            } else {
                console.error('[ct.rooms] The room "' + room + '" does not exist!');
            }
        },
        switching: false,
        /**
         * Loads a given room and adds it to the stage. Useful for embedding prefabs and UI screens.
         * @param  {string} roomName The name of a room to add to the stage
         * @returns {Room} The newly created room
         */
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
            deadPool.length = 0;
            var template = ct.rooms.templates[roomName];
            ct.viewWidth = ct.roomWidth = template.width;
            ct.viewHeight = ct.roomHeight = template.height;
            ct.pixiApp.renderer.resize(template.width, template.height);
            ct.rooms.current = ct.room = new Room(template);
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
        /**
         * The name of the starting room, as it was set in ct.IDE.
         * @type {string}
         */
        starting: '@startroom@',
        /**
         * The current room, same as `ct.room`
         * @type {Room}
         */
        current: null
    };
})();
/**
 * The current room
 * @type {Room}
 */
ct.room = null;

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

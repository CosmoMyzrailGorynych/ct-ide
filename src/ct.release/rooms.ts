import {u} from './u';
import {Background, backgrounds} from './backgrounds';
import {Copy, templates} from './templates';
import {Tilemap, tilemaps} from './tilemaps';
import {Camera} from './camera';
import {ctjsGame, deadPool} from '.';
import {ExportedRoom} from './../node_requires/exporter/_exporterContracts';
import * as PIXI from 'node_modules/pixi.js';

type RoomMergeResult = {
    copies: Copy[];
    tileLayers: Tilemap[];
    backgrounds: Background[];
};

export class Room extends PIXI.Container<PIXI.DisplayObject> {
    static roomId = 0;
    static getNewId(): number {
        this.roomId++;
        return this.roomId;
    }
    /**
     * A unique number you can use to differ your rooms.
     */
    uid: number;
    /**
     * Whether or not this room is positioned as a UI layer.
     * See [here](https://docs.ctjs.rocks/tips-n-tricks/game-and-ui-coordinates.html)
     * for more info on UI layers.
     */
    isUi: boolean;
    kill = false;
    tileLayers: Tilemap[] = [];
    backgrounds: Background[] = [];
    timer1 = 0;
    timer2 = 0;
    timer3 = 0;
    timer4 = 0;
    timer5 = 0;
    timer6 = 0;
    /** The name of this room. */
    name: string;
    /** A backlink to the template data that was used during the creation of this room. */
    template: ExportedRoom;
    /** A template name to follow around. Works with top-level rooms only. */
    follow: string | -1;
    /**
     * Called when this room is created.
     * ⚠ This is a combination of several events and it is not recommended to call it
     * without knowing exactly what you're doing.
     */
    onCreate: () => void;
    /**
     * Called on each frame.
     * ⚠ This is a combination of several events and it is not recommended to call it
     * without knowing exactly what you're doing.
     */
    onStep: () => void;
    /**
     * Called on each frame, after all the onStep events were executed.
     * ⚠ This is a combination of several events and it is not recommended to call it
     * without knowing exactly what you're doing.
     */
    onDraw: () => void;
    /**
     * Called when this room is switched (applies to top-level rooms only).
     * ⚠ This is a combination of several events and it is not recommended to call it
     * without knowing exactly what you're doing.
     */
    onLeave: () => void;
    constructor(template: ExportedRoom) {
        super();
        this.x = this.y = 0;
        this.sortableChildren = true;
        this.uid = Room.getNewId();
        if (!ctjsGame.room) {
            ctjsGame.room = ctjsGame.rooms.current = this;
        }
        if (template) {
            this.onCreate = template.onCreate;
            this.onStep = template.onStep;
            this.onDraw = template.onDraw;
            this.onLeave = template.onLeave;
            this.template = template;
            this.name = template.name;
            this.isUi = template.isUi;
            this.follow = template.follow;
            if (template.extends) {
                Object.assign(this, template.extends);
            }
            if (this === ctjsGame.room) {
                (ctjsGame.pixiApp.renderer as PIXI.Renderer).background.color =
                    u.hexToPixi(this.template.backgroundColor);
            }
            /*!%beforeroomoncreate%*/
            for (let i = 0, li = template.bgs.length; i < li; i++) {
                // Need to put additional properties like parallax here,
                // so we don't use ct.backgrounds.add
                const bg = new Background(
                    template.bgs[i].texture,
                    null,
                    template.bgs[i].depth,
                    template.bgs[i].exts
                );
                this.addChild(bg);
            }
            for (let i = 0, li = template.tiles.length; i < li; i++) {
                const tl = new Tilemap(template.tiles[i]);
                tl.cache();
                this.tileLayers.push(tl);
                this.addChild(tl);
            }
            for (let i = 0, li = template.objects.length; i < li; i++) {
                const copy = template.objects[i];
                const exts = copy.exts || {};
                const customProperties = copy.customProperties || {};
                templates.copyIntoRoom(
                    copy.template,
                    copy.x,
                    copy.y,
                    this,
                    {
                        ...exts,
                        ...customProperties,
                        scaleX: copy.scale.x,
                        scaleY: copy.scale.y,
                        rotation: copy.rotation,
                        alpha: copy.opacity,
                        tint: copy.tint
                    }
                );
            }
        }
        return this;
    }
    get x(): number {
        return -this.position.x;
    }
    set x(value: number) {
        this.position.x = -value;
    }
    get y(): number {
        return -this.position.y;
    }
    set y(value: number) {
        this.position.y = -value;
    }
}
Room.roomId = 0;

let nextRoom: string;
export const rooms = {
    /**
     * All the existing room templates that can be used in the game.
     * It is usually prefilled by ct.IDE.
     */
    templates: {} as Record<string, ExportedRoom>,
    /** The current top-level room in the game. */
    current: null as Room,
    /**
     * An object that contains arrays of currently present rooms.
     * These include the current room (`ctjsGame.room`), as well as any rooms
     * appended or prepended through `rooms.append` and `rooms.prepend`.
     */
    list: {} as Record<string, Room[]>,
    /**
     * Creates and adds a background to the current room, at the given depth.
     * @param {string} texture The name of the texture to use
     * @param {number} depth The depth of the new background
     * @returns {Background} The created background
     */
    addBg(texture: string, depth: number): Background {
        const bg = new Background(texture, null, depth);
        ctjsGame.room.addChild(bg);
        return bg;
    },
    /**
     * Adds a new empty tile layer to the room, at the given depth
     * @param depth The depth of the layer
     * @returns The created tile layer
     * @deprecated Use ct.tilemaps.create instead.
     */
    addTileLayer(depth: number): Tilemap {
        return tilemaps.create(depth);
    },
    /**
     * Clears the current stage, removing all rooms with copies, tile layers, backgrounds,
     * and other potential entities.
     * @returns {void}
     */
    clear(): void {
        ctjsGame.stage.children.length = 0;
        ctjsGame.stack = [];
        for (const i in templates.list) {
            templates.list[i] = [];
        }
        for (const i in backgrounds.list) {
            backgrounds.list[i] = [];
        }
        rooms.list = {};
        for (const name in rooms.templates) {
            rooms.list[name] = [];
        }
    },
    /**
     * This method safely removes a previously appended/prepended room from the stage.
     * It will trigger "On Leave" for a room and "On Destroy" event
     * for all the copies of the removed room.
     * The room will also have `this.kill` set to `true` in its event, if it comes in handy.
     * This method cannot remove `ctjsGame.room`, the main room.
     * @param {Room} room The `room` argument must be a reference
     * to the previously created room.
     * @returns {void}
     */
    remove(room: Room): void {
        if (!(room instanceof Room)) {
            if (typeof room === 'string') {
                console.error('[ct.rooms.remove] To remove a room, you should provide a reference to it (to an object), not its name. Provided value:', room);
                throw new Error('[ct.rooms.remove] Invalid argument type');
            }
            throw new Error('[rooms] An attempt to remove a room that is not actually a room! Provided value:' + room);
        }
        const ind = rooms.list[room.name].indexOf(room);
        if (ind !== -1) {
            rooms.list[room.name].splice(ind, 1);
        } else {
            // eslint-disable-next-line no-console
            console.warn('[rooms] Removing a room that was not found in rooms.list. This is strange…');
        }
        room.kill = true;
        ctjsGame.stage.removeChild(room);
        for (const copy of room.children) {
            if (copy instanceof Copy) {
                copy.kill = true;
            }
        }
        room.onLeave();
        rooms.onLeave.apply(room);
    },
    /**
     * Switches to the given room. Note that this transition happens at the end
     * of the frame, so the name of a new room may be overridden.
     */
    'switch'(roomName: string): void {
        if (rooms.templates[roomName]) {
            nextRoom = roomName;
            rooms.switching = true;
        } else {
            console.error('[rooms] The room "' + roomName + '" does not exist!');
        }
    },
    switching: false,
    /**
     * Restarts the current room.
     * @returns {void}
     */
    restart(): void {
        rooms.switch(ctjsGame.room.name);
    },
    /**
     * Creates a new room and adds it to the stage, separating its draw stack
     * from existing ones.
     * This room is added to `ct.stage` after all the other rooms.
     * @param {string} roomName The name of the room to be appended
     * @param {object} [exts] Any additional parameters applied to the new room.
     * Useful for passing settings and data to new widgets and prefabs.
     * @returns {Room} A newly created room
     */
    append(roomName: string, exts?: Record<string, unknown>): Room {
        if (!(roomName in rooms.templates)) {
            throw new Error(`[ct.rooms.append] append failed: the room ${roomName} does not exist!`);
        }
        const room = new Room(rooms.templates[roomName]);
        if (exts) {
            Object.assign(room, exts);
        }
        ctjsGame.stage.addChild(room);
        room.onCreate();
        rooms.onCreate.apply(room);
        rooms.list[roomName].push(room);
        return room;
    },
    /**
     * Creates a new room and adds it to the stage, separating its draw stack
     * from existing ones.
     * This room is added to `ct.stage` before all the other rooms.
     * @param {string} roomName The name of the room to be prepended
     * @param {object} [exts] Any additional parameters applied to the new room.
     * Useful for passing settings and data to new widgets and prefabs.
     * @returns {Room} A newly created room
     */
    prepend(roomName: string, exts?: Record<string, unknown>): Room {
        if (!(roomName in rooms.templates)) {
            throw new Error(`[rooms] prepend failed: the room ${roomName} does not exist!`);
        }
        const room = new Room(rooms.templates[roomName]);
        if (exts) {
            Object.assign(room, exts);
        }
        ctjsGame.stage.addChildAt(room, 0);
        room.onCreate();
        rooms.onCreate.apply(room);
        rooms.list[roomName].push(room);
        return room;
    },
    /**
     * Merges a given room into the current one. Skips room's OnCreate event.
     *
     * @param roomName The name of the room that needs to be merged
     * @returns Arrays of created copies, backgrounds, tile layers,
     * added to the current room (`ctjsGame.room`). Note: it does not get updated,
     * so beware of memory leaks if you keep a reference to this array for a long time!
     */
    merge(roomName: string): RoomMergeResult | false {
        if (!(roomName in rooms.templates)) {
            console.error(`[rooms] merge failed: the room ${roomName} does not exist!`);
            return false;
        }
        const generated: RoomMergeResult = {
            copies: [],
            tileLayers: [],
            backgrounds: []
        };
        const template = rooms.templates[roomName];
        const target = ctjsGame.room;
        for (const t of template.bgs) {
            const bg = new Background(t.texture, null, t.depth, t.exts);
            target.backgrounds.push(bg);
            target.addChild(bg);
            generated.backgrounds.push(bg);
        }
        for (const t of template.tiles) {
            const tl = new Tilemap(t);
            target.tileLayers.push(tl);
            target.addChild(tl);
            generated.tileLayers.push(tl);
            tl.cache();
        }
        for (const t of template.objects) {
            const c = templates.copyIntoRoom(t.template, t.x, t.y, target, {
                tx: t.tx || 1,
                ty: t.ty || 1,
                tr: t.tr || 0
            });
            generated.copies.push(c);
        }
        return generated;
    },
    forceSwitch(roomName?: string): void {
        if (nextRoom) {
            roomName = nextRoom;
        }
        if (ctjsGame.room) {
            rooms.rootRoomOnLeave.apply(ctjsGame.room);
            ctjsGame.room.onLeave();
            rooms.onLeave.apply(ctjsGame.room);
            ctjsGame.room = void 0;
        }
        rooms.clear();
        deadPool.length = 0;
        var template = rooms.templates[roomName];
        ctjsGame.roomWidth = template.width;
        ctjsGame.roomHeight = template.height;
        ctjsGame.camera = new Camera(
            ctjsGame.roomWidth / 2,
            ctjsGame.roomHeight / 2,
            ctjsGame.roomWidth,
            ctjsGame.roomHeight
        );
        if (template.cameraConstraints) {
            ctjsGame.camera.minX = template.cameraConstraints.x1;
            ctjsGame.camera.maxX = template.cameraConstraints.x2;
            ctjsGame.camera.minY = template.cameraConstraints.y1;
            ctjsGame.camera.maxY = template.cameraConstraints.y2;
        }
        ctjsGame.pixiApp.renderer.resize(template.width, template.height);
        ctjsGame.rooms.current = ctjsGame.room = new Room(template);
        ctjsGame.stage.addChild(ctjsGame.room);
        rooms.rootRoomOnCreate.apply(ctjsGame.room);
        ctjsGame.room.onCreate();
        rooms.onCreate.apply(ctjsGame.room);
        rooms.list[roomName].push(ctjsGame.room);
        /*!%switch%*/
        ctjsGame.camera.manageStage();
        rooms.switching = false;
        nextRoom = void 0;
    },
    onCreate(): void {
        /*!%roomoncreate%*/
    },
    onLeave(): void {
        /*!%roomonleave%*/
    },
    beforeStep(): void {
        /*!%beforeroomstep%*/
    },
    afterStep(): void {
        /*!%afterroomstep%*/
    },
    beforeDraw(): void {
        /*!%beforeroomdraw%*/
    },
    afterDraw(): void {
        /*!%afterroomdraw%*/
    },
    rootRoomOnCreate(): void {
        /*!@rootRoomOnCreate@*/
    },
    rootRoomOnStep(): void {
        /*!@rootRoomOnStep@*/
    },
    rootRoomOnDraw(): void {
        /*!@rootRoomOnDraw@*/
    },
    rootRoomOnLeave(): void {
        /*!@rootRoomOnLeave@*/
    },
    /**
     * The name of the starting room, as it was set in ct.IDE.
     * @type {string}
     */
    starting: '/*!@startroom@*/'
};

/*!@rooms@*/
/*!%rooms%*/

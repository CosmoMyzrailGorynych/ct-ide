import uLib from './u';
import backgrounds, {Background} from './backgrounds';
import templatesLib, {Copy} from './templates';
import tilemapsLib, {Tilemap} from './tilemaps';
import mainCamera from './camera';
import {deadPool, pixiApp, stack} from '.';
import {ExportedRoom} from './../node_requires/exporter/_exporterContracts';
import {updateViewport} from 'fittoscreen';
import {runBehaviors} from './behaviors';

import * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

type RoomMergeResult = {
    copies: Copy[];
    tileLayers: Tilemap[];
    backgrounds: Background[];
};

export class Room extends PIXI.Container<pixiMod.DisplayObject> {
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
    /** Time for the next run of the 1st timer, in seconds. */
    timer1 = 0;
    /** Time for the next run of the 2nd timer, in seconds. */
    timer2 = 0;
    /** Time for the next run of the 3rd timer, in seconds. */
    timer3 = 0;
    /** Time for the next run of the 4th timer, in seconds. */
    timer4 = 0;
    /** Time for the next run of the 5th timer, in seconds. */
    timer5 = 0;
    /** Time for the next run of the 6th timer, in seconds. */
    timer6 = 0;
    /**
     * The list of currently active behaviors. For editing this list,
     * use `behaviors.add` and `behaviors.remove`
     */
    readonly behaviors: string[];
    viewWidth: number;
    viewHeight: number;
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
        if (template) {
            this.onCreate = template.onCreate;
            this.onStep = template.onStep;
            this.onDraw = template.onDraw;
            this.onLeave = template.onLeave;
            this.template = template;
            this.name = template.name;
            this.isUi = template.isUi;
            this.follow = template.follow;
            this.viewWidth = template.width;
            this.viewHeight = template.height;
            this.behaviors = [...template.behaviors];
            if (template.extends) {
                Object.assign(this, template.extends);
            }
            if (this === roomsLib.current) {
                (pixiApp.renderer as pixiMod.Renderer).background.color =
                    uLib.hexToPixi(this.template.backgroundColor);
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
                templatesLib.copyIntoRoom(
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
        } else {
            this.behaviors = [];
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
    [key: string]: any;
}
Room.roomId = 0;

let nextRoom: string;
const roomsLib = {
    /**
     * All the existing room templates that can be used in the game.
     * It is usually prefilled by ct.IDE.
     */
    templates: {} as Record<string, ExportedRoom>,
    Room,
    /** The current top-level room in the game. */
    current: null as Room,
    /**
     * An object that contains arrays of currently present rooms.
     * These include the current room (`rooms.current`), as well as any rooms
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
        roomsLib.current.addChild(bg);
        return bg;
    },
    /**
     * Adds a new empty tile layer to the room, at the given depth
     * @param depth The depth of the layer
     * @returns The created tile layer
     * @deprecated Use ct.tilemaps.create instead.
     */
    addTileLayer(depth: number): Tilemap {
        return tilemapsLib.create(depth);
    },
    /**
     * Clears the current stage, removing all rooms with copies, tile layers, backgrounds,
     * and other potential entities.
     * @returns {void}
     */
    clear(): void {
        pixiApp.stage.children.length = 0;
        stack.length = 0;
        for (const i in templatesLib.list) {
            templatesLib.list[i] = [];
        }
        for (const i in backgrounds.list) {
            backgrounds.list[i] = [];
        }
        roomsLib.list = {};
        for (const name in roomsLib.templates) {
            roomsLib.list[name] = [];
        }
    },
    /**
     * This method safely removes a previously appended/prepended room from the stage.
     * It will trigger "On Leave" for a room and "On Destroy" event
     * for all the copies of the removed room.
     * The room will also have `this.kill` set to `true` in its event, if it comes in handy.
     * This method cannot remove `rooms.current`, the main room.
     * @param {Room} room The `room` argument must be a reference
     * to the previously created room.
     * @returns {void}
     */
    remove(room: Room): void {
        if (!(room instanceof Room)) {
            if (typeof room === 'string') {
                console.error('[rooms.remove] To remove a room, you should provide a reference to it (to an object), not its name. Provided value:', room);
                throw new Error('[rooms.remove] Invalid argument type');
            }
            throw new Error('[rooms] An attempt to remove a room that is not actually a room! Provided value:' + room);
        }
        const ind = roomsLib.list[room.name].indexOf(room);
        if (ind !== -1) {
            roomsLib.list[room.name].splice(ind, 1);
        } else {
            // eslint-disable-next-line no-console
            console.warn('[rooms] Removing a room that was not found in rooms.list. This is strange…');
        }
        room.kill = true;
        pixiApp.stage.removeChild(room);
        for (const copy of room.children) {
            if (copy instanceof Copy) {
                copy.kill = true;
            }
        }
        room.onLeave();
        roomsLib.onLeave.apply(room);
    },
    /**
     * Switches to the given room. Note that this transition happens at the end
     * of the frame, so the name of a new room may be overridden.
     */
    'switch'(roomName: string): void {
        if (roomsLib.templates[roomName]) {
            nextRoom = roomName;
            roomsLib.switching = true;
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
        roomsLib.switch(roomsLib.current.name);
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
        if (!(roomName in roomsLib.templates)) {
            throw new Error(`[rooms.append] append failed: the room ${roomName} does not exist!`);
        }
        const room = new Room(roomsLib.templates[roomName]);
        if (exts) {
            Object.assign(room, exts);
        }
        pixiApp.stage.addChild(room);
        room.onCreate.apply(room);
        roomsLib.onCreate.apply(room);
        roomsLib.list[roomName].push(room);
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
        if (!(roomName in roomsLib.templates)) {
            throw new Error(`[rooms] prepend failed: the room ${roomName} does not exist!`);
        }
        const room = new Room(roomsLib.templates[roomName]);
        if (exts) {
            Object.assign(room, exts);
        }
        pixiApp.stage.addChildAt(room, 0);
        room.onCreate.apply(room);
        roomsLib.onCreate.apply(room);
        roomsLib.list[roomName].push(room);
        return room;
    },
    /**
     * Merges a given room into the current one. Skips room's OnCreate event.
     *
     * @param roomName The name of the room that needs to be merged
     * @returns Arrays of created copies, backgrounds, tile layers,
     * added to the current room (`rooms.current`). Note: it does not get updated,
     * so beware of memory leaks if you keep a reference to this array for a long time!
     */
    merge(roomName: string): RoomMergeResult | false {
        if (!(roomName in roomsLib.templates)) {
            console.error(`[rooms] merge failed: the room ${roomName} does not exist!`);
            return false;
        }
        const generated: RoomMergeResult = {
            copies: [],
            tileLayers: [],
            backgrounds: []
        };
        const template = roomsLib.templates[roomName];
        const target = roomsLib.current;
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
            const c = templatesLib.copyIntoRoom(t.template, t.x, t.y, target, {
                tx: t.scale.x || 1,
                ty: t.scale.y || 1,
                tr: t.rotation || 0
            });
            generated.copies.push(c);
        }
        return generated;
    },
    forceSwitch(roomName?: string): void {
        if (nextRoom) {
            roomName = nextRoom;
        }
        if (roomsLib.current) {
            roomsLib.rootRoomOnLeave.apply(roomsLib.current);
            roomsLib.current.onLeave();
            roomsLib.onLeave.apply(roomsLib.current);
            roomsLib.current = void 0;
        }
        roomsLib.clear();
        deadPool.length = 0;
        var template = roomsLib.templates[roomName];
        mainCamera.reset(
            template.width / 2,
            template.height / 2,
            template.width,
            template.height
        );
        if (template.cameraConstraints) {
            mainCamera.minX = template.cameraConstraints.x1;
            mainCamera.maxX = template.cameraConstraints.x2;
            mainCamera.minY = template.cameraConstraints.y1;
            mainCamera.maxY = template.cameraConstraints.y2;
        }
        roomsLib.current = new Room(template);
        pixiApp.stage.addChild(roomsLib.current);
        updateViewport();
        roomsLib.rootRoomOnCreate.apply(roomsLib.current);
        roomsLib.current.onCreate();
        roomsLib.onCreate.apply(roomsLib.current);
        roomsLib.list[roomName].push(roomsLib.current);
        /*!%switch%*/
        mainCamera.manageStage();
        roomsLib.switching = false;
        nextRoom = void 0;
    },
    onCreate(this: Room): void {
        /*!%roomoncreate%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'rooms', 'thisOnCreate');
        }
    },
    onLeave(this: Room): void {
        /*!%roomonleave%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'rooms', 'thisOnDestroy');
        }
    },
    beforeStep(this: Room): void {
        /*!%beforeroomstep%*/
    },
    afterStep(this: Room): void {
        /*!%afterroomstep%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'rooms', 'thisOnStep');
        }
    },
    beforeDraw(this: Room): void {
        /*!%beforeroomdraw%*/
    },
    afterDraw(this: Room): void {
        /*!%afterroomdraw%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'rooms', 'thisOnDraw');
        }
    },
    rootRoomOnCreate(this: Room): void {
        /*!@rootRoomOnCreate@*/
    },
    rootRoomOnStep(this: Room): void {
        /*!@rootRoomOnStep@*/
    },
    rootRoomOnDraw(this: Room): void {
        /*!@rootRoomOnDraw@*/
    },
    rootRoomOnLeave(this: Room): void {
        /*!@rootRoomOnLeave@*/
    },
    /**
     * The name of the starting room, as it was set in ct.IDE.
     * @type {string}
     */
    starting: '/*!@startroom@*/'
};
export default roomsLib;

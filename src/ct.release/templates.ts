import * as PIXI from 'node_modules/pixi.js';
import {CtjsTexture, res} from './res';
import {Background} from './backgrounds';
import {Tilemap} from './tilemaps';
import {Room} from './rooms';
import {ctjsGame, copyTypeSymbol} from '.';

import {ExportedTemplate, TextureShape} from '../node_requires/exporter/_exporterContracts';

const textureAccessor = Symbol('texture');
const zeroDirectionAccessor = Symbol('zeroDirection');
const hspeedAccessor = Symbol('hspeed');
const vspeedAccessor = Symbol('vspeed');
let uid = 0;

export class Copy extends PIXI.AnimatedSprite {
    uid: number;
    /** The name of the template from which the copy was created */
    template: string | null;
    /** The collision shape of a copy */
    shape: TextureShape;
    /** The horizontal location of a copy in the previous frame */
    xprev: number;
    /** The vertical location of a copy in the previous frame */
    yprev: number;
    /**
     * The starting location of a copy, meaning the point where it was created —
     * either by placing it in a room with ct.IDE or by calling `templates.copy`.
     */
    xstart: number;
    /**
     * The starting location of a copy, meaning the point where it was created —
     * either by placing it in a room with ct.IDE or by calling `templates.copy`.
     */
    ystart: number;
    /** The acceleration that pulls a copy at each frame */
    gravity: number;
    /** The direction of acceleration that pulls a copy at each frame */
    gravityDir: number;
    /** If set to `true`, the copy will be destroyed by the end of a frame. */
    kill: boolean;
    /** Time for the next run of the 1st timer, in seconds. */
    timer1: number;
    /** Time for the next run of the 2nd timer, in seconds. */
    timer2: number;
    /** Time for the next run of the 3rd timer, in seconds. */
    timer3: number;
    /** Time for the next run of the 4th timer, in seconds. */
    timer4: number;
    /** Time for the next run of the 5th timer, in seconds. */
    timer5: number;
    /** Time for the next run of the 6th timer, in seconds. */
    timer6: number;

    /** Set to true to disable this copy from automatic realignment with Camera.realign */
    skipRealign?: boolean;

    // Private-ish values
    [textureAccessor]: string;
    [zeroDirectionAccessor]: number;
    [hspeedAccessor]: number;
    [vspeedAccessor]: number;
    [copyTypeSymbol]: true = true;

    onStep: () => void;
    onDraw: () => void;
    onCreate: () => void;
    onDestroy: () => void;

    /**
     * Creates an instance of Copy.
     * @param {string} template The name of the template to copy
     * @param {number} [x] The x coordinate of a new copy. Defaults to 0.
     * @param {number} [y] The y coordinate of a new copy. Defaults to 0.
     * @param {object} [exts] An optional object with additional properties
     * that will exist prior to a copy's OnCreate event
     * @param {PIXI.DisplayObject|Room} [container] A container to set as copy's parent
     * before its OnCreate event. Defaults to ct.room.
     * @memberof Copy
     */
    // eslint-disable-next-line complexity, max-lines-per-function
    constructor(
        template: string,
        x: number,
        y: number,
        exts?: {
            scaleX?: number;
            scaleY?: number;
            tex?: string;
            depth?: number;
        },
        container?: Room
    ) {
        container = container || ctjsGame.room;
        let textures: PIXI.Texture[] = [PIXI.Texture.EMPTY];
        var t;
        if (template) {
            if (!(template in templates.templates)) {
                throw new Error(`[ct.templates] An attempt to create a copy of a non-existent template \`${template}\` detected. A typo?`);
            }
            t = templates.templates[template];
            if (t.texture && t.texture !== '-1') {
                textures = res.getTexture(t.texture);
            }
        }
        super(textures);
        if (template) {
            this[textureAccessor] = t.texture;
            this.anchor.x = textures[0].defaultAnchor.x;
            this.anchor.y = textures[0].defaultAnchor.y;
            this.anchor.x = t.anchorX || 0;
            this.anchor.y = t.anchorY || 0;
            this.template = template;
            this.parent = container;
            this.blendMode = t.blendMode || PIXI.BLEND_MODES.NORMAL;
            this.loop = t.loopAnimation;
            this.animationSpeed = t.animationFPS / 60;
            if (t.visible === false) { // ignore nullish values
                this.visible = false;
            }
            if (t.playAnimationOnStart) {
                this.play();
            }
            if (t.extends) {
                Object.assign(this, t.extends);
            }
        }
        const oldScale = this.scale;
        Object.defineProperty(this, 'scale', {
            get: () => oldScale,
            set: value => {
                this.scale.x = this.scale.y = Number(value);
            }
        });
        // it is defined in main.js
        // eslint-disable-next-line no-undef
        this[copyTypeSymbol] = true;
        this.position.set(x || 0, y || 0);
        this.xprev = this.xstart = this.x;
        this.yprev = this.ystart = this.y;
        this[hspeedAccessor] = 0;
        this[vspeedAccessor] = 0;
        this[zeroDirectionAccessor] = 0;
        this.speed = this.direction = this.gravity = 0;
        this.gravityDir = 90;
        this.depth = 0;
        this.timer1 = this.timer2 = this.timer3 = this.timer4 = this.timer5 = this.timer6 = 0;
        if (exts) {
            Object.assign(this, exts);
            if (exts.scaleX) {
                this.scale.x = exts.scaleX;
            }
            if (exts.scaleY) {
                this.scale.y = exts.scaleY;
            }
        }
        this.uid = ++uid;
        if (template) {
            Object.assign(this, {
                template,
                zIndex: t.depth,
                onStep: t.onStep,
                onDraw: t.onDraw,
                onCreate: t.onCreate,
                onDestroy: t.onDestroy
            });
            if (exts && exts.tex !== void 0) {
                this.shape = res.getTextureShape(exts.tex || -1);
            } else {
                this.shape = res.getTextureShape(t.texture || -1);
            }
            if (exts && exts.depth !== void 0) {
                this.depth = exts.depth;
            }
            if (templates.list[template]) {
                templates.list[template].push(this);
            } else {
                templates.list[template] = [this];
            }
            this.onBeforeCreateModifier();
            templates.templates[template].onCreate.apply(this);
        }
        return this;
    }

    /**
     * The name of the current copy's texture, or -1 for an empty texture.
     * @param {string} value The name of the new texture
     * @type {(string|number)}
     */
    set tex(value: string) {
        if (this[textureAccessor] === value) {
            return;
        }
        var {playing} = this;
        this.textures = res.getTexture(value);
        this[textureAccessor] = value;
        this.shape = res.getTextureShape(value);
        this.anchor.x = (this.textures[0] as CtjsTexture).defaultAnchor.x;
        this.anchor.y = (this.textures[0] as CtjsTexture).defaultAnchor.y;
        if (playing) {
            this.play();
        }
    }
    get tex(): string {
        return this[textureAccessor];
    }
    /**
     * The speed of a copy that is used in `this.move()` calls and similar function
     */
    get speed(): number {
        return Math.hypot(this.hspeed, this.vspeed);
    }
    set speed(value: number) {
        if (value === 0) {
            this[zeroDirectionAccessor] = this.direction;
            this.hspeed = this.vspeed = 0;
            return;
        }
        if (this.speed === 0) {
            const restoredDir = this[zeroDirectionAccessor];
            this[hspeedAccessor] = value * Math.cos(restoredDir * Math.PI / 180);
            this[vspeedAccessor] = value * Math.sin(restoredDir * Math.PI / 180);
            return;
        }
        var multiplier = value / this.speed;
        this.hspeed *= multiplier;
        this.vspeed *= multiplier;
    }
    /** The horizontal speed of a copy */
    get hspeed(): number {
        return this[hspeedAccessor];
    }
    set hspeed(value: number) {
        if (this.vspeed === 0 && value === 0) {
            this[zeroDirectionAccessor] = this.direction;
        }
        this[hspeedAccessor] = value;
    }
    /** The vertical speed of a copy */
    get vspeed(): number {
        return this[vspeedAccessor];
    }
    set vspeed(value: number) {
        if (this.hspeed === 0 && value === 0) {
            this[zeroDirectionAccessor] = this.direction;
        }
        this[vspeedAccessor] = value;
    }
    get direction(): number {
        if (this.speed === 0) {
            return this[zeroDirectionAccessor];
        }
        return (Math.atan2(this.vspeed, this.hspeed) * 180 / Math.PI + 360) % 360;
    }
    /**
     * The moving direction of the copy, in degrees, starting with 0 at the right side
     * and going with 90 facing upwards, 180 facing left, 270 facing down.
     * This parameter is used by `this.move()` call.
     * @param {number} value New direction
     * @type {number}
     */
    set direction(value: number) {
        this[zeroDirectionAccessor] = value;
        if (this.speed > 0) {
            var {speed} = this;
            this.hspeed = speed * Math.cos(value * Math.PI / 180);
            this.vspeed = speed * Math.sin(value * Math.PI / 180);
        }
    }

    /**
     * The relative position of a copy in a drawing stack.
     * Higher values will draw the copy on top of those with lower ones
     * @deprecated Use this.zIndex instead
     */
    get depth(): number {
        return this.zIndex;
    }
    /**
     * @deprecated Use this.zIndex instead
     */
    set depth(v: number) {
        this.zIndex = v;
    }

    /**
     * Performs a movement step, reading such parameters as `gravity`, `speed`,
     * `direction`.
     * @returns {void}
     */
    move(): void {
        if (this.gravity) {
            this.hspeed += this.gravity * ctjsGame.delta *
                Math.cos(this.gravityDir * Math.PI / 180);
            this.vspeed += this.gravity * ctjsGame.delta *
                Math.sin(this.gravityDir * Math.PI / 180);
        }
        this.x += this.hspeed * ctjsGame.delta;
        this.y += this.vspeed * ctjsGame.delta;
    }
    /**
     * Adds a speed vector to the copy, accelerating it by a given delta speed
     * in a given direction.
     * @param {number} spd Additive speed
     * @param {number} dir The direction in which to apply additional speed
     * @returns {void}
     */
    addSpeed(spd: number, dir: number): void {
        this.hspeed += spd * Math.cos(dir * Math.PI / 180);
        this.vspeed += spd * Math.sin(dir * Math.PI / 180);
    }

    /**
     * Returns the room that owns the current copy
     * @returns {Room} The room that owns the current copy
     */
    getRoom(): Room {
        let {parent} = this;
        while (!(parent instanceof Room)) {
            ({parent} = parent);
        }
        return parent;
    }

    // eslint-disable-next-line class-methods-use-this
    onBeforeCreateModifier(): void {
        // Filled by ct.IDE and catmods
        /*%onbeforecreate%*/
    }
}
declare class LivingCopy extends Copy {
    kill: true
}

const onCreateModifier = function () {
    /*%oncreate%*/
};

/**
 * An object with properties and methods for manipulating templates and copies,
 * mainly for finding particular copies and creating new ones.
 */
export const templates = {
    Copy,
    /**
     * An object that contains arrays of copies of all templates.
     * @type {Object.<string,Array<Copy>>}
     */
    list: {
        BACKGROUND: [],
        TILEMAP: []
    } as {
        BACKGROUND: Background[],
        TILEMAP: Tilemap[]
    } & Record<string, Copy[]>,
    /**
     * A map of all the templates of templates exported from ct.IDE.
     * @type {object}
     */
    templates: {} as Record<string, ExportedTemplate>,
    /**
     * Creates a new copy of a given template inside a specific room.
     * @param template The name of the template to use
     * @param [x] The x coordinate of a new copy. Defaults to 0.
     * @param [y] The y coordinate of a new copy. Defaults to 0.
     * @param [room] The room to which add the copy.
     * Defaults to the current room.
     * @param [exts] An optional object which parameters will be applied
     * to the copy prior to its OnCreate event.
     * @returns The created copy.
     */
    copyIntoRoom(template: string, x = 0, y = 0, room: Room, exts: Record<string, unknown>): Copy {
        // An advanced constructor. Returns a Copy
        if (!room || !(room instanceof Room)) {
            throw new Error(`Attempt to spawn a copy of template ${template} inside an invalid room. Room's value provided: ${room}`);
        }
        const obj = new Copy(template, x, y, exts);
        room.addChild(obj);
        ctjsGame.stack.push(obj);
        onCreateModifier.apply(obj);
        return obj;
    },
    /**
     * Creates a new copy of a given template inside the current root room.
     * A shorthand for `templates.copyIntoRoom(template, x, y, ct.room, exts)`
     * @param template The name of the template to use
     * @param [x] The x coordinate of a new copy. Defaults to 0.
     * @param [y] The y coordinate of a new copy. Defaults to 0.
     * @param [exts] An optional object which parameters will be applied
     * to the copy prior to its OnCreate event.
     * @returns The created copy.
     */
    copy(template: string, x = 0, y = 0, exts: Record<string, unknown>): Copy {
        return templates.copyIntoRoom(template, x, y, ctjsGame.room, exts);
    },
    /**
     * Applies a function to each copy in the current room
     * @param {Function} func The function to apply
     * @returns {void}
     */
    each(func: (this: Copy) => void): void {
        for (const copy of ctjsGame.stack) {
            if (!(copy instanceof Copy)) {
                continue; // Skip backgrounds and tile layers
            }
            func.apply(copy, this);
        }
    },
    /**
     * Applies a function to a given object (e.g. to a copy)
     * @param {Copy} obj The copy to perform function upon.
     * @param {Function} function The function to be applied.
     */
    withCopy<T>(obj: T, func: (this: T) => void): void {
        func.apply(obj, this);
    },
    /**
     * Applies a function to every copy of the given template name
     * @param {string} template The name of the template to perform function upon.
     * @param {Function} function The function to be applied.
     */
    withTemplate(
        template: string,
        func: (this: Copy) => void
    ): void {
        for (const copy of templates.list[template]) {
            func.apply(copy, this);
        }
    },
    /**
     * Checks whether there are any copies of this template's name.
     * Will throw an error if you pass an invalid template name.
     * @param {string} template The name of a template to check.
     * @returns {boolean} Returns `true` if at least one copy exists in a room;
     * `false` otherwise.
     */
    exists(template: string): boolean {
        if (!(template in templates.templates)) {
            throw new Error(`[ct.templates] templates.exists: There is no such template ${template}.`);
        }
        return templates.list[template].length > 0;
    },

    /**
     * Checks whether a given object is a ct.js copy.
     * @param {any} obj The object which needs to be checked.
     * @returns {boolean} Returns `true` if the passed object is a copy; `false` otherwise.
     */
    isCopy: ((obj: unknown): boolean => obj instanceof Copy) as {
        (obj: Copy): obj is Copy;
        (obj: unknown): false;
    },
    /**
     * Checks whether a given object exists in game's world.
     * Intended to be applied to copies, but may be used with other PIXI entities.
     */
    valid: ((obj: unknown): boolean => {
        if (obj instanceof Copy) {
            return !obj.kill;
        }
        if (obj instanceof PIXI.DisplayObject) {
            return Boolean(obj.position);
        }
        return Boolean(obj);
    }) as {
        (obj: Copy): obj is LivingCopy;
        (obj: PIXI.DisplayObject): obj is PIXI.DisplayObject;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj: unknown): boolean
    },

    beforeStep(): void {
        /*%beforestep%*/
    },
    afterStep(): void {
        /*%afterstep%*/
    },
    beforeDraw(): void {
        /*%beforedraw%*/
    },
    afterDraw(): void {
        /*%afterdraw%*/
    },
    onDestroy(): void {
        /*%ondestroy%*/
    }
};

/*@templates@*/
/*%templates%*/

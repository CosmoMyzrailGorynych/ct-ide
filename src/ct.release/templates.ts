/* eslint-disable no-underscore-dangle */
import resLib, {CtjsAnimation, CtjsTexture} from './res';
import {Background} from './backgrounds';
import {Tilemap} from './tilemaps';
import roomsLib, {Room} from './rooms';
import {runBehaviors} from './behaviors';
import {copyTypeSymbol, stack, deadPool} from '.';
import uLib from './u';

import type * as pixiMod from 'pixi.js';
declare var PIXI: typeof pixiMod;

import type {ExportedRoom, ExportedTemplate, TextureShape} from '../lib/exporter/_exporterContracts';
import {CopyButton, CopyPanel, baseClassToPixiClass} from './templateBaseClasses';

let uid = 0;

export interface ICopy {
    uid: number;
    /** The name of the template from which the copy was created */
    template: string | null;
    baseClass: ExportedTemplate['baseClass'];
    /** UI alignment information */
    align?: ExportedRoom['objects'][0]['align'];
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
    /**
     * The speed of a copy that is used in `this.move()` calls and similar function.
     * It is measured in pixels per frame.
     */
    speed: number;
    /**
     * The moving direction of the copy, in degrees, starting with 0 at the right side
     * and going with 90 facing upwards, 180 facing left, 270 facing down.
     * This parameter is used by `this.move()` call.
     * This is **not** the texture's rotation — for that, use this.angle.
     */
    direction: number;
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
    /**
     * The list of currently active behaviors. For editing this list,
     * use `behaviors.add` and `behaviors.remove`
     */
    readonly behaviors: string[];

    /** Set to true to disable this copy from automatic realignment with Camera.realign */
    skipRealign?: boolean;

    /**
     * The name of the current copy's texture, or -1 for an empty texture.
     * @param {string} value The name of the new texture
     * @type {(string|number)}
     */
    tex: string;
    /** The horizontal speed of a copy */
    hspeed: number;
    /** The vertical speed of a copy */
    vspeed: number;

    // Private-ish values
    /** Current texture.
     * @readonly
    */
    _tex: string | -1;
    _zeroDirection: number;
    _hspeed: number;
    _vspeed: number;
    [copyTypeSymbol]: true;
    onStep: () => void;
    onDraw: () => void;
    onBeforeCreateModifier: () => void;
    onCreate: () => void;
    onDestroy: () => void;
    _destroyed: boolean;
    /**
     * Performs a movement step, reading such parameters as `gravity`, `speed`,
     * `direction`.
     */
    move: (this: BasicCopy) => void;
    /**
     * Adds a speed vector to the copy, accelerating it by a given delta speed
     * in a given direction.
     * @param spd Additive speed
     * @param dir The direction in which to apply additional speed
     */
    addSpeed: (this: BasicCopy, spd: number, dir: number) => void;
    /**
     * Returns the room that owns the current copy
     * @returns The room that owns the current copy
     */
    getRoom: (this: BasicCopy) => Room;
}

interface IFocusableElement extends pixiMod.DisplayObject {
    readonly isFocused: boolean;
    blur(): void;
    focus(): void;
}
let focusedElement: IFocusableElement;
/**
 * @catnipIgnore
 */
export const getFocusedElement = () => focusedElement;
/**
 * @catnipIgnore
 */
export const blurFocusedElement = (): void => {
    focusedElement.blur();
};
/**
 * @catnipIgnore
 */
export const setFocusedElement = (elt: IFocusableElement): void => {
    if (focusedElement && focusedElement !== elt) {
        blurFocusedElement();
    }
    focusedElement = elt;
};

// Record<string, any> allows ct.js users to write any properties to their copies
// without typescript complaining.
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * An instance of a ct.js template. Ct.js cannot predict the base class
 * of a template here, so you may need to add `as Copy...` to further narrow down
 * the class.
 */
export type BasicCopy = Record<string, any> & pixiMod.DisplayObject & ICopy;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * @catnipIgnore
 */
export const CopyProto: Partial<BasicCopy> = {
    set tex(value: string) {
        if (this._tex === value) {
            return;
        }
        var {playing} = this;
        this.textures = resLib.getTexture(value);
        [this.texture] = this.textures;
        this._tex = value;
        this.shape = resLib.getTextureShape(value);
        this.hitArea = (this.textures as CtjsAnimation).hitArea;
        if (this.anchor) {
            this.anchor.x = (this.textures[0] as CtjsTexture).defaultAnchor.x;
            this.anchor.y = (this.textures[0] as CtjsTexture).defaultAnchor.y;
            if (playing) {
                this.play();
            }
        }
        if ('_bottomHeight' in this) { // Duck typing for CopyPanel
            uLib.reshapeNinePatch(this);
        }
    },
    get tex(): string {
        return this._tex;
    },
    get speed(): number {
        return Math.hypot(this.hspeed, this.vspeed);
    },
    set speed(value: number) {
        if (value === 0) {
            this._zeroDirection = this.direction;
            this.hspeed = this.vspeed = 0;
            return;
        }
        if (this.speed === 0) {
            const restoredDir = this._zeroDirection;
            this._hspeed = value * Math.cos(restoredDir * Math.PI / 180);
            this._vspeed = value * Math.sin(restoredDir * Math.PI / 180);
            return;
        }
        var multiplier = value / this.speed;
        this.hspeed *= multiplier;
        this.vspeed *= multiplier;
    },
    get hspeed(): number {
        return this._hspeed;
    },
    set hspeed(value: number) {
        if (this.vspeed === 0 && value === 0) {
            this._zeroDirection = this.direction;
        }
        this._hspeed = value;
    },
    get vspeed(): number {
        return this._vspeed;
    },
    set vspeed(value: number) {
        if (this.hspeed === 0 && value === 0) {
            this._zeroDirection = this.direction;
        }
        this._vspeed = value;
    },
    get direction(): number {
        if (this.speed === 0) {
            return this._zeroDirection;
        }
        return (Math.atan2(this.vspeed, this.hspeed) * 180 / Math.PI + 360) % 360;
    },
    set direction(value: number) {
        this._zeroDirection = value;
        if (this.speed > 0) {
            var {speed} = this;
            this.hspeed = speed * Math.cos(value * Math.PI / 180);
            this.vspeed = speed * Math.sin(value * Math.PI / 180);
        }
    },
    move(this: BasicCopy): void {
        if (this.gravity) {
            this.hspeed += this.gravity * uLib.time *
                    Math.cos(this.gravityDir * Math.PI / 180);
            this.vspeed += this.gravity * uLib.time *
                    Math.sin(this.gravityDir * Math.PI / 180);
        }
        this.x += this.hspeed * uLib.time;
        this.y += this.vspeed * uLib.time;
    },
    addSpeed(this: BasicCopy, spd: number, dir: number): void {
        this.hspeed += spd * Math.cos(dir * Math.PI / 180);
        this.vspeed += spd * Math.sin(dir * Math.PI / 180);
    },
    getRoom(this: BasicCopy): Room {
        let {parent} = this;
        while (!(parent instanceof Room)) {
            ({parent} = parent);
        }
        return parent;
    },
    onBeforeCreateModifier(): void {
        // Filled by ct.IDE and catmods
        /*!%onbeforecreate%*/
        /*!@onbeforecreate@*/
    }
};
type Mutable<T> = {-readonly[P in keyof T]: T[P]};

const assignExtends = (target: BasicCopy, exts: Record<string, unknown>) => {
    // Some base classes, like BitmapText, can preset tint during construction,
    // So we need to multiply it with the set tint to preserve the effect.
    let {tint} = target;
    if (exts.tint || exts.tint === 0) {
        tint = (new PIXI.Color(target.tint))
            .multiply(exts.tint as number)
            .toNumber();
    }
    Object.assign(target, exts);
    target.tint = tint;
};

// eslint-disable-next-line complexity, max-lines-per-function
/**
 * A factory function that when applied to a PIXI.DisplayObject instance,
 * augments it with ct.js Copy functionality.
 * @param {string} template The name of the template to copy
 * @param {PIXI.DisplayObject|Room} [container] A container to set as copy's parent
 * before its OnCreate event. Defaults to rooms.current.
 * @catnipIgnore
 */
// eslint-disable-next-line max-lines-per-function, max-params, complexity
const Copy = function (
    this: BasicCopy,
    x: number,
    y: number,
    template: ExportedTemplate,
    container: pixiMod.Container,
    exts: Record<string, unknown>
): ICopy {
    container = container || roomsLib.current;
    this[copyTypeSymbol] = true;
    if (template) {
        this.baseClass = template.baseClass;
        // Early linking so that `this.parent` is available in OnCreate events
        this.parent = container;
        if (template.baseClass === 'AnimatedSprite' || template.baseClass === 'NineSlicePlane') {
            this._tex = template.texture || -1;
        }
        (this as Mutable<typeof this>).behaviors = [...template.behaviors];
        if (template.visible === false) { // ignore nullish values
            this.visible = false;
        }
    } else {
        (this as Mutable<typeof this>).behaviors = [];
    }
    const oldScale = this.scale;
    Object.defineProperty(this, 'scale', {
        get: () => oldScale,
        set: value => {
            this.scale.x = this.scale.y = Number(value);
        }
    });
    this[copyTypeSymbol] = true;
    this.xprev = this.xstart = this.x = x;
    this.yprev = this.ystart = this.y = y;
    this._hspeed = 0;
    this._vspeed = 0;
    this._zeroDirection = 0;
    this.gravity = 0;
    // this.speed = this.direction = 0
    this.gravityDir = 90;
    this.zIndex = 0;
    this.timer1 = this.timer2 = this.timer3 = this.timer4 = this.timer5 = this.timer6 = 0;
    this.uid = ++uid;
    if (template) {
        Object.assign(this, {
            template: template.name,
            zIndex: template.depth,
            onStep: template.onStep,
            onDraw: template.onDraw,
            onBeforeCreateModifier: CopyProto.onBeforeCreateModifier,
            onCreate: template.onCreate,
            onDestroy: template.onDestroy
        });
        this.zIndex = template.depth;
        Object.assign(this, template.extends);
        if (exts) {
            assignExtends(this, exts);
        }
        if ('texture' in template && !this.shape) {
            this.shape = resLib.getTextureShape(template.texture || -1);
            if (typeof template.texture === 'string') {
                this.hitArea = resLib.getTexture(template.texture).hitArea;
            }
        }
        if (templatesLib.list[template.name]) {
            templatesLib.list[template.name].push(this);
        } else {
            templatesLib.list[template.name] = [this];
        }
        this.onBeforeCreateModifier.apply(this);
        templatesLib.templates[template.name].onCreate.apply(this);
        onCreateModifier.apply(this);
    } else if (exts) {
        // Some base classes, like BitmapText, can preset tint during construction,
        // So we need to multiply it with the set tint to preserve the effect.
        assignExtends(this, exts);
        this.onBeforeCreateModifier.apply(this);
        onCreateModifier.apply(this);
    }
    if (!this.shape) {
        this.shape = resLib.getTextureShape(-1);
    }
    if (this.behaviors.length) {
        runBehaviors(this, 'templates', 'thisOnCreate');
    }
    return this;
};
const mix = (
    target: pixiMod.DisplayObject,
    x: number,
    y: number,
    template: ExportedTemplate,
    parent: pixiMod.Container,
    exts: Record<string, unknown>
// eslint-disable-next-line max-params
) => {
    const proto = CopyProto;
    const properties = Object.getOwnPropertyNames(proto);
    for (const i in properties) {
        if (properties[i] !== 'constructor') {
            Object.defineProperty(
                target,
                properties[i],
                Object.getOwnPropertyDescriptor(proto, properties[i])!
            );
        }
    }
    Copy.apply(target, [x, y, template, parent, exts]);
};

/**
 * @catnipIgnore
*/
// eslint-disable-next-line complexity, max-lines-per-function
export const makeCopy = (
    template: string,
    x: number,
    y: number,
    parent: pixiMod.Container,
    exts: Record<string, unknown>
): BasicCopy => {
    if (!(template in templatesLib.templates)) {
        throw new Error(`[ct.templates] An attempt to create a copy of a non-existent template \`${template}\` detected. A typo?`);
    }
    const t: ExportedTemplate = templatesLib.templates[template];
    if (!(t.baseClass in baseClassToPixiClass)) {
        throw new Error(`[internal -> makeCopy] Unknown base class \`${(t as any).baseClass}\` for template \`${template}\`.`);
    }
    const copy = new baseClassToPixiClass[t.baseClass](t, exts) as BasicCopy;
    mix(copy, x, y, t, parent, exts);
    return copy;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

/**
 * @catnipIgnore
 */
export const killRecursive = (copy: (BasicCopy & pixiMod.DisplayObject) | Background) => {
    copy.kill = true;
    if (templatesLib.isCopy(copy) && (copy as BasicCopy).onDestroy) {
        templatesLib.onDestroy.apply(copy);
        (copy as BasicCopy).onDestroy.apply(copy);
    }
    if (copy.children) {
        for (const child of copy.children) {
            if (templatesLib.isCopy(child)) {
                killRecursive(child as (BasicCopy & pixiMod.DisplayObject)); // bruh
            }
        }
    }
    const stackIndex = stack.indexOf(copy);
    if (stackIndex !== -1) {
        stack.splice(stackIndex, 1);
    }
    if (templatesLib.isCopy(copy) && (copy as BasicCopy).template) {
        if ((copy as BasicCopy).template) {
            const {template} = (copy as BasicCopy);
            if (template) {
                const templatelistIndex = templatesLib
                    .list[template]
                    .indexOf((copy as BasicCopy));
                if (templatelistIndex !== -1) {
                    templatesLib.list[template]
                        .splice(templatelistIndex, 1);
                }
            }
        }
    }
    deadPool.push(copy);
};

const onCreateModifier = function () {
    /*!%oncreate%*/
};

/**
 * An object with properties and methods for manipulating templates and copies,
 * mainly for finding particular copies and creating new ones.
 */
const templatesLib = {
    /**
     * @catnipIgnore
     */
    CopyProto,
    /**
     * @catnipIgnore
     */
    Background,
    /**
     * @catnipIgnore
     */
    Tilemap,
    /**
     * An object that contains arrays of copies of all templates.
     * @catnipList template
     */
    list: {
        BACKGROUND: [],
        TILEMAP: []
    } as {
        BACKGROUND: Background[],
        TILEMAP: Tilemap[]
    } & Record<string, BasicCopy[]>,
    /**
     * A map of all the templates of templates exported from ct.IDE.
     * @catnipIgnore
     */
    templates: {} as Record<string, ExportedTemplate>,
    /**
     * Creates a new copy of a given template inside the current root room.
     * A shorthand for `templates.copyIntoRoom(template, x, y, rooms.current, exts)`
     * @param template The name of the template to use
     * @catnipAsset template:template
     * @param [x] The x coordinate of a new copy. Defaults to 0.
     * @param [y] The y coordinate of a new copy. Defaults to 0.
     * @param [params] An optional object which parameters will be applied
     * to the copy prior to its OnCreate event.
     * @returns The created copy.
     * @catnipSaveReturn
     * @catnipIgnore
     */
    copy(template: string, x = 0, y = 0, params: Record<string, unknown> = {}): BasicCopy {
        if (!roomsLib.current) {
            throw new Error('[emitters.fire] An attempt to create a copy before the main room is created.');
        }
        return templatesLib.copyIntoRoom(template, x, y, roomsLib.current, params);
    },
    /**
     * Creates a new copy of a given template inside a specific room.
     * @param template The name of the template to use
     * @catnipAsset template:template
     * @param [x] The x coordinate of a new copy. Defaults to 0.
     * @param [y] The y coordinate of a new copy. Defaults to 0.
     * @param [room] The room to which add the copy.
     * Defaults to the current room.
     * @param [params] An optional object which parameters will be applied
     * to the copy prior to its OnCreate event.
     * @returns The created copy.
     * @catnipSaveReturn
     * @catnipIgnore
     */
    // eslint-disable-next-line max-len
    copyIntoRoom(template: string, x = 0, y = 0, room: Room, params: Record<string, unknown> = {}): BasicCopy {
        // An advanced constructor. Returns a Copy
        if (!room || !(room instanceof Room)) {
            throw new Error(`Attempt to spawn a copy of template ${template} inside an invalid room. Room's value provided: ${room}`);
        }
        const obj = makeCopy(template, x, y, room, params);
        room.addChild(obj as pixiMod.DisplayObject);
        stack.push(obj);
        return obj;
    },
    /**
     * Applies a function to each copy in the current room
     * @param {Function} func The function to apply
     * @catnipIcon crosshair
     * @returns {void}
     */
    each(func: (this: BasicCopy, me: BasicCopy) => void): void {
        for (const copy of stack) {
            if (!copy[copyTypeSymbol]) {
                continue; // Skip backgrounds and tile layers
            }
            func.call(copy, copy);
        }
    },
    /**
     * Applies a function to a given object (e.g. to a copy)
     * @param {Copy} obj The copy to perform function upon.
     * @param {Function} function The function to be applied.
     * @catnipIcon crosshair
     */
    withCopy<T>(obj: T, func: (this: T) => void): void {
        func.apply(obj, this);
    },
    /**
     * Applies a function to every copy of the given template name
     * @param {string} template The name of the template to perform function upon.
     * @catnipAsset template:template
     * @param {Function} function The function to be applied.
     * @catnipIcon crosshair
     */
    withTemplate(
        template: string,
        func: (this: BasicCopy) => void
    ): void {
        for (const copy of templatesLib.list[template]) {
            func.apply(copy, this);
        }
    },
    /**
     * Checks whether there are any copies of this template's name.
     * Will throw an error if you pass an invalid template name.
     * @param {string} template The name of a template to check.
     * @catnipAsset template:template
     * @returns {boolean} Returns `true` if at least one copy exists in a room;
     * `false` otherwise.
     */
    exists(template: string): boolean {
        if (!(template in templatesLib.templates)) {
            throw new Error(`[ct.templates] templates.exists: There is no such template ${template}.`);
        }
        return templatesLib.list[template].length > 0;
    },

    /**
     * Checks whether a given object is a ct.js copy.
     * @param {any} obj The object which needs to be checked.
     * @returns {boolean} Returns `true` if the passed object is a copy; `false` otherwise.
     * @catnipIgnore
     */
    isCopy: ((obj: unknown): boolean => obj && obj[copyTypeSymbol]) as {
        (obj: BasicCopy): obj is BasicCopy;
        (obj: unknown): false;
    },
    /**
     * Checks whether a given object exists in game's world.
     * Intended to be applied to copies, but may be used with other PIXI entities.
     * @catnipIgnore
     */
    valid: ((obj: unknown): boolean => {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        if (copyTypeSymbol in obj) {
            return !(obj as BasicCopy).kill;
        }
        if (obj instanceof PIXI.DisplayObject) {
            return Boolean(obj.position);
        }
        return false;
    }) as {
        (obj: BasicCopy): obj is BasicCopy;
        (obj: pixiMod.DisplayObject): obj is pixiMod.DisplayObject;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj: unknown): false
    },
    /**
     * @catnipIgnore
     */
    beforeStep(this: BasicCopy): void {
        /*!%beforestep%*/
    },
    /**
     * @catnipIgnore
     */
    afterStep(this: BasicCopy): void {
        /*!%afterstep%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'templates', 'thisOnStep');
        }
    },
    /**
     * @catnipIgnore
     */
    beforeDraw(this: BasicCopy): void {
        /*!%beforedraw%*/
    },
    /**
     * @catnipIgnore
     */
    afterDraw(this: BasicCopy): void {
        if (this.behaviors.length) {
            runBehaviors(this, 'templates', 'thisOnDraw');
        }
        if (this.baseClass === 'Button' && (this.scale.x !== 1 || this.scale.y !== 1)) {
            (this as CopyButton).unsize();
        }
        if (this.updateNineSliceShape) {
            if (this.prevWidth !== this.width || this.prevHeight !== this.height) {
                this.prevWidth = this.width;
                this.prevHeight = this.height;
                uLib.reshapeNinePatch(this as CopyPanel | CopyButton);
            }
        }
        /*!%afterdraw%*/
    },
    /**
     * @catnipIgnore
     */
    onDestroy(this: BasicCopy): void {
        /*!%ondestroy%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'templates', 'thisOnDestroy');
        }
    }
};
export default templatesLib;

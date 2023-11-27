/* eslint-disable no-underscore-dangle */
import resLib, {CtjsTexture} from './res';
import {Background} from './backgrounds';
import {Tilemap} from './tilemaps';
import roomsLib, {Room} from './rooms';
import {runBehaviors} from './behaviors';
import {copyTypeSymbol, stack} from '.';
import stylesLib from 'styles';
import uLib from './u';

import type * as pixiMod from 'node_modules/pixi.js';
declare var PIXI: typeof pixiMod;

import type {ExportedRoom, ExportedStyle, ExportedTemplate, TextureShape} from '../node_requires/exporter/_exporterContracts';

let uid = 0;

interface ICopy {
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
    _tex: string;
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

class PixiButton extends PIXI.Container {
    panel: pixiMod.NineSlicePlane;
    text: pixiMod.Text;
    normalTexture: pixiMod.Texture;
    hoverTexture: pixiMod.Texture;
    pressedTexture: pixiMod.Texture;
    disabledTexture: pixiMod.Texture;
    updateNineSliceShape: boolean;

    #disabled: boolean;
    get disabled(): boolean {
        return this.#disabled;
    }
    set disabled(val: boolean) {
        this.#disabled = val;
        if (val) {
            this.panel.texture = this.disabledTexture;
        } else {
            this.panel.texture = this.normalTexture;
        }
    }

    constructor(t: ExportedTemplate, exts: Record<string, unknown>) {
        if (t?.baseClass !== 'Button') {
            throw new Error('Don\'t call PixiButton class directly! Use templates.copy to create an instance instead.');
        }
        super();
        this.normalTexture = resLib.getTexture(t.texture, 0);
        this.hoverTexture = t.hoverTexture ?
            resLib.getTexture(t.hoverTexture, 0) :
            this.normalTexture;
        this.pressedTexture = t.pressedTexture ?
            resLib.getTexture(t.pressedTexture, 0) :
            this.normalTexture;
        this.disabledTexture = t.disabledTexture ?
            resLib.getTexture(t.disabledTexture, 0) :
            this.normalTexture;
        this.panel = new PIXI.NineSlicePlane(
            this.normalTexture,
            t.nineSliceSettings?.left ?? 16,
            t.nineSliceSettings?.top ?? 16,
            t.nineSliceSettings?.right ?? 16,
            t.nineSliceSettings?.bottom ?? 16
        );
        const style = t.textStyle === -1 ?
            {} :
            stylesLib.get(t.textStyle, true) as Partial<pixiMod.ITextStyle>;
        if (exts.customSize) {
            style.fontSize = Number(exts.customSize);
        }
        this.text = new PIXI.Text((exts.customText as string) || t.defaultText || '', style);
        this.text.anchor.set(0.5);
        this.addChild(this.panel, this.text);

        this.eventMode = 'dynamic';
        this.cursor = 'pointer';
        this.on('pointerenter', this.hover);
        this.on('pointerentercapture', this.hover);
        this.on('pointerleave', this.blur);
        this.on('pointerleavecapture', this.blur);
        this.on('pointerdown', this.press);
        this.on('pointerdowncapture', this.press);
        this.on('pointerup', this.hover);
        this.on('pointerupcapture', this.hover);
        this.on('pointerupoutside', this.blur);
        this.on('pointerupoutsidecapture', this.blur);

        this.updateNineSliceShape = t.nineSliceSettings.autoUpdate;
        let baseWidth = this.panel.width,
            baseHeight = this.panel.height;
        if ('scaleX' in exts) {
            baseWidth *= (exts.scaleX as number);
        }
        if ('scaleY' in exts) {
            baseHeight *= (exts.scaleY as number);
        }
        this.resize(baseWidth, baseHeight);
        uLib.reshapeNinePatch(this as CopyButton);
    }

    unsize(): void {
        const {x, y} = this.scale;
        this.panel.scale.x *= x;
        this.panel.scale.y *= y;
        this.scale.set(1);
        this.text.x = this.panel.width / 2;
        this.text.y = this.panel.height / 2;
    }
    resize(newWidth: number, newHeight: number): void {
        this.panel.width = newWidth;
        this.panel.height = newHeight;
        this.text.x = newWidth / 2;
        this.text.y = newHeight / 2;
    }

    hover(): void {
        if (this.disabled) {
            return;
        }
        this.panel.texture = this.hoverTexture;
    }
    blur(): void {
        if (this.disabled) {
            return;
        }
        this.panel.texture = this.normalTexture;
    }
    press(): void {
        if (this.disabled) {
            return;
        }
        this.panel.texture = this.pressedTexture;
    }
}

// Record<string, any> allows ct.js users to write any properties to their copies
// without typescript complaining.
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * An instance of a ct.js template. Ct.js cannot predict the base class
 * of a template here, so you may need to add `as Copy...` to further narrow down
 * the class.
 */
export type BasicCopy = Record<string, any> & pixiMod.DisplayObject & ICopy;
/**
 * An instance of a ct.js template with Animated Sprite as its base class.
 * It has functionality of both PIXI.AnimatedSprite and ct.js Copies.
 */
export type CopyAnimatedSprite = Record<string, any> & pixiMod.AnimatedSprite & ICopy;
/**
 * An instance of a ct.js template with Panel as its base class.
 * It has functionality of both PIXI.NineSlicePlane and ct.js Copies.
 */
export type CopyPanel = Record<string, any> & pixiMod.NineSlicePlane & ICopy;
/**
 * An instance of a ct.js template with Text as its base class.
 * It has functionality of both PIXI.Text and ct.js Copies.
 */
export type CopyText = Record<string, any> & pixiMod.Text & ICopy;
/**
 * An instance of a ct.js template with Container as its base class.
 * It has functionality of both PIXI.Container and ct.js Copies, and though by itself it doesn't
 * display anything, you can add other copies and pixi.js classes with `this.addChild(copy)`.
 */
export type CopyContainer = Record<string, any> & pixiMod.Container & ICopy;
/**
 * An instance of a ct.js template with button logic.
 * It has functionality of both PIXI.Container and ct.js Copies.
 */
export type CopyButton = Record<string, any> & PixiButton & ICopy;

/* eslint-enable @typescript-eslint/no-explicit-any */

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
// eslint-disable-next-line complexity, max-lines-per-function
/**
 * A factory function that when applied to a PIXI.DisplayObject instance,
 * augments it with ct.js Copy functionality.
 * @param {string} template The name of the template to copy
 * @param {PIXI.DisplayObject|Room} [container] A container to set as copy's parent
 * before its OnCreate event. Defaults to ct.room.
 */
// eslint-disable-next-line max-lines-per-function, max-params
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
        if (template.baseClass === 'AnimatedSprite') {
            this._tex = template.texture;
            const me = this as CopyAnimatedSprite;
            me.blendMode = template.blendMode || PIXI.BLEND_MODES.NORMAL;
            me.loop = template.loopAnimation;
            me.animationSpeed = template.animationFPS / 60;
            if (template.playAnimationOnStart) {
                me.play();
            }
        } else if (template.baseClass === 'NineSlicePlane') {
            const me = this as CopyPanel;
            me.blendMode = template.blendMode || PIXI.BLEND_MODES.NORMAL;
            this._tex = template.texture;
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
            Object.assign(this, exts);
        }
        if ('texture' in template) {
            this.shape = resLib.getTextureShape(template.texture || -1);
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
        Object.assign(this, exts);
        this.onBeforeCreateModifier.apply(this);
        onCreateModifier.apply(this);
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
    for (const y in properties) {
        if (properties[y] !== 'constructor') {
            Object.defineProperty(
                target,
                properties[y],
                Object.getOwnPropertyDescriptor(proto, properties[y])
            );
        }
    }
    Copy.apply(target, [x, y, template, parent, exts]);
};

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
    if (t.baseClass === 'Container') {
        const copy = new PIXI.Container() as CopyContainer;
        copy.shape = {
            type: 'point'
        };
        mix(copy, x, y, t, parent, exts);
        return copy;
    }
    if (t.baseClass === 'Text') {
        let style: ExportedStyle;
        if (t.textStyle && t.textStyle !== -1) {
            style = stylesLib.get(t.textStyle, true);
        }
        if (exts.customWordWrap) {
            style.wordWrap = true;
            style.wordWrapWidth = Number(exts.customWordWrap);
        }
        if (exts.customSize) {
            style.fontSize = Number(exts.customSize);
        }
        const copy = new PIXI.Text(
            (exts.customText as string) || t.defaultText || '',
            style as unknown as Partial<pixiMod.ITextStyle>
        ) as CopyText;
        if (exts.customAnchor) {
            const anchor = exts.customAnchor as {
                x?: number,
                y?: number
            };
            copy.anchor.set(anchor?.x ?? 0, anchor?.y ?? 0);
        }
        mix(copy, x, y, t, parent, exts);
        copy.shape = uLib.getRectShape(copy);
        copy.scale.set(
            (exts.scaleX as number) ?? 1,
            (exts.scaleY as number) ?? 1
        );
        return copy;
    }

    let textures: pixiMod.Texture[] = [PIXI.Texture.EMPTY];
    if (t.texture && t.texture !== '-1') {
        textures = resLib.getTexture(t.texture);
    }

    if (t.baseClass === 'NineSlicePlane') {
        const copy = new PIXI.NineSlicePlane(
            textures[0],
            t.nineSliceSettings?.left ?? 16,
            t.nineSliceSettings?.top ?? 16,
            t.nineSliceSettings?.right ?? 16,
            t.nineSliceSettings?.bottom ?? 16
        ) as CopyPanel;
        copy.updateNineSliceShape = t.nineSliceSettings.autoUpdate;
        mix(copy, x, y, t, parent, exts);
        const baseWidth = copy.width,
              baseHeight = copy.height;
        if ('scaleX' in exts) {
            copy.width = baseWidth * (exts.scaleX as number);
        }
        if ('scaleY' in exts) {
            copy.height = baseHeight * (exts.scaleY as number);
        }
        uLib.reshapeNinePatch(copy);
        return copy;
    }
    if (t.baseClass === 'Button') {
        const copy = new PixiButton(t, exts) as CopyButton;
        mix(copy, x, y, t, parent, exts);
        return copy;
    }
    if (t.baseClass === 'AnimatedSprite') {
        const copy = new PIXI.AnimatedSprite(textures) as CopyAnimatedSprite;
        copy.anchor.x = t.anchorX ?? textures[0].defaultAnchor.x ?? 0;
        copy.anchor.y = t.anchorY ?? textures[0].defaultAnchor.y ?? 0;
        copy.scale.set(
            (exts.scaleX as number) ?? 1,
            (exts.scaleY as number) ?? 1
        );
        mix(copy, x, y, t, parent, exts);
        return copy;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(`[internal -> makeCopy] Unknown base class \`${(t as any).baseClass}\` for template \`${template}\`.`);
};

const onCreateModifier = function () {
    /*!%oncreate%*/
};

/**
 * An object with properties and methods for manipulating templates and copies,
 * mainly for finding particular copies and creating new ones.
 */
const templatesLib = {
    CopyProto,
    Background,
    Tilemap,
    /**
     * An object that contains arrays of copies of all templates.
     */
    list: {
        BACKGROUND: [],
        TILEMAP: []
    } as {
        BACKGROUND: Background[],
        TILEMAP: Tilemap[]
    } & Record<string, pixiMod.DisplayObject[]>,
    /**
     * A map of all the templates of templates exported from ct.IDE.
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
    // eslint-disable-next-line max-len
    copyIntoRoom(template: string, x = 0, y = 0, room: Room, exts: Record<string, unknown> = {}): BasicCopy {
        // An advanced constructor. Returns a Copy
        if (!room || !(room instanceof Room)) {
            throw new Error(`Attempt to spawn a copy of template ${template} inside an invalid room. Room's value provided: ${room}`);
        }
        const obj = makeCopy(template, x, y, room, exts);
        room.addChild(obj as pixiMod.DisplayObject);
        stack.push(obj);
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
    copy(template: string, x = 0, y = 0, exts: Record<string, unknown> = {}): BasicCopy {
        return templatesLib.copyIntoRoom(template, x, y, roomsLib.current, exts);
    },
    /**
     * Applies a function to each copy in the current room
     * @param {Function} func The function to apply
     * @returns {void}
     */
    each(func: (this: BasicCopy) => void): void {
        for (const copy of stack) {
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
     */
    isCopy: ((obj: unknown): boolean => obj[copyTypeSymbol]) as {
        (obj: BasicCopy): obj is BasicCopy;
        (obj: unknown): false;
    },
    /**
     * Checks whether a given object exists in game's world.
     * Intended to be applied to copies, but may be used with other PIXI entities.
     */
    valid: ((obj: unknown): boolean => {
        if (typeof obj !== 'object') {
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

    beforeStep(this: BasicCopy): void {
        /*!%beforestep%*/
    },
    afterStep(this: BasicCopy): void {
        /*!%afterstep%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'templates', 'thisOnStep');
        }
    },
    beforeDraw(this: BasicCopy): void {
        /*!%beforedraw%*/
    },
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
    onDestroy(this: BasicCopy): void {
        /*!%ondestroy%*/
        if (this.behaviors.length) {
            runBehaviors(this, 'templates', 'thisOnDestroy');
        }
    }
};
export default templatesLib;

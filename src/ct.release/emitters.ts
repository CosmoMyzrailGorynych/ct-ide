import * as PIXI from 'node_modules/pixi.js';
import {Emitter} from 'node_modules/@pixi/particle-emitter';
import {ExportedTandems, ExportedTandem} from './../node_requires/exporter/_exporterContracts';
import {Copy} from './templates';
import {Room} from './rooms';
import {res} from './res';
import {u} from './u';
import {ctjsGame} from '.';

export interface ITandemSettings {
    /** Optional scaling object with `x` and `y` parameters. */
    scale?: {
        x: number,
        y: number
    };
    /**
     * Set this to additionally shift the emitter tandem relative
     * to the copy it was attached to, or relative to the copy it follows.
     */
    position?: {
        x: number,
        y: number
    };
    /**
     * Optional; if less than 0, it will prewarm the emitter tandem,
     * meaning that it will simulate a given number of seconds before
     * showing particles in the world. If greater than 0, will postpone
     * the effect for the specified number of seconds.
     */
    prewarmDelay?: number;
    /** Optional tint to the whole effect. */
    tint?: number;
    /**  Optional opacity set to the whole effect. */
    alpha?: number;
    /** Optional rotation in radians. */
    rotation?: number;
    /** Optional rotation in degrees. */
    angle?: number;
    /**
     * If set to true, will use the time scale of UI layers. This affects
     * how an effect is simulated during slowmo effects and game pause.
     */
    isUi?: boolean;
    /** The depth of the tandem. Defaults to Infinity (will overlay everything). */
    depth?: number;
    /**
     * The room to attach the effect to.
     * Defaults to the current main room (ctjsGame.room); has no effect if attached to a copy.
     */
    room?: Room;
}

type AttachedEmitter = Emitter & {
    oldMaxParticles: number;
    initialDeltaPos: {
        x: number;
        y: number;
    }
}

/**
 * A class for displaying and managing a collection of particle emitters.
 * @extends PIXI.Container
 */
export class EmitterTandem extends PIXI.Container {
    emitters: AttachedEmitter[];
    delayed: {
        value: number,
        emitter: AttachedEmitter,
    }[];
    templates: ExportedTandems;
    isUi: boolean;
    deltaPosition: {
        x: number,
        y: number
    };
    depth = 0;
    kill: boolean;
    /** If set to true, the tandem will stop updating its emitters */
    frozen = false;
    stopped = false;
    /** A copy to follow */
    follow?: PIXI.DisplayObject;
    appendant?: PIXI.Container;
    /**
     * Creates a new emitter tandem. This method should not be called directly;
     * better use the methods of `emitters`.
     * @param tandemData The template object of the tandem, as it was exported from ct.IDE.
     * @param opts Additional settings applied to the tandem
     * @constructor
     */
    constructor(tandemData: ExportedTandem, opts: ITandemSettings) {
        super();

        for (const emt of tandemData) {
            const inst = new Emitter(
                this,
                res.getTexture(emt.texture),
                emt.settings
            ) as AttachedEmitter;
            const d = emt.settings.delay + opts.prewarmDelay;
            if (d > 0) {
                inst.emit = false;
                this.delayed.push({
                    value: d,
                    emitter: inst
                });
            } else if (d < 0) {
                inst.emit = true;
                inst.update(-d);
            } else {
                inst.emit = true;
            }
            inst.initialDeltaPos = {
                x: emt.settings.pos.x,
                y: emt.settings.pos.y
            };
            this.emitters.push(inst);
            inst.playOnce(() => {
                this.emitters.splice(this.emitters.indexOf(inst), 1);
            });
        }
        this.isUi = opts.isUi;
        this.scale.x = opts.scale.x;
        this.scale.y = opts.scale.y;
        if (opts.rotation) {
            this.rotation = opts.rotation;
        } else if (opts.angle) {
            this.angle = opts.angle;
        }
        this.deltaPosition = opts.position;
        this.depth = opts.depth;
        this.frozen = false;

        if (this.isUi) {
            emitters.uiTandems.push(this);
        } else {
            emitters.tandems.push(this);
        }
    }
    /**
     * A method for internal use; advances the particle simulation further
     * according to either a UI ticker or ct.delta.
     * @returns {void}
     */
    update(): void {
        if (this.stopped) {
            for (const emitter of this.emitters) {
                if (!emitter.particleCount) {
                    this.emitters.splice(this.emitters.indexOf(emitter), 1);
                }
            }
        }
        // eslint-disable-next-line no-underscore-dangle
        if ((this.appendant && this.appendant.destroyed) || this.kill || !this.emitters.length) {
            if (this.isUi) {
                emitters.uiTandems.splice(emitters.uiTandems.indexOf(this), 1);
            } else {
                emitters.tandems.splice(emitters.tandems.indexOf(this), 1);
            }
            this.destroy();
            return;
        }
        if (this.frozen) {
            return;
        }
        const s = (this.isUi ? PIXI.Ticker.shared.elapsedMS : PIXI.Ticker.shared.deltaMS) / 1000;
        for (const delayed of this.delayed) {
            delayed.value -= s;
            if (delayed.value <= 0) {
                delayed.emitter.emit = true;
                this.delayed.splice(this.delayed.indexOf(delayed), 1);
            }
        }
        for (const emt of this.emitters) {
            if (this.delayed.find(delayed => delayed.emitter === emt)) {
                continue;
            }
            emt.update(s);
        }
        if (this.follow) {
            this.updateFollow();
        }
    }
    /**
     * Stops spawning new particles, then destroys itself.
     * Can be fired only once, otherwise it will log a warning.
     * @returns {void}
     */
    stop(): void {
        if (this.stopped) {
            // eslint-disable-next-line no-console
            console.trace('[emitters] An attempt to stop an already stopped emitter tandem. Continuing…');
            return;
        }
        this.stopped = true;
        for (const emt of this.emitters) {
            emt.emit = false;
        }
        this.delayed = [];
    }
    /**
     * Stops spawning new particles, but continues simulation and allows to resume the effect later
     * with `emitter.resume();`
     * @returns {void}
     */
    pause(): void {
        for (const emt of this.emitters) {
            if (emt.maxParticles !== 0) {
                emt.oldMaxParticles = emt.maxParticles;
                emt.maxParticles = 0;
            }
        }
    }
    /**
     * Resumes previously paused effect.
     * @returns {void}
     */
    resume(): void {
        for (const emt of this.emitters) {
            emt.maxParticles = emt.oldMaxParticles || emt.maxParticles;
        }
    }
    /**
     * Removes all the particles from the tandem, but continues spawning new ones.
     * @returns {void}
     */
    clear(): void {
        for (const emt of this.emitters) {
            emt.cleanup();
        }
    }

    updateFollow(): void {
        if (!this.follow) {
            return;
        }
        if ((('kill' in this.follow) && this.follow.kill) || !this.follow.scale) {
            this.follow = null;
            this.stop();
            return;
        }
        const delta = u.rotate(
            this.deltaPosition.x * this.follow.scale.x,
            this.deltaPosition.y * this.follow.scale.y,
            this.follow.angle
        );
        for (const emitter of this.emitters) {
            emitter.updateOwnerPos(this.follow.x + delta.x, this.follow.y + delta.y);
            const ownDelta = u.rotate(
                emitter.initialDeltaPos.x * this.follow.scale.x,
                emitter.initialDeltaPos.y * this.follow.scale.y,
                this.follow.angle
            );
            emitter.updateSpawnPos(ownDelta.x, ownDelta.y);
        }
    }
}

const defaultSettings = {
    prewarmDelay: 0,
    scale: {
        x: 1,
        y: 1
    },
    tint: 0xffffff,
    alpha: 1,
    position: {
        x: 0,
        y: 0
    },
    isUi: false,
    depth: Infinity
};

export const emitters = {
    /**
     * A map of existing emitter templates.
     */
    templates: [/*@tandemTemplates@*/][0] || {} as ExportedTandems,
    /**
     * A list of all the emitters that are simulated in UI time scale.
     */
    uiTandems: [] as EmitterTandem[],
    /**
     * A list of all the emitters that are simulated in a regular game loop.
     */
    tandems: [] as EmitterTandem[],
    /**
     * Creates a new emitter tandem in the world at the given position.
     * @param {string} name The name of the tandem template, as it was named in ct.IDE.
     * @param {number} x The x coordinate of the new tandem.
     * @param {number} y The y coordinate of the new tandem.
     * @param {ITandemSettings} [settings] Additional configs for the created tandem.
     * @return {EmitterTandem} The newly created tandem.
     */
    fire(name: string, x: number, y: number, settings: ITandemSettings): EmitterTandem {
        if (!(name in emitters.templates)) {
            throw new Error(`[emitters] An attempt to create a non-existent emitter ${name}.`);
        }
        const opts = Object.assign({}, defaultSettings, settings);
        const tandem = new EmitterTandem(emitters.templates[name], opts);
        tandem.x = x;
        tandem.y = y;
        if (!opts.room) {
            ctjsGame.room.addChild(tandem);
            tandem.isUi = ctjsGame.room.isUi;
        } else {
            opts.room.addChild(tandem);
            tandem.isUi = opts.room.isUi;
        }
        return tandem;
    },
    /**
     * Creates a new emitter tandem and attaches it to the given copy
     * (or to any other DisplayObject).
     * @param {Copy|PIXI.DisplayObject} parent The parent of the created tandem.
     * @param {string} name The name of the tandem template.
     * @param {ITandemSettings} [settings] Additional options for the created tandem.
     * @returns {EmitterTandem} The newly created emitter tandem.
     */
    append(
        parent: Copy | PIXI.Container,
        name: string,
        settings: ITandemSettings
    ): EmitterTandem {
        if (!(name in emitters.templates)) {
            throw new Error(`[emitters] An attempt to create a non-existent emitter ${name}.`);
        }
        const opts = Object.assign({}, defaultSettings, settings);
        const tandem = new EmitterTandem(emitters.templates[name], opts);
        if (opts.position) {
            tandem.x = opts.position.x;
            tandem.y = opts.position.y;
        }
        tandem.appendant = parent;
        parent.addChild(tandem);
        return tandem;
    },
    /**
     * Creates a new emitter tandem in the world, and configs it so it will follow a given copy.
     * This includes handling position, scale, and rotation.
     * @param {Copy|PIXI.DisplayObject} parent The copy to follow.
     * @param {string} name The name of the tandem template.
     * @param {ITandemSettings} [settings] Additional options for the created tandem.
     * @returns {EmitterTandem} The newly created emitter tandem.
     */
    follow(
        parent: Copy | PIXI.DisplayObject,
        name: string,
        settings: ITandemSettings
    ): EmitterTandem {
        if (!(name in emitters.templates)) {
            throw new Error(`[emitters] An attempt to create a non-existent emitter ${name}.`);
        }
        const opts = Object.assign({}, defaultSettings, settings);
        const tandem = new EmitterTandem(emitters.templates[name], opts);
        tandem.follow = parent;
        tandem.updateFollow();
        if (!('getRoom' in parent)) {
            ctjsGame.room.addChild(tandem);
        } else {
            parent.getRoom().addChild(tandem);
        }
        return tandem;
    }
};

PIXI.Ticker.shared.add(() => {
    for (const tandem of emitters.uiTandems) {
        tandem.update();
    }
    for (const tandem of emitters.tandems) {
        tandem.update();
    }
});

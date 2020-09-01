/**
 * @typedef ISimplePoint
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef ITandemSettings
 *
 * @property {ISimplePoint} [scale] Optional scaling object with `x` and `y` parameters.
 * @property {ISimplePoint} [position] Set this to additionally shift the emitter tandem relative
 * to the copy it was attached to, or relative to the copy it follows.
 * @property {number} [prewarmDelay] Optional; if less than 0, it will prewarm the emitter tandem,
 * meaning that it will simulate a given number of seconds before
 * showing particles in the world. If greater than 0, will postpone
 * the effect for the specified number of seconds.
 * @property {number} [tint] Optional tint to the whole effect.
 * @property {number} [alpha] Optional opacity set to the whole effect.
 * @property {number} [rotation] Optional rotation in radians.
 * @property {number} [angle] Optional rotation in degrees.
 * @property {boolean} [isUi] If set to true, will use the time scale of UI layers. This affects
 * how an effect is simulated during slowmo effects and game pause.
 * @property {number} [depth] The depth of the tandem. Defaults to Infinity
 * (will overlay everything).
 * @property {Room} [room] The room to attach the effect to.
 * Defaults to the current main room (ct.room); has no effect if attached to a copy.
 */

/**
 * A class for displaying and managing a collection of particle emitters.
 *
 * @property {boolean} frozen If set to true, the tandem will stop updating its emitters
 * @property {Copy|DisplayObject} follow A copy to follow
 * @extends PIXI.Container
 */
class EmitterTandem extends PIXI.Container {
    /**
     * Creates a new emitter tandem. This method should not be called directly;
     * better use the methods of `ct.emitters`.
     * @param {object} tandemData The template object of the tandem, as it was exported from ct.IDE.
     * @param {ITandemSettings} opts Additional settings applied to the tandem
     * @constructor
     */
    constructor(tandemData, opts) {
        super();
        this.emitters = [];
        this.delayed = [];

        for (const emt of tandemData) {
            const inst = new PIXI.particles.Emitter(
                this,
                ct.res.getTexture(emt.texture),
                emt.settings
            );
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
        this.paused = this.frozen = false;

        if (this.isUi) {
            ct.emitters.uiTandems.push(this);
        } else {
            ct.emitters.tandems.push(this);
        }
    }
    /**
     * A method for internal use; advances the particle simulation further
     * according to either a UI ticker or ct.delta.
     * @returns {void}
     */
    update() {
        if (this.stopped) {
            for (const emitter of this.emitters) {
                if (!emitter.particleCount) {
                    this.emitters.splice(this.emitters.indexOf(emitter), 1);
                }
            }
        }
        // eslint-disable-next-line no-underscore-dangle
        if ((this.appendant && this.appendant._destroyed) || this.kill || !this.emitters.length) {
            this.emit('done');
            if (this.isUi) {
                ct.emitters.uiTandems.splice(ct.emitters.uiTandems.indexOf(this), 1);
            } else {
                ct.emitters.tandems.splice(ct.emitters.tandems.indexOf(this), 1);
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
    stop() {
        if (this.stopped) {
            // eslint-disable-next-line no-console
            console.trace('[ct.emitters] An attempt to stop an already stopped emitter tandem. Continuing…');
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
    pause() {
        for (const emt of this.emitters) {
            emt.oldMaxParticles = emt.maxParticles;
            emt.maxParticles = 0;
        }
    }
    /**
     * Resumes previously paused effect.
     * @returns {void}
     */
    resume() {
        for (const emt of this.emitters) {
            emt.maxParticles = emt.oldMaxParticles || emt.maxParticles;
        }
    }
    /**
     * Removes all the particles from the tandem, but continues spawning new ones.
     * @returns {void}
     */
    clear() {
        for (const emt of this.emitters) {
            emt.cleanup();
        }
    }

    updateFollow() {
        if (!this.follow) {
            return;
        }
        if (this.follow.kill || !this.follow.scale) {
            this.follow = null;
            this.stop();
            return;
        }
        const delta = ct.u.rotate(
            this.deltaPosition.x * this.follow.scale.x,
            this.deltaPosition.y * this.follow.scale.y,
            -this.follow.angle
        );
        for (const emitter of this.emitters) {
            emitter.updateOwnerPos(this.follow.x + delta.x, this.follow.y + delta.y);
            const ownDelta = ct.u.rotate(
                emitter.initialDeltaPos.x * this.follow.scale.x,
                emitter.initialDeltaPos.y * this.follow.scale.y,
                -this.follow.angle
            );
            emitter.updateSpawnPos(ownDelta.x, ownDelta.y);
        }
    }
}

(function emittersAddon() {
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

    /**
     * @namespace
     */
    ct.emitters = {
        /**
         * A map of existing emitter templates.
         * @type Array<object>
         */
        templates: [/*@tandemTemplates@*/][0] || {},
        /**
         * A list of all the emitters that are simulated in UI time scale.
         * @type Array<EmitterTandem>
         */
        uiTandems: [],
        /**
         * A list of all the emitters that are simulated in a regular game loop.
         * @type Array<EmitterTandem>
         */
        tandems: [],
        /**
         * Creates a new emitter tandem in the world at the given position.
         * @param {string} name The name of the tandem template, as it was named in ct.IDE.
         * @param {number} x The x coordinate of the new tandem.
         * @param {number} y The y coordinate of the new tandem.
         * @param {ITandemSettings} [settings] Additional configs for the created tandem.
         * @return {EmitterTandem} The newly created tandem.
         */
        fire(name, x, y, settings) {
            if (!(name in ct.emitters.templates)) {
                throw new Error(`[ct.emitters] An attempt to create a non-existent emitter ${name}.`);
            }
            const opts = Object.assign({}, defaultSettings, settings);
            const tandem = new EmitterTandem(ct.emitters.templates[name], opts);
            tandem.x = x;
            tandem.y = y;
            if (!opts.room) {
                ct.room.addChild(tandem);
                tandem.isUi = ct.room.isUi;
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
        append(parent, name, settings) {
            if (!(name in ct.emitters.templates)) {
                throw new Error(`[ct.emitters] An attempt to create a non-existent emitter ${name}.`);
            }
            const opts = Object.assign({}, defaultSettings, settings);
            const tandem = new EmitterTandem(ct.emitters.templates[name], opts);
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
        follow(parent, name, settings) {
            if (!(name in ct.emitters.templates)) {
                throw new Error(`[ct.emitters] An attempt to create a non-existent emitter ${name}.`);
            }
            const opts = Object.assign({}, defaultSettings, settings);
            const tandem = new EmitterTandem(ct.emitters.templates[name], opts);
            tandem.follow = parent;
            tandem.updateFollow();
            if (!('getRoom' in parent)) {
                ct.room.addChild(tandem);
            } else {
                parent.getRoom().addChild(tandem);
            }
            return tandem;
        }
    };

    PIXI.Ticker.shared.add(() => {
        for (const tandem of ct.emitters.uiTandems) {
            tandem.update();
        }
        for (const tandem of ct.emitters.tandems) {
            tandem.update();
        }
    });
})();

/**
 * @typedef ISoundOptions
 *
 * @property {Filter[]} [filters]
 * @property {boolean} [loop]
 * @property {boolean} [singleInstance]
 * @property {number} [speed]
 * @property {number} [volume]
 */

/**
 * @typedef IMediaInstance
 *
 * @property {number} volume Current speed of the instance. This is not the actual volume
 *                           since it takes into account the global context and the sound volume.
 * @property {number} speed Current speed of the instance. This is not the actual speed
 *                          since it takes into account the global context and the sound speed.
 * @property {boolean} loop If the current instance is set to loop
 * @property {boolean} muted Set the muted state of the instance
 * @property {boolean}  paused If the instance is paused, if the sound or global context is paused,
 *                             this could still be false.
 * @property {number} progress Read-only. Current progress of the sound from 0 to 1
 * @property {number} id Read-only. Auto-incrementing ID for the instance.
 *
 * @method set
 * @method stop Stops this sound instance.
 */

const computeStereoLevels = (position, stereoSettings = {}) => {
    const head = ct.camera.position;
    // Let's say that a virtual head is roughly half a screen
    const earSpan = Math.max(ct.camera.width, ct.camera.height) / 4;

    // Get position of virtual ears
    const eR = {
        x: head.x + earSpan,
        y: head.y
    };
    const eL = {
        x: head.x - earSpan,
        y: head.y
    };

    let kR = Math.cos(ct.u.deltaDir(0, ct.u.pdn(eR.x, eR.y, position.x, position.y)) / 180 * Math.PI),
        kL = Math.cos(ct.u.deltaDir(180, ct.u.pdn(eL.x, eL.y, position.x, position.y)) / 180 * Math.PI);
    // Volume changes depending on the orientation of the sound relative to the ear
    kR = (kR + 1) / 2;
    kL = (kL + 1) / 2;


    const distance = Math.max(0, (ct.u.pdc(position.x, position.y, head.x, head.y) - earSpan / 2));
    // @see https://math.stackexchange.com/a/296846
    const distanceCompensation = 1 - (1 / ((distance / (earSpan * 2)) ** 2 + 1));
    const stereo = (kR / (kL + kR) - 0.5) * 2 * Math.abs(kR - kL) * distanceCompensation;
    // Everything inside half-radius of our "head" is at max volume
    let volume = 1 - (distance / Math.max(1, (stereoSettings.maxHearDistance - earSpan / 2))) ** 0.5;
    volume = Math.max(Math.min(1, volume), 0);
    console.log('stereo', stereo);
    console.log('volume', volume);

    return {
        volume,
        stereo
    };
};

/**
 * @namespace
 */
ct.sound = {
    /**
     * Creates a PIXI.sound.Sound object that can later be played.
     * This method is mainly designed for internal use. For dynamic sound loading with ct.js,
     * better use ct.res.addSound method.
     */
    init(soundTemplate) {
        return new Promise((resolve, reject) => {
            console.log(soundTemplate);
            if (soundTemplate.preload) {
                PIXI.sound.add(soundTemplate.name, {
                    url: soundTemplate.path,
                    preload: true,
                    loaded: (err, sound) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                            return;
                        }
                        sound.stereoSettings = soundTemplate.stereoSettings || {};
                        console.log('soundLoaded');
                        resolve(sound);
                    }
                });
            } else {
                const sound = PIXI.sound.Sound.from(soundTemplate.path, {
                    preload: false
                });
                sound.stereoSettings = soundTemplate.stereoSettings;
                resolve(sound);
            }
        });
    },
    /**
     * Plays a 2D sound with optional filters and effects applied
     *
     * @param {string} name The name of the sound.
     * @param {ISoundOptions} [options]
     *
     * @returns {IMediaInstance} The instance of a sound that was played.
     *                           You can use it to stop a sound.
     */
    play(name, options = {}) {
        return ct.res.sounds[name].play(options);
    },
    playAt(name, pos, options = {}) {
        const sound = ct.res.sounds[name];
        const spatial = computeStereoLevels(pos, sound.stereoSettings);
        const filter = new PIXI.sound.filters.StereoFilter(spatial.stereo);
        return sound.play(Object.assign({}, options, {
            volume: (options.volume || 1) * spatial.volume,
            filters: [...(options.filter || []), filter]
        }));
    },
    stop(name) {
        if (!(name in ct.res.sounds)) {
            console.warn(`Attempt to stop a non-existent sound ${name}. Ignoring.`);
            return;
        }
        ct.res.sounds[name].stop();
    },
    get globalVolume() {
        // TODO:
    },
    set globalVolume(volume) {
        // TODO:
    },
    preload(name) {
        // TODO:
    }
};

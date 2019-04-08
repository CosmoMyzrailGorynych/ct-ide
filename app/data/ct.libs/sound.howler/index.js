/* global ct Howler Howl */
ct.sound = {};

ct.sound.howler = Howler;
ct.sound.howl = Howl;

/** 
 * Detects if a particular codec is supported in the system 
 * @param {String} type One of: "mp3", "mpeg", "opus", "ogg", "oga", "wav", "aac", "caf", m4a", "mp4", "weba", "webm", "dolby", "flac".
 * @returns {Boolean} true/false
 */
ct.sound.detect = Howler.codecs;

/** 
 * Creates a new Sound object and puts it in resource object 
 * 
 * @param {String} name Sound's name
 * @param {String} wav Local path to the sound in wav format
 * @param {String} mp3 Local path to the sound in mp3 format
 * @param {Object} options An options object
 * 
 * @returns {Object} Sound's object
 */
ct.sound.init = function (name, wav, mp3, options) {
    options = options || {};
    var sounds = [];
    if (wav && wav.slice(-4) === '.wav') {
        sounds.push(wav);
    }
    if (mp3 && mp3.slice(-4) === '.mp3') {
        sounds.push(mp3);
    }
    var howl = new Howl({
        src: sounds,
        autoplay: false,
        preload: !options.music,
        html5: Boolean(options.music),
        loop: options.loop,
        pool: options.poolSize || 5,

        onload: function () {
            if (!options.music) {
                ct.res.soundsLoaded++;
            }
        },
        onloaderror: function () {
            ct.res.soundsError++;
            howl.buggy = true;
            console.error('[ct.sound.howler] Oh no! We couldn\'t load ' + (wav || mp3) + '!');
        }
    });
    if (options.music) {
        ct.res.soundsLoaded++;
    }
    ct.res.sounds[name] = howl;
};

/**
 * Spawns a new sound and plays it.
 * 
 * @param {String} name The name of sound to be played
 * @param {Object} [opts] Options object.
 * @param {Function} [cb] A callback, which is called when the sound finishes playing
 * 
 * @returns {Number} The ID of the created sound. This can be passed to Howler methods.
 */
ct.sound.spawn = function(name, opts, cb) {
    opts = opts || {};
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    var howl = ct.res.sounds[name];
    var id = howl.play();
    if (opts.loop) {
        howl.loop(true, id);
    }
    if (opts.volume !== void 0) {
        howl.volume(opts.volume, id);
    }
    if (cb) {
        howl.once('end', cb, id);
    }
    return id;
};

/**
 * Stops playback of sound, resetting its time to 0.
 * 
 * @param {String} name The name of a sound
 * @param {Number} [id] An optional ID of a particular sound
 * @returns {void}
 */
ct.sound.stop = function(name, id) {
    ct.res.sounds[name].stop(id);
};

/**
 * Pauses playback of sound or group, saving the seek of playback.
 * 
 * @param {String} name The name of a sound
 * @param {Number} [id] An optional ID of a particular sound
 * @returns {void}
 */
ct.sound.pause = function(name, id) {
    ct.res.sounds[name].pause(id);
};

/**
 * Resumes a given sound, e.g. after pausing it.
 * 
 * @param {String} name The name of a sound
 * @param {Number} [id] An optional ID of a particular sound
 * @returns {void}
 */
ct.sound.resume = function(name, id) {
    ct.res.sounds[name].play(id);
};
/**
 * Returns whether a sound is currently playing,
 * either an exact sound (found by its ID) or any sound of a given name.
 * 
 * @param {String} name The name of a sound
 * @param {Number} [id] An optional ID of a particular sound
 * @returns {Boolean} `true` if the sound is playing, `false` otherwise.
 */
ct.sound.playing = function(name, id) {
    return ct.res.sounds[name].playing(id);
};
/**
 * Preloads a sound. This is usually applied to music files before playing, 
 * as they are not preloaded by default.
 * 
 * @param {String} name The name of a sound
 * @returns {void}
 */
ct.sound.load = function(name) {
    ct.res.sounds[name].load();
};


/**
 * Changes/returns the volume of the given sound.
 * 
 * @param {String} name The name of sound to affect.
 * @param {Number} [volume] The new volume from `0.0` to `1.0`. If empty, will return the existing volume.
 * @param {Number} [id] If specified, then only the given sound instance is affected.
 * 
 * @returns {Number} The current volume of the sound.
 */
ct.sound.volume = function (name, volume, id) {
    return ct.res.sounds[name].volume(volume, id);
};

/**
 * Fades a sound to a given volume. Can affect either a specific instance or the whole group.
 * 
 * @param {String} name The name of sound to affect.
 * @param {Number} newVolume The new volume from `0.0` to `1.0`.
 * @param {Number} duration The duration of transition, in milliseconds.
 * @param {Number} [id] If specified, then only the given sound instance is affected.
 * 
 * @returns {void}
 */
ct.sound.fade = function(name, newVolume, duration, id) {
    var howl = ct.res.sounds[name],
        oldVolume = id? howl.volume(id) : howl.volume;
    howl.fade(oldVolume, newVolume, duration, id);
};

/**
 * Get/set the global volume for all sounds, relative to their own volume.
 * @param {Number} [volume] The new volume from `0.0` to `1.0`. If omitted, will return the current global volume.
 * 
 * @returns {Number} The current volume.
 */
ct.sound.globalVolume = Howler.volume.bind(Howler);

ct.sound.exists = function(name) {
    return (name in ct.res.sounds);
};

/* global ct Howler Howl */
(function () {
    ct.sound = {};
    ct.sound.howler = Howler;
    Howler.orientation(0, -1, 0, 0, 0, 1);
    Howler.pos(0, 0, 0);
    ct.sound.howl = Howl;

    var defaultMaxDistance = [/*%defaultMaxDistance%*/][0] || 2500;
    ct.sound.useDepth = [/*%useDepth%*/][0] === void 0? false : [/*%useDepth%*/][0];
    ct.sound.manageListenerPosition = [/*%manageListenerPosition%*/][0] === void 0? true : [/*%manageListenerPosition%*/][0];
    
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
    
    var set3Dparameters = (howl, opts, id) => {
        howl.pannerAttr({
            coneInnerAngle: opts.coneInnerAngle || 360,
            coneOuterAngle: opts.coneOuterAngle || 360,
            coneOuterGain: opts.coneOuterGain || 1,
            distanceModel: opts.distanceModel || 'linear',
            maxDistance: opts.maxDistance || defaultMaxDistance,
            refDistance: opts.refDistance || 1,
            rolloffFactor: opts.rolloffFactor || 1,
            panningModel: opts.panningModel || 'HRTF',
        }, id);
    };
    /**
     * Spawns a new sound and plays it.
     * 
     * @param {String} name The name of a sound to be played
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
        if (opts.rate !== void 0) {
            howl.rate(opts.rate, id);
        }
        if (opts.x !== void 0 || opts.position) {
            if (opts.x !== void 0) {
                howl.pos(opts.x, opts.y || 0, opts.z || 0, id);
            } else {
                const copy = opts.position;
                howl.pos(copy.x, copy.y, opts.z || (ct.sound.useDepth? copy.depth : 0), id);
            }
            set3Dparameters(howl, opts, id);
        }
        if (cb) {
            howl.once('end', cb, id);
        }
        return id;
    };
    
    /**
     * Stops playback of a sound, resetting its time to 0.
     * 
     * @param {String} name The name of a sound
     * @param {Number} [id] An optional ID of a particular sound
     * @returns {void}
     */
    ct.sound.stop = function(name, id) {
        ct.res.sounds[name].stop(id);
    };
    
    /**
     * Pauses playback of a sound or group, saving the seek of playback.
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
     * @param {String} name The name of a sound to affect.
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
     * @param {String} name The name of a sound to affect.
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
     * Moves the 3D listener to a new position.
     * 
     * @see https://github.com/goldfire/howler.js#posx-y-z
     * 
     * @param {Number} x The new x coordinate 
     * @param {Number} y The new y coordinate
     * @param {Number} z The new z coordinate
     * 
     * @returns {void}
     */
    ct.sound.moveListener = function(x, y, z) {
        Howler.pos(x, y, z || 0);
    };

    /**
     * Moves a 3D sound to a new location
     * 
     * @param {String} name The name of a sound to move
     * @param {Number} id The ID of a particular sound. Pass `null` if you want to affect all the sounds of a given name.
     * @param {Number} x The new x coordinate 
     * @param {Number} y The new y coordinate
     * @param {Number} [z] The new z coordinate
     * 
     * @returns {void}
     */
    ct.sound.position = function(name, id, x, y, z) {
        var howl = ct.res.sounds[name],
            oldPosition = howl.pos(id);
        howl.pos(x, y, z || oldPosition[2], id);
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
})();

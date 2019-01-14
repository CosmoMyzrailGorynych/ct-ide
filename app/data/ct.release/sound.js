if (!ct.sound) {
    ct.sound = {
        /** 
         * Detects if a particular codec is supported in the system 
         * @param {String} type Codec/MIME-type to look for
         * @returns {Boolean} true/false
         */
        detect(type) {
            var au = document.createElement('audio');
            return Boolean(au.canPlayType && au.canPlayType(type).replace(/no/, ''));
        },
        /** 
         * Creates a new Sound object and puts it in resource object 
         * 
         * @param {String} name Sound's name
         * @param {String} wav Local path to the sound in wav format
         * @param {String} mp3 Local path to the sound in mp3 format
         * @param {Number} [options] An options object
         * 
         * @returns {Object} Sound's object
         */
        init(name, wav, mp3, options) {
            var src = '';
            if (ct.sound.mp3 && mp3) {
                src = mp3;
            } else if (ct.sound.wav && wav) {
                src = wav;
            }
            options = options || {};
            var audio = {
                src,
                direct: document.createElement('audio'),
                pool: [],
                poolSize: options.poolSize || 5
            };
            if (src !== '') {
                ct.res.soundsLoaded++;
                audio.direct.preload = options.music? 'metadata' : 'auto';
                audio.direct.onerror = audio.direct.onabort = function () {
                    console.error('[ct.sound] Oh no! We couldn\'t load ' + src + '!');
                    audio.buggy = true;
                    ct.res.soundsError++;
                    ct.res.soundsLoaded--;
                };
                audio.direct.src = src;
            } else {
                ct.res.soundsError++;
                audio.buggy = true;
                console.error('[ct.sound] We couldn\'t load sound named "' + name + '" because the browser doesn\'t support any of proposed formats.');
            }
            ct.res.sounds[name] = audio;
            return audio;
        },
        /**
         * Spawns a new sound and plays it.
         * 
         * @param {String} name The name of sound to be played
         * @param {Object} [opts] Options object that is applied to a newly created audio tag
         * @param {Function} [cb] A callback, which is called when the sound finishes playing
         * 
         * @returns {HTMLTagAudio|Boolean} The created audio or `false` (if a sound wasn't created)
         */
        spawn(name, opts, cb) {
            opts = opts || {};
            if (typeof opts === 'function') {
                cb = opts;
            }
            var s = ct.res.sounds[name];
            if (s.pool.length < s.poolSize) {
                var a = document.createElement('audio');
                a.src = s.src;
                if (opts) {
                    ct.u.ext(a, opts);
                }
                s.pool.push(a);
                a.addEventListener('ended', function (e) {
                    s.pool.splice(s.pool.indexOf(a), 1);
                    if (cb) {
                        cb(true, e);
                    }
                });

                a.play();
                return a;
            } else if (cb) {
                cb(false);
            }
            return false;
        },
        exists(name) {
            return (name in ct.res.sounds);
        }
    };

    // define sound types we can support
    ct.sound.wav = ct.sound.detect('audio/wav; codecs="1"');
    ct.sound.mp3 = ct.sound.detect('audio/mpeg;');
}

/*@sound@*/

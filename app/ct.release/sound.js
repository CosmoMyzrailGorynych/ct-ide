ct.sound = {
    detect(type){
        var au = document.createElement('audio');
        return Boolean(au.canPlayType && au.canPlayType(type).replace(/no/, ''));
    },
    init(name, wav, mp3, ogg) {
        // Creates a new Sound object and puts it in resource object
        var src = '';
        if (ct.sound.ogg && ogg) {
            src = ogg;
        } else if (ct.sound.mp3 && mp3) {
         src = mp3;
        } else if (ct.sound.wav && wav) {
            src = wav;
        }
        var audio = document.createElement('audio');
        audio.style.display = 'none';
        if (src !== '') {
            ct.res.soundsLoaded++;
            audio.onerror = audio.onabort = function () {
                console.error('[ct.sound] Oh no! We couldn\'t load ' + this.src + '!');
                ct.res.soundsError++;
                ct.res.soundsLoaded--;
            };
            audio.setAttribute('src', src);
        } else {
            ct.res.soundsError++;
            audio.buggy = true;
            console.error('[ct.sound] We couldn\'t load sound named "' + name + '" because the browser doesn\'t support any of proposed formats.');
        }
        ct.res.sounds[name] = audio;
        document.body.appendChild(audio);
    },
    play(name) {
        ct.res.sounds[name].loop = false;
        ct.res.sounds[name].play();
    },
    loop(name) {
        ct.res.sounds[name].loop = true;
        ct.res.sounds[name].play();
    },
    pause(name) {
        ct.res.sounds[name].pause();
    },
    volume(name, power) {
        if (power !== void 0) {
            ct.res.sounds[name].volume = power;
        }
        return ct.res.sounds[name].volume;
    },
    time(name, time) {
        if (time !== void 0) {
            ct.res.sounds[name].currentTime = time;
        }
        return ct.res.sounds[name].currentTime;
    },
    duration(name) {
        return ct.res.sounds[name].duration;
    }
};

// define sound types we can support
ct.sound.wav = ct.sound.detect('audio/wav; codecs="1"');
ct.sound.ogg = ct.sound.detect('audio/ogg; codecs="vorbis"');
ct.sound.mp3 = ct.sound.detect('audio/mpeg;');

/*@sound@*/

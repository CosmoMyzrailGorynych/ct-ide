/***************************************

            [ sound cotomod ]

***************************************/

ct.sound = {
    'detect': function (type){
        var au = document.createElement('audio');
        return !!(au.canPlayType && au.canPlayType(type).replace(/no/, ''));
    },
    'init': function(name, wav, mp3, ogg) {
    // Creates a new Sound object and puts it in resource object
        var src = '',
            type = 'none';
        if (ct.sound.ogg && (ogg != undefined && ogg != '')) {
            type = 'ogg';
            src = ogg;
        } else if (ct.sound.mp3 && (mp3 != undefined && mp3 != '')) {
         type = 'mp3';
         src = mp3;
        } else if (ct.sound.wav && (wav != undefined && wav != '')) {
            type = 'wav';
            src = wav;
        }
        var audio = document.createElement('audio');
        audio.style.display = 'none';
        if (src != '') {
            ct.res.soundsLoaded ++;
            audio.onerror = audio.onabort = function () {
                console.log('[ct.sound] Катастрофа! Звук с урл ' + this.src + ' не удалось загрузить!');
                console.log('[ct.sound] Oh no! We couldn\'t load ' + this.src + '!');
                ct.res.soundsError ++;
                ct.res.soundsLoaded --;
            };
            audio.setAttribute('src', src);
        } else {
            ct.res.soundsError ++;
            audio.buggy = true;
            console.log('[ct.sound] Звук "' + name + '" не удалось загрузить, т.к. такие форматы не поддерживаются браузером.');
            console.log('[ct.sound] We couldn\'t load sound named "' + name + '" because the browser doesn\'t support any of proposed formats.');
        }
        ct.res.sounds[name] = audio;
        document.body.appendChild(audio);
    },
    'play': function (name) {
        ct.res.sounds[name].loop = false;
        ct.res.sounds[name].play();
    },
    'loop': function (name) {
        ct.res.sounds[name].loop = true;
        ct.res.sounds[name].play();
    },
    'pause': function (name) {
        ct.res.sounds[name].pause();
    },
    'volume': function (name,power) {
        if (power == undefined) return ct.res.sounds[name].volume;
        return ct.res.sounds[name].volume = power;
    },
    'time': function (name,time) {
        if (time == undefined) return ct.res.sounds[name].currentTime;
        return ct.res.sounds[name].currentTime = time;
    },
    'duration': function (name) {
        return ct.res.sounds[name].duration;
    }
};

// define sound types we can support
ct.sound.wav = ct.sound.detect('audio/wav; codecs="1"');
ct.sound.ogg = ct.sound.detect('audio/ogg; codecs="vorbis"');
ct.sound.mp3 = ct.sound.detect('audio/mpeg;');

@sound@

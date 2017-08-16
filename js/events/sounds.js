window.events = window.events || {};
//-------------- events -------------------

events.fillSounds = function() {
    $('#sounds ul').empty();
    for (var i = 0; i < currentProject.sounds.length; i++) {
        $('#sounds ul').append(tmpl.sound.f(
            currentProject.sounds[i].name,
            //sessionStorage.projdir + '/sounds/s' + currentProject.sounds[i].uid + '.png',
            assets + '/img/wave.png',
            i
        ));
    }
};
events.soundNew = function () {
    var obj = {
        name: 'sound' + currentProject.soundtick,
        uid: currentProject.soundtick
    };
    $('#sounds ul').append(tmpl.sound.f(
        'sound' + currentProject.soundtick,
        assets + '/img/wave.png',
        currentProject.sounds.length
    ));
    currentProject.soundtick ++;
    currentProject.sounds.push(obj);
    $('#sounds .cards li:last').click();
    $('#inputsound').click();
};
events.openSound = function (sound) {
    currentSound = currentProject.sounds[sound];
    $('#soundname').val(currentSound.name);
    $('#soundview').show();
    if (currentSound.origname) {
        $('#soundaudio').attr('src', sessionStorage.projdir + '/snd/' + currentSound.origname);
    }
};
events.soundPlay = function () {
    if (glob.playing) {
        glob.playing = false;
        document.getElementById('soundaudio').pause();
//        $('#listen div').css('width',0);
    } else {
        glob.playing = true;
        document.getElementById('soundaudio').play();
/*        glob.soundplayinterval = setInterval(function () {
            $('#listen div').css('width',document.getElementById('soundaudio').position / document.getElementById('soundaudio').duration);
        }, 100);*/
    }
}

events.soundSave = function () {
    if (glob.playing) {
        events.soundPlay();
    }
    events.fillSounds();
    $('#soundview').hide();
};

//------------ menus ----------------------

soundMenu = new gui.Menu(); // +
soundMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function () {
        $('#sounds .cards li[data-sound="{0}"]'.f(currentSoundId)).click();
    }
}));
soundMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.rename,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    currentSound.name = nam;
                    events.fillSounds();
                }
            }
        }, currentSound.name);
    }
}));
soundMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        alertify.confirm(languageJSON.common.confirmDelete.f(currentSound.name), function (e) {
            if (e) {
                currentProject.sounds.splice(currentSoundId,1);
                events.fillSounds();
            }
        });
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on sound cards
    $('#sounds .cards').delegate('li', 'click', function() {
        events.openSound($(this).attr('data-sound'));
    }).delegate('li', 'contextmenu', function (e) {
        var me = $(this);
        currentSound = currentProject.sounds[me.attr('data-sound')];
        currentSoundId = me.attr('data-sound');
        soundMenu.popup(e.clientX, e.clientY);
    });
    $('#inputsound').change(function () {
        me = $(this);
        currentSound.origname = 's' + currentSound.uid + path.extname(me.val());
        megacopy(me.val(),sessionStorage.projdir + '/snd/' + currentSound.origname, function () {
            $('#soundaudio').attr('src', sessionStorage.projdir + '/snd/' + currentSound.origname);
        });
        me.val('');
    });
    $('#soundaudio').on('play', function () {
        glob.playing = true;
    });
});

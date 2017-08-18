sounds-panel.panel.view
    button#soundcreate(onclick="{soundNew}")
        i.icon.icon-lamp
        span {voc.create}
    ul.cards
        li(each="{sound in window.currentProject.sound}" style="background-image: url('/img/wave.png');" onclick="{openSound(sound)}")
            span {sound.name}
            img(src="/img/wave.png")
    sound-editor(if="{editing}" sound="{editedSound}")
    script.
        this.voc = window.languageJSON.sounds;
        this.soundNew = e => {
            var newSound = {
                name: 'sound' + currentProject.soundtick,
                uid: currentProject.soundtick
            };
            window.currentProject.soundtick++;
            window.currentProject.sounds.push(newSound);
            this.openSound(newSound);
        };
        this.openSound => sound => e {
            this.editedSound = sound;
            this.editing = true;
        };

sounds-panel.panel.view
    button#soundcreate(onclick="{soundNew}")
        i.icon.icon-lamp
        span {voc.create}
    ul.cards
        li(
            each="{sound in window.currentProject.sound}"
            style="background-image: url('/img/wave.png');"
            onclick="{openSound(sound)}"
            oncontextmenu="{popupMenu(sound)}"
        )
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
        this.fillSounds = () => {
            
        };
        
        // Контекстное меню, вызываемое при клике ПКМ по карточке звука 
        var soundMenu = new gui.Menu();
        soundMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
            click: () => {
                this.openSound(this.editedSound);
            }
        }));
        soundMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
            click: function () {
                alertify.prompt(window.languageJSON.common.newname, function (e, newName) {
                    if (e) {
                        if (newName != '') {
                            this.editedSound.name = newName;
                            this.fillSounds();
                        }
                    }
                }, this.editedSound.name);
            }
        }));
        soundMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: function () {
                alertify.confirm(window.languageJSON.common.confirmDelete.f(this.editedSound.name), e => {
                    if (e) {
                        var ind = window.currentProject.sounds.indexOf(this.editedSound);
                        window.currentProject.sounds.splice(ind, 1);
                        this.fillSounds();
                    }
                });
            }
        }));

        this.popupMenu = sound => e => {
            this.editedSound = sound;
            soundMenu.popup(e.clientX, e.clientY);
        };

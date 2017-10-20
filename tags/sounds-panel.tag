sounds-panel.panel.view
    button#soundcreate(onclick="{soundNew}")
        i.icon.icon-add
        span {voc.create}
    ul.cards
        li(
            each="{sound in window.currentProject.sounds}"
            onclick="{openSound(sound)}"
            oncontextmenu="{popupMenu(sound)}"
        )
            span {sound.name}
            img(src="/img/wave.png")
    sound-editor(if="{editing}" sound="{editedSound}")
    script.
        this.voc = window.languageJSON.sounds;
        const gui = require('nw.gui');
        
        this.soundNew = e => {
            var newSound = {
                name: 'sound' + currentProject.soundtick,
                uid: currentProject.soundtick
            };
            window.currentProject.soundtick++;
            window.currentProject.sounds.push(newSound);
            this.openSound(newSound);
        };
        this.openSound = sound => e => {
            this.editedSound = sound;
            this.editing = true;
            this.update();
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
            click: () => {
                alertify
                .defaultValue(this.editedSound.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue) {
                        this.editedSound.name = e.inputValue;
                    }
                });
            }
        }));
        soundMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        soundMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: () => {
                alertify
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedSound.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        var ind = window.currentProject.sounds.indexOf(this.editedSound);
                        window.currentProject.sounds.splice(ind, 1);
                    }
                });
            }
        }));

        this.popupMenu = sound => e => {
            this.editedSound = sound;
            soundMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

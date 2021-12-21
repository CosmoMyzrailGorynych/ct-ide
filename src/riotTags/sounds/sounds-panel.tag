sounds-panel.aPanel.aView
    asset-viewer(
        collection="{global.currentProject.sounds}"
        contextmenu="{popupMenu}"
        namespace="sounds"
        click="{openSound}"
        thumbnails="{thumbnails}"
        ref="sounds"
        class="tall"
    )
        button#soundcreate(onclick="{parent.soundNew}" title="Control+N" data-hotkey="Control+n")
            svg.feather
                use(xlink:href="#plus")
            span {parent.voc.create}
        button#soundcreate(onclick="{parent.openRecorder}" title="Control+R" data-hotkey="Control+r")
            svg.feather
                use(xlink:href="#mic")
            span {parent.voc.record}
    sound-editor(if="{editing}" sound="{editedSound}")
    sound-recorder(if="{recorderVisible}" onclose="{onCloseRecorder}")
    context-menu(menu="{soundMenu}" ref="soundMenu")
    script.
        this.namespace = 'sounds';
        this.mixin(window.riotVoc);
        this.mixin(window.riotNiceTime);
        this.sort = 'name';
        this.sortReverse = false;
        this.recorderVisible = false;

        this.thumbnails = sound => `data/img/${sound.isMusic ? 'music' : 'wave'}.png`;

        this.setUpPanel = () => {
            this.searchResults = null;
            this.editing = false;
            this.editedSound = null;
            this.refs.sounds.updateList();
            this.update();
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
        });

        this.soundNew = () => {
            if (this.editing) {
                return false;
            }
            const sounds = require('./data/node_requires/resources/sounds');
            const newSound = sounds.createNewSound();
            this.refs.sounds.updateList();
            this.openSound(newSound)();
            return true;
        };
        this.openSound = sound => () => {
            this.editedSound = sound;
            this.editing = true;
            this.update();
        };

        this.openRecorder = () => {
            this.recorderVisible = true;
        };
        this.onCloseRecorder = () => {
            this.recorderVisible = false;
            this.refs.sounds.updateList();
            this.update();
        };

        // A context menu called by clicking on a sound card with RMB
        this.soundMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: () => {
                    this.openSound(this.editedSound)();
                }
            }, {
                label: window.languageJSON.common.copyName,
                click: () => {
                    nw.Clipboard.get().set(this.editedSound.name, 'text');
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    alertify
                    .defaultValue(this.editedSound.name)
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue && e.buttonClicked !== 'cancel') {
                            this.editedSound.name = e.inputValue;
                            this.update();
                        }
                    });
                }
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.delete,
                click: () => {
                    alertify
                    .okBtn(window.languageJSON.common.delete)
                    .cancelBtn(window.languageJSON.common.cancel)
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedSound.name))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            var ind = global.currentProject.sounds.indexOf(this.editedSound);
                            global.currentProject.sounds.splice(ind, 1);
                            this.refs.sounds.updateList();
                            this.update();
                            alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };

        this.popupMenu = sound => e => {
            this.editedSound = sound;
            this.refs.soundMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

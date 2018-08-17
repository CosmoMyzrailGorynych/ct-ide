sounds-panel.panel.view
    .flexfix.tall
        .flexfix-header
            div
                .toright
                    b {vocGlob.sort}   
                    button.inline.square(onclick="{switchSort('date')}" class="{selected: sort === 'date' && !searchResults}")
                        i.icon-clock
                    button.inline.square(onclick="{switchSort('name')}" class="{selected: sort === 'name' && !searchResults}")
                        i.icon-sort-alphabetically
                    .aSearchWrap
                        input.inline(type="text" onkeyup="{fuseSearch}")
                .toleft
                    button#soundcreate(onclick="{soundNew}")
                        i.icon.icon-add
                        span {voc.create}
        ul.cards.flexfix-body
            li(
                each="{sound in (searchResults? searchResults : sounds)}"
                onclick="{openSound(sound)}"
                oncontextmenu="{popupMenu(sound)}"
            )
                span {sound.name}
                img(src="/img/{sound.isMusic? 'music' : 'wave'}.png")
    sound-editor(if="{editing}" sound="{editedSound}")
    script.
        this.namespace = 'sounds';
        this.mixin(window.riotVoc);
        this.sort = 'name';
        this.sortReverse = false;

        this.updateList = () => {
            this.sounds = [...window.currentProject.sounds];
            if (this.sort === 'name') {
                this.sounds.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            } else {
                this.sounds.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
            }
            if (this.sortReverse) {
                this.sounds.reverse();
            }
        };
        this.switchSort = sort => e => {
            if (this.sort === sort) {
                this.sortReverse = !this.sortReverse;
            } else {
                this.sort = sort;
                this.sortReverse = false;
            }
            this.updateList();
        };
        const fuseOptions = {
            shouldSort: true,
            tokenize: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['name']
        };
        const Fuse = require('fuse.js');
        this.fuseSearch = e => {
            if (e.target.value.trim()) {
                var fuse = new Fuse(this.sounds, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        this.on('mount', () => {
            this.updateList();
        });
        
        const gui = require('nw.gui');
        
        this.soundNew = e => {
            var id = window.generateGUID(),
                slice = id.split('-').pop();
            var newSound = {
                name: 'Sound_' + slice,
                uid: id
            };
            window.currentProject.sounds.push(newSound);
            this.updateList();
            this.openSound(newSound)();
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
            click: () => {
                this.openSound(this.editedSound);
            }
        }));
        // Пункт "Скопировать название"
        soundMenu.append(new gui.MenuItem({
            label: languageJSON.common.copyName,
            click: e => {
                var clipboard = nw.Clipboard.get();
                clipboard.set(this.editedSound.name, 'text');
            }
        }));
        soundMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            click: () => {
                alertify
                .defaultValue(this.editedSound.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue && e.buttonClicked !== 'cancel') {
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
            click: () => {
                alertify
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedSound.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        var ind = window.currentProject.sounds.indexOf(this.editedSound);
                        window.currentProject.sounds.splice(ind, 1);
                        this.updateList();
                        this.update();
                    }
                });
            }
        }));

        this.popupMenu = sound => e => {
            this.editedSound = sound;
            soundMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

rooms-panel.panel.view
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
                    button#roomcreate(onclick="{roomCreate}")
                        i.icon.icon-add
                        span {voc.create}
        ul.cards.rooms.flexfix-body
            li(
                each="{room in (searchResults? searchResults : rooms)}"
                class="{starting: window.currentProject.startroom === room.uid}"
                onclick="{openRoom(room)}"
                oncontextmenu="{menuPopup(room)}"
            )
                img(src="file://{sessionStorage.projdir + '/img/r' + room.uid + '.png?' + room.lastmod}")
                span {room.name}
    room-editor(if="{editing}" room="{editingRoom}")
    script.
        this.namespace = 'rooms';
        this.mixin(window.riotVoc);
        this.editing = false;
        this.sort = 'name';
        this.sortReverse = false;

        this.updateList = () => {
            this.rooms = [...window.currentProject.rooms];
            if (this.sort === 'name') {
                this.rooms.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            } else {
                this.rooms.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
            }
            if (this.sortReverse) {
                this.rooms.reverse();
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
                var fuse = new Fuse(this.rooms, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        this.on('mount', () => {
            this.updateList();
        });

        const gui = require('nw.gui'),
              fs = require('fs-extra'),
              path = require('path');
        this.roomCreate = function () {
            fs.copy('./img/nograph.png', path.join(sessionStorage.projdir + '/img/r' + (currentProject.roomtick + 1) + '.png'), () => {
                currentProject.roomtick ++;
                var newRoom = {
                    name: 'room' + currentProject.roomtick,
                    oncreate: '',
                    onstep: '',
                    ondraw: '',
                    onleave: '',
                    width: 800,
                    height: 600,
                    backgrounds: [],
                    layers: [],
                    uid: window.currentProject.roomtick
                };
                window.currentProject.rooms.push(newRoom);
                this.updateList();
                this.update();
            });
        };
        this.openRoom = room => e => {
            this.editingRoom = room;
            this.editing = true;
        };

        var roomMenu = new gui.Menu();
        roomMenu.append(new gui.MenuItem({
            label: this.voc.makestarting,
            click: () => {
                window.currentProject.startroom = this.editingRoom.uid;
                this.update();
            }
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            click: () => {
                this.openRoom(this.editingRoom);
            }
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.duplicate,
            click: () => {
                alertify
                .defaultValue(this.editingRoom.name + '_dup')
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue != '') {
                        var newRoom = JSON.parse(JSON.stringify(this.editingRoom));
                        window.currentProject.roomtick ++;
                        newRoom.name = e.inputValue;
                        window.currentProject.rooms.push(newRoom);
                        this.currentRoomId = window.currentProject.rooms.length - 1;
                        this.editingRoom = window.currentProject.rooms[currentRoomId];
                        fs.linkSync(sessionStorage.projdir + '/img/r' + newRoom.uid + '.png', sessionStorage.projdir + '/img/r' + window.currentProject.roomtick + '.png')
                        newRoom.uid = window.currentProject.roomtick;
                        this.updateList();
                        this.update();
                    }
                });
            }
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            click: () => {
                alertify
                .defaultValue(this.editingRoom.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue != '') {
                        var nam = e.inputValue;
                        this.editingRoom.name = nam;
                        this.update();
                    }
                });
            }
        }));
        roomMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            click: () => {
                alertify
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', currentRoom.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        var ind = window.currentProject.rooms.indexOf(this.editingRoom);
                        window.currentProject.rooms.splice(ind, 1);
                        this.updateList();
                        this.update();
                    }
                });
            }
        }));

        this.menuPopup = room => e => {
            this.editingRoom = room;
            roomMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

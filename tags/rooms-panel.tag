rooms-panel.panel.view
    button#roomcreate(onclick="{roomCreate}")
        i.icon.icon-add
        span {voc.create}
    ul.cards.rooms
        li(
            each="{room in window.currentProject.rooms}"
            class="{starting: window.currentProject.startroom === room.uid}"
            onclick="{openRoom(room)}"
            oncontextmenu="{menuPopup(room)}"
        )
            img(src="file://{sessionStorage.projdir + '/img/r' + room.uid + '.png?' + room.lastmod}")
            span {room.name}
    room-editor(if="{editing}" room="{editingRoom}")
    script.
        this.voc = window.languageJSON.rooms;
        this.editing = false;
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
                        var newRoom = JSON.parse(JSON.stringify(currentRoom));
                        window.currentProject.roomtick ++;
                        newRoom.name = e.inputValue;
                        window.currentProject.rooms.push(newRoom);
                        currentRoomId = window.currentProject.rooms.length - 1;
                        this.editingRoom = window.currentProject.rooms[currentRoomId];
                        fs.linkSync(sessionStorage.projdir + '/img/r' + newRoom.uid + '.png', sessionStorage.projdir + '/img/r' + window.currentProject.roomtick + '.png')
                        newRoom.uid = window.currentProject.roomtick;
                        this.update();
                    }
                });
            }
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            click: () => {
                alertify
                .defaultValue(currentRoom.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue != '') {
                        var nam = e.inputValue;
                        currentRoom.name = nam;
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

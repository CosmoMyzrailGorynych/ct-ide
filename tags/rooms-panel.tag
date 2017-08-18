rooms-panel.panel.view
    button#roomcreate(onclick="{roomCreate}")
        i.icon.icon-lamp
        span {voc.create}
    ul.cards.rooms
        li(
            each="{room in window.currentProject.rooms}"
            class="{starting: window.currentProject.startroom === room.uid}"
            onclick="{openRoom(room)}"
        )
            img(src="{sessionStorage.projdir + '/img/r' + room.uid + '.png'}")
            span {room.name}
    room-editor(if="{editing}" room="{editingRoom}")
    script.
        this.voc = window.languageJSON.rooms;
        this.editing = false;
        const gui = require('nw.gui'),
              fs = require('fs-extra');
        this.roomCreate = function () {
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
        };
        this.openRoom = room => e => {
            this.editingRoom = room;
            this.editing = true;
        };
        var roomMenu = new gui.Menu();
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
            click: function () {
                this.openRoom(this.editingRoom);
            }
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.duplicate,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
            click: function () {
                alertify.prompt(window.languageJSON.common.newname, (e, newName) => {
                    if (e) {
                        if (newName != '') {
                            var newRoom = JSON.parse(JSON.stringify(currentRoom));
                            window.currentProject.roomtick ++;
                            newRoom.name = newName;
                            window.currentProject.rooms.push(newRoom);
                            currentRoomId = window.currentProject.rooms.length - 1;
                            this.editingRoom = window.currentProject.rooms[currentRoomId];
                            fs.linkSync(sessionStorage.projdir + '/img/r' + newRoom.uid + '.png', sessionStorage.projdir + '/img/r' + window.currentProject.roomtick + '.png')
                            newRoom.uid = window.currentProject.roomtick;
                            this.update();
                        }
                    }
                }, this.editingRoom.name + '_dup');
            }
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
            click: function () {
                alertify.prompt(window.languageJSON.common.newname, function (e, r) {
                    if (e) {
                        if (r != '') {
                            var nam = r;
                            currentRoom.name = nam;
                            this.update();
                        }
                    }
                }, currentRoom.name);
            }
        }));
        roomMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: function () {
                alertify.confirm(window.languageJSON.common.confirmDelete.f(currentRoom.name), function (e) {
                    if (e) {
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
        };

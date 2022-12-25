//
    @method openAsset
rooms-panel.aPanel.aView
    asset-viewer(
        collection="{global.currentProject.rooms}"
        contextmenu="{menuPopup}"
        namespace="rooms"
        assettype="rooms"
        defaultlayout="largeCards"
        click="{openRoom}"
        thumbnails="{thumbnails}"
        icons="{icons}"
        ref="rooms"
        class="tall"
    )
        button#roomcreate(onclick="{parent.roomCreate}" data-hotkey="Control+n" title="Control+N")
            svg.feather
                use(xlink:href="#plus")
            span {parent.voc.create}
    room-editor(if="{editing}" room="{editingRoom}" onclose="{closeRoomEditor}")
    context-menu(menu="{roomMenu}" ref="roomMenu")
    script.
        const generateGUID = require('./data/node_requires/generateGUID');

        this.namespace = 'rooms';
        this.mixin(window.riotVoc);
        this.mixin(window.riotNiceTime);
        this.editing = false;

        const fs = require('fs-extra');
        const {createNewRoom} = require('./data/node_requires/resources/rooms');
        this.roomCreate = async () => {
            if (this.editing) {
                return false;
            }
            const newRoom = await createNewRoom();
            if (!this.refs.rooms.currentGroup.isUngroupedGroup) {
                newRoom.group = this.refs.rooms.currentGroup.uid;
            }
            this.openRoom(newRoom)();
            this.refs.rooms.updateList();
            this.update();
            return true;
        };
        this.openRoom = room => () => {
            this.editingRoom = room;
            this.editing = true;
        };
        this.closeRoomEditor = () => {
            this.editingRoom = void 0;
            this.editing = false;
            this.update();
        };

        this.roomMenu = {
            items: [{
                icon: 'play',
                label: this.voc.makeStarting,
                click: () => {
                    global.currentProject.startroom = this.editingRoom.uid;
                    this.update();
                }
            }, {
                label: window.languageJSON.common.open,
                click: () => {
                    this.openRoom(this.editingRoom)();
                    this.update();
                }
            }, {
                label: window.languageJSON.common.copyName,
                click: () => {
                    nw.Clipboard.get().set(this.editingRoom.name, 'text');
                }
            }, {
                label: window.languageJSON.common.duplicate,
                click: () => {
                    window.alertify
                    .defaultValue(this.editingRoom.name + '_dup')
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            var guid = generateGUID();
                            var newRoom = JSON.parse(JSON.stringify(this.editingRoom));
                            newRoom.name = e.inputValue;
                            global.currentProject.rooms.push(newRoom);
                            newRoom.uid = guid;
                            try {
                                fs.linkSync(`${global.projdir}/img/r${this.editingRoom.uid}.png`, `${global.projdir}/img/r${guid}.png`);
                            } catch (e) {
                                fs.linkSync('./data/img/notexture.png', `${global.projdir}/img/r${guid}.png`);
                            }
                            this.refs.rooms.updateList();
                            this.update();
                        }
                    });
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    window.alertify
                    .defaultValue(this.editingRoom.name)
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            var nam = e.inputValue;
                            this.editingRoom.name = nam;
                            this.update();
                        }
                    });
                }
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.delete,
                click: () => {
                    window.alertify
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editingRoom.name))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            var ind = global.currentProject.rooms.indexOf(this.editingRoom);
                            global.currentProject.rooms.splice(ind, 1);
                            this.refs.rooms.updateList();
                            this.update();
                            window.alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };

        this.menuPopup = room => e => {
            this.editingRoom = room;
            this.refs.roomMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        this.thumbnails = require('./data/node_requires/resources/rooms').getRoomPreview;
        this.icons = room => {
            const icons = [];
            if (room.uid === window.currentProject.startroom) {
                icons.push('play');
            }
            if (room.extends && room.extends.isUi) {
                icons.push('ui');
            }
            return icons;
        };

        this.openAsset = (assetType, uid) => {
            if (assetType !== 'rooms') {
                return;
            }
            const room = global.currentProject.rooms.find(room => room.uid === uid);
            this.openRoom(room)();
            this.refs.rooms.updateList();
            if (this.parent) {
                this.parent.update();
            }
        };

types-panel.aPanel.aView
    asset-viewer(
        collection="{global.currentProject.types}"
        contextmenu="{onTypeContextMenu}"
        namespace="types"
        assettype="types"
        click="{openType}"
        thumbnails="{thumbnails}"
        icons="{icons}"
        ref="types"
        class="tall"
    )
        button#typecreate(onclick="{parent.typeCreate}" title="Control+N" data-hotkey="Control+n")
            svg.feather
                use(xlink:href="#plus")
            span {parent.voc.create}
    type-editor(if="{editingType}" type="{editedType}")
    context-menu(menu="{typeMenu}" ref="typeMenu")
    script.
        this.namespace = 'types';
        this.mixin(window.riotVoc);
        this.mixin(window.riotNiceTime);
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.editingType = false;
        this.sort = 'name';
        this.sortReverse = false;

        this.thumbnails = require('./data/node_requires/resources/types').getTypePreview;
        this.icons = function icons(type) {
            const icons = [];
            if (type.oncreate.trim()) {
                icons.push('sun');
            }
            if (type.onstep.trim()) {
                icons.push('skip-forward');
            }
            if (type.ondraw.trim()) {
                icons.push('edit-2');
            }
            if (type.ondestroy.trim()) {
                icons.push('trash');
            }
            return icons;
        };

        this.setUpPanel = () => {
            this.fillTypeMap();
            this.refs.types.updateList();
            this.searchResults = null;
            this.editingType = false;
            this.editedType = null;
            this.update();
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
        });

        this.getTypeTextureRevision = type => glob.texturemap[type.texture].g.lastmod;

        this.fillTypeMap = () => {
            delete glob.typemap;
            glob.typemap = {};
            for (let i = 0; i < global.currentProject.types.length; i++) {
                glob.typemap[global.currentProject.types[i].uid] = i;
            }
        };
        this.typeCreate = e => {
            if (this.editingType) {
                return false;
            }

            const typesAPI = require('./data/node_requires/resources/types/');
            const type = typesAPI.createNewType();
            if (!this.refs.types.currentGroup.isUngroupedGroup) {
                type.group = this.refs.types.currentGroup.uid;
            }
            this.refs.types.updateList();
            this.openType(type)(e);

            if (!e) {
                this.update();
            }
            return true;
        };
        this.openType = type => () => {
            this.editingType = true;
            this.editedType = type;
        };

        const assetListener = asset => {
            const [assetType, uid] = asset.split('/');
            if (assetType !== 'types') {
                return;
            }
            const type = global.currentProject.types.find(type => type.uid === uid);
            this.openType(type)();
            this.refs.types.updateList();
            if (this.parent) {
                this.parent.update();
            }
        };
        window.orders.on('openAsset', assetListener);
        this.on('unmount', () => {
            window.orders.off('openAsset', assetListener);
        });

        this.typeMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: () => {
                    this.openType(this.currentType)();
                    this.update();
                }
            }, {
                label: window.languageJSON.common.copyName,
                click: () => {
                    nw.Clipboard.get().set(this.currentType.name, 'text');
                }
            }, {
                label: window.languageJSON.common.duplicate,
                click: () => {
                    alertify
                    .defaultValue(this.currentType.name + '_dup')
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            const generateGUID = require('./data/node_requires/generateGUID');
                            const tp = JSON.parse(JSON.stringify(this.currentType));
                            tp.name = e.inputValue;
                            tp.uid = generateGUID();
                            global.currentProject.types.push(tp);
                            this.fillTypeMap();
                            this.refs.types.updateList();
                            this.update();
                        }
                    });
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    alertify
                    .defaultValue(this.currentType.name)
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            this.currentType.name = e.inputValue;
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
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentType.name))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            for (const room of global.currentProject.rooms) {
                                let i = 0;
                                while (i < room.copies.length) {
                                    if (room.copies[i].uid === this.currentType.uid) {
                                        room.copies.splice(i, 1);
                                    } else {
                                        i++;
                                    }
                                }
                            }

                            const ind = global.currentProject.types.indexOf(this.currentType);
                            global.currentProject.types.splice(ind, 1);
                            this.refs.types.updateList();
                            this.fillTypeMap();
                            this.update();
                            window.signals.trigger('typesChanged');
                            alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };
        this.onTypeContextMenu = type => e => {
            this.currentType = type;
            this.refs.typeMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

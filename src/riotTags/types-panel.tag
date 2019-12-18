types-panel.panel.view
    .flexfix.tall
        .flexfix-header
            div
                .toright
                    b {vocGlob.sort}
                    button.inline.square(onclick="{switchSort('date')}" class="{selected: sort === 'date' && !searchResults}")
                        svg.feather
                            use(xlink:href="data/icons.svg#clock")
                    button.inline.square(onclick="{switchSort('name')}" class="{selected: sort === 'name' && !searchResults}")
                        svg.feather
                            use(xlink:href="data/icons.svg#sort-alphabetically")
                    .aSearchWrap
                        input.inline(type="text" onkeyup="{fuseSearch}")
                .toleft
                    button#typecreate(onclick="{typeCreate}" title="Control+N" data-hotkey="Control+n")
                        svg.feather
                            use(xlink:href="data/icons.svg#plus")
                        span {voc.create}
        ul.cards.flexfix-body
            li(
                each="{type in (searchResults? searchResults : types)}"
                onclick="{openType(type)}"
                oncontextmenu="{onTypeContextMenu}"
                onlong-press="{onTypeContextMenu}"
            )
                span {type.name}
                img(src="{type.texture !== -1 ? (glob.texturemap[type.texture].src.split('?')[0] + '_prev.png?' + getTypeTextureRevision(type)) : 'data/img/notexture.png'}")
    type-editor(if="{editingType}" type="{editedType}")
    context-menu(menu="{typeMenu}" ref="typeMenu")
    script.
        this.namespace = 'types';
        this.mixin(window.riotVoc);
        const glob = require('./data/node_requires/glob');
        const generateGUID = require('./data/node_requires/generateGUID');
        this.glob = glob;
        this.editingType = false;
        this.sort = 'name';
        this.sortReverse = false;

        this.updateList = () => {
            this.types = [...window.currentProject.types];
            if (this.sort === 'name') {
                this.types.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            } else {
                this.types.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
            }
            if (this.sortReverse) {
                this.types.reverse();
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
                var fuse = new Fuse(this.types, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };

        this.setUpPanel = e => {
            this.fillTypeMap();
            this.updateList();
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
            for (let i = 0; i < window.currentProject.types.length; i++) {
                glob.typemap[currentProject.types[i].uid] = i;
            }
        };
        this.typeCreate = e => {
            if (this.editingType) {
                return false;
            }
            var id = generateGUID(),
                slice = id.split('-').pop();
            var obj = {
                name: 'Type_' + slice,
                depth: 0,
                oncreate: '',
                onstep: 'this.move();',
                ondraw: '',
                ondestroy: '',
                uid: id,
                texture: -1,
                extends: {}
            };
            window.currentProject.types.push(obj);
            this.updateList();
            this.openType(obj)(e);
            window.signals.trigger('typesChanged');

            if (!e) {
                this.update();
            }
        };
        this.openType = type => e => {
            this.editingType = true;
            this.editedType = type;
        };

        this.typeMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: () => {
                    this.openType(this.currentType)();
                    this.update();
                }
            }, {
                label: languageJSON.common.copyName,
                click: e => {
                    const {clipboard} = require('electron');
                    clipboard.writeText(this.currentType.name);
                }
            }, {
                label: window.languageJSON.common.duplicate,
                click: () => {
                    alertify
                    .defaultValue(this.currentType.name + '_dup')
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue != '' && e.buttonClicked !== 'cancel') {
                            var tp = JSON.parse(JSON.stringify(this.currentType));
                            tp.name = e.inputValue;
                            tp.uid = generateGUID();
                            currentProject.types.push(tp);
                            this.fillTypeMap();
                            this.updateList();
                            this.update();
                        }
                    });
                }
            }, {
                label: window.languageJSON.common.rename,
                click:  () => {
                    alertify
                    .defaultValue(this.currentType.name)
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue != '' && e.buttonClicked !== 'cancel') {
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
                            for (const room of window.currentProject.rooms) {
                                let i = 0;
                                while (i < room.copies.length) {
                                    if (room.copies[i].uid === this.currentType.uid) {
                                        room.copies.splice(i, 1);
                                    } else {
                                        i++;
                                    }
                                }
                            }

                            let ind = window.currentProject.types.indexOf(this.currentType);
                            window.currentProject.types.splice(ind, 1);
                            this.updateList();
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
        this.onTypeContextMenu = e => {
            this.currentType = e.item.type;
            this.refs.typeMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

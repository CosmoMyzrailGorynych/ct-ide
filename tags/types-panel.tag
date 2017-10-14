types-panel.panel.view
    button#typecreate(onclick="{typeCreate}")
        i.icon.icon-add
        span {voc.create}
    ul.cards
        li(each="{type in window.currentProject.types}" onclick="{openType(type)}" oncontextmenu="{onTypeContextMenu}")
            span {type.name}
            img(src="{type.graph !== -1 ? 'file://' + sessionStorage.projdir + '/img/' + type.graph + '_prev.png?' + getTypeGraphRevision(type) : '/img/nograph.png'}")
    type-editor(if="{editingType}" type="{editedType}")
    script.
        this.voc = window.languageJSON.types;
        const gui = require('nw.gui');
        this.editingType = false;
        
        this.on('mount', () => {
            this.fillTypeMap();
        });

        this.getTypeGraphRevision = type => window.glob.graphmap[type.graph].g.lastmod;

        this.fillTypeMap = () => {
            delete window.glob.typemap;
            window.glob.typemap = {};
            for (let i = 0; i < window.currentProject.types.length; i++) {
                window.glob.typemap[currentProject.types[i].uid] = i;
            }
        };
        this.typeCreate = e => {
            window.currentProject.typetick ++;
            var obj = {
                name: 'type' + window.currentProject.typetick,
                depth: 0,
                oncreate: '',
                onstep: '',
                ondraw: 'ct.draw(this);',
                ondestroy: '',
                uid: currentProject.typetick,
                graph: -1
            };
            window.currentProject.types.push(obj);
            this.openType(obj)(e);
        };
        this.openType = type => e => {
            this.editingType = true;
            this.editedType = type;
        };
        
        var typeMenu = new gui.Menu();
        this.onTypeContextMenu = e => {
            this.currentType = e.item.type;
            typeMenu.popup(e.clientX, e.clientY);
        };
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
            click: () => {
                this.openType(this.currentType)();
            }
        }));
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.duplicate,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
            click: function () {
                alertify.prompt(window.languageJSON.common.newname, function (e, newName) {
                    if (e) {
                        if (newName != '') {
                            var tp = JSON.parse(JSON.stringify(currentType));
                            currentProject.typetick ++;
                            tp.name = newName;
                            tp.uid = currentProject.typetick;
                            currentProject.types.push(tp);
                            this.currentType = currentProject.types[currentTypeId];
                            this.fillTypeMap();
                            this.update();
                        }
                    }
                }, this.editedType.name + '_dup');
            }
        }));
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
            click: function () {
                alertify.prompt(window.languageJSON.common.newname, function (e, newName) {
                    if (e) {
                        if (newName != '') {
                            this.editedType.name = newName;
                            this.update();
                        }
                    }
                }, this.editedType.name);
            }
        }));
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: function () {
                alertify.confirm(window.languageJSON.common.confirmDelete.f(this.editedType.name), function (e) {
                    if (e) {
                        let ind = window.currentProject.types.indexOf(this.editedType);
                        window.currentProject.types.splice(ind, 1);
                        this.fillTypeMap();
                        this.update();
                    }
                });
            }
        }));

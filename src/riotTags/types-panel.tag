types-panel.panel.view
    .flexfix.tall
        .flexfix-header
            button#typecreate(onclick="{typeCreate}")
                i.icon.icon-add
                span {voc.create}
        ul.cards.flexfix-body
            li(each="{type in window.currentProject.types}" onclick="{openType(type)}" oncontextmenu="{onTypeContextMenu}")
                span {type.name}
                img(src="{type.graph !== -1 ? 'file://' + sessionStorage.projdir + '/img/' + type.graph + '_prev.png?' + getTypeGraphRevision(type) : '/img/nograph.png'}")
    type-editor(if="{editingType}" type="{editedType}")
    script.
        this.namespace = 'types';
        this.mixin(window.riotVoc);
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
                onstep: 'ct.types.move(this);',
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
            e.preventDefault();
        };
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
            click: () => {
                this.openType(this.currentType)();
                this.update();
            }
        }));
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.duplicate,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
            click: () => {
                alertify
                .defaultValue(this.currentType.name + '_dup')
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue != '') {
                        var tp = JSON.parse(JSON.stringify(this.currentType));
                        currentProject.typetick ++;
                        tp.name = e.inputValue;
                        tp.uid = currentProject.typetick;
                        currentProject.types.push(tp);
                        this.fillTypeMap();
                        this.update();
                    }
                });
            }
        }));
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
            click:  () => {
                alertify
                .defaultValue(this.currentType.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue != '') {
                        this.currentType.name = e.inputValue;
                        this.update();
                    }
                });
            }
        }));
        typeMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        typeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: () => {
                alertify
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentType.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        let ind = window.currentProject.types.indexOf(this.currentType);
                        window.currentProject.types.splice(ind, 1);
                        this.fillTypeMap();
                        this.update();
                    }
                });
            }
        }));

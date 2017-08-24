styles-panel
    button#stylecreate(onclick="styleCreate")
        i.icon.icon-lamp
        span {voc.create}
    ul.cards
        li(each="{style in window.currentProject.styles}" onclick="{openStyle(style)}" oncontextmenu="{onStyleContextMenu}")
            span {style.name}
            img(src="{window.sessionStorage.projdir + '/img/s' + style.uid + '.png'}")
    style-editor(if="{editingStyle}" styleobj="{editedStyle}")
    script.
        this.editingStyle = false;
        this.voc = window.languageJSON.styles
        
        const gui = require('nw.gui');
        
        this.styleCreate = () => {
            window.currentProject.styletick ++;
            var obj = {
                name: "style" + window.currentProject.styletick,
                shadow: false,
                stroke: false,
                fill: false,
                font: false,
                uid: window.currentProject.styletick
            };
            window.currentProject.styles.push(obj);
            this.editedStyle = obj;
            this.editingStyle = true;
        };
        this.openStyle = style => e => {
            this.editingStyle = true;
            this.editedStyle = style;
        };
        
        // Контекстное меню для управления стилями по нажатию ПКМ по карточкам
        var styleMenu = new gui.Menu();
        this.onStyleContextMenu = e => {
            this.editedStyle = e.item.style;
            styleMenu.popup(e.clientX, e.clientY);
        };
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
            click: e => {
                this.editingStyle = true;
                this.update();
            }
        }));
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.duplicate,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
            click: () => {
                window.alertify.prompt(window.languageJSON.common.newname, (e, newName) => {
                    if (e) {
                        if (newName !== '') {
                            var newStyle = JSON.parse(JSON.stringify(this.editedStyle));
                            window.currentProject.styletick ++;
                            newStyle.name = newName;
                            newStyle.uid = window.currentProject.styletick;
                            window.currentProject.styles.push(newStyle);
                            this.editedStyleId = window.currentProject.styles.length - 1;
                            this.editedStyle = newStyle;
                            this.styleGenPreview();
                            this.update();
                        }
                    }
                }, this.editedStyle.name + '_dup');
            }
        }));
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
            click: function () {
                alertify.prompt(window.languageJSON.common.newname, (e, newName) => {
                    if (e) {
                        if (newName !== '') {
                            this.editedStyle.name = newName;
                            this.update();
                        }
                    }
                }, this.editedStyle.name);
            }
        }));
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: e => {
                window.alertify.confirm(window.languageJSON.common.confirmDelete.f(this.editedStyle.name), confirmed => {
                    if (confirmed) {
                        const ind = window.currentProject.styles.indexOf(this.editedStyle);
                        window.currentProject.styles.splice(ind, 1);
                        this.update();
                    }
                });
            }
        }));

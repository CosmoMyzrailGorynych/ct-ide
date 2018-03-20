styles-panel.panel.view
    button#stylecreate(onclick="{styleCreate}")
        i.icon.icon-add
        span {voc.create}
    ul.cards
        li(each="{style in window.currentProject.styles}" onclick="{openStyle(style)}" oncontextmenu="{onStyleContextMenu}")
            span {style.name}
            img(src="{window.sessionStorage.projdir + '/img/s' + style.uid + '_prev.png'}")
    style-editor(if="{editingStyle}" styleobj="{editedStyle}")
    script.
        this.editingStyle = false;
        
        this.namespace = 'styles';
        this.mixin(window.riotVoc);
        
        const gui = require('nw.gui');
        
        this.styleCreate = () => {
            window.currentProject.styletick ++;
            var obj = {
                name: "style" + window.currentProject.styletick,
                shadow: false,
                stroke: false,
                fill: false,
                font: false,
                uid: window.currentProject.styletick,
                origname: 's' + window.currentProject.styletick
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
                alertify
                .defaultValue(this.editedStyle.name + '_dup')
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue !== '') {
                        var newStyle = JSON.parse(JSON.stringify(this.editedStyle));
                        window.currentProject.styletick ++;
                        newStyle.name = e.inputValue;
                        newStyle.uid = window.currentProject.styletick;
                        window.currentProject.styles.push(newStyle);
                        this.editedStyleId = window.currentProject.styles.length - 1;
                        this.editedStyle = newStyle;
                        this.styleGenPreview();
                        this.update();
                    }
                });
            }
        }));
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
            click: () => {
                alertify
                .defaultValue(this.editedStyle.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue !== '') {
                        this.editedStyle.name = e.inputValue;
                        this.update();
                    }
                });
            }
        }));
        styleMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
            click: () => {
                alertify
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedStyle.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        const ind = window.currentProject.styles.indexOf(this.editedStyle);
                        window.currentProject.styles.splice(ind, 1);
                        this.update();
                    }
                });
            }
        }));

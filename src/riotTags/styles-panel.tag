styles-panel.panel.view
    .flexfix.tall
        div.flexfix-header
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
                    button#stylecreate(onclick="{styleCreate}")
                        i.icon.icon-add
                        span {voc.create}
        ul.cards.flexfix-body
            li(each="{style in (searchResults? searchResults : styles)}" 
            onclick="{openStyle(style)}" 
            oncontextmenu="{onStyleContextMenu(style)}")
                span {style.name}
                img(src="file://{window.sessionStorage.projdir + '/img/' + style.origname}_prev.png?{style.lastmod}")
    style-editor(if="{editingStyle}" styleobj="{editedStyle}")
    script.
        this.editingStyle = false;
        
        this.namespace = 'styles';
        this.mixin(window.riotVoc);
        this.sort = 'name';
        this.sortReverse = false;

        this.updateList = () => {
            this.styles = [...window.currentProject.styles];
            if (this.sort === 'name') {
                this.styles.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            } else {
                this.styles.sort((a, b) => {
                    return b.lastmod - a.lastmod;
                });
            }
            if (this.sortReverse) {
                this.styles.reverse();
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
                var fuse = new Fuse(this.styles, fuseOptions);
                this.searchResults = fuse.search(e.target.value.trim());
            } else {
                this.searchResults = null;
            }
        };
        
        const gui = require('nw.gui');
        
        this.styleCreate = () => {
            var id = window.generateGUID(),
                slice = id.split('-').pop();
            window.currentProject.styletick ++;
            var obj = {
                name: "Style_" + slice,
                uid: id,
                origname: 's' + slice
            };
            window.currentProject.styles.push(obj);
            this.editedStyle = obj;
            this.editingStyle = true;
            this.updateList();
        };
        this.openStyle = style => e => {
            this.editingStyle = true;
            this.editedStyle = style;
        };
        this.on('mount', () => {
            this.updateList();
        })
        
        // Контекстное меню для управления стилями по нажатию ПКМ по карточкам
        var styleMenu = new gui.Menu();
        this.onStyleContextMenu = style => e => {
            this.editedStyle = e.item.style;
            styleMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            click: e => {
                this.editingStyle = true;
                this.update();
            }
        }));
        // Пункт "Скопировать название"
        styleMenu.append(new gui.MenuItem({
            label: languageJSON.common.copyName,
            click: e => {
                var clipboard = nw.Clipboard.get();
                clipboard.set(this.editedStyle.name, 'text');
            }
        }));
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.duplicate,
            click: () => {
                alertify
                .defaultValue(this.editedStyle.name + '_dup')
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                        var id = window.generateGUID(),
                            slice = id.split('-').pop();
                        var newStyle = JSON.parse(JSON.stringify(this.editedStyle));
                        newStyle.name = e.inputValue;
                        newStyle.origname = 's' + slice;
                        newStyle.uid = id;
                        window.currentProject.styles.push(newStyle);
                        this.editedStyleId = id;
                        this.editedStyle = newStyle;
                        this.editingStyle = true;
                        this.updateList();
                        this.update();
                    }
                });
            }
        }));
        styleMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.rename,
            click: () => {
                alertify
                .defaultValue(this.editedStyle.name)
                .prompt(window.languageJSON.common.newname)
                .then(e => {
                    if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
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
            click: () => {
                alertify
                .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedStyle.name))
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        const ind = window.currentProject.styles.indexOf(this.editedStyle);
                        window.currentProject.styles.splice(ind, 1);
                        this.updateList();
                        this.update();
                    }
                });
            }
        }));

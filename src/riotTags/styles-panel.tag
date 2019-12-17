styles-panel.flexfix.tall.fifty
    div.flexfix-header
        .toright
            b {vocGlob.sort}
            button.inline.square(onclick="{switchSort('date')}" class="{selected: sort === 'date' && !searchResults}")
                i.icon-clock
            button.inline.square(onclick="{switchSort('name')}" class="{selected: sort === 'name' && !searchResults}")
                i.icon-sort-alphabetically
            .aSearchWrap
                input.inline(type="text" onkeyup="{fuseSearch}")
        h1.nmt {voc.styles}
        .clear
        .toleft
            button#stylecreate(onclick="{styleCreate}" title="Control+N" data-hotkey="Control+n")
                i.icon.icon-add
                span {voc.create}
        .clear
    ul.cards.flexfix-body
        li(each="{style in (searchResults? searchResults : styles)}"
        onclick="{openStyle(style)}"
        oncontextmenu="{onStyleContextMenu(style)}"
        onlong-press="{onStyleContextMenu(style)}")
            span {style.name}
            .aStyleIcon
                img(src="file://{window.sessionStorage.projdir + '/img/' + style.origname}_prev.png?{style.lastmod}")
    style-editor(if="{editingStyle}" styleobj="{editedStyle}")
    context-menu(menu="{styleMenu}" ref="styleMenu")
    script.
        const generateGUID = require('./data/node_requires/generateGUID');

        this.editingStyle = false;

        this.namespace = 'styles';
        this.mixin(window.riotVoc);

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

        this.styleCreate = e => {
            if (this.editingStyle) {
                return;
            }
            var id = generateGUID(),
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

            if (!e) {
                this.update();
            }
        };
        this.openStyle = style => e => {
            this.editingStyle = true;
            this.editedStyle = style;
        };
        this.setUpPanel = e => {
            this.updateList();
            this.searchResults = null;
            this.editingStyle = false;
            this.editedStyle = null;
            this.update();
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
        });

        this.onStyleContextMenu = style => e => {
            this.editedStyle = e.item.style;
            this.refs.styleMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

        this.styleMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: e => {
                    this.editingStyle = true;
                    this.update();
                }
            }, {
                label: languageJSON.common.copyName,
                click: e => {
                    const {clipboard} = require('electron');
                    clipboard.writeText(this.editedStyle.name);
                }
            }, {
                label: window.languageJSON.common.duplicate,
                click: () => {
                    alertify
                    .defaultValue(this.editedStyle.name + '_dup')
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            var id = generateGUID(),
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
            }, {
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
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.delete,
                click: () => {
                    alertify
                    .okBtn(window.languageJSON.common.delete)
                    .cancelBtn(window.languageJSON.common.cancel)
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedStyle.name))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            const ind = window.currentProject.styles.indexOf(this.editedStyle);
                            window.currentProject.styles.splice(ind, 1);
                            this.updateList();
                            this.update();
                            alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };

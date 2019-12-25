styles-panel.tall.fifty
    asset-viewer(
        collection="{currentProject.styles}"
        contextmenu="{onStyleContextMenu}"
        namespace="styles"
        click="{openStyle}"
        thumbnails="{thumbnails}"
        ref="styles"
        class="tall"
    )
        h1.nmt {voc.styles}
        .clear
        .toleft
            button#stylecreate(onclick="{styleCreate}" title="Control+N" data-hotkey="Control+n")
                svg.feather
                    use(xlink:href="data/icons.svg#plus")
                span {voc.create}
    style-editor(if="{editingStyle}" styleobj="{editedStyle}")
    context-menu(menu="{styleMenu}" ref="styleMenu")
    script.
        const generateGUID = require('./data/node_requires/generateGUID');

        this.editingStyle = false;

        this.namespace = 'styles';
        this.mixin(window.riotVoc);

        this.thumbnails = style => `file://${window.sessionStorage.projdir}/img/${style.origname}_prev.png?${style.lastmod}`;

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
            this.refs.styles.updateList();

            if (!e) {
                this.update();
            }
        };
        this.openStyle = style => e => {
            this.editingStyle = true;
            this.editedStyle = style;
        };
        this.setUpPanel = e => {
            this.refs.styles.updateList();
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
            this.editedStyle = style;
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
                            this.refs.styles.updateList();
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
                            this.refs.styles.updateList();
                            this.update();
                            alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };

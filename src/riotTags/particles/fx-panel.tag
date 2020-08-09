fx-panel.panel.view
    asset-viewer.tall(
        collection="{global.currentProject.emitterTandems}"
        contextmenu="{showTandemPopup}"
        vocspace="particleEmitters"
        namespace="emitterTandems"
        click="{openTandem}"
        thumbnails="{thumbnails}"
        ref="emitterTandems"
    )
        h1.nmt {voc.emittersHeading}
        button(onclick="{parent.emitterTandemCreate}" title="Control+N" data-hotkey="Control+n")
            svg.feather
                use(xlink:href="data/icons.svg#plus")
            span {vocGlob.add}
    emitter-tandem-editor(if="{editingTandem}" tandem="{editedTandem}")
    context-menu(menu="{tandemMenu}" ref="tandemMenu")
    script.
        this.namespace = 'particleEmitters';
        this.mixin(window.riotVoc);

        this.thumbnails = () => 'data/img/particles.png';

        // Technically we edit a number of emitters at once — a "tandem",
        // but to not overcomplicate it all, let's call them "emitters" in UI anyways.
        this.openTandem = tandem => () => {
            this.editingTandem = true;
            this.editedTandem = tandem;
            this.update();
        };

        this.showTandemPopup = tandem => e => {
            this.editedTandem = tandem;
            this.refs.tandemMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

        this.emitterTandemCreate = () => {
            const defaultEmitter = require('./data/node_requires/resources/particles/defaultEmitter').get();
            const generateGUID = require('./data/node_requires/generateGUID');
            const id = generateGUID(),
                  slice = id.split('-').pop();

            const tandem = {
                name: 'Tandem_' + slice,
                origname: 'pt' + slice,
                emitters: [defaultEmitter]
            };

            global.currentProject.emitterTandems.push(tandem);
            this.editingTandem = true;
            this.editedTandem = tandem;
        };

        this.setUpPanel = () => {
            this.refs.emitterTandems.updateList();
            this.editingTandem = false;
            this.editedTandem = null;
            this.update();
        };
        this.updatePanel = () => {
            if (this.refs.emitterTandems) {
                this.refs.emitterTandems.updateList();
                this.update();
            }
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        window.signals.on('tandemUpdated', this.updatePanel);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
            window.signals.off('tandemUpdated', this.updatePanel);
        });


        this.tandemMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: () => {
                    this.editingTandem = true;
                    this.update();
                }
            }, {
                label: window.languageJSON.common.copyName,
                click: () => {
                    nw.Clipboard.get().set(this.editedTandem.name, 'text');
                }
            }, {
                label: window.languageJSON.common.duplicate,
                click: () => {
                    window.alertify
                    .defaultValue(this.editedTandem.name + '_dup')
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            const generateGUID = require('./data/node_requires/generateGUID');
                            const id = generateGUID(),
                                  slice = id.split('-').pop();
                            const newTandem = JSON.parse(JSON.stringify(this.editedTandem));
                            newTandem.name = e.inputValue;
                            newTandem.origname = 'pt' + slice;
                            newTandem.uid = id;
                            global.currentProject.emitterTandems.push(newTandem);
                            this.editedTandemId = id;
                            this.editedTandem = newTandem;
                            this.editingStyle = true;
                            this.refs.emitterTandems.updateList();
                            this.update();
                        }
                    });
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    window.alertify
                    .defaultValue(this.editedTandem.name)
                    .prompt(window.languageJSON.common.newname)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            this.editedTandem.name = e.inputValue;
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
                    .okBtn(window.languageJSON.common.delete)
                    .cancelBtn(window.languageJSON.common.cancel)
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedTandem.name))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            const ind = global.currentProject.emitterTandems.indexOf(this.editedTandem);
                            global.currentProject.emitterTandems.splice(ind, 1);
                            this.refs.emitterTandems.updateList();
                            this.update();
                            window.alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };
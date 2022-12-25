//
    @method openAsset
fx-panel.aPanel.aView
    asset-viewer.tall(
        collection="{global.currentProject.emitterTandems}"
        contextmenu="{showTandemPopup}"
        namespace="emitterTandems"
        assettype="emitterTandems"
        click="{openTandem}"
        useicons="yup"
        thumbnails="{thumbnails}"
        ref="emitterTandems"
    )
        h1.inlineblock {parent.voc.emittersHeading}
        .aSpacer.inlineblock
        button(onclick="{parent.emitterTandemCreate}" title="Control+N" data-hotkey="Control+n")
            svg.feather
                use(xlink:href="#plus")
            span {vocGlob.add}
    emitter-tandem-editor(if="{editingTandem}" tandem="{editedTandem}")
    context-menu(menu="{tandemMenu}" ref="tandemMenu")
    script.
        this.namespace = 'particleEmitters';
        this.mixin(window.riotVoc);

        this.thumbnails = () => 'sparkles';

        // Technically we edit a number of emitters at once — a "tandem",
        // but to not overcomplicate it all, let's call them "emitters" in UI anyways.
        this.openTandem = tandem => () => {
            this.editingTandem = true;
            this.editedTandem = tandem;
            this.update();
        };
        this.openAsset = (assetType, uid) => {
            if (assetType !== 'emitters' && assetType !== 'emitterTandems' && assetType !== 'tandems') {
                return;
            }
            const {getById} = require('./data/node_requires/resources/emitterTandems');
            this.openTandem(getById(uid))();
        };

        this.showTandemPopup = tandem => e => {
            this.editedTandem = tandem;
            this.refs.tandemMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

        const {createNewTandem} = require('./data/node_requires/resources/emitterTandems');
        this.emitterTandemCreate = () => {
            const tandem = createNewTandem(this.refs.emitterTandems.currentGroup.uid);
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
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            const generateGUID = require('./data/node_requires/generateGUID');
                            const id = generateGUID(),
                                  slice = id.slice(-6);
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
                    .prompt(window.languageJSON.common.newName)
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

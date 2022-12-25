//
    @method openAsset
templates-panel.aPanel.aView
    asset-viewer(
        collection="{global.currentProject.templates}"
        contextmenu="{onTemplateContextMenu}"
        namespace="templates"
        assettype="templates"
        click="{openTemplate}"
        thumbnails="{thumbnails}"
        icons="{icons}"
        ref="templates"
        class="tall"
    )
        button#templatecreate(onclick="{parent.templateCreate}" title="Control+N" data-hotkey="Control+n")
            svg.feather
                use(xlink:href="#plus")
            span {parent.voc.create}
    template-editor(if="{editingTemplate}" template="{editedTemplate}")
    context-menu(menu="{templateMenu}" ref="templateMenu")
    script.
        this.namespace = 'templates';
        this.mixin(window.riotVoc);
        this.mixin(window.riotNiceTime);
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.editingTemplate = false;
        this.sort = 'name';
        this.sortReverse = false;

        this.thumbnails = require('./data/node_requires/resources/templates').getTemplatePreview;
        this.icons = function icons(template) {
            const icons = [];
            if (template.playAnimationOnStart) {
                icons.push('play');
            }
            if (!template.visible) {
                icons.push('eye-off');
            }
            if (('blendMode' in template) && template.blendMode !== 'normal') {
                icons.push('droplet');
            }
            return icons;
        };

        this.setUpPanel = () => {
            this.fillTemplateMap();
            this.refs.templates.updateList();
            this.searchResults = null;
            this.editingTemplate = false;
            this.editedTemplate = null;
            this.update();
        };
        window.signals.on('projectLoaded', this.setUpPanel);
        this.on('mount', this.setUpPanel);
        this.on('unmount', () => {
            window.signals.off('projectLoaded', this.setUpPanel);
        });

        this.getTextureRevision = template => glob.texturemap[template.texture].g.lastmod;

        this.fillTemplateMap = () => {
            delete glob.templatemap;
            glob.templatemap = {};
            for (let i = 0; i < global.currentProject.templates.length; i++) {
                glob.templatemap[global.currentProject.templates[i].uid] = i;
            }
        };
        this.templateCreate = e => {
            if (this.editingTemplate) {
                return false;
            }

            const templatesAPI = require('./data/node_requires/resources/templates/');
            const template = templatesAPI.createNewTemplate();
            if (!this.refs.templates.currentGroup.isUngroupedGroup) {
                template.group = this.refs.templates.currentGroup.uid;
            }
            this.refs.templates.updateList();
            this.openTemplate(template)(e);

            if (!e) {
                this.update();
            }
            return true;
        };
        this.openTemplate = template => () => {
            this.editingTemplate = true;
            this.editedTemplate = template;
        };

        this.openAsset = (assetType, uid) => {
            if (assetType !== 'templates') {
                return;
            }
            const template = global.currentProject.templates.find(template => template.uid === uid);
            this.openTemplate(template)();
            this.refs.templates.updateList();
            if (this.parent) {
                this.parent.update();
            }
        };

        this.templateMenu = {
            items: [{
                label: window.languageJSON.common.open,
                click: () => {
                    this.openTemplate(this.currentTemplate)();
                    this.update();
                }
            }, {
                label: window.languageJSON.common.copyName,
                click: () => {
                    nw.Clipboard.get().set(this.currentTemplate.name, 'text');
                }
            }, {
                label: window.languageJSON.common.duplicate,
                click: () => {
                    alertify
                    .defaultValue(this.currentTemplate.name + '_dup')
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            const generateGUID = require('./data/node_requires/generateGUID');
                            const tp = JSON.parse(JSON.stringify(this.currentTemplate));
                            tp.name = e.inputValue;
                            tp.uid = generateGUID();
                            global.currentProject.templates.push(tp);
                            this.fillTemplateMap();
                            window.signals.trigger('templatesChanged');
                            window.signals.trigger('templateCreated');
                            this.refs.templates.updateList();
                            this.update();
                        }
                    });
                }
            }, {
                label: window.languageJSON.common.rename,
                click: () => {
                    alertify
                    .defaultValue(this.currentTemplate.name)
                    .prompt(window.languageJSON.common.newName)
                    .then(e => {
                        if (e.inputValue !== '' && e.buttonClicked !== 'cancel') {
                            this.currentTemplate.name = e.inputValue;
                            this.update();
                        }
                    });
                }
            }, {
                template: 'separator'
            }, {
                label: window.languageJSON.common.delete,
                click: () => {
                    alertify
                    .okBtn(window.languageJSON.common.delete)
                    .cancelBtn(window.languageJSON.common.cancel)
                    .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentTemplate.name))
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            for (const room of global.currentProject.rooms) {
                                let i = 0;
                                while (i < room.copies.length) {
                                    if (room.copies[i].uid === this.currentTemplate.uid) {
                                        room.copies.splice(i, 1);
                                    } else {
                                        i++;
                                    }
                                }
                                if (room.follow === this.currentTemplate.uid) {
                                    room.follow = -1;
                                }
                            }

                            const ind = global.currentProject.templates.indexOf(this.currentTemplate);
                            const template = global.currentProject.templates.splice(ind, 1);
                            const [{uid}] = template;
                            this.refs.templates.updateList();
                            this.fillTemplateMap();
                            this.update();
                            window.signals.trigger('templatesChanged');
                            window.signals.trigger('templateRemoved', uid);
                            alertify
                            .okBtn(window.languageJSON.common.ok)
                            .cancelBtn(window.languageJSON.common.cancel);
                        }
                    });
                }
            }]
        };
        this.onTemplateContextMenu = template => e => {
            this.currentTemplate = template;
            this.refs.templateMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };

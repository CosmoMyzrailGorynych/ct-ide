template-editor.aPanel.aView.flexrow
    .template-editor-Properties
        .tall.flexfix.aPanel.pad
            .flexfix-header
                asset-input.wide(
                    assettype="textures"
                    assetid="{template.texture || -1}"
                    large="yup"
                    allowclear="da"
                    onchanged="{applyTexture}"
                )
            .flexfix-body
                .aSpacer
                fieldset
                    label.block
                        b {voc.name}
                        input.wide(type="text" onchange="{wire('this.template.name')}" value="{template.name}")
                        .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nameTaken}
                    label.block
                        b {voc.depth}
                        input.wide(type="number" onchange="{wire('this.template.depth')}" value="{template.depth}")
                fieldset
                    label.block.checkbox
                        input(type="checkbox" checked="{template.extends.visible === void 0 ? true : template.extends.visible}" onchange="{wire('this.template.extends.visible')}")
                        span {voc.visible}
                extensions-editor(type="template" entity="{template.extends}" wide="yep" compact="probably")
                br
                br
                docs-shortcut(path="/ct.templates.html" button="true" wide="true" title="{voc.learnAboutTemplates}")
            .flexfix-footer
                button#templatedone.wide(onclick="{templateSave}" title="Shift+Control+S" data-hotkey="Control+S")
                    svg.feather
                        use(xlink:href="#check")
                    span {voc.done}
    .template-editor-aCodeEditor
        .tabwrap.tall(style="position: relative")
            ul.tabs.aNav.nogrow.noshrink
                li(onclick="{changeTab('templateoncreate')}" class="{active: tab === 'templateoncreate'}" title="{voc.create} (Control+Q)" data-hotkey="Control+q")
                    svg.feather
                        use(xlink:href="#sun")
                    span {voc.create}
                li(onclick="{changeTab('templateonstep')}" class="{active: tab === 'templateonstep'}" title="{voc.step} (Control+W)" data-hotkey="Control+w")
                    svg.feather
                        use(xlink:href="#skip-forward")
                    span {voc.step}
                li(onclick="{changeTab('templateondraw')}" class="{active: tab === 'templateondraw'}" title="{voc.draw} (Control+E)" data-hotkey="Control+e")
                    svg.feather
                        use(xlink:href="#edit-2")
                    span {voc.draw}
                li(onclick="{changeTab('templateondestroy')}" class="{active: tab === 'templateondestroy'}" title="{voc.destroy} (Control+R)" data-hotkey="Control+r")
                    svg.feather
                        use(xlink:href="#trash")
                    span {voc.destroy}
            div
                #templateoncreate.tabbed(show="{tab === 'templateoncreate'}")
                    .aCodeEditor(ref="templateoncreate")
                #templateonstep.tabbed(show="{tab === 'templateonstep'}")
                    .aCodeEditor(ref="templateonstep")
                #templateondraw.tabbed(show="{tab === 'templateondraw'}")
                    .aCodeEditor(ref="templateondraw")
                #templateondestroy.tabbed(show="{tab === 'templateondestroy'}")
                    .aCodeEditor(ref="templateondestroy")
    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.namespace = 'templateView';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        const textures = require('./data/node_requires/resources/textures');

        this.getTextureRevision = template => textures.getById(template.texture).lastmod;

        this.template = this.opts.template;
        this.tab = 'templateoncreate';

        const tabToEditor = tab => {
            tab = tab || this.tab;
            if (tab === 'templateonstep') {
                return this.templateonstep;
            } else if (tab === 'templateondraw') {
                return this.templateondraw;
            } else if (tab === 'templateondestroy') {
                return this.templateondestroy;
            } else if (tab === 'templateoncreate') {
                return this.templateoncreate;
            }
            return null;
        };

        this.changeTab = tab => () => {
            this.tab = tab;
            const editor = tabToEditor(tab);
            setTimeout(() => {
                editor.layout();
                editor.focus();
            }, 0);
        };

        const updateEditorSize = () => {
            if (tabToEditor()) {
                tabToEditor().layout();
            }
        };
        const updateEditorSizeDeferred = function () {
            setTimeout(updateEditorSize, 0);
        };
        window.signals.on('templatesFocus', this.focusEditor);
        window.signals.on('templatesFocus', updateEditorSizeDeferred);
        window.addEventListener('resize', updateEditorSize);
        this.on('unmount', () => {
            window.signals.off('templatesFocus', this.focusEditor);
            window.signals.off('templatesFocus', updateEditorSizeDeferred);
            window.removeEventListener('resize', updateEditorSize);
        });

        this.on('mount', () => {
            var editorOptions = {
                language: 'typescript',
                lockWrapper: true
            };
            setTimeout(() => {
                this.templateoncreate = window.setupCodeEditor(
                    this.refs.templateoncreate,
                    Object.assign({}, editorOptions, {
                        value: this.template.oncreate,
                        wrapper: ['function onCreate(this: Copy) {', '}']
                    })
                );
                this.templateonstep = window.setupCodeEditor(
                    this.refs.templateonstep,
                    Object.assign({}, editorOptions, {
                        value: this.template.onstep,
                        wrapper: ['function onStep(this: Copy) {', '}']
                    })
                );
                this.templateondraw = window.setupCodeEditor(
                    this.refs.templateondraw,
                    Object.assign({}, editorOptions, {
                        value: this.template.ondraw,
                        wrapper: ['function onDraw(this: Copy) {', '}']
                    })
                );
                this.templateondestroy = window.setupCodeEditor(
                    this.refs.templateondestroy,
                    Object.assign({}, editorOptions, {
                        value: this.template.ondestroy,
                        wrapper: ['function onDestroy(this: Copy) {', '}']
                    })
                );

                this.templateoncreate.onDidChangeModelContent(() => {
                    this.template.oncreate = this.templateoncreate.getPureValue();
                });
                this.templateonstep.onDidChangeModelContent(() => {
                    this.template.onstep = this.templateonstep.getPureValue();
                });
                this.templateondraw.onDidChangeModelContent(() => {
                    this.template.ondraw = this.templateondraw.getPureValue();
                });
                this.templateondestroy.onDidChangeModelContent(() => {
                    this.template.ondestroy = this.templateondestroy.getPureValue();
                });
                this.templateoncreate.focus();
            }, 0);
        });
        this.checkNames = () => {
            if (global.currentProject.templates.find(template =>
                this.template.name === template.name && this.template !== template)) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
        };
        this.on('update', () => {
            this.checkNames();
        });
        this.on('unmount', () => {
            // Manually destroy code editors, to free memory
            this.templateoncreate.dispose();
            this.templateonstep.dispose();
            this.templateondraw.dispose();
            this.templateondestroy.dispose();
        });

        this.changeSprite = () => {
            this.selectingTexture = true;
        };
        this.applyTexture = texture => {
            console.log('template editor received new texture: ' + texture);
            if (texture == -1) {
                this.template.texture = -1;
            } else {
                this.template.texture = texture;
                if (this.template.name === 'NewTemplate') {
                    this.template.name = textures.getById(texture).name;
                }
            }
            this.selectingTexture = false;
            this.parent.fillTemplateMap();
            this.update();
        };
        this.cancelTexture = () => {
            this.selectingTexture = false;
            this.update();
        };
        this.templateSave = () => {
            this.checkNames();
            if (this.nameTaken) {
                this.update();
                // animate the error notice
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                if (localStorage.disableSounds !== 'on') {
                    soundbox.play('Failure');
                }
                return false;
            }
            glob.modified = true;
            this.template.lastmod = Number(new Date());
            this.parent.editingTemplate = false;
            this.parent.fillTemplateMap();
            this.parent.update();
            window.signals.trigger('templatesChanged');
            return true;
        };

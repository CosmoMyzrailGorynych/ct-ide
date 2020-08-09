type-editor.panel.view.flexrow
    .type-editor-Properties
        .tall.flexfix.panel.pad
            .flexfix-header
                .type-editor-aTexturePicker.panel(onclick="{changeSprite}")
                    img.ohchangeme(src="{type.texture === -1? 'data/img/notexture.png' : (glob.texturemap[type.texture].src.split('?')[0] + '_prev@2.png?' + getTypeTextureRevision(type)) + getTypeTextureRevision(type)}")
                    div {voc.change}
                b {voc.name}
                input.wide(type="text" onchange="{wire('this.type.name')}" value="{type.name}")
                .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nametaken}
                br
            .flexfix-body
                b {voc.depth}
                input.wide(type="number" onchange="{wire('this.type.depth')}" value="{type.depth}")
                extensions-editor(type="type" entity="{type.extends}" wide="yep" compact="probably")
                br
                br
                docs-shortcut(path="/ct.types.html" button="true" wide="true" title="{voc.learnAboutTypes}")
            .flexfix-footer
                button#typedone.wide(onclick="{typeSave}" title="Shift+Control+S" data-hotkey="Control+S")
                    svg.feather
                        use(xlink:href="data/icons.svg#check")
                    span {voc.done}
    .type-editor-aCodeEditor
        .tabwrap.tall(style="position: relative")
            ul.tabs.nav.nogrow.noshrink
                li(onclick="{changeTab('typeoncreate')}" class="{active: tab === 'typeoncreate'}" title="{voc.create} (Control+Q)" data-hotkey="Control+q")
                    svg.feather
                        use(xlink:href="data/icons.svg#sun")
                    span {voc.create}
                li(onclick="{changeTab('typeonstep')}" class="{active: tab === 'typeonstep'}" title="{voc.step} (Control+W)" data-hotkey="Control+w")
                    svg.feather
                        use(xlink:href="data/icons.svg#skip-forward")
                    span {voc.step}
                li(onclick="{changeTab('typeondraw')}" class="{active: tab === 'typeondraw'}" title="{voc.draw} (Control+E)" data-hotkey="Control+e")
                    svg.feather
                        use(xlink:href="data/icons.svg#edit-2")
                    span {voc.draw}
                li(onclick="{changeTab('typeondestroy')}" class="{active: tab === 'typeondestroy'}" title="{voc.destroy} (Control+R)" data-hotkey="Control+r")
                    svg.feather
                        use(xlink:href="data/icons.svg#trash")
                    span {voc.destroy}
            div
                #typeoncreate.tabbed(show="{tab === 'typeoncreate'}")
                    .aCodeEditor(ref="typeoncreate")
                #typeonstep.tabbed(show="{tab === 'typeonstep'}")
                    .aCodeEditor(ref="typeonstep")
                #typeondraw.tabbed(show="{tab === 'typeondraw'}")
                    .aCodeEditor(ref="typeondraw")
                #typeondestroy.tabbed(show="{tab === 'typeondestroy'}")
                    .aCodeEditor(ref="typeondestroy")
    texture-selector(if="{selectingTexture}" onselected="{applyTexture}" oncancelled="{cancelTexture}" ref="textureselector" showempty="sure")
    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.namespace = 'typeview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.getTypeTextureRevision = type => glob.texturemap[type.texture].g.lastmod;

        this.type = this.opts.type;
        this.tab = 'typeoncreate';

        const tabToEditor = tab => {
            tab = tab || this.tab;
            if (tab === 'typeonstep') {
                return this.typeonstep;
            } else if (tab === 'typeondraw') {
                return this.typeondraw;
            } else if (tab === 'typeondestroy') {
                return this.typeondestroy;
            } else if (tab === 'typeoncreate') {
                return this.typeoncreate;
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
        window.signals.on('typesFocus', this.focusEditor);
        window.signals.on('typesFocus', updateEditorSizeDeferred);
        window.addEventListener('resize', updateEditorSize);
        this.on('unmount', () => {
            window.signals.off('typesFocus', this.focusEditor);
            window.signals.off('typesFocus', updateEditorSizeDeferred);
            window.removeEventListener('resize', updateEditorSize);
        });

        this.on('mount', () => {
            var editorOptions = {
                language: 'typescript',
                lockWrapper: true
            };
            setTimeout(() => {
                this.typeoncreate = window.setupCodeEditor(
                    this.refs.typeoncreate,
                    Object.assign({}, editorOptions, {
                        value: this.type.oncreate,
                        wrapper: ['function onCreate(this: Copy) {', '}']
                    })
                );
                this.typeonstep = window.setupCodeEditor(
                    this.refs.typeonstep,
                    Object.assign({}, editorOptions, {
                        value: this.type.onstep,
                        wrapper: ['function onStep(this: Copy) {', '}']
                    })
                );
                this.typeondraw = window.setupCodeEditor(
                    this.refs.typeondraw,
                    Object.assign({}, editorOptions, {
                        value: this.type.ondraw,
                        wrapper: ['function onDraw(this: Copy) {', '}']
                    })
                );
                this.typeondestroy = window.setupCodeEditor(
                    this.refs.typeondestroy,
                    Object.assign({}, editorOptions, {
                        value: this.type.ondestroy,
                        wrapper: ['function onDestroy(this: Copy) {', '}']
                    })
                );

                this.typeoncreate.onDidChangeModelContent(() => {
                    this.type.oncreate = this.typeoncreate.getPureValue();
                });
                this.typeonstep.onDidChangeModelContent(() => {
                    this.type.onstep = this.typeonstep.getPureValue();
                });
                this.typeondraw.onDidChangeModelContent(() => {
                    this.type.ondraw = this.typeondraw.getPureValue();
                });
                this.typeondestroy.onDidChangeModelContent(() => {
                    this.type.ondestroy = this.typeondestroy.getPureValue();
                });
                this.typeoncreate.focus();
            }, 0);
        });
        this.on('update', () => {
            if (global.currentProject.types.find(type =>
                this.type.name === type.name && this.type !== type)) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
        });
        this.on('unmount', () => {
            // Manually destroy code editors, to free memory
            this.typeoncreate.dispose();
            this.typeonstep.dispose();
            this.typeondraw.dispose();
            this.typeondestroy.dispose();
        });

        this.changeSprite = () => {
            this.selectingTexture = true;
        };
        this.applyTexture = texture => () => {
            if (texture === -1) {
                this.type.texture = -1;
            } else {
                this.type.texture = texture.uid;
                if (!this.type.lastmod && this.type.name === 'Type_' + this.type.uid.split('-').pop()) {
                    this.type.name = texture.name;
                }
            }
            this.selectingTexture = false;
            this.parent.fillTypeMap();
            this.update();
        };
        this.cancelTexture = () => {
            this.selectingTexture = false;
            this.update();
        };
        this.typeSave = () => {
            if (this.nameTaken) {
                // animate the error notice
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                soundbox.play('Failure');
                return false;
            }
            glob.modified = true;
            this.type.lastmod = Number(new Date());
            this.parent.editingType = false;
            this.parent.fillTypeMap();
            this.parent.update();
            window.signals.trigger('typesChanged');
            return true;
        };

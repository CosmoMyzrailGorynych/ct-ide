type-editor.panel.view.flexrow
    .c3.tall
        #typegraph.panel(onclick="{changeSprite}")
            img.ohchangeme(src="{type.graph === -1? '/img/nograph.png' : 'file://' + sessionStorage.projdir + '/img/' + type.graph + '_prev@2.png?' + getTypeGraphRevision(type)}")
            div {voc.change}
        b {voc.name}
        input#typename.wide(type="text" onchange="{wire('this.type.name')}" value="{type.name}")
        br
        b {voc.depth}
        input#typedepth.wide(type="number" onchange="{wire('this.type.depth')}" value="{type.depth}")
        br
        br
        button#typedone.wide(onclick="{typeSave}")
            i.icon.icon-confirm
            span {voc.done}
    .c9.tall.borderleft
        .tabwrap.tall(style="position: relative")
            ul.tabs.nav.nogrow.noshrink
                li(onclick="{changeTab('typeoncreate')}" class="{active: tab === 'typeoncreate'}" title="{voc.create}")
                    i.icon.icon-sun
                    span {voc.create}
                li(onclick="{changeTab('typeonstep')}" class="{active: tab === 'typeonstep'}" title="{voc.step}")
                    i.icon.icon-next
                    span {voc.step}
                li(onclick="{changeTab('typeondraw')}" class="{active: tab === 'typeondraw'}" title="{voc.draw}")
                    i.icon.icon-edit-2
                    span {voc.draw}
                li(onclick="{changeTab('typeondestroy')}" class="{active: tab === 'typeondestroy'}" title="{voc.destroy}")
                    i.icon.icon-trash
                    span {voc.destroy}
            div
                #typeoncreate.tabbed(show="{tab === 'typeoncreate'}")
                    .acer(ref="typeoncreate")
                #typeonstep.tabbed(show="{tab === 'typeonstep'}")
                    .acer(ref="typeonstep")
                #typeondraw.tabbed(show="{tab === 'typeondraw'}")
                    .acer(ref="typeondraw")
                #typeondestroy.tabbed(show="{tab === 'typeondestroy'}")
                    .acer(ref="typeondestroy")
    graphic-selector(if="{selectingGraphic}" onselected="{applyGraphic}" ref="graphicselector" showempty="sure")
    script.
        this.voc = window.languageJSON.typeview;
        this.mixin(window.riotWired);

        this.getTypeGraphRevision = type => window.glob.graphmap[type.graph].g.lastmod;
        
        this.type = this.opts.type;
        this.tab = 'typeoncreate';
        this.changeTab = tab => e => {
            this.tab = tab;
            if (this.tab === 'typeonstep') {
                this.typeonstep.moveCursorTo(0, 0);
                this.typeonstep.clearSelection();
                this.typeonstep.focus();
            } else if (this.tab === 'typeondraw') {
                this.typeondraw.moveCursorTo(0, 0);
                this.typeondraw.clearSelection();
                this.typeondraw.focus();
            } else if (this.tab === 'typeondestroy') {
                this.typeondestroy.moveCursorTo(0, 0);
                this.typeondestroy.clearSelection();
                this.typeondestroy.focus();
            } else if (this.tab === 'typeoncreate') {
                this.typeoncreate.moveCursorTo(0, 0);
                this.typeoncreate.clearSelection();
                this.typeoncreate.focus();
            }
        };
        
        this.on('mount', () => {
            var editorOptions = {
                mode: 'javascript'
            };
            setTimeout(() => {
                this.typeoncreate = window.setupAceEditor(this.refs.typeoncreate, editorOptions);
                this.typeonstep = window.setupAceEditor(this.refs.typeonstep, editorOptions);
                this.typeondraw = window.setupAceEditor(this.refs.typeondraw, editorOptions);
                this.typeondestroy = window.setupAceEditor(this.refs.typeondestroy, editorOptions);
                
                this.typeoncreate.setValue(this.type.oncreate);
                this.typeonstep.setValue(this.type.onstep);
                this.typeondraw.setValue(this.type.ondraw);
                this.typeondestroy.setValue(this.type.ondestroy);

                this.typeoncreate.getSession().on('change', (e) => {
                    this.type.oncreate = this.typeoncreate.getValue();
                });
                this.typeonstep.getSession().on('change', (e) => {
                    this.type.onstep = this.typeonstep.getValue();
                });
                this.typeondraw.getSession().on('change', (e) => {
                    this.type.ondraw = this.typeondraw.getValue();
                });
                this.typeondestroy.getSession().on('change', (e) => {
                    this.type.ondestroy = this.typeondestroy.getValue();
                });
                this.typeoncreate.moveCursorTo(0,0);
                this.typeoncreate.clearSelection();
                this.typeoncreate.focus();
            }, 0);
        });
        this.changeSprite = e => {
            this.selectingGraphic = true;
        };
        this.applyGraphic = graph => e => {
            if (graph === -1) {
                this.type.graph = -1;
            } else {
                this.type.graph = graph.origname;
            }
            this.selectingGraphic = false;
            this.update();
        };
        this.typeSave = e => {
            window.glob.modified = true;
            this.parent.editingType = false;
            this.parent.fillTypeMap();
            this.parent.update();
        };

type-editor.panel.view
    .pt20.tall
        #typegraph.panel(onclick="{changeSprite}")
            img.ohchangeme
            div {voc.change}
        b {voc.name}
        input#typename.wide(type="text" onchange="{wire('this.type.name')}")
        br
        b {voc.depth}
        input#typedepth.wide(type="number" onchange="{wire('this.type.depth')}")
        br
        br
        button#typedone.wide(onclick="{typeSave}")
            i.icon.icon-confirm
            span {voc.done}
    .pt80.tall.borderleft
        .tabwrap.tall(style="position: relative")
            ul.tabs.nav.nogrow.noshrink
                li(onclick="{changeTab('typeoncreate')}" class="{active: tab === 'typeoncreate'}" title="{voc.create}")
                    i.icon.icon-lamp
                    span {voc.create}
                li(onclick="{changeTab('typeonstep')}" class="{active: tab === 'typeonstep'}" title="{voc.step}")
                    i.icon.icon-timer
                    span {voc.step}
                li(onclick="{changeTab('typeondraw')}" class="{active: tab === 'typeondraw'}" title="{voc.draw}")
                    i.icon.icon-brush
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
    graphic-selector(if="{selectingGraphic}" ref="graphicselector" showempty)
    script.
        this.voc = window.languageJSON.typeview;
        this.mixin(window.riotWired);
        
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
            this.type = this.opts.type;
            var editorOptions = {
                mode: 'javascript'
            };
            setTimeout(() => {
                this.typeoncreate = window.setupAce(this.refs.typeoncreate, editorOptions);
                this.typeonstep = window.setupAce(this.refs.typeonstep, editorOptions);
                this.typeondraw = window.setupAce(this.refs.typeondraw, editorOptions);
                this.typeondestroy = window.setupAce(this.refs.typeondestroy, editorOptions);
                
                this.typeoncreate.sess.on('change', (e) => {
                    this.type.oncreate = this.typeoncreate.getValue();
                });
                this.typeonstep.sess.on('change', (e) => {
                    this.type.onstep = this.typeonstep.getValue();
                });
                this.typeondraw.sess.on('change', (e) => {
                    this.type.ondraw = this.typeondraw.getValue();
                });
                this.typeondestroy.sess.on('change', (e) => {
                    this.type.ondestroy = this.typeondestroy.getValue();
                });
                this.typeoncreate.moveCursorTo(0,0);
                this.typeoncreate.clearSelection();
                this.typeoncreate.focus();
            }, 0);
        });
        this.changeSprite = e => {
            this.selectingGraphic = true;
            this.update();
            this.refs.graphicselector.onselect = graph => {
                if (graph !== -1) {
                    this.type.graph = -1;
                } else {
                    this.type.graph = graph.origname;
                }
            };
        };
        this.typeSave = e => {
            window.glob.modified = true;
            this.parent.editing = false;
            this.parent.fillTypeMap();
            this.parent.update();
        };

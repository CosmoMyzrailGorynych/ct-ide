room-events-editor.view
    .tabwrap
        ul.tabs.nav.nogrow.noshrink.nb
            li(onclick="{switchTab('roomcreate')}" class="{active: tab === 'roomcreate'}" title="Control-Q" data-hotkey="Control+q")
                svg.feather
                    use(xlink:href="data/icons.svg#sun")
                span {voc.create}
            li(onclick="{switchTab('roomstep')}" class="{active: tab === 'roomstep'}" title="Control-W" data-hotkey="Control+w")
                svg.feather
                    use(xlink:href="data/icons.svg#skip-forward")
                span {voc.step}
            li(onclick="{switchTab('roomdraw')}" class="{active: tab === 'roomdraw'}" title="Control-E" data-hotkey="Control+e")
                svg.feather
                    use(xlink:href="data/icons.svg#edit-2")
                span {voc.draw}
            li(onclick="{switchTab('roomleave')}" class="{active: tab === 'roomleave'}" title="Control-R" data-hotkey="Control+r")
                svg.feather
                    use(xlink:href="data/icons.svg#trash")
                span {voc.leave}
        div(style="position: relative;")
            .tabbed(show="{tab === 'roomcreate'}")
                .aCodeEditor(ref="roomoncreate")
            .tabbed(show="{tab === 'roomstep'}")
                .aCodeEditor(ref="roomonstep")
            .tabbed(show="{tab === 'roomdraw'}")
                .aCodeEditor(ref="roomondraw")
            .tabbed(show="{tab === 'roomleave'}")
                .aCodeEditor(ref="roomonleave")
    button.wide.nogrow.noshrink(onclick="{roomSaveEvents}")
        svg.feather
            use(xlink:href="data/icons.svg#check")
        span {voc.done}
    script.
        this.namespace = 'roomview';
        this.mixin(window.riotVoc);

        this.tab = 'roomcreate';
        const tabToEditor = tab => {
            tab = tab || this.tab;
            if (tab === 'roomcreate') {
                return this.roomoncreate;
            } else if (tab === 'roomstep') {
                return this.roomonstep;
            } else if (tab === 'roomdraw') {
                return this.roomondraw;
            } else if (tab === 'roomleave') {
                return this.roomonleave;
            }
            return null;
        };
        this.switchTab = tab => () => {
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
        window.signals.on('roomsFocus', this.focusEditor);
        window.signals.on('roomsFocus', updateEditorSizeDeferred);
        window.addEventListener('resize', updateEditorSize);
        this.on('unmount', () => {
            window.signals.off('roomsFocus', this.focusEditor);
            window.signals.off('roomsFocus', updateEditorSizeDeferred);
            window.removeEventListener('resize', updateEditorSize);
        });
        this.on('mount', () => {
            this.room = this.opts.room;
            setTimeout(() => {
                var editorOptions = {
                    language: 'typescript',
                    lockWrapper: true
                };
                this.roomoncreate = window.setupCodeEditor(
                    this.refs.roomoncreate,
                    Object.assign({}, editorOptions, {
                        value: this.room.oncreate,
                        wrapper: ['function onCreate(this: Room) {', '}']
                    })
                );
                this.roomonstep = window.setupCodeEditor(
                    this.refs.roomonstep,
                    Object.assign({}, editorOptions, {
                        value: this.room.onstep,
                        wrapper: ['function onStep(this: Room) {', '}']
                    })
                );
                this.roomondraw = window.setupCodeEditor(
                    this.refs.roomondraw,
                    Object.assign({}, editorOptions, {
                        value: this.room.ondraw,
                        wrapper: ['function onDraw(this: Room) {', '}']
                    })
                );
                this.roomonleave = window.setupCodeEditor(
                    this.refs.roomonleave,
                    Object.assign({}, editorOptions, {
                        value: this.room.onleave,
                        wrapper: ['function onLeave(this: Room) {', '}']
                    })
                );
                this.roomoncreate.onDidChangeModelContent(() => {
                    this.room.oncreate = this.roomoncreate.getPureValue();
                });
                this.roomonstep.onDidChangeModelContent(() => {
                    this.room.onstep = this.roomonstep.getPureValue();
                });
                this.roomondraw.onDidChangeModelContent(() => {
                    this.room.ondraw = this.roomondraw.getPureValue();
                });
                this.roomonleave.onDidChangeModelContent(() => {
                    this.room.onleave = this.roomonleave.getPureValue();
                });
            }, 0);
        });
        this.on('unmount', () => {
            // Manually destroy editors to free memory
            this.roomoncreate.dispose();
            this.roomonstep.dispose();
            this.roomondraw.dispose();
            this.roomonleave.dispose();
        });

        this.roomSaveEvents = () => {
            this.parent.editingCode = false;
            this.parent.update();
        };

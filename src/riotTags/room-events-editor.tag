room-events-editor.view.panel
    .tabwrap
        ul.tabs.nav.nogrow.noshrink
            li(onclick="{switchTab('roomcreate')}" class="{active: tab === 'roomcreate'}")
                i.icon.icon-sun
                span {voc.create}
            li(onclick="{switchTab('roomstep')}" class="{active: tab === 'roomstep'}")
                i.icon.icon-next
                span {voc.step}
            li(onclick="{switchTab('roomdraw')}" class="{active: tab === 'roomdraw'}")
                i.icon.icon-edit-2
                span {voc.draw}
            li(onclick="{switchTab('roomleave')}" class="{active: tab === 'roomleave'}")
                i.icon.icon-trash
                span {voc.leave}
        div(style="position: relative;")
            .tabbed(show="{tab === 'roomcreate'}")
                .acer(ref="roomoncreate")
            .tabbed(show="{tab === 'roomstep'}")
                .acer(ref="roomonstep")
            .tabbed(show="{tab === 'roomdraw'}")
                .acer(ref="roomondraw")
            .tabbed(show="{tab === 'roomleave'}")
                .acer(ref="roomonleave")
    button.wide.nogrow.noshrink(onclick="{roomSaveEvents}")
        i.icon.icon-confirm
        span {voc.done}
    script.
        this.namespace = 'roomview';
        this.mixin(window.riotVoc);
        this.tab = 'roomcreate';
        this.switchTab = tab => e => {
            this.tab = tab;
            var editor;
            if (tab === 'roomcreate') {
                editor = this.roomoncreate;
            } else if (tab === 'roomstep') {
                editor = this.roomonstep;
            } else if (tab === 'roomdraw') {
                editor = this.roomondraw;
            } else if (tab === 'roomleave') {
                editor = this.roomonleave;
            }
            editor.moveCursorTo(0,0);
            editor.clearSelection();
            this.focusEditor();
        };
        this.focusEditor = () => {
            if (this.tab === 'roomcreate') {
                this.roomoncreate.focus();
            } else if (this.tab === 'roomstep') {
                this.roomonstep.focus();
            } else if (this.tab === 'roomdraw') {
                this.roomondraw.focus();
            } else if (this.tab === 'roomleave') {
                this.roomonleave.focus();
            }
        };
        window.signals.on('roomsFocus', this.focusEditor);
        this.on('unmount', () => {
            window.signals.off('roomsFocus', this.focusEditor); 
        });
        this.on('mount', e => {
            this.room = this.opts.room;
            setTimeout(() => {
                var editorOptions = {
                    mode: 'javascript'
                };
                this.roomoncreate = window.setupAceEditor(this.refs.roomoncreate, editorOptions);
                this.roomonstep = window.setupAceEditor(this.refs.roomonstep, editorOptions);
                this.roomondraw = window.setupAceEditor(this.refs.roomondraw, editorOptions);
                this.roomonleave = window.setupAceEditor(this.refs.roomonleave, editorOptions);
                this.roomoncreate.session.on('change', e => {
                    this.room.oncreate = this.roomoncreate.getValue();
                });
                this.roomonstep.session.on('change', e => {
                    this.room.onstep = this.roomonstep.getValue();
                });
                this.roomondraw.session.on('change', e => {
                    this.room.ondraw = this.roomondraw.getValue();
                });
                this.roomonleave.session.on('change', e => {
                    this.room.onleave = this.roomonleave.getValue();
                });
                this.roomoncreate.setValue(this.room.oncreate);
                this.roomonstep.setValue(this.room.onstep);
                this.roomondraw.setValue(this.room.ondraw);
                this.roomonleave.setValue(this.room.onleave);

            }, 0);
        });
        this.roomSaveEvents = e => {
            this.parent.editingCode = false;
            this.parent.update();
        };

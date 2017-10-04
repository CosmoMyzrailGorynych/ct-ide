room-events-editor.view.panel
    .tabwrap
        ul.tabs.nav.nogrow.noshrink
            li(onclick="{changeTab('roomcreate')}" class="{active: tab === 'roomcreate'}")
                i.icon.icon-lamp
                span {voc.create}
            li(onclick="{changeTab('roomstep')}" class="{active: tab === 'roomstep'}")
                i.icon.icon-timer
                span {voc.step}
            li(onclick="{changeTab('roomdraw')}" class="{active: tab === 'roomdraw'}")
                i.icon.icon-brush
                span {voc.draw}
            li(onclick="{changeTab('roomleave')}" class="{active: tab === 'roomleave'}")
                i.icon.icon-exit
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
    button.wide.nogrow.noshrink(data-event="roomSaveEvents")
        i.icon.icon-confirm
        span {voc.done}
    script.
        this.voc = window.languageJSON.roomview;
        this.tab = 'roomcreate';
        this.switchTab = tab => e => {
            this.tab = tab;
            if (tab === 'roomcreate') {
                this.roomoncreate.moveCursorTo(0,0);
                this.roomoncreate.clearSelection();
                this.roomoncreate.focus();
            } else if (tab === 'roomstep') {
                this.roomonstep.moveCursorTo(0,0);
                this.roomonstep.clearSelection();
                this.roomonstep.focus();
            } else if (tab === 'roomdraw') {
                this.roomondraw.moveCursorTo(0,0);
                this.roomondraw.clearSelection();
                this.roomondraw.focus();
            } else if (tab === 'roomleave') {
                this.roomonleave.moveCursorTo(0,0);
                this.roomonleave.clearSelection();
                this.roomonleave.focus();
            }
        };
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
                this.roomoncreate.session.on('change', function(e) {
                    this.room.oncreate = this.roomoncreate.getValue();
                });
                this.roomonstep.session.on('change', function(e) {
                    this.room.onstep = this.roomonstep.getValue();
                });
                this.roomondraw.session.on('change', function(e) {
                    this.room.ondraw = this.roomondraw.getValue();
                });
                this.roomonleave.session.on('change', function(e) {
                    this.room.onleave = this.roomonleave.getValue();
                });
            }, 0);
        });

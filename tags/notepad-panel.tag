notepad-panel#notepad.panel.dockright(class="{opened: opened}")
    ul.nav.tabs.nogrow
        li(onclick="{changeTab('notepadlocal')}")
            i.icon.icon-edit
            span {voc.local}
        li(onclick="{changeTab('notepaglobal')}")
            i.icon.icon-notepad
            span {voc.global}
        li(onclick="{changeTab('helppages')}")
            i.icon.icon-message
            span {voc.helppages}
    div
        div(show="{tab === 'notepadlocal'}")
            .acer(ref="notepadlocal")
        div(show="{tab === 'notepaglobal'}")
            .acer(ref="notepadglobal")
        div(show="{tab === 'helppages'}")
            iframe(src="/docs/index.html" nwdisable nwfaketop)

    button.vertical.dockleft(onclick="{notepadToggle}")
        i.icon(class="icon-{opened? 'back' : 'next'}")
    script.
        this.opened = false;
        this.voc = window.languageJSON.notepad;
        this.notepadToggle = function() {
            this.opened = !this.opened;
        };
        
        this.tab = 'notepadlocal';
        this.changeTab = tab => e => {
            this.tab = tab;
        };
        
        this.on('mount', () => {
            setTimeout(() => {
                this.notepadlocal = window.setupAceEditor(this.refs.notepadlocal, {
                    mode: 'javascript'
                });
                this.notepadglobal = window.setupAceEditor(this.refs.notepadglobal, {
                    mode: 'javascript'
                });
                
                this.notepadlocal.getSession().on('change', function(e) {
                    window.currentProject.notes = this.notepadlocal.getValue();
                    window.glob.modified = true;
                });
                this.notepadglobal.getSession().on('change', function(e) {
                    localStorage.notes = this.notepadglobal.getValue();
                });
                
                this.notepadglobal.setValue(localStorage.notes);
            }, 0);
        });
